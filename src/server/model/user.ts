import type { Mongoose } from 'mongoose'
import { IDBUser } from './../../../types/model/user.d';
export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    account: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    block: { type: Boolean, default: false },
    payment: { type: Number, default: 0, index: true },
    currency: {
      coin: { type: Number, default: 0, index: true }
    },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - Smod, 100 - Admin
    token: { type: String },
  }, {
    timestamps: true
  })
  schema.index({ account: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('User', schema, 'User')

  const autoCreate = async () => {
    const admin = await model.countDocuments({account: 'admin'})
    const test123 = await model.countDocuments({account: 'test123'})

    if(admin == 0) await model.create({ account: 'admin', password: '21232f297a57a5a743894a0e4a801fc3', type: 100 })
    if(test123 == 0) await model.create({ account: 'test123', password: 'cc03e747a6afbbcbf8be7668acfebee5', type: 100 })
  }
  autoCreate()
  return model
}