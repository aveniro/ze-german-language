const Word = require('./word');
const types = require('../types');
const lang = require('../../lang');

class Verb extends Word {
    type = types.word.VERB;

    static test(word) {
        if(lang.verbs.listobj[word.toLowerCase()]) {
            return new Verb(word);
        }
    }

    constructor(word) {
        super(word);

        this.wordBase = this.lower;
    }
}

module.exports = Verb;