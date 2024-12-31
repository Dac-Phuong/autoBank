import { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if (auth.type !== 100) throw ' bạn không phải quản trị được'

    const { _id } = await readBody(event)
    if (!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const account = await DB.BankAccount.findOne({ _id: _id })
    if (!account) throw 'Không tìm thấy dịch vụ'

    const status = account.status === 1 ? 2 : 1
    const run = status === 1 ? true : false
    await DB.BankAccount.findOneAndUpdate({ _id: account._id }, { $set: { status, run, time: new Date() } }, { new: true })

    const data = await DB.BankAccount.find({ user: account.user, status: { $in: [1, 2] }, bank: account.bank }).select('status run username account password bank path expired_date')

    await Promise.all(data.map(item => {
      if (item.status == 1 && item.run) return runAuto(item);
      if (item.status == 2 && !item.run) return stopCronJob(item.account);
      return Promise.resolve();
    }))

    return resp(event, { result: true, message: 'Thao tác thành công' })
  } catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
