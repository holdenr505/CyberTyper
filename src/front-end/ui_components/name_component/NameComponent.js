import './NameComponent.css';

class NameComponent {
    constructor(joinCallback = () => {}) {
        this.component = document.createElement('div');
        this.component.id = 'name-component';

        this._uiReferences = {
            nameParagraph: document.createElement('p'),
            nameInput: document.createElement('input'),
            joinBtn: document.createElement('button'),
        };

        this._uiReferences.nameParagraph.id = 'name-paragraph';
        this._uiReferences.joinBtn.id = 'join-btn';
        this._uiReferences.nameInput.id = 'name-input';

        this._uiReferences.nameParagraph.textContent = 'Select a car and enter your name:';
        this._uiReferences.joinBtn.textContent = 'Join race';
        
        // remove autocapitalization and form suggestions
        this._uiReferences.nameInput.autocomplete = 'off';
        this._uiReferences.nameInput.autocorrect = 'off';
        this._uiReferences.nameInput.spellcheck = 'false';
        this._uiReferences.nameInput.autocapitalize = 'off';
        
        this._uiReferences.joinBtn.onclick = joinCallback;
        this.component.append(this._uiReferences.nameParagraph, 
            this._uiReferences.nameInput, this._uiReferences.joinBtn);
    }

    get children() {
        return this._uiReferences;
    }

    setJoinCallback(callback) {
        if (typeof callback !== 'function') return;
        this._uiReferences.joinBtn.onclick = callback;
    }
}

export default NameComponent;