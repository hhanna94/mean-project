const Post = require('../models/post');

const express = require('express');
const router = express.Router();

// Get all posts
router.get('', (req, res, next) => {
  Post.find()
    .then(posts => res.status(200).json(posts))
})

// Get a post by ID
router.get('/:id', (req, res, next) => {
  Post.findById({_id: req.params.id})
    .then( post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found."});
      }
    })
})

// Create a post
router.post('', (req, res, next) => {
  const post = new Post(req.body);
  post.save()
    .then( savedPost => {
      res.status(201).json({message: "Post added successfully.", postId: savedPost._id});
    })
})

// Update a post
router.put('/:id', (req, res, next) => {
  const post = new Post({_id: req.body.id, title: req.body.title, content: req.body.content})
  Post.updateOne({_id: req.params.id}, post)
    .then(result => {
      res.status(200).json({message: "Post update successful."});
    })
})

// Delete a post
router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id})
    .then(result => {
      res.status(200).json({message: "Post deleted."});
    })
    .catch(err => console.log(err))
})

module.exports = router;
