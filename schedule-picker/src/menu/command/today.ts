import type { Command } from "./interface";

export class TodayCommand implements Command {
  execute(): void {
    // TODO: メソッド切り出す
    // ローディングを表示
    document.body.style.cursor = "progress";
    // ホストネームを取得
    location.hostname;
    try {
      // 予定を取得
      // テキストを挿入
    } catch {
      // 取得及び挿入に失敗
    } finally {
      // ローディングを非表示
      document.body.style.cursor = "auto";
    }
  }
}
