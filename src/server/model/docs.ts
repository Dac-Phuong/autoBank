import { Mongoose } from 'mongoose'
import { IDBDocs } from '~~/types/model/docs';

export const DBDocs = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBDocs>({ 
    name: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    content: { type: String },    
    display: { type: Boolean, default: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Docs', schema, 'Docs')
  return model 
}