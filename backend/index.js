import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";

dotenv.config();

const app = express();

const { default: authRoute } = await import("./routes/auth.route.js");
const { default: userRoute } = await import("./routes/user.route.js");
const { default: packageRoute } = await import("./routes/package.route.js");
const { default: ratingRoute } = await import("./routes/rating.route.js");
const { default: bookingRoute } = await import("./routes/booking.route.js");

const __dirname = path.resolve();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => console.log(err));

app.use(
  cors({
    origin: process.env.SERVER_URL,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/package", packageRoute);
app.use("/api/rating", ratingRoute);
app.use("/api/booking", bookingRoute);

if (process.env.NODE_ENV_CUSTOM === "production") {
  //static files
  app.use(express.static(path.join(__dirname, "/client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
  });
} else {
  // //rest api
  app.use("/", (req, res) => {
    res.send("Welcome to travel and tourism app");
  });
}

//port
app.listen(8000, () => {
  console.log("listening on 8000");
});
