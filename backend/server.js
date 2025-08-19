const express = require("express");
const dotenv = require('dotenv').config();
const userRoutes = require('./routes/userRoute');
const mongodb = require("./config/config");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const frontend_url = process.env.FRONTEND_URL;

app.use(cors({
    origin: frontend_url,
    credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth/',userRoutes);

const io = new Server(server, {
    cors: {
        origin: frontend_url,
        methods: ['GET', 'POST'],
        credentials: true
    },
});

const port = process.env.PORT || 5000;

mongodb().then(() => {
    server.listen(port, () => {
        console.log(`${port}`);
    });
});

const Conversation = require("./models/conversations");
const Messages = require("./models/messageModel");

io.on("connection",(socket) => {
    console.log("Socket connected");
    socket.on("join", (userId) => {
        socket.join(userId);
    });

    socket.on("sendMessage", async (data) => {
        const { sender , receiver , text } = data;

        let conversation = await Conversation.findOne({ $or : [
            { participants : [sender , receiver]},
            { participants : [receiver , sender]},
        ]})

        if(conversation){
            conversation.lastMessage.text = text;
            conversation.lastMessage.sender = sender;
            await conversation.save();
        } else {
            conversation = new Conversation({
                participants : [ sender , receiver],
                lastMessage : {
                    text : text,
                    sender : sender
                }
            })
            await conversation.save();
        }

        const saveMessage = new Messages({
            conversationId : conversation._id,
            sender,
            receiver,
            text
        });

        await saveMessage.save();

        io.to(receiver).emit("receiveMessage", {saveMessage});
    })

    socket.on("disconnect" ,() => {
        console.log("Socket disconnected");
    })
})