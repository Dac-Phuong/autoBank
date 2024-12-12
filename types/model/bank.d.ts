import type { Types } from "mongoose";

export interface IDBBank {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  image: string;
  key: string;
  status: Number;
  display: boolean;
  options: Array
}

export interface IDBBankAccount {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  account: string;
  number: string;
  password: string;
  time: Date;
  policy: boolean;
  bank: Types.ObjectId;
  status: Number;
}



