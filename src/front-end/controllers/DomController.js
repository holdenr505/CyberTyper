// centralize UI updates
class DomController {
   constructor (header, carSelector, nameComponent, typingPanel, racetrack, eventBus, eventHandlers = {}) {
        this._uiComponents = { header, carSelector, nameComponent, typingPanel, racetrack };   
        this._wordIndex = 0;
        this._eventBus = eventBus; // eventBus singleton
        this._updateInterval; // interval for UI update request

        // register event handlers here
        this.registerEventBusHandlers(eventHandlers);
        this._uiComponents.nameComponent.setJoinCallback(this.handleJoinBtn.bind(this));
        this._uiComponents.typingPanel.setNextCallback(this.handleNextBtn.bind(this));
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

    // event handlers for UI elements
    handleJoinBtn() {
        if (!this._uiComponents.nameComponent.children.nameInput.value.trim() || !this._uiComponents.carSelector.selectedCar) {
            this._uiComponents.nameComponent.children.nameParagraph.classList.add('invalid');
            this._uiComponents.nameComponent.children.nameParagraph.textContent = 'Select a car and enter a name:';
        }
        else {
            const name = this._uiComponents.nameComponent.children.nameInput.value;
            const car = this._uiComponents.carSelector.selectedCar;
            this._uiComponents.nameComponent.component.replaceWith(
                this._uiComponents.racetrack.track,
                this._uiComponents.typingPanel.panel
            );
            this._uiComponents.carSelector.selector.remove();
            this._eventBus.dispatchEvent(new CustomEvent('join race', { detail: { name, car } }));
        }
    }

    handleNextBtn() {
        const name = this._uiComponents.nameComponent.children.nameInput.value;
        const car = this._uiComponents.carSelector.selectedCar;
        this.resetGameDisplay();
        this._eventBus.dispatchEvent(new CustomEvent('leave room'));
        this._eventBus.dispatchEvent(new CustomEvent('join race', { detail: { name, car } }));
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
                }
                else {
                    this.updatePrompt(this._uiComponents.typingPanel.prompt, this._wordIndex);
                }
            }
        }
    }

    // reset the display before the next race
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
        document.body.append(this._uiComponents.header.headerElement, this._uiComponents.carSelector.selector, this._uiComponents.nameComponent.component);
    }
};

export default DomController;