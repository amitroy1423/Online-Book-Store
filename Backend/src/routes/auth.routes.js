const express = require("express");

const {
    register,
    login,
    getMe,
    logout,
} = require("../controllers/auth.controller");

const { authUser } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authUser, getMe);
router.post("/logout", logout);

module.exports = router;