import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoutes.js";
import cors from "cors";
import { rootPath } from "get-root-path";

const PORT = process.env.PORT || 8080;

dotenv.config();

//database config
connectDB();

const app = express();

//middlewares
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use("/uploads", express.static(rootPath + "/uploads"));

//All Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/product", productRoutes);

app.get("/test", (req, res) => {
  res.json({ message: "welcome to RealEstate" });
});



app.listen(PORT, () => {
  console.log(
    // `Server is running on ${process.env.DEV_MODE} mode on ${PORT}`.bgCyan.white
    "ghfhgfh"
  );
});
