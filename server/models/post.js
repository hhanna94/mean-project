const mongoose = require('mongoose');

// Blueprint
const postSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, require: true}
});

// Create the object based on the blueprint
module.exports = mongoose.model('Post', postSchema);
