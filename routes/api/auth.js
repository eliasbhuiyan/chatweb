const express = require("express");
const {
  registration,
  loginController,
  verifyEmailAddress,
  forgatPass,
  resetPass,
  update,
} = require("../../controller/authController");
const upload = require("../../helpers/multer");
const authMiddleware = require("../../middleware/authMiddleware");
const router = express.Router();

router.post("/registration", registration);
router.post("/verifyemail", verifyEmailAddress);
router.post("/login", loginController);
router.post("/forgatpass", forgatPass)
// http://localhost:8000/resetpassword/imI7SXJ1DOvV1QeV9oBpVUqX83Y3?email=elias.cit.bd@gmail.com
router.post("/resetpassword/:randomstring", resetPass)
router.post("/update", authMiddleware, upload.single('avatar'), update)
module.exports = router;
