import type { Types } from 'mongoose'

export interface IDBCategory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  name: string
  key: string
  color: string
  display: boolean
  image: string
}
