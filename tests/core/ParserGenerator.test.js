import ParserGenerator from '../../lib/core/ParserGenerator.js';

describe('ParserGenerator', () => {
    let parserGenerator;

    beforeEach(() => {
        parserGenerator = new ParserGenerator();
    });

    test('should create a new instance', () => {
        expect(parserGenerator).toBeInstanceOf(ParserGenerator);
    });

    test('should generate parser code for valid grammar', () => {
        const grammar = {
            bnf: {
                'start': ['expr'],
                'expr': ['NUMBER', 'expr PLUS NUMBER']
            },
            tokens: ['NUMBER', 'PLUS'],
            lex: {
                rules: [
                    ['\\d+', 'return "NUMBER"'],
                    ['\\+', 'return "PLUS"']
                ]
            }
        };

        const parserCode = parserGenerator.generate(grammar);
        expect(parserCode).toBeDefined();
        expect(typeof parserCode).toBe('string');
        expect(parserCode).toContain('class Parser');
    });

    test('should throw error for invalid grammar', () => {
        const invalidGrammar = {
            // Missing required bnf property
            tokens: ['NUMBER'],
            lex: {
                rules: [
                    ['\\d+', 'return "NUMBER"']
                ]
            }
        };

        expect(() => {
            parserGenerator.generate(invalidGrammar);
        }).toThrow('Invalid grammar structure');
    });

    test('should handle grammar with operators', () => {
        const grammar = {
            bnf: {
                'start': ['expr'],
                'expr': ['NUMBER', 'expr PLUS NUMBER', 'expr MINUS NUMBER']
            },
            tokens: ['NUMBER', 'PLUS', 'MINUS'],
            operators: [
                ['left', 'PLUS', 'MINUS']
            ],
            lex: {
                rules: [
                    ['\\d+', 'return "NUMBER"'],
                    ['\\+', 'return "PLUS"'],
                    ['\\-', 'return "MINUS"']
                ]
            }
        };

        const parserCode = parserGenerator.generate(grammar);
        expect(parserCode).toBeDefined();
        expect(parserCode).toContain('operators');
    });

    test('should throw error when no grammar is provided', () => {
        expect(() => {
            parserGenerator.generate();
        }).toThrow('Invalid grammar structure');
    });
}); 