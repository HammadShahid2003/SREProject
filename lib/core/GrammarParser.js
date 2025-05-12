import ebnfParser from 'ebnf-parser';
import Grammar from './Grammar.js';
import Nonterminal from './Nonterminal.js';
import Production from './Production.js';

class GrammarParser {
    constructor() {
        this.ebnfParser = ebnfParser;
    }

    parse(grammar) {
        if (!grammar || typeof grammar !== 'object') {
            throw new Error('Invalid grammar: must be an object');
        }

        if (typeof grammar === 'string') {
            grammar = this.ebnfParser.parse(grammar);
        }

        const parsedGrammar = new Grammar();
        
        // Process BNF or EBNF
        if (grammar.ebnf) {
            parsedGrammar.bnf = this.transform(grammar.ebnf);
        } else if (grammar.bnf) {
            parsedGrammar.bnf = grammar.bnf;
        } else {
            throw new Error('Grammar must have either BNF or EBNF rules');
        }

        // Process tokens or lex rules
        if (grammar.tokens) {
            parsedGrammar.tokens = this.processTokens(grammar.tokens);
        } else if (grammar.lex && grammar.lex.rules) {
            parsedGrammar.tokens = this.processLexRules(grammar.lex.rules);
        } else {
            throw new Error('Grammar must have either tokens or lexer rules');
        }
        
        // Process operators
        parsedGrammar.operators = this.processOperators(grammar.operators);
        
        // Set start symbol
        parsedGrammar.startSymbol = grammar.start || grammar.startSymbol;

        // Build productions
        this.buildProductions(parsedGrammar);

        return parsedGrammar;
    }

    transform(ebnf) {
        return this.ebnfParser.transform(ebnf);
    }

    processTokens(tokens) {
        if (!tokens) return [];
        if (typeof tokens === 'string') {
            return tokens.trim().split(' ');
        }
        return tokens.slice(0);
    }

    processLexRules(rules) {
        if (!rules) return [];
        return rules.map(rule => {
            if (typeof rule === 'string') {
                return rule;
            }
            if (Array.isArray(rule) && rule.length >= 2) {
                return rule[1].replace(/^return\s+['"](.+)['"]$/, '$1');
            }
            return null;
        }).filter(Boolean);
    }

    processOperators(ops) {
        if (!ops) return {};
        const operators = {};
        for (let i = 0; i < ops.length; i++) {
            const prec = ops[i];
            for (let k = 1; k < prec.length; k++) {
                operators[prec[k]] = {
                    precedence: i + 1,
                    assoc: prec[0]
                };
            }
        }
        return operators;
    }

    buildProductions(grammar) {
        const { bnf, nonterminals } = grammar;
        
        for (const symbol in bnf) {
            if (!nonterminals[symbol]) {
                nonterminals[symbol] = new Nonterminal(symbol);
            }

            bnf[symbol].forEach((handle, index) => {
                const production = new Production(symbol, handle, index);
                nonterminals[symbol].productions.add(production);
                grammar.productions.push(production);
            });
        }
    }

    validate(grammar) {
        if (!grammar.bnf && !grammar.ebnf) {
            throw new Error('Grammar must have either BNF or EBNF rules');
        }
        if (!grammar.tokens && !grammar.lex) {
            throw new Error('Grammar must have either tokens or lexer rules');
        }
        return true;
    }
}

export default GrammarParser; 