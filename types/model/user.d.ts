import type { Types } from "mongoose";

export interface IDBUser {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  account: string;
  password: string;
  email: string;
  phone: string;
  payment: number;
  currency: {
    coin: number;
  };
  type: number;
  token: string;
  block: boolean;
  // Function
  save: {
    (): void;
  };
}

export interface IDBUserStore {
  _id: IDBUser["_id"];
  account: IDBUser["account"];
  type: IDBUser["type"];
  currency: IDBUser["currency"];
}
