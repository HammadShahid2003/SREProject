# Jison

A parser generator with Bison's API, refactored for modern JavaScript.

## Overview

Jison generates bottom-up parsers in JavaScript. Its API is similar to Bison's, hence the name. It supports many of Bison's major features, plus some of its own.

## Installation

```bash
npm install jison
```

## Usage

### Basic Usage

```javascript
const Jison = require('jison');

// Create a grammar
const grammar = {
    "lex": {
        "rules": [
           ["\\s+", "/* skip whitespace */"],
           ["[a-f0-9]+", "return 'HEX';"]
        ]
    },
    "bnf": {
        "hex_strings" :[ "hex_strings HEX",
                         "HEX" ]
    }
};

// Generate a parser
const parser = Jison.generate(grammar);

// Parse some input
const result = parser.parse("adfe34bc e82a");
```

### Command Line Usage

```bash
jison calculator.jison
```

This will generate `calculator.js` in your current working directory.

## Architecture

The refactored Jison codebase is organized into the following modules:

### Core Components

- `ParserGenerator`: Main entry point for parser generation
- `GrammarParser`: Handles parsing and transforming grammar definitions
- `CodeGenerator`: Generates parser code from grammar
- `ErrorHandler`: Manages parser errors and recovery strategies

### Data Structures

- `Grammar`: Represents the parsed grammar structure
- `Nonterminal`: Represents nonterminal symbols
- `Production`: Represents grammar productions

### Parser Types

- LR(0)
- SLR(1)
- LALR(1)
- LR(1)
- LL(1)

## Development

### Setup

```bash
npm install
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

## Acknowledgments

- Original Jison by Zach Carter
- Special thanks to Jarred Ligatti and Manuel E. Bermúdez

