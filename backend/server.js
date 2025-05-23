import express from "express";
import dotenv from "dotenv";
import path from "path";

import { connectDB } from "./config/db.js";

import productRoutes from "./routes/product.route.js";
import categoryRoutes from "./routes/category.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // Middleware to parse JSON data

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}


app.listen(PORT, () => {
    connectDB();
    console.log('MongoDB connected');
  console.log('Server is running on port ', + PORT); 
});