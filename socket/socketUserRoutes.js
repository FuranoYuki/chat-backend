module.exports =  socket => {

    socket.on('userRoom', (name) => {
        socket.join(name);
    });

    socket.on('changeStatus', data => {
        data.forEach(room => {
            socket.to(`${room.name + '' + room.code}`).emit('friendChangeStatus');
        })
    });

    socket.on('pending', to => {
        socket.to(to).emit('pendingNotification')
    })

    socket.on('startCall', data => {
        socket.to(data.to).emit('pendingCall', ({id: data.id, from: data.from}))
    })

    socket.on('acceptedCall', data => {
        socket.to(data).emit('acceptedCall')
    })

    socket.on('recusedCall', data => {
        socket.to(data).emit('recusedCall')
    })

    socket.on('callOffer', data => {
        console.log(data);
        socket.to(data.to).emit('callOffer', {signal: data.signal, from: data.from})
    })

    socket.on('callAnswer', data => {
        console.log(data);
        socket.to(data.to).emit('callAnswer', (data.signal))
    })

    socket.on('finishCall', data => {
        socket.to(data).emit('finishCall')
    })

    socket.on('sendMessage', to => {
        socket.to(to).emit('newMessage');
    });

    socket.on("disconnect", () => {
        
    })
};

function addLocalTracks (rtcPeerConnection) {
    stream.getTracks().forEach((track) => {
        rtcPeerConnection.addTrack(track, stream)
    })
}

function iceCandidate (event) {
    if (event.candidate) {
        socket.emit('ice-candidate', {
            to,
            candidate: event.candidate.candidate,
            label: event.candidate.sdpMLineIndex
        })
    }
}
