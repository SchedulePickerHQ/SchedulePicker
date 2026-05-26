const MENU_COLORS: Record<string, string> = {
	"打合 / Mtg": "#e9f1fb",
	"通訳付き打合 / Interpreted MTG": "#e9f1fb",
	"会議 / Conf.": "#e5ecf3",
	"往来訪(Web) / Web mtg w. guests": "#ebeff2",
	"来訪 / Mtg outside ORG": "#edf6fe",
	"往訪 / Mtg w. guests": "#fef2f5",
	"出張 / Work trip": "#f8e6f5",
	"休み / Leave": "#feebeb",
	"複業 / Parallel job": "#feebeb",
	"リモートワーク / Remote": "#fef2e5",
	"ウルトラワーク / Ultrawork": "#fef2e5",
	"出社 / In office": "#fef2e5",
	"勉強会 / Learning": "#efefd9",
	"説明会 / Briefing": "#f0edfb",
	"面接 / Interview": "#f0edfb",
	"通訳付き面接 / Interpreted Interview": "#f0edfb",
	"セミナー / Seminar": "#fcfae5",
	"フェア / Fair": "#fcfae5",
	"取材／講演 / Media; Lecture": "#fcfae5",
	"誕生日会 / BD Party": "#e7f4f4",
	"イベン10": "#e7f4f4",
	"仕事Bar": "#e7f4f4",
	"部活動": "#e7f4f4",
	"懇親会 / Social": "#e7f4f4",
	"社内イベント / Org event": "#e7f4f4",
	"通訳付きイベント / Interpreted Event": "#e7f4f4",
	"タスク / Task": "#f2f2f2",
	"その他 / Other": "#f2f2f2",
	"人事研修 / HR train.": "#efefd9",
	"終日": "#fef2e6",
};

// 過去に対応していたメニュー名から現在のメニュー名へのマッピング
const LEGACY_MENU_MAPPING: Record<string, string> = {
	"打合": "打合 / Mtg",
	"会議": "会議 / Conf.",
	"往来訪(Web)": "往来訪(Web) / Web mtg w. guests",
	"来訪": "来訪 / Mtg outside ORG",
	"往訪": "往訪 / Mtg w. guests",
	"出張": "出張 / Work trip",
	"休み": "休み / Leave",
	"複業": "複業 / Parallel job",
	"ウルトラワーク": "ウルトラワーク / Ultrawork",
	"リモートワーク": "リモートワーク / Remote",
	"出社": "出社 / In office",
	"勉強会": "勉強会 / Learning",
	"説明会": "説明会 / Briefing",
	"面接": "面接 / Interview",
	"フェア": "フェア / Fair",
	"セミナー": "セミナー / Seminar",
	"取材/講演": "取材／講演 / Media; Lecture",
	"懇親会": "懇親会 / Social",
	"社内イベント": "社内イベント / Org event",
	"タスク": "タスク / Task",
	"その他": "その他 / Other",
	"【履歴】来訪": "来訪 / Mtg outside ORG",
	"【履歴】往訪": "往訪 / Mtg w. guests",
};

const DEFAULT_COLOR = "#e5f7f9";

export const getEventMenuColor = (eventMenu: string): string => {
	const normalized = LEGACY_MENU_MAPPING[eventMenu] ?? eventMenu;
	return MENU_COLORS[normalized] ?? DEFAULT_COLOR;
};
