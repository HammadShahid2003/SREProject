export default {
    testEnvironment: 'node',
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    collectCoverageFrom: [
        'lib/**/*.js',
        '!lib/cli.js'
    ],
    verbose: true,
    transform: {
        '^.+\\.js$': ['babel-jest', { configFile: './babel.config.js' }]
    },
    moduleFileExtensions: ['js', 'json']
}; 