export const getEventMenuEmoji = (eventMenu: string): string => {
	switch (eventMenu) {
		case "打合 / Mtg":
		case "通訳付き打合 / Interpreted MTG":
		case "会議 / Conf.":
		case "往来訪(Web) / Web mtg w. guests":
		case "打合":
		case "会議":
		case "往来訪(Web)":
			return "🟦";
		case "来訪 / Mtg outside ORG":
		case "来訪":
			return "🟦";
		case "往訪 / Mtg w. guests":
		case "往訪":
			return "🟪";
		case "出張 / Work trip":
		case "出張":
			return "🟪";
		case "説明会 / Briefing":
		case "面接 / Interview":
		case "通訳付き面接 / Interpreted Interview":
		case "説明会":
		case "面接":
			return "🟪";
		case "休み / Leave":
		case "複業 / Parallel job":
		case "休み":
		case "複業":
			return "🟥";
		case "リモートワーク / Remote":
		case "ウルトラワーク / Ultrawork":
		case "出社 / In office":
		case "ウルトラワーク":
		case "リモートワーク":
		case "出社":
			return "🟧";
		case "勉強会 / Learning":
		case "社内勉強会 / Co-learning":
		case "研修 / Training":
		case "人事研修 / HR train.":
		case "勉強会":
		case "【履歴】来訪":
		case "【履歴】往訪":
			return "🟫";
		case "セミナー / Seminar":
		case "フェア / Fair":
		case "取材／講演 / Media; Lecture":
		case "フェア":
		case "セミナー":
		case "取材/講演":
			return "🟨";
		case "誕生日会 / BD Party":
		case "イベン10":
		case "イベン10 / Event10":
		case "仕事Bar":
		case "仕事Bar / Shigoto Bar":
		case "部活動":
		case "部活動 / Club":
		case "懇親会 / Social":
		case "社内イベント / Org event":
		case "通訳付きイベント / Interpreted Event":
		case "懇親会":
		case "社内イベント":
			return "🟩";
		case "タスク / Task":
		case "その他 / Other":
		case "タスク":
		case "その他":
			return "⬜";
		case "終日":
			return "⬜";
		default:
			return "⬜";
	}
};
