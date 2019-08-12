"use strict";

const { Server } = require("./src/server");
const { Sender } = require("./src/sender");

const sender = new Sender();
const server = new Server(sender);

server.listen(587, () => {
    console.log("server started at port 587");
});
