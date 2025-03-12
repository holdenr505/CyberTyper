const registerSocketHandlers = (socket, eventBus) => {
    if (typeof socket.on !== 'function') {
        return;
    }

    socket.io.on('reconnect', () => {
        eventBus.dispatchEvent(new CustomEvent('reconnect', { detail: socket.id }));
    });

    socket.on('player joined', (player) => {
        const { name, id } = player;
        eventBus.dispatchEvent(new CustomEvent('player joined', { detail: { name, id } }));
    })

    socket.on('countdown', (remainingTime) => {
        eventBus.dispatchEvent(new CustomEvent('countdown', { detail: remainingTime }));
    });

    socket.on('room data', (roomData) => {
        const { prompt, players } = roomData;
        eventBus.dispatchEvent(new CustomEvent('room data', { detail: { prompt, players } }));
    });

    socket.on('start race', () => {
        eventBus.dispatchEvent(new CustomEvent('start race'));
    });

    socket.on('update player', (playerData) => {
        const { typedWords, wpm, id } = playerData;
        eventBus.dispatchEvent(new CustomEvent('update player', { detail: { typedWords, wpm, id }}));
    });

    socket.on('game over', (gameData) => {
        const { winningPlayer, room } = gameData;
        eventBus.dispatchEvent(new CustomEvent('game over', { detail: winningPlayer }));
    });

    socket.on('player disconnected', (id) => {
        eventBus.dispatchEvent(new CustomEvent('player disconnected', { detail: id }));
    });

    eventBus.addEventListener('join race', (event) => {
        // only need to connect if the socket is disconnected
        if (!socket.connected) {
            socket.connect();
        }
        const name = event.detail;
        socket.emit('join race', name);
    });

    eventBus.addEventListener('leave room', () => {
        socket.emit('leave room');
    });

    eventBus.addEventListener('send word', (event) => {
        const word = event.detail;
        socket.emit('send word', word);
    })

    eventBus.addEventListener('request update', () => {
        socket.volatile.emit('request update');
    });

    eventBus.addEventListener('player victory', () => {
        socket.emit('player victory');
    });
}

export default registerSocketHandlers;