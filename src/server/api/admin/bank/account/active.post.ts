import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const { _id, option } = await readBody(event)
    if (!_id) throw 'Không tìm thấy tài khoản'
    if (!option) throw 'Vui lòng chọn gói kích hoạt'

    const account = await DB.BankAccount.findOne({ _id: _id }).select('money status')
    if (!account) throw 'Không tìm thấy tài khoản'

    if (account.status === 1 || account.status === 2) throw 'Tài khoản đang hoạt động, vui lòng đợi hết hạn để gia hạn'

    await DB.BankAccount.updateOne(
      { _id: _id },
      {
        $set: {
          status: 2,
          start_date: new Date(),
          expired_date: new Date(Date.now() + option.number * 30 * 24 * 60 * 60 * 1000),
          option: option
        }
      }
    )
    return resp(event, { message: 'Kích hoạt thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

