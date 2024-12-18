import runAuto from "~~/src/server/utils/runAuto"

export default defineEventHandler(async (event) => {
  try {
    const user = await getAuth(event)
    if (!user) throw 'Vui lòng đăng nhập trước'
    const { _id } = await readBody(event)
    if (!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const data = await DB.BankAccount.findOne({ _id: _id }).select('status username account password bank path expired_date')
    if (!data) throw 'Không tìm thấy tài khoản'
    if(!data.path) throw 'Vui lòng thêm url nhận dữ liệu trước khi chạy'
    
    const status = data.status === 1 ? 2 : 1
    const newData = await DB.BankAccount.findOneAndUpdate({ _id: data._id }, { $set: { status, time: new Date() } }, { new: true }).select('status username account password bank path')
    
    await runAuto(newData)
    console.log(newData);
    
    return resp(event, { message: 'Chuyển trạng thái thành công' })
  }
  catch (e: any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})

