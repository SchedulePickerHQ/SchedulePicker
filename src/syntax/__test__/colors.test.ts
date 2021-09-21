import { getEventMenuColorCode, VisibleForTesting } from '../colors';

describe('getEventMenuColorCode', () => {
    const { COLOR } = VisibleForTesting;

    test.each(['打合', '会議'])('Blue', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.BLUE);
    });

    test.each(['来訪', '取材/講演', '【履歴】来訪'])('Skyblue', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.SKYBLUE);
    });

    test.each(['出張', 'ウルトラワーク', 'リモートワーク', '出社'])('Orange', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.ORANGE);
    });

    test.each(['副業', '複業', '休み'])('Red', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.RED);
    });

    test.each(['往訪', '【履歴】往訪'])('Pink', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.PINK);
    });

    test.each(['面接', 'フェア', 'イベン10', '仕事Bar', '部活動', '懇親会', '社内イベント'])('Purple', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.PURPLE);
    });

    test.each(['勉強会', 'タスク'])('Brown', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.BROWN);
    });

    test.each(['説明会', 'セミナー', 'その他'])('Gray', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.GRAY);
    });

    test.each(['終日'])('Yellow green', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.YELLOW_GREEN);
    });

    test.each(['てきとう'])('Deep orange', (value) => {
        expect(getEventMenuColorCode(value)).toBe(COLOR.DEEP_ORANGE);
    });
});
