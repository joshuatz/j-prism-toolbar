module.exports = {
    testEnvironment: 'jsdom',
    testEnvironmentOptions: {
        runScripts: 'dangerously',
        resources: 'usable',
    },
    testMatch: ['<rootDir>/tests/**/*.test.*'],
    moduleFileExtensions: ['js', 'ts', 'mjs'],
    // https://gist.github.com/rstacruz/511f43265de4939f6ca729a3df7b001c#method-b-using-babel
    transform: {
        '^.+\\.[t|j]sx?$': 'babel-jest',
    },
};
