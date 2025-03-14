import generatePrompt from "./helpers.js";
import Player from '../entities/Player.js';
import Room from '../entities/Room.js';

// handle join race event and return the joined room
const handleJoinRace = async (socket, rooms, io, name, car) => {
    let availableRoom = [...rooms.values()].find(room => !room.isFull() && !room.started);

    // create a new room and add the new player to it
    if (!availableRoom) {
        const prompt = await generatePrompt();
        availableRoom = new Room(io, prompt, new Map());
        rooms.set(availableRoom.id, availableRoom);
    }

    rooms.set(availableRoom.id, availableRoom);
    availableRoom.addPlayer(socket.id, new Player(socket.id, name, [], car));
    socket.join(availableRoom.id);
    console.log(car);
    socket.to(availableRoom.id).emit('player joined', { id: socket.id, name: name, car: car });
    console.log(`Player with ID: ${socket.id} joined room ${availableRoom.id}`)

    return availableRoom;
}

// update player word list and check if the player has completed the prompt
const handleSendWord = (socket, room, word) => {
    if (!room) return;
    const player = room.getPlayer(socket.id);
    player.appendWord(word);

    const playerText = player.typedWords.map(entry => entry.word).join(' ');
    if (playerText === room.prompt) {
        room.broadcast('game over', { winningPlayer: player.name });
    }
}

// calculate player WPM and send result to
// other players in room for UI update
const handleRequestUpdate = (socket, room) => {
    if (!room) {
        console.log('Room not found');
        return;
    }

    const player = room.getPlayer(socket.id);
    const wpm = player.calculateWPM();
    room.broadcast('update player', { typedWords: player.typedWords, wpm: wpm, id: player.id });
}

// handle player disconnects
const handleDisconnect = (socket, rooms, room) => {
    if(!room) return;

    room.broadcast('player disconnected', socket.id);
    room.removePlayer(socket.id);
    socket.leave(room.id);

    console.log(`${socket.id} left room ${room.id}`);

    if (room.isEmpty()) {
        rooms.delete(room.id);
    }
}

// initializing the race and start the timer
const initRace = (room) => {
    if(!room) return;

    let remainingTime = 10;
    let countdownInterval = setInterval(() => {
        if (!remainingTime) {
            clearInterval(countdownInterval);
            room.started = true;
            room.broadcast('start race');
        }
        else if(!room.isFull()) clearInterval(countdownInterval);
        else {
            room.broadcast('countdown', remainingTime);
            remainingTime--;
        }
    },
    1000);
}

// register socket handlers
const registerSocketHandlers = async (socket, rooms, io) => {
    let currentRoom;
    
    if (typeof socket.on !== 'function') return;
    
    socket.on('join race', async (playerData) => {
        const { name, car } = playerData;
        currentRoom = await handleJoinRace(socket, rooms, io, name, car);
        // player data must be in a form that can be serialized (will lose methods, only preserve state)
        socket.emit('room data', { prompt: currentRoom.prompt, players: Object.fromEntries(currentRoom.getAllPlayers()) });
        if (currentRoom.isFull()) initRace(currentRoom);
    });
    socket.on('send word', (word) => {
        handleSendWord(socket, currentRoom, word);
    })
    socket.on('request update', () => {
        handleRequestUpdate(socket, currentRoom);
    });

    let dcEvents = ['disconnect', 'leave room'];

    dcEvents.forEach(event => {
        socket.on(event, () => {
            handleDisconnect(socket, rooms, currentRoom);
        });
    });
}

export default registerSocketHandlers;