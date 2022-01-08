const express = require('express');
const multer = require("multer");

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");

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

// Get paginated posts or all posts, depending on query parameters
router.get('', (req, res, next) => {
  // Get the query parameters from the URL, converting them to numbers in the process
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      // Skip n items because depending on the page, we want to skipp all of the items that come before the page we are on
      .skip(pageSize * (currentPage - 1))
      // Only return how many items we want based on the pageSize variable
      .limit(pageSize)
  }
  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then(count => res.status(200).json({posts: fetchedPosts, maxPosts: count}))
    .catch( () => res.status(500).json({message: "Fetching posts failed."}))
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
    .catch( () => res.status(500).json({message: "Fetching post failed."}))
})

// Create a post
router.post('', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  // constructs a URL to our server
  const url = req.protocol + '://' + req.get("host");
  const post = new Post ({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save()
    .then( savedPost => {
      res.status(201).json({message: "Post added successfully.", post: {
        ...savedPost,
        id: savedPost._id
      }});
    })
    .catch( () => res.status(500).json({message: "Creating a post failed."}))
})

// Update a post
router.put('/:id', checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  })

  // Only update a post if the id of the post matches, and if the logged in user is the creator of the post.
  Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post)
    .then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({message: "Post update successful."});
      } else {
        res.status(401).json({message: "Not authorized to perform this operation."})
      }
    })
    .catch( () => res.status(500).json({message: "Couldn't update post."}))
})

// Delete a post
router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({message: "Post deleted."});
      } else {
        res.status(401).json({message: "Not authorized to perform this operation."})
      }
    })
    .catch( () => res.status(500).json({message: "Failed to delete post."}))
})

module.exports = router;
