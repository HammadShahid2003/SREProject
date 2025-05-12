class ErrorHandler {
    constructor(options = {}) {
        this.errors = [];
        this.recoveryStrategies = new Map();
        this.debug = options.debug || false;
        this.initializeRecoveryStrategies();
    }

    initializeRecoveryStrategies() {
        // Panic mode recovery
        this.recoveryStrategies.set('panic', (error, parser) => {
            let tokensSkipped = 0;
            while (!this.isRecoveryToken(parser.currentToken)) {
                parser.advance();
                tokensSkipped++;
                if (tokensSkipped > 100) { // Prevent infinite loops
                    throw new Error('Recovery failed: too many tokens skipped');
                }
            }
            return tokensSkipped;
        });

        // Phrase level recovery
        this.recoveryStrategies.set('phrase', (error, parser) => {
            // Implement phrase level recovery
            return 0;
        });

        // Error productions
        this.recoveryStrategies.set('error_production', (error, parser) => {
            // Implement error production recovery
            return 0;
        });
    }

    handleError(error) {
        this.errors.push(error);
        // Limit error history to 100 errors
        if (this.errors.length > 100) {
            this.errors = this.errors.slice(-100);
        }
        // Only log errors in debug mode
        if (this.debug) {
            console.error('Error:', error.message);
        }
    }

    recover(error, parser, strategy = 'panic') {
        const recoveryStrategy = this.recoveryStrategies.get(strategy);
        if (!recoveryStrategy) {
            throw new Error(`Unknown recovery strategy: ${strategy}`);
        }

        try {
            return recoveryStrategy(error, parser);
        } catch (recoveryError) {
            this.handleError(recoveryError);
            return false;
        }
    }

    formatError(error) {
        return `Error: ${error.message} at line ${error.line}, column ${error.column}`;
    }

    isRecoveryToken(token) {
        // Define tokens that can be used for recovery
        const recoveryTokens = [';', '}', ']', ')', 'EOF'];
        return recoveryTokens.includes(token);
    }

    getErrors() {
        return this.errors;
    }

    clearErrors() {
        this.errors = [];
    }

    hasErrors() {
        return this.errors.length > 0;
    }

    addRecoveryStrategy(name, strategy) {
        this.recoveryStrategies.set(name, strategy);
    }
}

export default ErrorHandler; 