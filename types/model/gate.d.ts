import type { Types } from 'mongoose'

export interface IDBGate {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  type: string
  name: string
  person: string
  number: string

  image:string
  key: string
  qrcode: string
  
  display: boolean
}