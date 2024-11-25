import type { Types } from "mongoose";

export interface IDBDocs {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    url: string;
    content: string;
    display: boolean;
}


