const nodemailer = require("nodemailer");

const authEmail = nodemailer.createTransport({
    host:process.env.SMTP_HOST,
    port:process.env.SMTP_PORT,
    secure:false,
    auth:{
        user:process.env.SMTP_USERNAME,
        pass:process.env.SMTP_PASSWORD
    },
});

module.exports = authEmail;