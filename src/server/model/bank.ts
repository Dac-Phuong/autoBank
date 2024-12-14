import type { Mongoose } from "mongoose";
import { IDBBank, IDBBankAccount } from "./../../../types/model/bank.d";
export const DBBank = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBBank>(
    {
      name: { type: String },
      display: { type: Boolean, default: true },
      status: { type: Number, default: 0 },
      image: { type: String },
      key: { type: String },
      options: { type: Array },
    },
    {
      timestamps: true,
    }
  );
  schema.index({ name: "text" });
  const model = mongoose.model("Bank", schema, "Bank");
  return model;
};
export const DBBankAccount = (mongoose: Mongoose) => {
  const schema = new mongoose.Schema<IDBBankAccount>(
    {
      account: { type: String },
      status: { type: Number, default: 0 },
      number: { type: String },
      password: { type: String },
      time: { type: Date },
      option: { type: Object },
      expired_date: { type: Date },
      policy: { type: Boolean, default: true },
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      bank: { type: mongoose.Schema.Types.ObjectId, ref: "Bank" },
    },
    {
      timestamps: true,
    }
  );
  schema.index({ account: "text" });
  const model = mongoose.model("BankAccount", schema, "BankAccount");
  return model;
};
