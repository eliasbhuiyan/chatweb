const express = require("express");
const {
  registration,
  loginController,
} = require("../../controller/authController");
const router = express.Router();

router.post("/registration", registration);
router.post("/login", loginController);

module.exports = router;
