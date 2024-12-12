import type { Types } from "mongoose";

export interface IDBDocs {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    category: Types.ObjectId;
    name: string;
    content: string;
    display: boolean;
}


