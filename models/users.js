const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: true,
  },
  email: { 
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  resetCode: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User; 
