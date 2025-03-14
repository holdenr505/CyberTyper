import './Header.css';

class Header {
    constructor(logo) {
        this.headerElement = document.createElement('header');
        this._uiReferences = {
            logo: document.createElement('a'),
        };
        
        this._uiReferences.logo.id = 'logo';
        this._uiReferences.logo.href = '/';
        this._uiReferences.logo.innerHTML = `<img src='${logo}' alt='CyberTyper'>`;

        this.headerElement.append(this._uiReferences.logo);
    }

    get children() {
        return this._uiReferences;
    }
}

export default Header;