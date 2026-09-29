const router = require("express").Router();
const { register, login, refresh, logout } = require("../controllers/authController");
const { protect, adminOnly } = require("../middleware/auth");
const { getAllUsers } = require("../controllers/adminController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/users", protect, adminOnly, getAllUsers);

module.exports = router;
