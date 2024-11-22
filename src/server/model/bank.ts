import type { Mongoose } from 'mongoose'
import { IDBBank } from './../../../types/model/bank.d';
export const DBBank = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBBank>({ 
    name: { type: String },
    display: { type: Boolean, default: false },
    status: { type: Boolean, default: false },
    image: { type: String },
  }, {
    timestamps: true
  })
  schema.index({ account: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('Bank', schema, 'Bank')
  return model
}