import type { Model } from 'mongoose'
export { IDBUser, IDBUserStore } from './user'

export interface IGlobalDB {
  User: Model<IDBUser>
  Bank: Model<IDBBank>
}