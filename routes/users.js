import express from "express";
import Joi from "joi";
import { pool } from "../config/dbconnection.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Validation schema for user registration
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// User registration endpoint
router.post("/register", async (req, res) => {
  try {
    let bodyData = req.body;
    const { error } = registerSchema.validate(bodyData);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { username, email, password } = bodyData;

    // Check if the user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, hashed_password) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [newUser.rows[0].id, "register"]
    );

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// User login endpoint
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user with the provided email
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.rows[0].hashed_password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const secret_jwt = process.env.JWT_key;
    const token = jwt.sign(
      {
        userId: existingUser.rows[0].id,
        username: existingUser.rows[0].username,
      },
      secret_jwt,
      {
        expiresIn: "1h",
      }
    );

    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [existingUser.rows[0].id, "login"]
    );

    const userObj = {
      userName: existingUser.rows[0].username,
      userId: existingUser.rows[0].id,
      userEmail: existingUser.rows[0].email,
    };

    res.json({ message: "User logged in successfully", token, userObj });
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // Clear the token cookie to log out the user
    res.clearCookie("auth_token");

    // Log user activity in the user_activity_logs table
    await pool.query(
      "INSERT INTO user_activity_logs (user_id, activitytype) VALUES ($1, $2)",
      [req.body.userId, "logout"]
    );

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export { router };
