const fs = require('fs');
const path = require('path');
const Jison = require('../lib/jison');

try {
    // Define the grammar directly
    const grammar = {
        lex: {
            rules: [
                ["\\s+", "/* skip whitespace */"],
                ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
                ["\\*", "return '*';"],
                ["\\/", "return '/';"],
                ["\\-", "return '-';"],
                ["\\+", "return '+';"],
                ["\\^", "return '^';"],
                ["\\!", "return '!';"],
                ["%", "return '%';"],
                ["\\(", "return '(';"],
                ["\\)", "return ')';"],
                ["PI\\b", "return 'PI';"],
                ["E\\b", "return 'E';"],
                ["$", "return 'EOF';"]
            ]
        },
        operators: [
            ['left', '+', '-'],
            ['left', '*', '/'],
            ['left', '^'],
            ['right', '!'],
            ['right', '%'],
            ['left', 'UMINUS']
        ],
        bnf: {
            expressions: [['e EOF', 'return $1;']],
            e: [
                ['e + e', '$$ = $1 + $3;'],
                ['e - e', '$$ = $1 - $3;'],
                ['e * e', '$$ = $1 * $3;'],
                ['e / e', '$$ = $1 / $3;'],
                ['e ^ e', '$$ = Math.pow($1, $3);'],
                ['e !', '$$ = (function fact(n) { return n==0 ? 1 : fact(n-1) * n })($1);'],
                ['e %', '$$ = $1 / 100;'],
                ['- e %prec UMINUS', '$$ = -$2;'],
                ['( e )', '$$ = $2;'],
                ['NUMBER', '$$ = Number(yytext);'],
                ['E', '$$ = Math.E;'],
                ['PI', '$$ = Math.PI;']
            ]
        }
    };

    // Generate the parser code
    const parserCode = Jison.generate(grammar);
    console.log("Generated parser code:");
    console.log(parserCode);

    // Save the parser code to a file for inspection
    fs.writeFileSync('generated_parser.js', parserCode);
    console.log("\nParser code has been saved to 'generated_parser.js'");

    // Create a module from the parser code
    const module = { exports: {} };
    const fn = new Function('module', 'exports', parserCode);
    fn(module, module.exports);
    const Parser = module.exports;

    // Create parser instance
    const parser = new Parser();

    // Test some expressions
    const testExpressions = [
        "2 + 3",
        "2 * 3",
        "2 ^ 3",
        "(4 + 5) * 2",
        "-5 + 3",
        "10 / 2",
        "5!",
        "50%",
        "PI",
        "E"
    ];

    console.log("\nTesting calculator parser:");
    console.log("-------------------------");
    
    testExpressions.forEach(expr => {
        try {
            const result = parser.parse(expr);
            console.log(`${expr} = ${result}`);
        } catch (error) {
            console.error(`Error parsing "${expr}":`, error.message);
        }
    });

} catch (error) {
    console.error("Error:", error.message);
    console.error(error.stack);
} 