//dependencies
const express = require("express")
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const socketio = require('socket.io')
const path = require('path');

require("dotenv").config();

//config middleware
const app = express();

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

//socket-middleware
const auth = require('./socket/socketAuthMiddleware');
io.use(auth);
//socket-routes
const userConnection = require('./socket/socketUserRoutes');
io.on("connection", userConnection);



server.listen(process.env.PORT || 3001);
