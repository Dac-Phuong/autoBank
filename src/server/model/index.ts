import type { Mongoose } from 'mongoose'
import { IGlobalDB } from './../../../types/model/index.d';
import { DBUser } from './user'
import { DBBank, DBBankAccount } from './bank'
import { DBGate } from './gate';
import { DBConfig } from './config';
import { DBLogAdmin, DBLogLogin, DBLogUser } from './log';
import { DBCategory } from './category';
import { DBDocs } from './docs';

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    User: DBUser(mongoose),

    Gate: DBGate(mongoose),

    Bank: DBBank(mongoose),
    BankAccount: DBBankAccount(mongoose),

    Category:DBCategory(mongoose),
    Docs: DBDocs(mongoose),

    LogUser: DBLogUser(mongoose),
    LogAdmin: DBLogAdmin(mongoose),
    LogLogin: DBLogLogin(mongoose)
  }
}