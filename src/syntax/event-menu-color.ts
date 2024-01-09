// NOTE: 分割する意味がないのでルールを無視している
// eslint-disable-next-line complexity
export const getEventMenuColorCode = (eventMenu: string): string => {
    switch (eventMenu) {
        case '打合 / Mtg':
        case '通訳付き打合 / Interpreted MTG':
            return '#3182dc';
        case '会議 / Conf.':
            return '#00508a';
        case '往来訪(Web) / Web mtg w. guests':
            return '#556b81';
        case '来訪 / Mtg outside ORG':
            return '#57b3ed';
        case '往訪 / Mtg w. guests':
            return '#f194a7';
        case '出張 / Work trip':
            return '#c242aa';
        case '休み / Leave':
        case '複業 / Parallel job':
            return '#f44848';
        case 'リモートワーク / Remote':
        case 'ウルトラワーク / Ultrawork':
        case '出社 / In office':
            return '#ef9201';
        case '勉強会 / Learning':
            return '#646600';
        case '説明会 / Briefing':
        case '面接 / Interview':
        case '通訳付き面接 / Interpreted Interview':
            return '#725bce';
        case 'セミナー / Seminar':
        case 'フェア / Fair':
        case '取材／講演 / Media; Lecture':
            return '#dfc506';
        case '誕生日会 / BD Party':
        case 'イベン10':
        case '仕事Bar':
        case '部活動':
        case '懇親会 / Social':
        case '社内イベント / Org event':
        case '通訳付きイベント / Interpreted Event':
            return '#158084';
        case 'タスク / Task':
        case 'その他 / Other':
            return '#999999';
        case '人事研修 / HR train.':
            return '#646600';
        case '終日':
            return '#fb8c00';
        // 過去に対応していたメニューの分岐 ここから
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
        case '懇親会':
        case '社内イベント':
            return '#158084';
        case 'タスク':
        case 'その他':
            return '#999';
        case '【履歴】来訪':
        case '【履歴】往訪':
            return '#873e0e';
        // 過去に対応していたメニューの分岐 ここまで
        default:
            return '#00acc1'; // 個人設定で追加したメニューの配色
    }
};
