import { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const body = await readBody(event)
    const { account, username, password, key, _id, path } = body

    if (!_id || !account || !username || !path) throw 'Dữ liệu đầu vào không hợp lệ'

    if (username && !username?.match(/^[a-zA-Z0-9\s]+$/)) throw 'Tên tài khoản không hợp lệ'
    if (account && isNaN(+account)) throw 'Số tài khoản không hợp lệ'
    if (path && !path.match(/^http/g)) throw 'URL nhận dữ liệu không hợp lệ'

    const bank = await DB.Bank.findOne({ key: key }).select('_id')
    if (!bank) throw 'Không tìm thấy ngân hàng'

    const check = await DB.BankAccount.findOne({ account: account, bank: bank._id }).select('account')
    if (check && check._id.toString() !== _id.toString()) throw 'Tên tài khoản không tồn tại'

    await DB.BankAccount.updateOne({ _id }, { $set: { account, username, password, bank: bank._id, path: path } })
    return resp(event, { message: 'Cập nhật tài khoản thành công' })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

