import { clearUUID } from '../uuid';

describe('clearUUID', () => {
    test('Clear hash.', () => {
        expect(clearUUID('id')).toBe('id');
        expect(clearUUID('id#')).toBe('id');
        expect(clearUUID('id#1234')).toBe('id');
        expect(clearUUID('id#1234#')).toBe('id#1234');
        expect(clearUUID('id#1234#1234')).toBe('id#1234');
    });
});
