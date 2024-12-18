import { stopCronJob } from "~~/src/server/utils/runAuto"
import { IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event) as IDBUser
    if (!user) throw 'Vui lòng đăng nhập trước'

    const { _id } = await readBody(event)
    if (!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const check = await DB.BankAccount.findOne({ _id: _id }).select('status password bank path')
    if (!check) throw 'Không tìm thấy tài khoản'
    if (!check.path) throw 'Vui lòng thêm url nhận dữ liệu trước khi chạy'

    const bank = await DB.Bank.findOne({ _id: check.bank }).select('name')
    if (!bank) throw 'Không tìm thấy ngân hàng'

    const status = check.status === 1 ? 2 : 1
    await DB.BankAccount.findOneAndUpdate({ _id: check._id }, { $set: { status, time: new Date() } }, { new: true })

    const data = await DB.BankAccount.find({ user: user._id, status: { $in: [1, 2] }, bank: check.bank }).select('status username account password bank path expired_date')
    
    for (const item of data) {
      if (item.status == 1) {
        await runAuto(item)
      } else {
        stopCronJob(item.account);
      }
    }

    return resp(event, { message: 'Chuyển trạng thái thành công' })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

