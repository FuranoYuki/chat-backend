//dependencies
const express = require("express")
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const socketio = require('socket.io')
const jwt = require("jsonwebtoken");
const path = require('path');

require("dotenv").config();

//config middleware
const app = express();

//static files
app.use('/imagePerfil', express.static(path.resolve(__dirname, 'storage', 'imgPerfil')));

//cors
app.use(cors())
//helmet
app.use(helmet());
//parseJson
app.use(express.json());
app.use(express.urlencoded({extended: false}));  

//pass app.use to controllers
require('./app/controllers')(app);

const server = http.createServer(app);
const io = socketio(server)

io.use((socket, next) => {
    const authHeader = socket.handshake.query.auth;

    if(!authHeader)
        next(new Error("header authorization doesn't exist"));

    const parts = authHeader.split(" ");

    if(parts.length < 2)
        next(new Error("header authorization incomplete"));

    const [schema, token] = parts;

    if(!/^Bearer$/i.test(schema))
        next(new Error("the Bearer in the header authorization is missing"));

    jwt.verify(token, process.env.SECRET_API, (error, decoded) => {
        if(error){
            const tokenExpired = error.expiredAt;
            next(new Error({
                message: "failed at verify header authorization",
                tokenExpired
            }));
        }
        socket.userId = decoded.id
        next();
    }); 
});

io.on("connection", socket => {

    socket.on('userRoom', (friends, name) => {
        friends.forEach(element => {
            socket.join(`${element._id}`);
        });
        socket.join(`${name}`);
    });

    socket.on('changeStatus', data => {
        data.forEach(room => {
            socket.to(`${room._id}`).emit('friendChangeStatus');
        })
    });

    socket.on('pending', () => {
        console.log(socket.userId);
        socket.to(socket.userId).emit('newPending')
    })

    socket.on('sendMessage', data => {
        socket.to(`${data}`).emit('newMessage');
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
});

server.listen(process.env.PORT || 3001);
