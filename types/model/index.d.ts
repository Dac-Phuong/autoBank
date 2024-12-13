import type { Model } from 'mongoose'
import type { IDBBank, IDBBankAccount } from './bank'
import type { IDBGate } from './gate'
import type { IDBConfig } from './config'
import type { IDBLogAdmin, IDBLogLogin, IDBLogUser } from './log'
import type { IDBCategory } from './category'
import type { IDBDocs } from './docs'
import type { IDBPayment } from './Payment'
export { IDBUser, IDBUserStore } from './user'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  User: Model<IDBUser>
  
  Bank: Model<IDBBank>
  BankAccount: Model<IDBBankAccount>

  Gate: Model<IDBGate>
  Payment: Model<IDBPayment>

  Category: Model<IDBCategory>
  Docs: Model<IDBDocs>
  
  LogAdmin: Model<IDBLogAdmin>
  LogUser: Model<IDBLogUser>
  LogLogin: Model<IDBLogLogin>
}