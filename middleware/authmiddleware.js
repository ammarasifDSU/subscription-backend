import jwt from "jsonwebtoken";
import "dotenv/config";

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ error: "Authentication token not provided." });
  }

  let secret_key = process.env.JWT_KEY;
  jwt.verify(token, secret_key, (err, user) => {
    if (err) {
      return res.status(403).json({ error: "Invalid authentication token." });
    }

    req.user = user;
    next();
  });
};

export { authenticateToken };
