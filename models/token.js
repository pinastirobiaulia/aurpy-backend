const mongoose = require("mongoose");

const Token = mongoose.model("Token", {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
  resetCode: {
    type: String,
    required: false,
  },
});

// const Token = mongoose.model("Token", TokenSchema);
module.exports = Token;
