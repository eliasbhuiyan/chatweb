const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'djscrr2gy',
  api_key: '776332758593124',
  api_secret: '7zDU_v72_tYpT0ojXy0Ogt8ebZI'
});

module.exports = cloudinary;