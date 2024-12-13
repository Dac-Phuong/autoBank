import { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event) as IDBUser
    if (!user) throw 'Vui lòng đăng nhập'

    const { money, gate, code } = await readBody(event)
    if (!money || !gate || !code) throw 'Dữ liệu đầu vào không hợp lệ'

    if(money < 20000) throw 'Số tiền phải lớn hơn hoặc bằng 20.000'
    if(isNaN(+money)) throw 'Định dạng số tiền không hợp lệ'

    const checkGate = await DB.Gate.findOne({ _id: gate._id }).select('name')
    if (!checkGate) throw 'Kênh nạp không tồn tại'

    const checkCode = await DB.Payment.findOne({ code: code })
    if (!!checkCode) throw 'Mã nạp không hợp lệ'

    const checkUser = await DB.Payment.findOne({ user: user._id, status: 0 })
    if (!!checkUser) throw 'Bạn có giao dịch chưa hoàn tất, Vui lòng nạp tiền để hoàn tất giao dịch'

    const payment = await DB.Payment.create({
      code: code,
      user: user._id,
      gate: checkGate._id,
      money: money,
      status: 0,
    })
    await payment.save()
    return resp(event, { message: 'Tạo giao dịch thành công' })
  } catch (e: any) {
    return resp(event, {code: 400,message: e.toString()})
  }
})
