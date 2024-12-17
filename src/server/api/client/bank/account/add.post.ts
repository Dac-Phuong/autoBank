import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const body = await readBody(event)
    const { account, username, password, key } = body
    if (!account || !username || !password) throw 'Dữ liệu đầu vào không hợp lệ'
    // check validate
    if(username && !username.match(/^[a-zA-Z0-9\s]+$/)) throw 'Tên tài khoản không hợp lệ'
    if(username.match(/\s/g) || account.match(/\s/g) || password.match(/\s/g)) throw 'Phát hiện khoảng cách'
    if(account && !account.match(/^[0-9]+$/)) throw 'Số tài khoản không hợp lệ'
    if(password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'

    const bank = await DB.Bank.findOne({ key: key }).select('_id')
    if (!bank) throw 'Không tìm thấy ngân hàng'

    const checkAccount = await DB.BankAccount.findOne({ account: account, bank: bank._id, user: auth._id }).select('username')
    if (checkAccount) throw 'Số tài khoản đã tồn tại'
    
    const check = await DB.BankAccount.findOne({ account: account, bank: bank._id, user: auth._id }).select('account')
    if (check) throw 'Tên tài khoản đã tồn tại'
    
    body.bank = bank._id
    body.user = auth._id
    await DB.BankAccount.create(body)
    return resp(event, { message: 'Thêm tài khoản thành công' })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
