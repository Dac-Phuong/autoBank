import type { Types } from "mongoose";

export interface IDBBank {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  image: string;
  slug: string;
  status: Number;
  display: boolean;
}


