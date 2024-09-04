const nodemailer = require("nodemailer");

async function sendMail(data) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "medappsys.info@gmail.com",
      pass: "rwzympjtkctakold",
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Connectify" <medappsys.info@gmail.com>', // sender address
    to: data.email, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });

  if (info.messageId)
    return true;

  console.log("Message sent: %s", info.messageId);
}

module.exports = { sendMail };
