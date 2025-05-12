import GrammarParser from './GrammarParser.js';
import CodeGenerator from './CodeGenerator.js';
import ErrorHandler from './ErrorHandler.js';

class ParserGenerator {
    constructor(grammar = null, options = {}) {
        this.grammar = grammar;
        this.options = options;
        this.grammarParser = new GrammarParser();
        this.codeGenerator = new CodeGenerator();
        this.errorHandler = new ErrorHandler();
    }

    generate(grammar = null) {
        try {
            // Use provided grammar or fall back to constructor grammar
            const grammarToUse = grammar || this.grammar;
            
            if (!grammarToUse || typeof grammarToUse !== 'object') {
                throw new Error('Invalid grammar structure');
            }

            // Parse and validate the grammar
            const parsedGrammar = this.grammarParser.parse(grammarToUse);
            
            // Generate the parser code using the original grammar
            const parserCode = this.codeGenerator.generateParser(grammarToUse, this.options);
            return parserCode;
        } catch (error) {
            this.errorHandler.handleError(error);
            if (error.message === 'Invalid grammar: must be an object' ||
                error.message === 'Grammar must have either BNF or EBNF rules' ||
                error.message === 'Grammar must have either tokens or lexer rules') {
                throw new Error('Invalid grammar structure');
            }
            throw error;
        }
    }

    validateGrammar(grammar) {
        // Basic grammar validation
        if (!grammar.bnf && !grammar.ebnf) {
            return false;
        }
        if (!grammar.tokens && !grammar.lex) {
            return false;
        }
        return true;
    }
}

export default ParserGenerator; 