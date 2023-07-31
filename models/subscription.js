import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    service_id: { type: String, required: true },
    subscription_status: { type: String, required: true },
  },
  { timestamps: true }
);

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export { Subscription };
