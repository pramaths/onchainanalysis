const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
// const socketIo = require("socket.io");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

// const http = require("http");
const app = express();
const port = 8000;
// const server = http.createServer(app);
// const io = socketIo(server);
// const EthtransactionRoutes = require("./routes/Ethereum");
// const BitcointransactionsRouter = require("./routes/Bitcoin");
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(morgan("dev"));


// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Something broke!");
// });
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Crypto Tracker API");
});

// app.use("/api", BitcointransactionsRouter);
// app.use("/api", EthtransactionRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
