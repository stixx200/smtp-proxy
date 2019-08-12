"use strict";

const { simpleParser } = require("mailparser");
const nodemailer = require("nodemailer");

class Sender {

    async sendMail(session, stream) {
        try {
            const parsedMail = await simpleParser(stream);
            console.log("email parsed" + session.user);
            const transport = nodemailer.createTransport({
                host: "127.0.0.1",
                port: 588,
                secure: true,
                auth: session.user,
                // todo: remove self signed certs
                tls: {
                  rejectUnauthorized: false
                }
            });
            await transport.sendMail({
                ...parsedMail,
                from: parsedMail.from.value,
                to: parsedMail.to.value
            });
            console.log("#### forwarded mail");
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = {
    Sender,
};
