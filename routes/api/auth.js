const express = require("express");
const {
  registration,
  loginController,
  verifyEmailAddress,
} = require("../../controller/authController");
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyemail", verifyEmailAddress);
router.post("/login", loginController);

module.exports = router;
