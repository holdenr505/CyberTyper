// essentially acts as a player manager
class Room {
    constructor(io, prompt = '', players = new Map()) {
        this.id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
        this.prompt = prompt;
        this.started = false;
        this._players = players;
        this._size = 1;
        this._io = io;
    }

    isFull() {
        return this._players.size >= this._size;
    }

    isEmpty() {
        return this._players.size === 0;
    }

    addPlayer(id, player) {
        if (!this._players.has(id) && !this.isFull()) {
            this._players.set(id, player);
        }
    }

    removePlayer(id) {
        if (this._players.has(id)) {
            this._players.delete(id);
        }
    }

    getPlayer(id) {
        if (this._players.has(id)) return this._players.get(id);
    }

    getAllPlayers() {
        return this._players;
    }

    clearPlayers() {
        this._players = new Map();
    }

    broadcast(event, data = {}) {
        this._io.to(this.id).emit(event, data);
    }
}

export default Room;