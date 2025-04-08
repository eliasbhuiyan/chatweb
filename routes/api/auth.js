const express = require("express");
const {
  registration,
  loginController,
  verifyEmailAddress,
  forgatPass,
  resetPass,
} = require("../../controller/authController");
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyemail", verifyEmailAddress);
router.post("/login", loginController);
router.post("/forgatpass", forgatPass)
// http://localhost:8000/resetpassword/imI7SXJ1DOvV1QeV9oBpVUqX83Y3?email=elias.cit.bd@gmail.com
router.post("/resetpassword/:randomstring", resetPass)
module.exports = router;
