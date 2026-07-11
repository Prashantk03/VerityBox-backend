const express = require("express");
const router = express.Router();
const {
  createGuest,
  validateSession,
  createIdentity,
} = require("../controllers/authController");

router.post("/guest", createGuest);
router.post("/validate", validateSession);
router.post("/create-identity", createIdentity);

module.exports = router;
