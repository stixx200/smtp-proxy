"use strict";

const nodemailer = require("nodemailer");
const { username, password } = require("../configuration");

const transport = nodemailer.createTransport({
    host: "127.0.0.1",
    port: 587,
    secure: false,
    ignoreTLS: true,
    auth: {
      user: username,
      pass: password,
    }
  });

const message = {
    from: 'todo@todo.de',
    to: 'receiver@sender.com',
    subject: 'Message title',
    text: 'Plaintext version of the message',
    html: '<p>HTML version of the message</p>'
};

transport.sendMail(message, (error, info) => {
    if (error) {
        console.error(error);
    } else {
        console.log(info);
    }
})