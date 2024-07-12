const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(express.json());

// Middleware untuk memverifikasi token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization || req.headers.Authorization;
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const newtoken = token.split(" ")[1];
    const decoded = jwt.verify(newtoken, "secret");
    req.user = decoded;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).send("Invalid Token");
  }
};

// Middleware untuk memverifikasi role 1
const verifyRole1 = (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "User is not authenticated" });
  }

  const { role } = req.user;
  if (role !== "1") {
    return res.status(403).json({ message: "User Role Not Allowed!" });
  }
  next();
};

// Middleware untuk memverifikasi role 2
const verifyRole2 = (req, res, next) => {
  if (!req.user) {
    return res.status(400).json({ message: "User is not authenticated" });
  }

  const { role } = req.user;
  if (role === "3") {
    return res.status(403).json({ message: "User Role Not Allowed!" });
  }
  next();
};

app.post('/users', verifyToken, verifyRole1, (req, res) => {
  const user = req.body;
  console.log('User received:', user);
  res.status(201).send('User added successfully');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = { verifyToken, verifyRole1, verifyRole2 };










// const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const token = req.headers.authorization || req.headers.Authorization;
//   if (!token) {
//     return res.status(403).send("A token is required for authentication");
//   }
//   try {
//     const newtoken = token.split(" ")[1];
//     const decoded = jwt.verify(newtoken, "secret");
//     req.user = decoded;
//   } catch (err) {
//     console.log(err);
//     return res.status(401).send("Invalid Token");
//   }
//   return next();
// };

// const verifyRole1 = (req, res, next) => {
//   const { role } = req.user;
//   try {
//     if (role !== "1") {
//       throw new Error("User Role Not Allowed!");
//     }
//     next();
//   } catch (err) {
//     res.status(400).json({
//       message: err.message,
//     });
//   }
// };

// const verifyRole2 = (req, res, next) => {
//   const { role } = req.user;
//   try {
//     if (role === "3") {
//       throw new Error("User Role Not Allowed!");
//     }
//     next();
//   } catch (err) {
//     res.status(400).json({
//       message: err.message,
//     });
//   }
// };

// module.exports = { verifyToken, verifyRole1, verifyRole2 };

// // to generate token secret
// // require('crypto').randomBytes(64).toString('hex')
