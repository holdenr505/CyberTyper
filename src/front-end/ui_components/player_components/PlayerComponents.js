import './PlayerComponents.css';
import assets from '../../assets/assets.js';

class PlayerComponent {
    constructor({car, name, id}) {
        this.playerComponent = document.createElement('div');
        this.playerComponent.id = id;
        this.playerComponent.classList.add('player');

        this._uiReferences = {
            playerName: document.createElement('div'),
            playerWpm: document.createElement('div'),
            playerCar: document.createElement('img'),
        };
        
        this._uiReferences.playerName.textContent = name;
        this._uiReferences.playerWpm.textContent = '0 wpm';

        this._uiReferences.playerName.classList.add('player-name');
        this._uiReferences.playerWpm.classList.add('player-wpm');

        this._uiReferences.playerCar.src = assets.cars[car];
        this._uiReferences.playerCar.alt = 'Player car';
        
        this.playerComponent.append(this._uiReferences.playerName, this._uiReferences.playerCar, this._uiReferences.playerWpm);
    }

    get children() {
        return this._uiReferences;
    }

    get name() {
        return this._uiReferences.playerName.textContent;
    }

    set name(name) {
        if (typeof name !== 'string') return;
        this._uiReferences.playerName.textContent = name;
    }

    get car() {
        return this._uiReferences.playerCar;
    }

    set car(car) {
        this._uiReferences.playerCar.src = car;
    }

    get wpm() {
        return this._uiReferences.playerWpm.textContent;
    }

    set wpm(wpm) {
        if (typeof wpm !== 'number') return;
        this._uiReferences.playerWpm.textContent = `${wpm} wpm`;
    }
}

// tightly coupled to PlayerComponent
class Racetrack {
    constructor() {
        this.track = document.createElement('div');
        this.track.id = 'racetrack';
        this._players = {};
    }

    addPlayer(playerData) {
        if (this._players[playerData.id]) return;
        const player = new PlayerComponent(playerData);
        this._players[playerData.id] = player;
        this.track.append(player.playerComponent);
    }

    removePlayer(id) {
        if (!this._players[id]) return;

        delete this._players[id];
        const player = this.track.querySelector(`#${id}`);
        if (player) {
            player.remove();
        }
    }

    getPlayer(id) {
        return this._players[id];
    }

    clearPlayers() {
        this._players = {};
        this.track.innerHTML = '';
    }
}

export default Racetrack;