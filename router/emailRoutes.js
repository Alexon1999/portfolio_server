const nodemailer = require('nodemailer');
const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  //? quand on appelle sendMail , dedans il va retourner le callback function en l'appelant puis cela va repondre le request handler
  sendMail(
    'alexonportfolio@gmail.com',
    'Portfolio Contact',
    'someone contacts you from your portfolio site',
    output,
    (err, data) => {
      if (err) {
        return res.status(500).json({
          message:
            process.env.NODE_ENV != 'production'
              ? err.message
              : 'message non envoyé',
          sended: false,
        });
      }
      return res.json({ message: 'message envoyé avec succès', sended: true });
    }
  );
});

const sendMail = (email, subject, text, html, cb) => {
  const options = {
    service: 'gmail',
    port: 465,
    auth: {
      user: 'alexonportfolio@gmail.com',
      pass: 'Ualexon23+',
    },
  };
  const transporter = nodemailer.createTransport(options);
  const mailOptions = {
    from: `Portfolio site  <${email}>`, // TODO replace this with your own email
    to: 'alexon1999@gmail.com', // TODO: the receiver email has to be authorized for the free tier
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
