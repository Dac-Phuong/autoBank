import type { Model } from 'mongoose'
import type { IDBBank } from './bank'
import type { IDBGate } from './gate'
export { IDBUser, IDBUserStore } from './user'

export interface IGlobalDB {
  User: Model<IDBUser>
  Bank: Model<IDBBank>
  Gate: Model<IDBGate>
}