const COLOR = {
    DEEP_ORANGE: '#ff5722',
    YELLOW_GREEN: '#9acd32',
};

export const getEventMenuColorCode = (eventMenu: string): string => {
    switch (eventMenu) {
        case '打合':
            return '#3182dc';
        case '会議':
            return '#00508a';
        case '往来訪(Web)':
            return '#556b81';
        case '来訪':
            return '#57b3ed';
        case '往訪':
            return '#f194a7';
        case '出張':
            return '#c242aa';
        case '休み':
        case '複業':
            return '#f44848';
        case 'ウルトラワーク':
        case 'リモートワーク':
        case '出社':
            return '#ef9201';
        case '勉強会':
            return '#646600';
        case '説明会':
        case '面接':
            return '#725bce';
        case 'フェア':
        case 'セミナー':
        case '取材/講演':
            return '#dfc506';
        case 'イベン10':
        case '仕事Bar':
        case '部活動':
        case '懇親会':
        case '社内イベント':
            return '#158084';
        case 'タスク':
        case 'その他':
            return '#999';
        case '【履歴】来訪':
        case '【履歴】往訪':
            return '#873e0e';
        case '終日':
            return COLOR.YELLOW_GREEN;
        default:
            return COLOR.DEEP_ORANGE;
    }
};
