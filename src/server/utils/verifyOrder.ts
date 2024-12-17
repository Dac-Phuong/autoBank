import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import type { IDBUser } from '~~/types'
import type { IDBGate } from '~~/types/model/gate'
import type { IDBPayment } from '~~/types/model/Payment'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, { _id, status, money, reason }: IBodyData, verifier?: Types.ObjectId, sendNotify: boolean = true
): Promise<void> => {
  if (!_id) throw 'Không tìm thấy ID giao dịch'
  if ( !!isNaN(parseInt(String(status))) || parseInt(String(status)) < 1 || parseInt(String(status)) > 2 ) throw 'Mã trạng thái không hợp lệ'
  if (!!isNaN(parseInt(String(money))) || parseInt(String(money)) < 0 ) throw 'Số tiền không hợp lệ'
  if (status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Set Real Value
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Payment
  const payment = await DB.Payment.findOne({ _id: _id }).select('code gate user status createdAt') as IDBPayment
  if (!payment) throw 'Giao dịch không tồn tại'
  if (Number(payment.status) > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const user = await DB.User.findOne({ _id: payment.user }).select('_id') as IDBUser
  if (!user) throw 'Không tìm thấy thông tin tài khoản'

  const gate = await DB.Gate.findOne({ _id: payment.gate, display: true }).select('_id') as IDBGate
  if (!gate) throw 'Không tìm thấy thông tin kênh nạp'

  // Set Verify Person
  let verify_person
  if (!!verifier) {
    verify_person = verifier
  }

  // Update Payment
  const time = new Date(payment.createdAt)

  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })

  // Check Status
  if (realStatus == 1) {
    await DB.Payment.updateOne({ _id: _id }, {
      $inc: { order: 1 }
    })
    await DB.User.updateOne({ _id: user._id }, {
      $inc: { 'currency.coin': realMoney }
    })
    if (!!verifier) logAdmin(event, `Chấp nhận giao dịch mua hàng <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verifier)
  }
  else {
    if (!!verifier) logAdmin(event, `Từ chối giao dịch mua hàng <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verifier)
  }
}