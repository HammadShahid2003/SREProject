import Grammar from '../../lib/core/Grammar.js';

describe('Grammar', () => {
    let grammar;

    beforeEach(() => {
        grammar = new Grammar();
    });

    test('should create a new instance', () => {
        expect(grammar).toBeInstanceOf(Grammar);
    });

    test('should add terminal symbols', () => {
        grammar.addTerminal('NUMBER');
        grammar.addTerminal('PLUS');
        
        expect(grammar.isTerminal('NUMBER')).toBe(true);
        expect(grammar.isTerminal('PLUS')).toBe(true);
        expect(grammar.isTerminal('MINUS')).toBe(false);
    });

    test('should add nonterminal symbols', () => {
        const nonterminal = grammar.addNonterminal('expr');
        
        expect(grammar.isNonterminal('expr')).toBe(true);
        expect(nonterminal.symbol).toBe('expr');
        expect(nonterminal.productions).toBeInstanceOf(Set);
    });

    test('should add productions', () => {
        const production = grammar.addProduction('expr', ['NUMBER', 'PLUS', 'NUMBER']);
        
        expect(production.symbol).toBe('expr');
        expect(production.handle).toEqual(['NUMBER', 'PLUS', 'NUMBER']);
        expect(grammar.productions).toContain(production);
    });

    test('should get all symbols', () => {
        grammar.addTerminal('NUMBER');
        grammar.addTerminal('PLUS');
        grammar.addNonterminal('expr');
        
        const symbols = grammar.getSymbols();
        expect(symbols).toContain('NUMBER');
        expect(symbols).toContain('PLUS');
        expect(symbols).toContain('expr');
    });

    test('should convert to string representation', () => {
        grammar.startSymbol = 'start';
        grammar.addProduction('start', ['expr']);
        grammar.addProduction('expr', ['NUMBER']);
        
        const str = grammar.toString();
        expect(str).toContain('Grammar:');
        expect(str).toContain('Start Symbol: start');
        expect(str).toContain('Productions:');
    });
}); 