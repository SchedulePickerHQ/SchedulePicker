module.exports = {
    testEnvironment: 'jsdom',
    clearMocks: true,
    resetMocks: true,
    restoreMocks: true,
    transform: {
        '^.+\\.[jt]s$': ['@swc/jest'],
    },
    transformIgnorePatterns: ['/node_modules/(?!nanoid)'],
};
