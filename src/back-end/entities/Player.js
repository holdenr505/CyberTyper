class Player {
    constructor(id = 0, name = '', typedWords = [], car) {
        this.id = id;
        this.name = name;
        this.typedWords = typedWords;
        this.car = car;
    }

    appendWord(word) {
        if (!typeof word === 'string') return;
        this.typedWords.push({word: word, timestamp: Date.now()});
    }

    calculateWPM() {
        const currentTime = Date.now();
        // only want words from the last minute
        const window = Date.now() - 60000;
        const charsInWindow = this.typedWords.filter(word => word.timestamp >= window).join(' ');
        // divide by 5 to normalize length of a word
        return Math.floor(charsInWindow.length / 5);
    }
}

export default Player;