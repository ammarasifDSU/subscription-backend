import express from "express";
import { Subscription } from "../models/subscription.js";
import { Service } from "../models/service.js";
import { pool } from "../config/dbconnection.js";

const subscriptionRouter = express.Router();

subscriptionRouter.post("/subscribe", async (req, res) => {
  try {
    // Get the user ID and service ID from the request body
    const { userId, serviceId } = req.body;

    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userValues = [userId];
    const userResult = await pool.query(userQuery, userValues);
    const user_id = userResult.rows[0].id;
    let subscriptionNew = {};

    // Check if the user and service exist in the database
    const service = await Service.findById(serviceId);
    const service_id = service._id;

    if (!userResult || !service) {
      return res.status(404).json({ error: "User or service not found." });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { user_id, service_id },
      { subscription_status: "subscribe" },
      { new: true }
    );

    if (!updatedSubscription) {
      // Create a new subscription for the user and service
      const subscription = new Subscription({
        user_id,
        service_id,
        subscription_status: "subscribe",
      });

      subscriptionNew = await subscription.save();
    }

    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [user_id, "Subscribe"]
    );
    const currentSubscription = updatedSubscription
      ? updatedSubscription
      : subscriptionNew;
    res.json({ message: "Subscription successful.", currentSubscription });
  } catch (error) {
    res.status(500).json({ error: "Failed to subscribe to the service." });
  }
});

subscriptionRouter.post("/unsubscribe", async (req, res) => {
  try {
    // Get the user ID and service ID from the request body
    const { userId, serviceId } = req.body;

    const userQuery = "SELECT * FROM users WHERE id = $1";
    const userValues = [userId];
    const userResult = await pool.query(userQuery, userValues);
    const service = await Service.findById(serviceId);
    const user_id = userResult.rows[0].id;
    const service_id = service._id;

    if (!userResult || !service) {
      return res.status(404).json({ error: "User or service not found." });
    }

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { user_id, service_id },
      { subscription_status: "unsubscribe" },
      { new: true }
    );

    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [user_id, "Unsubscribe"]
    );

    res.json({ message: "Unsubscription successful.", updatedSubscription });
  } catch (error) {
    res.status(500).json({ error: "Failed to unsubscribe from the service." });
  }
});

subscriptionRouter.post("/subscription-callback", async (req, res) => {
  try {
    // Parse the JSON notification from the request body
    const { event, subscription_id, userId, serviceId, status } = req.body;

    // Log the notification in a table

    // Find the subscription in the database and update the status
    const subscription = await Subscription.findOneAndUpdate(
      { subscription_id },
      { subscription_status: status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [userId, "Subscription Callback"]
    );

    res.json({ message: "Callback received and processed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

subscriptionRouter.post("/unsubscription-callback", async (req, res) => {
  try {
    // Parse the JSON notification from the request body
    const { event, subscription_id, userId, serviceId, status } = req.body;

    // Log the notification in a table

    // Find the subscription in the database and update the status
    const subscription = await Subscription.findOneAndUpdate(
      { subscription_id },
      { subscription_status: status },
      { new: true }
    );

    if (!subscription) {
      return res.status(404).json({ error: "Subscription not found" });
    }

    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [userId, "Unsubscription Callback"]
    );

    res.json({ message: "Callback received and processed successfully." });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { subscriptionRouter };
