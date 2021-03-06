const Word = require('./word');
const types = require('../types');
const data = require('../../data');
const lang = require('../../lang');

function noun_bases(noun) {
    return Array.from(new Set([
        noun,
        ...(noun.endsWith('e') ? [noun.slice(0, -1)] : []),
        ...(noun.endsWith('n') ? [noun.slice(0, -1)] : []),
        ...(noun.endsWith('en') ? [noun.slice(0, -2)] : []),
        ...(noun.endsWith('er') ? [noun.slice(0, -2)] : []),
        ...(noun.endsWith('ern') ? [noun.slice(0, -3)] : []),

        ...(noun.includes('äu') ? noun_bases(noun.replace('äu', 'au')) : []),
        ...(noun.includes('ä') ? noun_bases(noun.replace('ä', 'a')) : []),
        ...(noun.includes('ü') ? noun_bases(noun.replace('ü', 'u')) : [])
    ]));
}

class Noun extends Word {
    type = types.word.NOUN;
    person = 3;
    caseSensitive = true;

    bases = [];

    depluralize() {
        this.plurality = types.plurality.PLURAL;
        this.gender = types.gender.FEMININE;

        for (let base of this.bases) {
            const gender = lang.nouns.sa[base];
            if (gender !== undefined && gender !== types.gender.PLURAL) {
                this.wordBase = base;
                this.gender = gender;
                this.plurality = types.plurality.SINGULAR;

                break;
            }
        }
    }

    static test(word) {
        if(word[0].toLowerCase() !== word[0]) {
            const noun = new Noun(word);

            if(lang.nouns.sa[noun.wordBase]) {
                return noun;
            }
        }

        return undefined;
    }

    constructor(word) {
        super(word);

        this.bases = noun_bases(this.word);

        for(let base of this.bases) {
            if(lang.nouns.sa[base]) {
                this.wordBase = base;
                this.gender = lang.nouns.sa[base];

                break;
            }
        }

        // Depluralize if plural
        if (this.gender === types.gender.PLURAL) {
            this.depluralize();
        } 
        
        if(this.gender.includes(types.gender.PLURAL)) {
            if(!Array.isArray(this.gender)) {
                this.gender = types.gender.FEMININE;
            } else {
                this.gender.splice(this.gender.indexOf(types.gender.PLURAL), 1);
            
                if(this.gender.length === 1) [this.gender] = this.gender;
            }
        }
    }
}

module.exports = Noun;