import { pool } from "../config/dbconnection.js";
import { Subscription } from "../models/subscription.js";
import express from "express";

const statisticsRouter = express.Router();

const getSubscriptionStatistics = async () => {
  const total_subscriptions = await Subscription.countDocuments();
  const total_subscribe_subscriptions = await Subscription.countDocuments({
    subscription_status: "subscribe",
  });
  const total_unsubscribe_subscriptions = await Subscription.countDocuments({
    subscription_status: "unsubscribe",
  });
  return {
    total_subscriptions,
    total_subscribe_subscriptions,
    total_unsubscribe_subscriptions,
  };
};

const getTotalUsers = async () => {
  const result = await pool.query("SELECT COUNT(*) AS total_users FROM users");
  return result.rows[0].total_users;
};

statisticsRouter.get("/statistics", async (req, res) => {
  try {
    // Fetch total_users
    const total_users = await getTotalUsers();

    const {
      total_subscriptions,
      total_subscribe_subscriptions,
      total_unsubscribe_subscriptions,
    } = await getSubscriptionStatistics();

    res.json({
      total_users,
      total_subscriptions,
      total_subscribe_subscriptions,
      total_unsubscribe_subscriptions,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { statisticsRouter };
