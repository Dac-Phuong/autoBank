import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBUser } from './user'


export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    User: DBUser(mongoose),
  }
}