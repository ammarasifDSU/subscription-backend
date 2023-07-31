import express from "express";
import { Service } from "../models/service.js";
import { Subscription } from "../models/subscription.js";

const servicesRouter = express.Router();

// POST /services
servicesRouter.post("/services", async (req, res) => {
  try {
    // Fetch all services from the Service schema
    const { userId } = req.body;
    const services = await Service.find();
    const modifiedServices = [];

    for (const service of services) {
      // Find the subscription for the current user and service
      const subscription = await Subscription.findOne({
        user_id: userId,
        service_id: service._id,
      });

      const isSubscribed = subscription
        ? subscription.subscription_status == "unsubscribe"
          ? false
          : true
        : false;
      // If subscription exists, set isSubscribed to true, otherwise set it to false
      const modifiedService = { ...service.toObject(), isSubscribed };
      modifiedServices.push(modifiedService);
    }

    res.json(modifiedServices);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services." });
  }
});

export { servicesRouter };
