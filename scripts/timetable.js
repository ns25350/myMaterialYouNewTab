document.addEventListener("DOMContentLoaded", () => {
    // 追加したHTMLの要素を取得
    const contentArea = document.getElementById("timetableContent");

    // あなたのFirebase Realtime DatabaseのURL
    const FIREBASE_URL = "https://johou7-275be-default-rtdb.firebaseio.com/timetable.json"; 

    // 要素が存在する場合のみ実行
    if (contentArea) {
        fetchTimetableFromFirebase();
    }

    async function fetchTimetableFromFirebase() {
        try {
            const response = await fetch(FIREBASE_URL);
            if (!response.ok) throw new Error("Firebaseからのデータ取得に失敗しました");
            
            const data = await response.json();
            
            // データが空の場合
            if (!data || !data.schedule) {
                contentArea.innerHTML = `
                    <p style='color:orange; font-size:14px; margin:0; text-align:center;'>時間割データがありません。</p>
                    <p style='font-size:11px; margin:4px 0 0 0; text-align:center;'>GASを実行してデータを送信してください。</p>
                `;
                return;
            }
            
            renderTimetable(data);
        } catch (error) {
            console.error("時間割取得エラー:", error);
            contentArea.innerHTML = `<p style='color:red; font-size:13px; margin:0; text-align:center;'>時間割の取得に失敗しました。<br><small>${error.message}</small></p>`;
        }
    }


    // 表を作成して表示する関数（今日の日付表示＋横並び版）
    function renderTimetable(data) {
        // 💡 今日の日付（年・月・日）を自動的に取得
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const date = today.getDate();
        
        // 曜日を「月曜」から「月」に変換してスッキリさせます（例: 月曜 → 月）
        const shortDay = data.day.replace("曜", "");
        
        // 「2026年6月22日（月）」という文字列を作成
        const dateString = `${year}年${month}月${date}日（${shortDay}）`;

        // 💡 タイトルの文字を今日の日付に変更
        let html = `<p style="font-weight: bold; margin-bottom: 10px; font-size: 15px; text-align: center; color: var(--md-sys-color-on-surface, #fff);">${dateString} の時間割</p>`;
        
        // はみ出た場合は横スクロールできるようにする
        html += "<div style='overflow-x: auto; width: 100%; -webkit-overflow-scrolling: touch;'>";
        
        // CSSの干渉を防ぐテーブル設定
        html += "<table style='display: table !important; width: 100% !important; border-collapse: collapse !important; font-size: 13px !important; text-align: center !important; table-layout: fixed !important;'>";
        
        // 1行目：1限〜7限の見出し
        html += "<tr style='display: table-row !important; background: rgba(0,0,0,0.05) !important;'>";
        data.schedule.forEach((_, index) => {
            html += `<th style='display: table-cell !important; border: 1px solid rgba(128,128,128,0.3) !important; padding: 8px !important; font-weight: bold !important; min-width: 45px !important;'>${index + 1}限</th>`;
        });
        html += "</tr>";

        // 2行目：授業科目
        html += "<tr style='display: table-row !important;'>";
        data.schedule.forEach((subject) => {
            html += `<td style='display: table-cell !important; border: 1px solid rgba(128,128,128,0.2) !important; padding: 8px !important; word-break: break-all !important; white-space: normal !important; vertical-align: middle !important;'>${subject || "―"}</td>`;
        });
        html += "</tr>";
        
        html += "</table></div>";
        contentArea.innerHTML = html;
    }
});
