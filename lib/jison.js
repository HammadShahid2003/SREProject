// Jison, an LR(0), SLR(1), LARL(1), LR(1) Parser Generator
// Zachary Carter <zach@carter.name>
// MIT X Licensed

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');
import ParserGenerator from './core/ParserGenerator.js';
import GrammarParser from './core/GrammarParser.js';
import Grammar from './core/Grammar.js';
import ErrorHandler from './core/ErrorHandler.js';
import CodeGenerator from './core/CodeGenerator.js';
import Nonterminal from './core/Nonterminal.js';
import Production from './core/Production.js';

class Jison {
    constructor() {
        this.version = version;
    }

    static generate(grammar, options = {}) {
        if (!grammar || typeof grammar !== 'object') {
            throw new Error('Invalid grammar: must be an object');
        }
        const parserGenerator = new ParserGenerator(grammar, options);
        return parserGenerator.generate();
    }

    parse(grammar, input) {
        if (!grammar || typeof grammar !== 'object') {
            throw new Error('Invalid grammar: must be an object');
        }
        const parserCode = Jison.generate(grammar);
        const Parser = eval(parserCode); // Note: In production, use a safer method
        const parser = new Parser();
        return parser.parse(input);
    }
}

// Create and export a singleton instance
const jison = new Jison();

// Export individual components for advanced usage
export { Jison, ParserGenerator, GrammarParser, CodeGenerator, ErrorHandler, Grammar, Nonterminal, Production };
export default jison;
