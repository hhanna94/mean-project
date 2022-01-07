const { createDecipheriv } = require('crypto');
const express = require('express');
const multer = require("multer");

const Post = require('../models/post');

const router = express.Router();

// Helper to get the file extension from the image upload.
const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

// Defining where multer should put files which it detects in an incoming request
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // This is validated on the front end as well, but this validates the file type on the back-end.
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null
    }
    cb(error, "server/images")
  },
  filename: (req, file, cb) => {
    // any white space in the name will be replaced with a dash
    const name =  file.originalname.toLowerCase().split(' ').join('-');
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  }
});

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
router.post('', multer({storage: storage}).single("image"), (req, res, next) => {
  // constructs a URL to our server
  const url = req.protocol + '://' + req.get("host");
  const post = new Post ({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename
  });
  post.save()
    .then( savedPost => {
      res.status(201).json({message: "Post added successfully.", post: {
        ...savedPost,
        id: savedPost._id
      }});
    })
})

// Update a post
router.put('/:id', multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({_id: req.body.id, title: req.body.title, content: req.body.content, imagePath: imagePath})
  console.log(post);
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
