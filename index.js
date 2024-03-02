const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const socketIo = require("socket.io");
const morgan = require("morgan");
const nodemailer = require("nodemailer");
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
app.post("/snooping-account", (req, res) => {
  const mailOptions = {
    to: "testmailjai4@gmail.com", //The Embrione Mail comes here.
    subject: `Suspicious activity on tagged account`,
    text: JSON.stringify(req.body),
  };

  transporter.sendMail(mailOptions, (error, info) => {
    // this is to bypass all the mails via the embrione tech mail as well
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

app.listen(8000, () => {
  console.log(`Server is running on port`);
});
