import express from "express";
import list from "./database/data.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

const app = express();
app.use(cors());
dotenv.config();
const mongoURI = process.env.monurl;
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const dataSchema = mongoose.Schema({
  id: String,
  title: String,
  author: String,
  price: Number,
  img: String,
  amount: String,
});

const Data = mongoose.model("warehouse", dataSchema);
//This is database
Data.insertMany(list)
  .then(() => {
    console.log("Data inserted successfully");
  })
  .catch((error) => {
    console.error("Error inserting data:", error);
  });

app.get("/database", async (req, res) => {
  const data = await Data.find();
  res.json(data);
  console.log(data);
});
app.listen(7070, () => {
  console.log("Server is working ");
});
