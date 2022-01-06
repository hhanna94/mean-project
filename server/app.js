const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const mongoose = require('mongoose');

const app = express();

// Connect to the MongoDB Cloud Server
mongoose.connect("mongodb+srv://admin:mdzq326iBRK9pvJ@cluster0.fcumg.mongodb.net/mean-project?retryWrites=true&w=majority")
  .then(() => console.log("Connected to database"))
  .catch(() => console.log("Connection to database failed."));

// Middleware for parsing JSON data
app.use(bodyParser.json());

// Middleware to set the response header to allow any origin to request data. Also allows the request to have the following headers (although it does not need them). Also allows the request to use the following methods
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
  next();
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(posts => {
      res.status(200).json(posts);
    })

})

app.post('/api/posts', (req, res, next) => {
  const post = new Post(req.body);
  // Insert the post into the database
  post.save();
  // Typical status code for something new being created
  res.status(201).json({message: "Post added successfully."});
})


module.exports = app;
