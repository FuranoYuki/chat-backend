const jwt = require("jsonwebtoken");

module.exports = (socket, next) => {
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
}
