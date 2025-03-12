import './Header.css';

class Header {
    constructor(title) {
        this.header = document.createElement('header');
        this._uiReferences = {
            logo: document.createElement('a'),   
        };
        
        this._uiReferences.logo.id = 'logo';
        this._uiReferences.logo.href = '/';
        this._uiReferences.logo.innerHTML = `<h1>${title}</h1>`;

        this.header.append(this._uiReferences.logo);
    }

    get children() {
        return this._uiReferences;
    }

    get title() {
        return this._uiReferences.logo.textContent;
    }

    set title(title) {
        if (typeof title !== 'string') return;
        this._uiReferences.logo.innerHTML = `<h1>${title}</h1>`;
    }
}


export default Header;