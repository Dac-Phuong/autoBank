import { IAuth } from "~~/types"
export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const { _id } = await readBody(event)
    if(!_id ) throw 'Dữ liệu đầu vào không hợp lệ'

    const bankAccount = await DB.BankAccount.findOneAndUpdate({ _id }, { status: 0, option: null, start_date: null, expired_date: null }, { new: true })
    if (!bankAccount) throw 'Tài khoản không tồn tại'

    return resp(event, { result: true, message: 'Hủy gói thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }

})
