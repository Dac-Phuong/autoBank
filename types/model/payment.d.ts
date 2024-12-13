import type { Types } from "mongoose";

export interface IDBPayment {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  gate: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  money: string;
  status: Number;
  code: string
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
}