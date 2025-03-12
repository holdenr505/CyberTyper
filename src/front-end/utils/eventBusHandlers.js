const eventBusHandlers = {
    'reconnect': function(event) {
        this.resetGameDisplay();
        this.render();
        if (this._updateInterval) {
            clearInterval(this._updateInterval);
        }
    },

    'room data': function(event) {
        const { prompt, players } = event.detail;
        this.updatePrompt(prompt, 0);

        Object.entries(players).forEach(([id, player]) => {
            this._uiComponents.racetrack.addPlayer({ car: 'purple', name: player.name, id });
        });
    },

    'player joined': function(event) {
        const { id, name } = event.detail;
        this._uiComponents.racetrack.addPlayer({car: 'red', name, id});
    },

    'player disconnected': function(event) {
        const id = event.detail;
        const player = this._uiComponents.racetrack.getPlayer(id);
        if (player) {
            this._uiComponents.racetrack.removePlayer(id);
        }
    },

    'update player': function(event) {
        const { typedWords, wpm, id } = event.detail;
        const words = this._uiComponents.typingPanel.prompt.split(' ');
        const player = this._uiComponents.racetrack.getPlayer(id);

        if (!player) return;
        
        player.wpm = wpm;

        const maxWidth = this._uiComponents.racetrack.track.offsetWidth - player.playerComponent.offsetWidth;
        const progress = (typedWords.length / words.length) * maxWidth;
    
        player.playerComponent.style.transition = 'transform 0.2s ease-out';
        player.playerComponent.style.transform = `translateX(${progress}px)`;
    },

    'countdown': function(event) {
        const timer = event.detail;
        this._uiComponents.typingPanel.gameInfo = `${timer}s until race begins`;
        
    },

    'start race': function() {
        this._uiComponents.typingPanel.children.playerInput.disabled = false;
        this._uiComponents.typingPanel.children.playerInput.select();
        this._uiComponents.typingPanel.gameInfo = 'The race has begun!';

        this._updateInterval = setInterval(() => {
            this._eventBus.dispatchEvent(new CustomEvent('request update'));
        }, 2000);
    },

    'game over': function(event) {
        const winnerName = event.detail;
        this._uiComponents.typingPanel.children.nextBtn.classList.remove('disable-btn');
        this._uiComponents.typingPanel.children.playerInput.disabled = true;
        this._uiComponents.typingPanel.gameInfo = `${winnerName} wins!`;
        clearInterval(this._updateInterval);
    }
}

export default eventBusHandlers;