const express = require("express");
const dbConfig = require("./dbConfig/db");
const router = require("./routes");
require("dotenv").config();
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors")
const app = express();
app.use(express.json());
app.use(cors())
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: "*"
});
global.io = io;

dbConfig();

app.use(router);

// console.log(new Date("2025-05-20T10:12:13.008+00:00").toLocaleString());


httpServer.listen(8000, () => console.log("Server is running"));