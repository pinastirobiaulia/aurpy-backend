const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(`${process.env.MONGODB_ATLAS}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log(`mongodb terkoneksi...`);
});
