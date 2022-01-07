const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
require('dotenv').config();

const secretPassword = process.env.MONGO_PASSWORD;

const postsRoutes =  require("./routes/posts")

const app = express();

// Connect to the MongoDB Cloud Server
mongoose.connect(`mongodb+srv://admin:${secretPassword}@cluster0.fcumg.mongodb.net/mean-project?retryWrites=true&w=majority`)
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Connection to database failed."));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Middleware to make images folder statically accessible (allow users to access the images folder)
app.use("/images", express.static(path.join("server/images")));

// Middleware to set the response header to allow any origin to request data. Also allows the request to have the following headers (although it does not need them). Also allows the request to use the following methods
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE, OPTIONS");

  next();
});

app.use("/api/posts", postsRoutes);



module.exports = app;
