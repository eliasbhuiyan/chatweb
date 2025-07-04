const express = require("express");
const dbConfig = require("./dbConfig/db");
const router = require("./routes");
require("dotenv").config();
const http = require('http');
const { Server } = require("socket.io");
const cors = require("cors")
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors({
    // origin: ['https://chatweb-app-1pfm.onrender.com', 'http://localhost:5173'],
    origin: '*',
}))
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: ['https://chatweb-app-1pfm.onrender.com', 'http://localhost:5173']
});
global.io = io;
const activeUsers = new Map()
io.on("connection", socket => {
    socket.on("join_room", (convoId)=>{
        socket.join(convoId)
    })

    socket.on("join_user", (userId)=>{
        activeUsers.set(socket.id, userId)
        io.emit("active_users", Array.from(activeUsers.values()))
    })
  
    socket.on("disconnect",()=>{
        activeUsers.delete(socket.id)
        setTimeout(() => {
            io.emit("active_users", Array.from(activeUsers.values()))
        }, 5000);
    })
});

dbConfig();

app.use(router);

httpServer.listen(8000, () => console.log("Server is running"));
