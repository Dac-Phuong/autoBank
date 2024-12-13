import type { Mongoose } from 'mongoose'
import { IDBPayment } from '~~/types/model/Payment'

export const DBPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBPayment>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    gate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate' },
    money: { type: String },
    status: { type: Number },
    code: { type: String },
    verify: { person: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, time: { type: Date }, reason: { type: String } },
  }, {
    timestamps: true
  })

  schema.index({ action: 'text' })

  const model = mongoose.model('Payment', schema, 'Payment')
  return model
}