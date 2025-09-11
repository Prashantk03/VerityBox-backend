const express = require("express");
const router = express.Router();
const { createGuest, validateSession } = require("../controllers/authController");

router.post("/guest", createGuest);
router.post("/validate", validateSession);

module.exports = router;

