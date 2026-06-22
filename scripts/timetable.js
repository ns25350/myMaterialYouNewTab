document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("timetableToggleCont");
    const container = document.getElementById("timetableContainer");
    const contentArea = document.getElementById("timetableContent");

    // 💡 あなたのFirebase Realtime Databaseのデータ取得用URL (末尾に .json が必要です)
    const FIREBASE_URL = "https://johou7-275be-default-rtdb.firebaseio.com/timetable.json"; 

    // ボタンをクリックしたら時間割の表示/非表示を切り替える
    toggleButton.addEventListener("click", () => {
        if (container.style.display === "none") {
            container.style.display = "block";
            fetchTimetableFromFirebase();
        } else {
            container.style.display = "none";
        }
    });

    // Firebaseから時間割を取得する関数
    async function fetchTimetableFromFirebase() {
        try {
            contentArea.innerHTML = "<p>データを取得中...</p>";
            
            // 個人のFirebaseなので、GitHubからでもCORS制限を回避して直接fetch可能
            const response = await fetch(FIREBASE_URL);
            if (!response.ok) throw new Error("Firebaseからのデータ取得に失敗しました");
            
            const data = await response.json();
            
            // まだGASからデータが送られておらず、Firebaseが空っぽの場合の処理
            if (!data || !data.schedule) {
                contentArea.innerHTML = `
                    <p style='color:orange;'>時間割データがありません。</p>
                    <p style='font-size:11px; color:#666;'>学校のGASを実行して、Firebaseへデータを最初に送信してください。</p>
                `;
                return;
            }
            
            renderTimetable(data);
        } catch (error) {
            console.error("時間割取得エラー:", error);
            contentArea.innerHTML = `<p style='color:red;'>時間割の取得に失敗しました。<br><small>${error.message}</small></p>`;
        }
    }

    // HTMLを生成して画面（コンテナ）に映す関数
    function renderTimetable(data) {
        let html = `<p style="font-weight: bold; margin-bottom: 8px; color: var(--md-sys-color-on-surface);">本日（${data.day}）の時間割</p>`;
        html += "<table style='width:100%; border-collapse: collapse; margin-top:5px; font-size:14px;'>";
        html += "<tr style='background: rgba(0,0,0,0.05);'><th style='border:1px solid #ccc; padding:6px; width:25%;'>時限</th><th style='border:1px solid #ccc; padding:6px;'>授業内容</th></tr>";

        // 1時間目〜7時間目をループで回す
        data.schedule.forEach((subject, index) => {
            html += `<tr>
                <td style='border:1px solid #ccc; padding:6px; text-align:center; font-weight:bold;'>${index + 1}限</td>
                <td style='border:1px solid #ccc; padding:6px;'>${subject}</td>
            </tr>`;
        });
        
        html += "</table>";
        contentArea.innerHTML = html;
    }
});
