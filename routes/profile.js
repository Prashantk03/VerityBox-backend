const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.get("/me", profileController.getMyProfile);
router.get("/:profileId", profileController.getProfile);

module.exports = router;