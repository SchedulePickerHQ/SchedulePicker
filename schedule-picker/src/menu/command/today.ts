import { getUserEvents } from "~schedule/events";
import { loadAllDayEventIncludedSetting, loadSyntaxSetting } from "~storage";
import { convertToEndOfDay, convertToStartOfDay, dateTime } from "~utils/datetime";

import type { Command } from "../../utils/interface";

export class TodayCommand implements Command {
  async execute() {
    document.body.style.cursor = "progress";

    const now = dateTime();
    const startTime = convertToStartOfDay(now);
    const endTime = convertToEndOfDay(now);
    const alldayEventIncluded = await loadAllDayEventIncludedSetting();
    const syntax = loadSyntaxSetting();

    try {
      const events = await getUserEvents(location.hostname, {
        startTime,
        endTime,
        alldayEventIncluded
      });
      // テキストを挿入
    } catch {
      // 取得及び挿入に失敗
    } finally {
      document.body.style.cursor = "auto";
    }
  }
}
