import mongoose from "mongoose";

const merchantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const Merchant = mongoose.model("Merchant", merchantSchema);

export { Merchant };
