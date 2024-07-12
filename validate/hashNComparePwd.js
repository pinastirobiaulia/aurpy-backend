const bcrypt = require("bcrypt");

const hashPassword = async (plaintext) => {
  const hash = await bcrypt.hash(plaintext, 10);
  return hash;
};

const comparePassword = async (plaintext, hash) => {
  const result = await bcrypt.compare(plaintext, hash);
  return result;
};

module.exports = { hashPassword, comparePassword };
