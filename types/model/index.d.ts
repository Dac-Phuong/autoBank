import type { Model } from 'mongoose'
import type { IDBBank, IDBBankAccount } from './bank'
import type { IDBGate } from './gate'
export { IDBUser, IDBUserStore } from './user'

export interface IGlobalDB {
  User: Model<IDBUser>
  Bank: Model<IDBBank>
  BankAccount: Model<IDBBankAccount>
  Gate: Model<IDBGate>
}