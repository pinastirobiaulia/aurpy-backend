const userRoutes = require("express").Router();
const {
  getAllUsers,
  getUserById,
  addUser,
  deleteUser,
  reqError,
  login,
  ubahRoleUser,
  searchUser,
  forgotPassword,
  verifyResetCode,
  resetPassword,
} = require("../controller/userController"); 
const { verifyToken, verifyRole1 } = require("../middleware/auth");

userRoutes.post("/login", login);
userRoutes.get("/users",   getAllUsers);
userRoutes.get("/searchUser",   searchUser);
userRoutes.get("/users/:id",   getUserById);
userRoutes.post("/tambahUser", addUser);
userRoutes.delete("/hapusUser/:id",  deleteUser);
userRoutes.put("/ubahRoleUser/:id",  ubahRoleUser);
userRoutes.put("/ubahRoleUser/:id",  ubahRoleUser);
userRoutes.post("/forgot-password", forgotPassword);
userRoutes.post("/verify-reset-code", verifyResetCode);
userRoutes.post("/reset-password", resetPassword);
userRoutes.post("/change-password/:id/:token", resetPassword);

module.exports = userRoutes;
