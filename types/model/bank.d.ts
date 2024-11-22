import type { Types } from "mongoose";

export interface IDBBank {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  image: string;
  status: boolean;
  display: boolean;
}


