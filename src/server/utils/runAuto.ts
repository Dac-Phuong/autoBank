import { createHash } from "node:crypto"
import axios from "axios"
import moment from "moment"
import { Client } from "undici"
import wasmEnc from "./loadwasm"
import cron from "node-cron"

// Param
let client: Client | null = null
let sessionId: string | null = null
let deviceId: string = generateDeviceId()
let wasmData: Buffer | null = null
let isLogin: boolean = false
let task: cron.ScheduledTask | null = null;
// Login
const login = async (data: any): Promise<void> => {
  console.log('Start Login')
  client = new Client("https://online.mbbank.com.vn")
  const rId = getTimeNow()

  const headers = defaultHeaders
  headers["X-Request-Id"] = rId

  // Get Captcha
  const captchaReq = await client.request({
    method: "POST",
    path: "/api/retail-web-internetbankingms/getCaptchaImage",
    headers,
    body: JSON.stringify({
      "sessionId": "",
      "refNo": rId,
      "deviceIdCommon": deviceId,
    })
  })

  const captchaRes: any = await captchaReq.body.json()
  const captchaContent = await decodeCaptcha(captchaRes)
  if (!captchaContent) throw 'LOGIN - Captcha'

  // Set Wasm Data
  if (!wasmData) {
    const wasm = await client.request({
      method: "GET",
      path: "/assets/wasm/main.wasm",
      headers: headers,
    });
    wasmData = Buffer.from(await wasm.body.arrayBuffer())
  }

  // Enc Data
  const dataEnc = await wasmEnc(wasmData, {
    userId: data.username as string,
    password: createHash("md5").update(data.password as string).digest("hex"),
    captcha: captchaContent,
    ibAuthen2faString: FPR,
    sessionId: null,
    refNo: getTimeNow(),
    deviceIdCommon: deviceId,
  }, "0")

  // Login Request
  const loginReq = await client.request({
    method: "POST",
    path: "/api/retail_web/internetbanking/v2.0/doLogin",
    headers: defaultHeaders,
    body: JSON.stringify({ dataEnc: dataEnc })
  })
  const loginRes: any = await loginReq.body.json()

  if (!loginRes.result) {
    isLogin = false
    sessionId = null
    client = null
    throw 'LOGIN - Request 1'
  }
  if (loginRes.result.ok) {
    isLogin = true
    sessionId = loginRes.sessionId
    return
  }
  else {
    isLogin = false
    sessionId = null
    client = null
    throw 'LOGIN - Request 2'
  }
}

// Get History
const getHistory = async (data: {
  username: string,
  account: string,
  fromDate: string,
  toDate: string,
}): Promise<
  {
    money: number,
    content: string,
    stk: string,
    time: string
  }[]
> => {
  console.log('Start Get History')
  if (!sessionId) throw 'LOGIN'
  client = new Client("https://online.mbbank.com.vn")

  const rId = getRefNo(data.username as string)
  const headers = defaultHeaders
  headers["X-Request-Id"] = rId
  headers["Deviceid"] = deviceId
  headers["Refno"] = rId
  const defaultBody = {
    "sessionId": sessionId as string,
    "refNo": rId,
    "deviceIdCommon": deviceId
  }

  const body = {
    "accountNo": data.account,
    "fromDate": moment(data.fromDate, "D/M/YYYY").format("DD/MM/YYYY"),
    "toDate": moment(data.toDate, "D/M/YYYY").format("DD/MM/YYYY"),
    ...defaultBody
  }

  const httpReq = await client.request({
    method: "POST",
    path: "/api/retail-transactionms/transactionms/get-account-transaction-history",
    headers,
    body: JSON.stringify(body)
  });
  const httpRes: any = await httpReq.body.json()
  
  if (!httpRes || !httpRes.result) throw 'HISTORY'
  if (httpRes.result.ok == true) {
    if (!httpRes.transactionHistoryList) throw 'HISTORY'
    const transactionHistories: any = [];
    httpRes.transactionHistoryList.forEach((item: any) => {
      if (item.creditAmount > 0 && !item.toBank) {
        const transactionData = {
          money: item.creditAmount,
          content: item.description,
          stk: item.accountNo,
          time: item.transactionDate
        }
        transactionHistories.push(transactionData);
      }
    })
    return transactionHistories
  }
  else if (httpRes.result.responseCode === "GW200") {
    isLogin = false
    sessionId = null
    client = null
    throw 'LOGIN'
  }
  else throw 'HISTORY'
}

const sendHistory = async (history: any[], path: string, sign: string): Promise<void> => {
  for (const item of history) {
    try {      
      const response = await axios.post(path, { sign, ...item });
      console.log('Response:', response.data);
    } catch (error: any) {
      console.error('Failed to send item:', item, 'Error:', error.message);
    }
  }
};

const startCronJob = (data: any): void => {
  console.log('Running cron task...');
  if (task) return;
  task = cron.schedule('*/1 * * * *', async () => {
    await runAuto(data);
  });
  task.start();
};
const stopCronJob = (): void => {
  if (task) {
    task.stop();
    task = null;
    console.log('Stopping cron task.');
  } else {
    console.log('No cron job is running.');
  }
};
// Running
const runAuto = async (data: any): Promise<void> => {
  try {
    const sign = 'eni@gm'
    const timeCheck = moment(Date.now())
    const toDay = timeCheck.format("DD/MM/YYYY")
    // const yesterDay = timeCheck.subtract(1, 'd').format("DD/MM/YYYY")

    // Expired
    const expired = moment(data.expired_date)
    if (expired.isBefore(timeCheck)) {
      isLogin = false
      sessionId = null
      client = null
      stopCronJob();
      return
    }
    // Running
    if (!data || data.status !== 1) {
      isLogin = false
      sessionId = null
      client = null
      stopCronJob();
      return
    }

    // Login
    if (!isLogin) await login(data)
    // History
    const history: any = await getHistory({
      account: data.account,
      username: data.username,
      fromDate: toDay,
      toDate: toDay,
    })
    
    await sendHistory(history, data.path, sign);
    startCronJob(data);
    return history
  }
  catch (e) {
    await runAuto(data)
  }
}

export default runAuto