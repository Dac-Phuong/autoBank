import { defineEventHandler, readBody } from 'h3';
import type { IAuth } from "~~/types"
import getAuth from '../../../../utils/getAuth';
import resp from '../../../../utils/resp';

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (!auth) throw 'Vui lòng đăng nhập trước'

    const body = await readBody(event)
    const { account, number, password, key } = body
    
    if (!account || !number || !password) throw 'Dữ liệu đầu vào không hợp lệ'

    if(account && !account.match(/^[a-zA-Z0-9\s]+$/)) throw 'Tên tài khoản không hợp lệ'
    if(number && !number.match(/^[0-9]+$/)) throw 'Số tài khoản không hợp lệ'
    
    const bank = await DB.Bank.findOne({ key: key }).select('_id')
    if (!bank) throw 'Không tìm thấy ngân hàng'

    const checkNumber = await DB.BankAccount.findOne({ number: number, bank: bank._id, user: auth._id }).select('number')
    if (checkNumber) throw 'Số tài khoản đã tồn tại'
    
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
