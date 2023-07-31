import mongoose from "mongoose";
import "dotenv/config";
import pg from "pg";
import { seedDefaultServices } from "../models/seedDefaultServies.js";
import { seedDefaultMerchants } from "../models/seedDefaultMerchant.js";

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "12345",
  port: 5432,
});

// Load environment variables
const mongoURI = process.env.MONGO_URI;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(mongoURI, options).then(() => {
      seedDefaultServices();
      seedDefaultMerchants();
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export { connectDB, pool };
