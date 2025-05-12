import { Jison } from './lib/jison.js';
import readline from 'readline';

// Define the calculator grammar
const grammar = {
    "tokens": "NUMBER + - * / ^ ! % ( ) PI E EOF",
    "operators": [
        ["left", "+", "-"],
        ["left", "*", "/"],
        ["left", "^"],
        ["left", "!"],
        ["left", "%"]
    ],
    "bnf": {
        "expressions": [
            ["e EOF", "return $1"]
        ],
        "e": [
            ["NUMBER", "$$ = Number($1)"],
            ["PI", "$$ = Math.PI"],
            ["E", "$$ = Math.E"],
            ["e + e", "$$ = $1 + $3"],
            ["e - e", "$$ = $1 - $3"],
            ["e * e", "$$ = $1 * $3"],
            ["e / e", "$$ = $1 / $3"],
            ["e ^ e", "$$ = Math.pow($1, $3)"],
            ["e !", "$$ = (function(n) { return n < 0 ? NaN : n === 0 ? 1 : n * arguments.callee(n - 1); })($1)"],
            ["e %", "$$ = $1 / 100"],
            ["( e )", "$$ = $2"],
            ["- e", "$$ = -$2"]
        ]
    },
    "lex": {
        "rules": [
            ["\\s+", "/* skip whitespace */"],
            ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER'"],
            ["\\*", "return '*'"],
            ["\\/", "return '/'"],
            ["-", "return '-'"],
            ["\\+", "return '+'"],
            ["\\^", "return '^'"],
            ["!", "return '!'"],
            ["%", "return '%'"],
            ["\\(", "return '('"],
            ["\\)", "return ')'"],
            ["PI\\b", "return 'PI'"],
            ["E\\b", "return 'E'"],
            ["$", "return 'EOF'"]
        ]
    }
};

// Generate parser code
const parserCode = Jison.generate(grammar);

// Create a module object to hold exports
const module = { exports: {} };

// Create a function to execute the generated parser code
const createParser = new Function('module', 'exports', parserCode);

// Execute the function to get the Parser
createParser(module, module.exports);

// Create parser instance
const parser = new module.exports();

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('Calculator (type "exit" to quit)');
console.log('Examples:');
console.log('  2 + 2');
console.log('  5!');
console.log('  PI');
console.log('  2 * (3 + 4)');

function calculate() {
    rl.question('> ', (input) => {
        if (input.toLowerCase() === 'exit') {
            rl.close();
            return;
        }

        try {
            // Add EOF token to the end of input
            const result = parser.parse(input);
            if (typeof result === 'number') {
                console.log('=', result);
            } else {
                console.log('Error: Invalid expression');
            }
        } catch (e) {
            console.log('Error:', e.message);
        }

        calculate();
    });
}

calculate(); 