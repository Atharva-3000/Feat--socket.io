import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
const port = 3000;
const app = express();
const server = createServer(app);
import cors from 'cors';
const io = new Server(server,{
    // options
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    }
});
const secret="1234";
app.get("/", (req, res) => {
    res.send("Hello World");
})


app.get("/login", (req, res) => {
    const token = jwt.sign({_id:"abcde"}, secret);

    res.cookie("token", token, {httpOnly:true, secure:true, sameSite:"none"}).send("Logged In");
});


const user=false
io.use((socket,next)=>{
    cookieParser() (socket.request, socket.request.res, (err)=>{
        if(err) return next(new Error("Authentication Error"));
        const token = socket.request.cookies.token;
        if(!token) return next(new Error("Authentication Error"));

        const decoded = jwt.verify(token, secret);

        next();

    });
    if(user) next();
})

io.on('connection',(socket)=>{
    console.log("User Connected");
    console.log("Id",socket.id);

    socket.on("message",(data)=>{
        console.log(data);
        socket.to(data.room).emit("receive-message",data.message);
    })
    socket.on('disconnect',()=>{
        console.log("User Disconnected", socket.id);
    }); 

    socket.on("join-room",(room)=>{
        console.log("Joining Room", room);
        socket.join(room);
    });
});


server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});