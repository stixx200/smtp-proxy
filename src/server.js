"use strict";

const SMTPServer = require("smtp-server").SMTPServer;
const { username, password, allowedSenders } = require("../configuration");

function addAuthOption(options) {
    if (username && password) {
        options.onAuth = function (auth, session, callback) {
            if (auth.username !== username || auth.password !== password) {
                console.error("auth rejected");
                return callback(new Error("Invalid username or password"));
            }
            console.log("auth successful");
            callback(null, { user: { user: auth.username, pass: auth.password } });
        }
    }
}

function addSenderValidation(options) {
    if (allowedSenders && allowedSenders.length > 0) {
        options.onMailFrom = function (address, session, callback) {
            if (!allowedSenders.includes(address.address)) {
              return callback(new Error("Given sender is not acceptable."));
            }
            return callback(); // Accept the address
        }
    }
}

function addMailHandler(options, sender) {
    options.onData = async function (stream, session, callback) {
        console.log(JSON.stringify(session, null, 2));
        console.log("");

        try {
            await sender.sendMail(session, stream);
            callback(null);
        } catch (error) {
            callback(error);
        }
    }
}

function getOptions(sender) {
    const options = {
        secure: false,
        disabledCommands: ["STARTTLS"],
    };

    addAuthOption(options);
    addSenderValidation(options);
    addMailHandler(options, sender);

    return options;
}

class Server extends SMTPServer {
    constructor(sender) {
        super({
            ...getOptions(sender),
        });

        this.on("error", err => {
            console.log("Error %s", err.message);
        });
    }
}

module.exports = {
    Server,
};
