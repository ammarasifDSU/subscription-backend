import express from "express"
import {connectDB,pool} from "./config/dbconnection.js"
import {router} from "./routes/users.js"
import "dotenv/config"
import bodyParser from "body-parser"
import cors from "cors"
import { subscriptionRouter } from "./routes/subscription.js"
import { servicesRouter } from "./routes/services.js"
import { authenticateToken as authMiddleware } from "./middleware/authmiddleware.js"
import { statisticsRouter } from "./routes/statistics.js"

const app = express();
const corsOpts = {
  origin: '*',
  credentials: true,
  methods: ['GET','POST','HEAD','PUT','PATCH','DELETE'],
  allowedHeaders: ['Content-Type'],
  exposedHeaders: ['Content-Type']
};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(corsOpts));

// parse application/json
app.use(bodyParser.json())

app.use(router)
app.use(statisticsRouter)
app.use(authMiddleware)
app.use(subscriptionRouter)
app.use(servicesRouter)
app.use(express.json())

// Connect to MongoDB
connectDB();

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the PostgreSQL database');
  }
});

// Start the server
const port =  process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});