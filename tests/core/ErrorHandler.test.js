import ErrorHandler from '../../lib/core/ErrorHandler.js';

describe('ErrorHandler', () => {
    let errorHandler;

    beforeEach(() => {
        errorHandler = new ErrorHandler({ debug: false });
    });

    test('should create a new instance', () => {
        expect(errorHandler).toBeInstanceOf(ErrorHandler);
    });

    test('should handle errors', () => {
        const error = new Error('Test error');
        error.line = 1;
        error.column = 5;
        error.token = 'PLUS';

        errorHandler.handleError(error);
        const errors = errorHandler.getErrors();
        
        expect(errors).toHaveLength(1);
        expect(errors[0].message).toBe('Test error');
        expect(errors[0].line).toBe(1);
        expect(errors[0].column).toBe(5);
        expect(errors[0].token).toBe('PLUS');
    });

    test('should format error message', () => {
        const error = {
            message: 'Syntax error',
            line: 10,
            column: 15
        };

        const formattedError = errorHandler.formatError(error);
        expect(formattedError).toBe('Error: Syntax error at line 10, column 15');
    });

    test('should identify recovery tokens', () => {
        expect(errorHandler.isRecoveryToken(';')).toBe(true);
        expect(errorHandler.isRecoveryToken('}')).toBe(true);
        expect(errorHandler.isRecoveryToken('PLUS')).toBe(false);
    });

    test('should clear errors', () => {
        const error = new Error('Test error');
        errorHandler.handleError(error);
        expect(errorHandler.getErrors()).toHaveLength(1);
        
        errorHandler.clearErrors();
        expect(errorHandler.getErrors()).toHaveLength(0);
    });

    test('should limit error history', () => {
        for (let i = 0; i < 150; i++) {
            errorHandler.handleError(new Error(`Error ${i}`));
        }
        
        expect(errorHandler.getErrors()).toHaveLength(100);
    });
}); 