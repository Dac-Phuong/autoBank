import type { Mongoose } from 'mongoose'
import { IDBBank, IDBBankAccount } from './../../../types/model/bank.d';
export const DBBank = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBBank>({ 
    name: { type: String },
    display: { type: Boolean, default: false },
    status: { type: Number, default: 0 },
    image: { type: String },
    slug: { type: String },
  }, {
    timestamps: true
  })
  schema.index({ name: 'text' })
  const model = mongoose.model('Bank', schema, 'Bank')
  return model
}
export const DBBankAccount = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBBankAccount>({
    name: { type: String },
    status: { type: Number, default: 0 },
    number: { type: Number },
    password: { type: String },
    bank: { type: mongoose.Schema.Types.ObjectId, ref: 'Bank' },
  }, {
    timestamps: true
  })
  schema.index({ name: 'text' })
  const model = mongoose.model('BankAccount', schema, 'BankAccount')
  return model
}