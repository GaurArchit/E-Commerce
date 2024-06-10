import express from "express";
import list from "./database/data.js";
import { fileURLToPath } from "url";
import { join, dirname } from "path";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//Handling static pages in E-commerce Project
app.set("view engine", "pug");
app.use("/public", express.static(join(__dirname, "public")));
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
  productname: String,
  category: String,
  price: Number,
  img: String,
  quantity: String,
});

const Data = mongoose.model("warehouse", dataSchema);
//This is database

app.get("/insertData", async (req, res) => {
  await Data.insertMany(list)
    .then(() => {
      console.log("Data inserted successfully");
    })
    .catch((error) => {
      console.error("Error inserting data:", error);
    });
});

app.get("/database", async (req, res) => {
  const data = await Data.find();
  res.json(data);
  console.log(data);
});

app.get("/price", async (req, res) => {
  const data = await Data.find({ price: { $lt: 100 } });
  res.json(data);
  console.log(data.length);
});

// Adding session functionality to the code as of now adding it on the root route that is admin
app.use(
  session({
    name: "sessId", //this is name of the cookie that will be sent to the user broweser if this is not setup then a default name will come
    resave: false, // this is a mandory field if not done will throw warning
    saveUninitialized: true,
    secret:
      app.get("env") === "production"
        ? process.env.sessionSecret
        : "12312323dfdffffewdedergttgtg", //it is used to fectch the secreat key in case of dev or production environment
    cookie: {
      httpOnly: true, //it is used to set so that hacker dont react cookie value
      maxAge: 18000000, // it is used to set the time till which the cookie is valid
      secure: app.get("env") === "production" ? true : false,
    },
  })
);

//Just and example this will be updated as per the logic
app.post("/price", async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;
  //Values as of now are hard coded it will be updated once we update the mongo db
  if (email === "architgaur123@gmail.com" && password === "12345") {
    req.session.user = "Archit"; //Storing the data in the session
    const data = await Data.find({ price: { $lt: 100 } });

    return res.json(data);
  } else {
    return res.redirect("/login");
  }
});

/// Get call in which products will be fetch based on the category name

app.get("/category/:zip", async (req, res) => {
  const categoryName = req.params.zip;
  const data = await Data.find({ category: categoryName });
  res.json(data);
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.listen(7070, () => {
  console.log("Server is working ");
});
