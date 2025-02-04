import express from "express";
import http from "http";
import { Server } from "socket.io";



const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" },
});

const PORT = 8080

// storing the users typing in state memory
let typingUsers = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("userTyping", (usertypingdata) => {
        typingUsers[socket.id] = usertypingdata //storing the typing data
        io.emit("updatedUserTyping", typingUsers) //sending the updated data to the client
    })

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        delete typingUsers[socket.id]
        io.emit("updateTypingUsers", typingUsers);
    });
});

server.listen(PORT, () => console.log("Server running on port", PORT));
