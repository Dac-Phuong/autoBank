import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBUser } from './user'
import { DBBank } from './bank'


export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    User: DBUser(mongoose),
    Bank: DBBank(mongoose)
  }
}