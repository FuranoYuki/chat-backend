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

//socket
const authMiddleware = require("./socket/authMiddleware");
io.use(authMiddleware);
require('./socket')(io);



server.listen(process.env.PORT || 3001);
