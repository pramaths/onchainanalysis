const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const morgan = require("morgan");
const monitor=require("./routes/monitor")
const nodemailer = require("nodemailer");
const Moralis = require('moralis').default;
const { Alchemy, Network } = require("alchemy-sdk");
const config = {
  apiKey: "gvGFt1jOABt1tDSCwPNqli0Ssrie7BAe", 
  network: Network.ETH_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "testaccout33@gmail.com",
    pass: "rexmriznhrrkegcc",
  },
});

const cors = require("cors");
require("dotenv").config();

const http = require("http");
const app = express();
const port = 8000;
const server = http.createServer(app);
const io = socketIo(server);
const EthtransactionRoutes = require("./routes/Ethereum");
const BitcointransactionsRouter = require("./routes/Bitcoin");
const analysis = require("./routes/analysis");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(cookieParser());
// // app.use(morgan("dev"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Crypto Tracker API");
});

app.use("/api", BitcointransactionsRouter);
app.use("/api", EthtransactionRoutes);
app.use("/api",analysis)
app.use("/api",monitor)
app.post("/snooping-account", (req, res) => {
  const mailOptions = {
    to: "testmailjai4@gmail.com", //The Embrione Mail comes here.
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
      // console.log("Email sent: " + info.response + Date.now());
      console.log("Mail Sent Successfully!");
      res.status(200).json({
        message: "Success! Message Sent! ",
      });
    }
    // res.json({name: 'This is the backendddd'})
  });
});

// async function initializeMoralis() {
//   await Moralis.start({
//     apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImEzZTA5ZDgyLTU3YjEtNGZlMy04MjY3LTk3NWI1MjZmOWJmZCIsIm9yZ0lkIjoiMjYxNjMzIiwidXNlcklkIjoiMjY1ODk2IiwidHlwZUlkIjoiMjU5MTRlZGYtNDdjMy00Y2ZhLWI1NjktMGMzNDg3ZWQ1NTI3IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDYxODExOTIsImV4cCI6NDg2MTk0MTE5Mn0._EvFooXZJKB4aRbKXf_W6-VJJv9S_IaYBZUZOyC0Jtg"
//   });
//   console.log('Moralis initialized successfully.');
// }

// initializeMoralis().catch(console.error);

app.get("/trx/:hash", (req, res) => {
  const { hash } = req.params;
  alchemy.core.getTransaction(hash)
    .then(transaction => {
      if (transaction) {
        res.json(transaction); 
      } else {
        res.status(404).send({ error: 'Transaction not found' });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).send({ error: 'An error occurred while fetching transaction details' });
    });
});

app.listen(8000, () => {
  console.log(`Server is running on port`);
});

