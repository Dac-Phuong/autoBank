import type { Mongoose } from 'mongoose'
import { IDBCategory } from './../../../types/model/category.d';

export const DBCategory = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBCategory>({
    name: { type: String },
    key: { type: String },
    image: { type: String },
    color: { type: String, default: 'primary' }
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('Category', schema, 'Category')
  return model
}