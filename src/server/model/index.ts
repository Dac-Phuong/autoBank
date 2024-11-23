import type { Mongoose } from 'mongoose'
import { IGlobalDB } from './../../../types/model/index.d';
import { DBUser } from './user'
import { DBBank } from './bank'
import { DBGate } from './gate';


export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    User: DBUser(mongoose),
    Bank: DBBank(mongoose),
    Gate: DBGate(mongoose),
  }
}