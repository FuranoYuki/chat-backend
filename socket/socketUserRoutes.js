module.exports =  socket => {

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

    socket.on('startCall', data => {
        socket.to(data).emit('receving call', socket.userId);
    })

    socket.on('pending', () => {
        socket.to(socket.userId).emit('newPending', socket.userId)
    })

    socket.on('sendMessage', data => {
        socket.to(`${data}`).emit('newMessage');
    });

    socket.on("disconnect", () => {
        
    })
};
