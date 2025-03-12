import './Homepage.css';

class Homepage {
    constructor(joinCallback = () => {}) {
        this.page = document.createElement('div');
        this.page.id = 'homepage-component';

        this._uiReferences = {
            nameParagraph: document.createElement('p'),
            nameInput: document.createElement('input'),
            joinBtn: document.createElement('button'),
        };

        this._uiReferences.nameParagraph.id = 'name-paragraph';
        this._uiReferences.joinBtn.id = 'join-btn';
        this._uiReferences.nameInput.id = 'name-input';

        this._uiReferences.nameParagraph.textContent = 'Enter your name:';
        this._uiReferences.joinBtn.textContent = 'Join race';
        this._uiReferences.joinBtn.addEventListener('click', joinCallback);

        this.page.append(this._uiReferences.nameParagraph, this._uiReferences.nameInput, this._uiReferences.joinBtn);
    }

    get children() {
        return this._uiReferences;
    }

    setJoinCallback(callback) {
        if (typeof callback !== 'function') return;
        this._uiReferences.joinBtn.addEventListener('click', callback);
    }
}

export default Homepage;