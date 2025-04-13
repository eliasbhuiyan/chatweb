const express = require("express");
const {
  registration,
  loginController,
  verifyEmailAddress,
  forgatPass,
  resetPass,
  update,
} = require("../../controller/authController");
const multer  = require('multer')
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + "profile"
    
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const upload = multer({ storage: storage })




router.post("/registration", registration);
router.post("/verifyemail", verifyEmailAddress);
router.post("/login", loginController);
router.post("/forgatpass", forgatPass)
// http://localhost:8000/resetpassword/imI7SXJ1DOvV1QeV9oBpVUqX83Y3?email=elias.cit.bd@gmail.com
router.post("/resetpassword/:randomstring", resetPass)
router.post("/update", upload.single('avatar'), update)
module.exports = router;
