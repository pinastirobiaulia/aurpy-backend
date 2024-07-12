require("dotenv").config();
const app = require("express")();
const express = require("express");
const bookRoutes = require("./routes/index");
const userRoutes = require("./routes/userRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");

// dokumnetasi swagger
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const options = require("./swagger");
const specs = swaggerJsDoc(options);

const port = process.env.PORT || 5000;

require("./database");
app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// menggunakan body-parser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(userRoutes);
app.use(bookRoutes);

// Handle static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const server = app.listen(port, () => {
  console.log(`app listen at http://localhost:${port}`);
});

module.exports = { app, server };
