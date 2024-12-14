import type { Types } from "mongoose";

export interface IDBUser {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  account: string;
  org_name: string;
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
  username: IDBUser["username"];
  email: IDBUser["email"];
  phone: IDBUser["phone"];
  org_name: IDBUser["org_name"];
  type: IDBUser["type"];
  currency: IDBUser["currency"];
}
