const nodemailer = require("nodemailer");
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  const output = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Request</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #333333;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              background-color: #ffffff;
              padding: 20px;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h3 {
              color: #555555;
            }
            p {
              line-height: 1.5;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            ul li {
              margin-bottom: 10px;
              padding: 10px;
              background-color: #f9f9f9;
              border-radius: 3px;
            }
            a {
              color: #1a73e8;
              text-decoration: none;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <p>You have a new contact request</p>
            <h3>Contact Details</h3>
            <ul>
              <li><strong>Name:</strong> ${req.body.name}</li>
              <li><strong>Email:</strong> <a href="mailto:${req.body.email}">${req.body.email}</a></li>
            </ul>
            <h3>Message</h3>
            <p>${req.body.message}</p>
          </div>
        </body>
      </html>
    `;

  //? quand on appelle sendMail , dedans il va retourner le callback function en l'appelant puis cela va repondre le request handler
  sendMail(
    "gmail",
    process.env.SENDER_SMTP_USER,
    process.env.SENDER_SMTP_USER,
    process.env.SENDER_SMTP_PASSWORD,
    process.env.RECEIVER_CONTACT_EMAILS?.split(",").map((email) =>
      email.trim()
    ) || [],
    "Portfolio Contact",
    "someone contacts you from your portfolio site",
    output,
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message:
            process.env.NODE_ENV != "production"
              ? err.message
              : "message non envoyé",
          sended: false,
        });
      }
      return res.json({ message: "message envoyé avec succès", sended: true });
    }
  );
});

const sendMail = (
  service,
  from_email,
  sender_smtp_user,
  sender_smtp_pass,
  to_emails = [],
  subject,
  text,
  html,
  cb
) => {
  const options = {
    service,
    port: 587,
    secure: false,
    auth: {
      user: sender_smtp_user,
      pass: sender_smtp_pass, // for security purposes, for gmail use an app password (https://security.google.com/settings/security/apppasswords)
    },
  };
  const transporter = nodemailer.createTransport(options);
  const mailOptions = {
    from: {
      name: "Portfolio site",
      address: from_email,
    },
    to: to_emails, // TODO: the receiver emails has to be authorized for the free tier
    subject,
    text,
    html,
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      return cb(err, null);
    }
    return cb(null, data);
  });

  transporter.close();
};

module.exports = { sendMail, router };
