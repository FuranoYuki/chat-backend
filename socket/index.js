module.exports = io => io.on("connection", socket => {

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