const express = require('express');

const PostController = require("../controllers/posts.controller");
const checkAuth = require("../middleware/check-auth");
const extractFile = require("../middleware/multer");

const router = express.Router();

router.get('', PostController.getPosts);
router.get('/:id', PostController.getOnePost);
router.post('', checkAuth, extractFile, PostController.createPost);
router.put('/:id', checkAuth, extractFile, PostController.editPost);
router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
