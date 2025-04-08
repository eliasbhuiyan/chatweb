const nodemailer = require("nodemailer");
const sendMail = async (email, subject, template, random)=>{
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        secure: true,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASS,
        },
      });
    
      await transporter.sendMail({
        from: '"no reply" ChatWeb',
        to: email,
        subject: subject,
        html: template(random, email),
      });
}

module.exports = {sendMail}