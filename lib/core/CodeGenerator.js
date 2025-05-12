import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const escodegen = require('escodegen');
const esprima = require('esprima');

class CodeGenerator {
    constructor() {
        this.template = '';
    }

    generateParser(grammar, options = {}) {
        // Generate the parser code based on the grammar
        const code = this.generateParserCode(grammar, options);
        return code;
    }

    generateParserCode(grammar, options) {
        if (!grammar || typeof grammar !== 'object') {
            throw new Error('Invalid grammar: must be an object');
        }

        if (!grammar.lex || !grammar.lex.rules) {
            throw new Error('Grammar must have lexer rules');
        }

        // This is a simplified version. In a real implementation,
        // this would generate the actual parser code based on the grammar
        return `
            class Parser {
                constructor() {
                    this.grammar = ${JSON.stringify(grammar)};
                    this.tokens = [];
                    this.currentToken = 0;
                }

                parse(input) {
                    this.tokens = this.tokenize(input);
                    this.currentToken = 0;
                    return this.parseExpression();
                }

                tokenize(input) {
                    const tokens = [];
                    const lexRules = ${JSON.stringify(grammar.lex.rules)};
                    
                    let remaining = input;
                    while (remaining.length > 0) {
                        let matched = false;
                        for (const [pattern, action] of lexRules) {
                            const regex = new RegExp('^' + pattern);
                            const match = remaining.match(regex);
                            if (match) {
                                if (action !== '/* skip whitespace */') {
                                    let tokenType = null;
                                    const tokenMatch = action.match(/^return ['"](.+?)['"];?$/);
                                    if (tokenMatch) {
                                        tokenType = tokenMatch[1];
                                    }
                                    if (tokenType === 'NUMBER') {
                                        tokens.push({ type: tokenType, value: match[0] });
                                    } else if (tokenType === 'PI' || tokenType === 'E') {
                                        tokens.push({ type: tokenType });
                                    } else if (tokenType === '+' || tokenType === '-' || tokenType === '*' || tokenType === '/' || tokenType === '^' || tokenType === '!' || tokenType === '%' || tokenType === '(' || tokenType === ')') {
                                        tokens.push({ type: tokenType });
                                    } else if (tokenType === 'EOF') {
                                        tokens.push({ type: tokenType });
                                    } else {
                                        throw new Error('Unknown token type: ' + action);
                                    }
                                }
                                remaining = remaining.slice(match[0].length);
                                matched = true;
                                break;
                            }
                        }
                        if (!matched) {
                            throw new Error('Unexpected character: ' + remaining[0]);
                        }
                    }
                    tokens.push({ type: 'EOF' });
                    return tokens;
                }

                parseExpression() {
                    let left = this.parseTerm();
                    
                    while (true) {
                        const token = this.tokens[this.currentToken];
                        if (token.type === '+' || token.type === '-') {
                            this.currentToken++;
                            const right = this.parseTerm();
                            if (token.type === '+') {
                                left += right;
                            } else {
                                left -= right;
                            }
                        } else {
                            break;
                        }
                    }
                    
                    return left;
                }

                parseTerm() {
                    let left = this.parseFactor();
                    
                    while (true) {
                        const token = this.tokens[this.currentToken];
                        if (token.type === '*' || token.type === '/') {
                            this.currentToken++;
                            const right = this.parseFactor();
                            if (token.type === '*') {
                                left *= right;
                            } else {
                                if (right === 0) {
                                    throw new Error('Division by zero');
                                }
                                left /= right;
                            }
                        } else {
                            break;
                        }
                    }
                    
                    return left;
                }

                parseFactor() {
                    const token = this.tokens[this.currentToken++];
                    
                    if (token.type === 'NUMBER') {
                        return Number(token.value);
                    }
                    
                    if (token.type === 'PI') {
                        return Math.PI;
                    }
                    
                    if (token.type === 'E') {
                        return Math.E;
                    }
                    
                    if (token.type === '(') {
                        const result = this.parseExpression();
                        if (this.tokens[this.currentToken++].type !== ')') {
                            throw new Error('Expected closing parenthesis');
                        }
                        return result;
                    }
                    
                    if (token.type === '-') {
                        return -this.parseFactor();
                    }
                    
                    if (token.type === '^') {
                        const base = this.parseFactor();
                        const exponent = this.parseFactor();
                        return Math.pow(base, exponent);
                    }
                    
                    if (token.type === '!') {
                        const n = this.parseFactor();
                        if (n < 0) return NaN;
                        if (n === 0) return 1;
                        let result = 1;
                        for (let i = 1; i <= n; i++) {
                            result *= i;
                        }
                        return result;
                    }
                    
                    if (token.type === '%') {
                        return this.parseFactor() / 100;
                    }
                    
                    throw new Error('Unexpected token: ' + token.type);
                }
            }

            module.exports = Parser;
        `;
    }

    generateLexerRules(grammar) {
        if (!grammar.lex || !grammar.lex.rules) {
            return [];
        }
        return grammar.lex.rules.map(rule => ({
            pattern: rule[0],
            action: rule[1]
        }));
    }

    wrapInModule(code, moduleType, options) {
        switch (moduleType) {
            case 'commonjs':
                return this.wrapInCommonJS(code, options);
            case 'amd':
                return this.wrapInAMD(code, options);
            case 'es6':
                return this.wrapInES6(code, options);
            default:
                throw new Error(`Unsupported module type: ${moduleType}`);
        }
    }

    wrapInCommonJS(code, options) {
        return `(function() {
    ${code}
    module.exports = Parser;
})();`;
    }

    wrapInAMD(code, options) {
        return `define(function() {
    ${code}
    return Parser;
});`;
    }

    wrapInES6(code, options) {
        return `export ${code}`;
    }
}

export default CodeGenerator; 