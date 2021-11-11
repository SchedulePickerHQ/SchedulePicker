import { VisibleForTesting } from '../editor';

describe('normalizeContents', () => {
    const normalizeContents = VisibleForTesting.normalizeContents;

    test.each(['', '1234', '<div>a', '<p>', '<p>a', '</p>', 'a</p>'])('コンテンツを正規化する', (contents) => {
        expect(normalizeContents(contents)).toBe(`<p>${contents}</p>`);
    });

    test.each(['', '1234', '<div>a', '<p>', '<p>a', '</p>', 'a</p>'])('コンテンツは正規化済み', (contents) => {
        const normalized = `<p>${contents}</p>`;
        expect(normalizeContents(normalized)).toBe(normalized);
    });
});
