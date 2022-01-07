const mongoose = require('mongoose');
// A plugin that adds an extra hook to check data before saving it to database
const uniqueValidator = require("mongoose-unique-validator");

// Blueprint
const userSchema = mongoose.Schema({
  // Unique is not a validation, it just optimizes queries
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
});

// Throws an error if we try to save a user with an email that exists.
userSchema.plugin(uniqueValidator);

// Create the object based on the blueprint
module.exports = mongoose.model('User', userSchema);
