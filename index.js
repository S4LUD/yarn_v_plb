const express = require("express");
const app = express();
const mongoose = require("mongoose");
const usePark = require("./routes");
const dotenv = require("dotenv");
const cors = require("cors");

app.use(
  cors({
    origin: "*",
  })
);

dotenv.config();

mongoose
  .connect(process.env.DB_CONNECT)
  .then(() => console.log("Connected to mongoDB"))
  .catch((err) => console.log(err));

app.use(express.json());

app.use("/api", usePark);

app.listen(process.env.PORT || 5719, () =>
  console.log("Express successfully initialized")
);
