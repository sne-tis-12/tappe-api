import express from "express";
import mongoose from "mongoose";
import errorHandler from "./middlewares/error.middleware.js";
import adminRouter from "./routes/admin.routes.js";
import studentRouter from "./routes/student.routes.js";
import vendorRouter from "./routes/vendor.routes.js";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static("./"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);
app.use("/api/vendor", vendorRouter);
app.use(errorHandler);

app.listen("3000", () => {
  console.log("App running on https://j4z3ts-3000.csb.app/");
});

mongoose.connect(
  "mongodb+srv://tappe:Tappe123@tappe-cluster.hoj7r2p.mongodb.net/?retryWrites=true&w=majority"
);

const db = mongoose.connection;
db.on("error", () => console.log("Error connecting to db"));
db.once("open", () => console.log("Connected to Mongodb"));
