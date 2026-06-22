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

    // 表を作成して表示する関数
    function renderTimetable(data) {
        let html = `<p style="font-weight: bold; margin-bottom: 10px; font-size: 15px; text-align: center;">本日（${data.day}）の時間割</p>`;
        html += "<table style='width:100%; border-collapse: collapse; font-size:13px;'>";
        
        // ヘッダー行
        html += "<tr style='background: rgba(0,0,0,0.05);'><th style='border:1px solid rgba(128,128,128,0.3); padding:6px; width:25%;'>時限</th><th style='border:1px solid rgba(128,128,128,0.3); padding:6px; text-align:left;'>授業内容</th></tr>";

        // 1時間目〜7時間目
        data.schedule.forEach((subject, index) => {
            html += `<tr>
                <td style='border:1px solid rgba(128,128,128,0.2); padding:6px; text-align:center; font-weight:bold;'>${index + 1}限</td>
                <td style='border:1px solid rgba(128,128,128,0.2); padding:6px; text-align:left;'>${subject}</td>
            </tr>`;
        });
        
        html += "</table>";
        contentArea.innerHTML = html;
    }
});
