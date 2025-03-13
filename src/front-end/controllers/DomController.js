// centralize UI updates
class DomController {
   constructor (header, homepage, typingPanel, racetrack, eventBus, eventHandlers = {}) {
        this._uiComponents = { header, homepage, typingPanel, racetrack };   
        this._wordIndex = 0;
        this._eventBus = eventBus; // eventBus singleton
        this._updateInterval; // interval for UI update request

        // register event handlers here
        this.registerEventBusHandlers(eventHandlers);
        this._uiComponents.homepage.setJoinCallback(this.handleJoinBtn.bind(this));
        this._uiComponents.typingPanel.setBtnCallback(this.handleNextBtn.bind(this));
        this._uiComponents.typingPanel.setInputCallback(this.handlePlayerInput.bind(this));
    }

    registerEventBusHandlers(eventHandlers) {
        Object.entries(eventHandlers).forEach(([event, handler]) => {
            this._eventBus.addEventListener(event, handler.bind(this));
        });
    }

    updatePrompt(prompt = '', index) {
        let promptText = prompt;
        if (index >= 0) {
            this._uiComponents.typingPanel.prompt = promptText.split(' ').map(word => `<span>${word}</span>`).join(' ');
            document.querySelectorAll('span')[index].classList.add('current-word');
        }
        else {
            this._uiComponents.typingPanel.prompt = prompt;
        }
    }

    handleJoinBtn() {
        if (!this._uiComponents.homepage.children.nameInput.value.trim()) {
            this._uiComponents.homepage.children.nameParagraph.classList.add('invalid');
            this._uiComponents.homepage.children.nameParagraph.textContent = 'Invalid name. Try again';
        }
        else {
            document.body.replaceChild(this._uiComponents.racetrack.track, this._uiComponents.homepage.page);
            document.body.append(this._uiComponents.typingPanel.panel);
            this._eventBus.dispatchEvent(new CustomEvent('join race', { detail: this._uiComponents.homepage.children.nameInput.value }));
        }
    }

    handleNextBtn() {
        this.resetGameDisplay();
        this._eventBus.dispatchEvent(new CustomEvent('leave room'));
        this._eventBus.dispatchEvent(new CustomEvent('join race', { detail: this._uiComponents.homepage.children.nameInput.value }));
    }

    handlePlayerInput() {
        if (this._uiComponents.typingPanel.children.playerInput.value.endsWith(' ')) {
            const words = this._uiComponents.typingPanel.prompt.split(' ');
            if (this._uiComponents.typingPanel.children.playerInput.value.trim() === words[this._wordIndex]) {
                this._eventBus.dispatchEvent(new CustomEvent('send word', { detail: words[this._wordIndex] }));
                this._uiComponents.typingPanel.children.playerInput.value = '';
                this._wordIndex++;

                if (this._wordIndex >= words.length) {
                    this._wordIndex = 0;
                    this._eventBus.dispatchEvent(new CustomEvent('player victory'));
                }
                else {
                    this.updatePrompt(this._uiComponents.typingPanel.prompt, this._wordIndex);
                }
            }
        }
    }

    resetGameDisplay() {
        this._wordIndex = 0;
        this._uiComponents.racetrack.clearPlayers();
        this._uiComponents.typingPanel.children.nextBtn.classList.add('disable-btn');
        this._uiComponents.typingPanel.children.playerInput.value = '';
        this._uiComponents.typingPanel.children.playerInput.disabled = true;
        this._uiComponents.typingPanel.children.nextBtn.classList.remove('enable-btn');
        this._uiComponents.typingPanel.gameInfo = 'Waiting for players...';
        this.updatePrompt();
    }

    render() {
        document.body.innerHTML = '';
        document.body.append(this._uiComponents.header.header, this._uiComponents.homepage.page);
    }
};

export default DomController;