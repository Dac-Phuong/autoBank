import { defineEventHandler, readBody } from 'h3';
import type { IAuth } from "~~/types"
import getAuth from '../../../../utils/getAuth';

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const { _id } = await readBody(event)
    if (!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const check = await DB.BankAccount.findOne({ _id: _id }).select('name status time')
    if (!check) throw 'Không tìm thấy tài khoản'

    const status = check.status === 1 ? 2 : 1
    await DB.BankAccount.updateOne({ _id: _id }, { $set: { status, time: new Date() } })
    
    return resp(event, { message: 'Chuyển trạng thái thành công' })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

