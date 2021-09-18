import { assert, assertExists } from '../asserts';

describe('assert', () => {
    test.each([
        [1],
        ['a'],
        [true],
        [Symbol('a')],
        [() => {}], // eslint-disable-line @typescript-eslint/no-empty-function
        [[]],
        [{ [Symbol('key')]: 'value' }],
        [{ key: 'value' }],
        [new Date()],
    ])('truthyな値のときは何もしない', (value) => {
        expect(() => {
            assert(value);
        }).not.toThrow();
    });

    // eslint-disable-next-line unicorn/prefer-number-properties
    test.each([[undefined], [null], [NaN], [0], [''], [false]])('falsyな値のときはエラーを投げる', (value) => {
        expect(() => {
            assert(value);
        }).toThrow(new Error('Expected value to be truthy but it is falsy'));

        const errorMessage = 'Custom error message';
        expect(() => {
            assert(value, errorMessage);
        }).toThrow(new Error(errorMessage));
    });
});

describe('assertExists', () => {
    test.each([
        [0],
        [1],
        [''],
        ['a'],
        [true],
        [false],
        [Symbol('a')],
        [() => {}], // eslint-disable-line @typescript-eslint/no-empty-function
        [[]],
        [{ key: 'value' }],
        [new Date()],
        [NaN], // eslint-disable-line unicorn/prefer-number-properties
    ])('undefined, null ではないとき何もしない', (value) => {
        expect(() => {
            assertExists(value);
        }).not.toThrow();
    });

    test.each([[undefined], [null]])('undefined、null のときにエラーを投げる', (value) => {
        expect(() => {
            assertExists(value);
        }).toThrow(new Error('Expected to exist value of not null or undefined.'));
    });
});
