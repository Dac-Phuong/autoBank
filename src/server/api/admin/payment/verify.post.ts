import type { IAuth } from "~~/types"
import verifyOrder from "~~/src/server/utils/verifyOrder"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type !== 100) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    if(!!body.redo){
      const order = await DB.Payment.findOne({ _id: body._id }).select('status money code')
      if(!order) throw 'Giao dịch không tồn tại'
      if(order.status == 0) throw 'Giao dịch chưa được duyệt'
   
      order.status = 0
      await order.save()

      await DB.User.updateOne({ _id: auth._id }, {
        $inc: { 'currency.coin': -order.money }
      })
      await logAdmin(event, `Hoàn tác trạng thái giao dịch đơn hàng <b>${order.code}</b>`, auth._id)
      return resp(event, { message: 'Thao tác thành công' })
    }

    await verifyOrder(event, body, auth._id)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
