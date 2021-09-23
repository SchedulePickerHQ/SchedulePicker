export const COLOR = {
    BLUE: '#3182dc',
    SKYBLUE: '#57b3ed',
    ORANGE: '#ef9201',
    DEEP_ORANGE: '#ff5722',
    RED: '#f44848',
    PINK: '#f194a7',
    PURPLE: '#b592d8',
    BROWN: '#b99976',
    GRAY: '#999999',
    YELLOW_GREEN: '#9acd32',
};

export const getEventMenuColorCode = (eventMenu: string): string => {
    switch (eventMenu) {
        case '打合':
        case '会議':
            return COLOR.BLUE;
        case '来訪':
        case '取材/講演':
        case '【履歴】来訪':
            return COLOR.SKYBLUE;
        case '出張':
        case 'ウルトラワーク':
        case 'リモートワーク':
        case '出社':
            return COLOR.ORANGE;
        case '副業':
        case '複業':
        case '休み':
            return COLOR.RED;
        case '往訪':
        case '【履歴】往訪':
            return COLOR.PINK;
        case '面接':
        case 'フェア':
        case 'イベン10':
        case '仕事Bar':
        case '部活動':
        case '懇親会':
        case '社内イベント':
            return COLOR.PURPLE;
        case '勉強会':
        case 'タスク':
            return COLOR.BROWN;
        case '説明会':
        case 'セミナー':
        case 'その他':
            return COLOR.GRAY;
        case '終日':
            return COLOR.YELLOW_GREEN;
        default:
            return COLOR.DEEP_ORANGE;
    }
};
