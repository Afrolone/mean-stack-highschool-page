const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const newsRoutes = require("./routes/news");
const alumniRoutes = require("./routes/alumni");
const userRoutes = require("./routes/user");
const reportsRoutes = require("./routes/report");


const app = express();

mongoose
  .connect(
    process.env.DATABASE_URL
  )
  .then(() => {
    console.log('Connected to database!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/news", newsRoutes);
app.use("/api/alumni", alumniRoutes);
app.use("/api/user", userRoutes);
app.use("/api/reports", reportsRoutes);

module.exports = app;
