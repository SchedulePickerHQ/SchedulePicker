type Assert = (value: unknown, errorMessage?: string) => asserts value;
type AssertExists = <T>(value: T) => asserts value is NonNullable<T>;

export const assert: Assert = (value, errorMessage) => {
    if (!value) {
        throw new Error(errorMessage ?? 'Expected value to be truthy but it is falsy');
    }
};

export const assertExists: AssertExists = (value) => {
    if (typeof value === 'undefined' || value === null) {
        throw new Error('Expected to exist value of not null or undefined.');
    }
};
