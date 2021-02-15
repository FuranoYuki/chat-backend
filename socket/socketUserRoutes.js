module.exports =  socket => {
    socket.on('userRoom', (name) => {
        socket.join(name);
    });

    socket.on('changeStatus', data => {
        data.friends.forEach(room => {
            socket.to(`${room.name + '' + room.code}`).emit('friendChangeStatus');
        })
    });

    socket.on('friendRemoved', data => {
        socket.to(data).emit('friendRemoved')
    })

    socket.on('pendingRequest', to => {
        socket.to(to).emit('pendingRequest')
    })

    socket.on('pendingRecuse', to => {
        socket.to(to).emit('pendingNotificationRecuse')
    })

    socket.on('pendingAccept', to => {
        socket.to(to).emit('pendingNotificationAccept')
    })

    socket.on('startCall', data => {
        console.log('startCall and pendingCall');
        socket.to(data.to).emit('pendingCall', ({id: data.id, from: data.from}))
    })

    socket.on('acceptedCall', data => {
        socket.to(data).emit('acceptedCall')
    })

    socket.on('recusedCall', data => {
        socket.to(data).emit('recusedCall')
    })

    socket.on('callOffer', data => {
        socket.to(data.to).emit('callOffer', {signal: data.signal, from: data.from})
    })

    socket.on('callAnswer', data => {
        console.log('send answer');
        socket.to(data.to).emit('callAnswer', (data.signal))
    })

    socket.on('webrtc_ice_candidate', data => {
        socket.to(data.to).emit('webrtc_ice_candidate', {label: data.label, candidate: data.candidate})
    })

    socket.on('finishCall', (data) => {
        socket.to(data).emit('finishCall')
    })

    socket.on('sendMessage', to => {
        socket.to(to).emit('newMessage');
    });

    socket.on("disconnect", () => {
    })
}
