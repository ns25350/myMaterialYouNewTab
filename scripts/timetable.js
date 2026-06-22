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

    // 表を作成して表示する関数（横並びバージョン）
    function renderTimetable(data) {
        let html = `<p style="font-weight: bold; margin-bottom: 10px; font-size: 15px; text-align: center;">本日（${data.day}）の時間割</p>`;
        
        // 💡 画面幅からはみ出した場合に横スクロールできるようにdivで囲む
        html += "<div style='overflow-x: auto; width: 100%;'>";
        html += "<table style='width:100%; border-collapse: collapse; font-size:13px; text-align:center;'>";
        
        // 1行目：ヘッダー（1限〜7限を横に並べる）
        html += "<tr style='background: rgba(0,0,0,0.05);'>";
        data.schedule.forEach((_, index) => {
            html += `<th style='border:1px solid rgba(128,128,128,0.3); padding:6px; min-width:45px;'>${index + 1}限</th>`;
        });
        html += "</tr>";

        // 2行目：授業内容（科目を横に並べる）
        html += "<tr>";
        data.schedule.forEach((subject) => {
            // 文字が長い場合に適切に折り返すよう word-break を設定
            html += `<td style='border:1px solid rgba(128,128,128,0.2); padding:6px; word-break: break-word;'>${subject}</td>`;
        });
        html += "</tr>";
        
        html += "</table></div>";
        contentArea.innerHTML = html;
    }
});
