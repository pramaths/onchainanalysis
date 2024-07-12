const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
const Moralis = require('moralis').default;
const session = require('express-session');
let RedisStore = require('connect-redis').default;
const redisClient = require('./utils/redis');
const mongoose = require('mongoose');
const cors = require("cors");
const http = require("http");
const compression = require("compression");
const helmet = require("helmet");
const logger = require('./utils/logger');
require("dotenv").config();

const app = express();

const { initAPI, fetchTransaction } = require("./utils/keyRotation");
const monitor = require("./routes/monitor");

// Security and performance middleware
app.use(helmet());
app.use(compression());

// Session configuration with Redis
// app.use(
//   session({
//     store: new RedisStore({ client: redisClient }),
//     secret: process.env.SESSION_SECRET || '1234', // Replace with a secure secret
//     store: new RedisStore({
//       client: redisClient,
//     }),
//     secret: '1234', // Replace with a secure secret
//     resave: false,
//     saveUninitialized: true,
//     cookie: { secure: process.env.NODE_ENV === 'production' }, // Set to true for HTTPS in production
//   })
// );

// Middleware setup
app.use(morgan('tiny', { stream: logger.stream }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
}).then(() => {
  console.log('MongoDB connected successfully 🚀🚀🚀');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Routes
const EthtransactionRoutes = require("./routes/Ethereum");
const BitcointransactionsRouter = require("./routes/Bitcoin");
const address = require("./routes/address");

app.use("/api", BitcointransactionsRouter);
app.use("/api", EthtransactionRoutes);
app.use("/api", address);
app.use("/api", monitor);

app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Crypto Tracker API");
});

app.post("/snooping-account", (req, res) => {
  const mailOptions = {
    to: "testmailjai4@gmail.com",
    subject: `Suspicious activity on tagged account`,
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(200).json({
        message: JSON.stringify(error.message),
      });
    } else {
      console.log("Mail Sent Successfully!");
      res.status(200).json({
        message: "Success! Message Sent!",
      });
    }
  });
});

app.get("/trx/:hash", (req, res) => {
  const { hash } = req.params;
  const alchemyInstance = initAPI();
  
  fetchTransaction(hash, alchemyInstance, res);
});

// Server-Sent Events (SSE) for real-time updates
app.get("/events", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // Example: sending a message every 10 seconds
  const intervalId = setInterval(() => {
    sendEvent({ message: "Hello from SSE" });
  }, 10000);

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

// Start the server
const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
