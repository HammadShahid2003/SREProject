class Nonterminal {
    constructor(symbol) {
        this.symbol = symbol;
        this.productions = new Set();
        this.first = [];
        this.follows = [];
        this.nullable = false;
    }

    addProduction(production) {
        this.productions.add(production);
    }

    addToFirst(symbol) {
        if (!this.first.includes(symbol)) {
            this.first.push(symbol);
        }
    }

    addToFollows(symbol) {
        if (!this.follows.includes(symbol)) {
            this.follows.push(symbol);
        }
    }

    setNullable(nullable) {
        this.nullable = nullable;
    }

    getProductions() {
        return Array.from(this.productions);
    }

    toString() {
        let str = `${this.symbol}\n`;
        str += (this.nullable ? 'nullable' : 'not nullable');
        str += `\nFirsts: ${this.first.join(', ')}`;
        str += `\nFollows: ${this.follows.join(', ')}`;
        str += '\nProductions:\n  ' + this.getProductions().join('\n  ');
        return str;
    }

    isNullable() {
        return this.nullable;
    }
}

export default Nonterminal; 