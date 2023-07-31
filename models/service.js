import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  merchant_id: { type: String, required: true },
});

const Service = mongoose.model("Service", serviceSchema);

export { Service };
