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
  res.setHeader('Access-Control-Allow-Methods', "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

app.get('/api/posts', (req, res, next) => {
  Post.find()
    .then(posts => res.status(200).json(posts))
})

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById({_id: req.params.id})
    .then( post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found."});
      }
    })
})

app.post('/api/posts', (req, res, next) => {
  const post = new Post(req.body);
  post.save()
    .then( savedPost => {
      res.status(201).json({message: "Post added successfully.", postId: savedPost._id});
    })
})

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({_id: req.body.id, title: req.body.title, content: req.body.content})
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json({message: "Post update successful."});
    })
})

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      res.status(200).json({message: "Post deleted."});
    })
    .catch(err => console.log(err))
})


module.exports = app;
