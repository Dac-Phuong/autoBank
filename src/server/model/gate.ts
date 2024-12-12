import { Mongoose } from 'mongoose'
import { IDBGate } from './../../../types/model/gate.d';

export const DBGate = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBGate>({
    type: { type: String },
    name: { type: String },
    person: { type: String },
    number: { type: String },
    image: { type: String },
    key: { type: String },
    qrcode: { type: String },

    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Gate', schema, 'Gate')
  return model
}