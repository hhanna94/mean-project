const Post = require('../models/post');

// Get a post by ID
exports.getOnePost = (req, res, next) => {
  Post.findById({_id: req.params.id})
    .then( post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({message: "Post not found."});
      }
    })
    .catch( () => res.status(500).json({message: "Fetching post failed."}))
}

// Get paginated posts or all posts, depending on query parameters
exports.getPosts = (req, res, next) => {
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
}

// Create a post
exports.createPost = (req, res) => {
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
}

// Update a post
exports.editPost = (req, res) => {
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
      if (result.matchedCount > 0) {
        res.status(200).json({message: "Post update successful."});
      } else {
        res.status(401).json({message: "Not authorized to perform this operation."})
      }
    })
    .catch( () => res.status(500).json({message: "Couldn't update post."}))
}

// Delete a post
exports.deletePost = (req, res) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId})
    .then(result => {
      if (result.deletedCount > 0) {
        res.status(200).json({message: "Post deleted."});
      } else {
        res.status(401).json({message: "Not authorized to perform this operation."})
      }
    })
    .catch( () => res.status(500).json({message: "Failed to delete post."}))
}
