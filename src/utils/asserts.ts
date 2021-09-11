type AssertExists = <T>(value: T) => asserts value is NonNullable<T>;

export const assertExists: AssertExists = (value) => {
    if (typeof value === 'undefined' || value === null) {
        throw new Error('Expected to exist value of not null or undefined.');
    }
};
