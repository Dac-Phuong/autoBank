import { IAuth } from './../../../../../../types/utils/index.d';
import { defineEventHandler, readBody} from 'h3'
import getAuth from '../../../../utils/getAuth'
import resp from '../../../../utils/resp'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const body = await readBody(event)
    const { name, number, password, slug, _id } = body
    if (!_id || !name || !number) throw 'Dữ liệu đầu vào không hợp lệ'

    if (name && !name.match(/^[a-zA-Z0-9\s]+$/)) throw 'Tên tài khoản không hợp lệ'
    if (number && !number.match(/^[0-9]+$/)) throw 'Số tài khoản không hợp lệ'

    const bank = await DB.Bank.findOne({ slug: slug }).select('_id')
    if (!bank) throw 'Không tìm thấy ngân hàng'

    const check = await DB.BankAccount.findOne({ name: name, bank: bank._id }).select('name')
    if (check && check._id.toString() !== _id.toString()) throw 'Tên tài khoản đã không tồn tại'
    await DB.BankAccount.updateOne({ _id }, { $set: { name, number, password, bank: bank._id } })
    return resp(event, { message: 'Cập nhật tài khoản thành công' })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

