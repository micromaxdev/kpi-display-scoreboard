const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  changePassword,
  getUser,
  updateUser,
  deleteUser,
  getUserOne,
  updateUserOne,
  manageUserOne,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:resetToken", resetPassword);
router.put("/change-password", protect, changePassword);
router.get("/me", protect, getMe);
router.delete("/:id", protect, deleteUser);

router.route("/user").get(protect, getUser);
router.route("/user/:id").delete(protect, deleteUser);
router.route("/user/:id").put(protect, updateUser);
router.route("/userOne/:paramsField").get(protect, getUserOne);
router.route("/userOne/:id").put(protect, updateUserOne);
router.route("/manageUserOne/:id").put(protect, manageUserOne);

module.exports = router;
