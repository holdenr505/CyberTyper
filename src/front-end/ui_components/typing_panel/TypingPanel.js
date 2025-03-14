import './TypingPanel.css';

class TypingPanel {
    constructor({prompt, message, inputCallback = () => {}, nextCallback = () => {}}) {
        this.panel = document.createElement('div');
        this._uiReferences = {
            promptParagraph: document.createElement('p'),
            playerInput: document.createElement('input'),
            gameInfo: document.createElement('p'),
            nextBtn: document.createElement('button'),
        };

        this._uiReferences.promptParagraph.textContent = prompt;
        this._uiReferences.gameInfo.textContent = message;
        this._uiReferences.nextBtn.textContent  = 'Next race';
        this._uiReferences.nextBtn.onclick = nextCallback;
        this._uiReferences.playerInput.oninput = inputCallback;
        this._uiReferences.playerInput.setAttribute('aria-label', 'Typing area');
        
        // remove autocapitalization and form suggestions
        this._uiReferences.playerInput.disabled = true;
        this._uiReferences.playerInput.autocorrect = 'off';
        this._uiReferences.playerInput.spellcheck = 'false';
        this._uiReferences.playerInput.autocapitalize = 'off';
        this._uiReferences.playerInput.autocomplete = 'off';

        this.panel.id = 'typing-panel';
        this._uiReferences.promptParagraph.id = 'prompt';
        this._uiReferences.playerInput.id = 'player-input';
        this._uiReferences.gameInfo.id = 'game-info';
        this._uiReferences.nextBtn.id = 'next-btn';
        this._uiReferences.nextBtn.classList.add('disable-btn');

        this.panel.append(this._uiReferences.promptParagraph, this._uiReferences.playerInput, 
            this._uiReferences.gameInfo, this._uiReferences.nextBtn);
    }

    get children() {
        return this._uiReferences;
    }

    get prompt() {
        return this._uiReferences.promptParagraph.textContent;
    }

    set prompt(prompt) {
        if (typeof prompt !== 'string') return;
        this._uiReferences.promptParagraph.innerHTML = prompt;
    }

    get gameInfo() {
        return this._uiReferences.gameInfo;
    }

    set gameInfo(info) {
        if (typeof info !== 'string') return;
        this._uiReferences.gameInfo.textContent = info;
    }

    setInputCallback(callback) {
        if (typeof callback !== 'function') return;
        this._uiReferences.playerInput.oninput = callback;
    }

    setNextCallback(callback) {
        if (typeof callback !== 'function') return;
        this._uiReferences.nextBtn.onclick = callback;
    }
}

export default TypingPanel;