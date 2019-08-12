"use strict";

const SMTPServer = require("smtp-server").SMTPServer;
const { username, password, allowedSenders } = require("../configuration");

function addAuthOption(options) {
    if (username && password) {
        options.onAuth = function (auth, session, callback) {
            console.log("auth check");
            if (auth.username !== username || auth.password !== password) {
                return callback(new Error("Invalid username or password"));
            }
            callback(null, { user: auth.username });
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

function addMailHandler(options) {
    options.onData = function (stream, session, callback) {
        console.log("RECEIVED NEW MESSAGE");
        console.log(JSON.stringify(session, null, 2));

        stream.pipe(process.stdout); // print message to console
        stream.on("end", callback);
    }
}

function getOptions() {
    const options = {
        secure: true,
        // self signed-certificate
    };

    addAuthOption(options);
    addSenderValidation(options);
    addMailHandler(options);

    return options;
}

class Server extends SMTPServer {
    constructor() {
        super({
            ...getOptions(),
        });

        this.on("error", err => {
            console.log("Error %s", err.message);
        });
    }
}

const server = new Server();
server.listen(588, () => console.log("TestServer listening."));
