const dotenv = require("dotenv");

dotenv.config();

function createMailOptions(email, token) {
  const mailOptions = {
    from: process.env.MAIL_FROM_NAME,
    to: email,
    subject: "Your Password Reset Token",
    html: `<div><p>Dear ${email},</p>
      <p>You recently requested to reset your password. Please use the following token to reset your password:</p>
      <p style="font-size: 20px;"><strong>${token}</strong></p>
      <p>The token is only valid for 5 minutes.</p>
      <p>If you did not request a password reset, please ignore this email. Thank you!</p>
      <p>Best regards, ${process.env.MAIL_FROM_NAME}</p></div>`,
  };

  return mailOptions;
};

module.exports = createMailOptions;
