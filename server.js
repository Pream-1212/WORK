//1.Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const expressSession = require("express-session");
const moment = require("moment");
const methodOverride = require("method-override");
const bcrypt = require("bcrypt");

require("dotenv").config(); // load .env file
//import model
const UserModel = require("./models/userModel");
//import routes


const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const stockRoutes = require("./routes/stockRoutes");
const salesRoutes = require("./routes/salesRoutes");
const usersRoutes = require("./routes/usersRoutes");

//2.Instantiate the express app
const app = express();
const port = 4000;

//3.Configurations
//setting upmongodb connection

mongoose.connect(process.env.MONGODB_URL, {});

mongoose.connection
  .on("open", () => {
    console.log("Mongoose connection open");
  })
  .on("error", (err) => {
    console.log(`Connection error: ${err.message}`);
  });

// setting view engine to pug
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.static(path.join(__dirname, "public"))); //static files
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //one day
  })
);
//passport configs

app.use(passport.initialize()); //looks out passport.authenticate
app.use(passport.session()); //connects passport to the session created by

//authenticate with passportlocal strategy

passport.use(UserModel.createStrategy());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

// Make currentUser available in all Pug templates
app.use((req, res, next) => {
  res.locals.currentUser = req.user || null;
  next();
});

//routing


app.use("/", dashboardRoutes);
app.use("/", authRoutes);
app.use("/", stockRoutes);
app.use("/", salesRoutes);
app.use("/", usersRoutes);

//non existent route handler
app.use((req, res) => {
  res.status(404).send("Oops!Route  not found.");
});

//this should always be the last line in this file.
app.listen(port, () => {console.log(`listening on port ${port}`)});
