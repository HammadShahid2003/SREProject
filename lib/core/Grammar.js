import Nonterminal from './Nonterminal.js';
import Production from './Production.js';

class Grammar {
    constructor() {
        this.bnf = {};
        this.tokens = [];
        this.operators = {};
        this.startSymbol = null;
        this.nonterminals = {};
        this.productions = [];
        this.terminals = new Set();
        this.EOF = '$end';
    }

    addTerminal(symbol) {
        this.terminals.add(symbol);
    }

    addNonterminal(symbol) {
        if (!this.nonterminals[symbol]) {
            this.nonterminals[symbol] = new Nonterminal(symbol);
        }
        return this.nonterminals[symbol];
    }

    addProduction(symbol, handle) {
        if (!this.nonterminals[symbol]) {
            this.nonterminals[symbol] = new Nonterminal(symbol);
        }
        const production = new Production(symbol, handle);
        this.nonterminals[symbol].productions.add(production);
        this.productions.push(production);
        return production;
    }

    getProductions(symbol) {
        if (!this.nonterminals[symbol]) {
            return [];
        }
        return Array.from(this.nonterminals[symbol].productions);
    }

    getNonterminals() {
        return Object.keys(this.nonterminals);
    }

    getTerminals() {
        const terminals = new Set();
        for (const production of this.productions) {
            for (const symbol of production.handle) {
                if (!this.nonterminals[symbol]) {
                    terminals.add(symbol);
                }
            }
        }
        return Array.from(terminals);
    }

    getSymbols() {
        const symbols = new Set();
        // Add terminals
        for (const terminal of this.terminals) {
            symbols.add(terminal);
        }
        // Add nonterminals
        for (const nonterminal of this.getNonterminals()) {
            symbols.add(nonterminal);
        }
        return Array.from(symbols);
    }

    isTerminal(symbol) {
        return this.terminals.has(symbol);
    }

    isNonterminal(symbol) {
        return symbol in this.nonterminals;
    }

    toString() {
        let str = 'Grammar:\n';
        str += `Start Symbol: ${this.startSymbol}\n`;
        str += 'Productions:\n';
        this.productions.forEach((prod, i) => {
            str += `${i}: ${prod.symbol} -> ${prod.handle.join(' ')}\n`;
        });
        return str;
    }
}

export default Grammar; 