const mongoose = require('mongoose');

// Blueprint
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true},
  creator: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
});

// Create the object based on the blueprint
module.exports = mongoose.model('Post', postSchema);
