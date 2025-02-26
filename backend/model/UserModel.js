const { model, Schema } = require('mongoose');

// Define User Schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

// Create User model
const User = new model("User", UserSchema);

module.exports = { User };
