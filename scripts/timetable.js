document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("timetableToggleCont");
    const container = document.getElementById("timetableContainer");
    const contentArea = document.getElementById("timetableContent");

    // あなたのGASウェブアプリURL
    const GAS_API_URL = "https://script.google.com/a/macros/isk.ed.jp/s/AKfycbyCnh63cv6b-BGXrCdHufYbXO5ALM99clAzxMkoUOWnSuc5GxneXd9NU2iWy3v45cPi/exec"; 

    toggleButton.addEventListener("click", () => {
        if (container.style.display === "none") {
            container.style.display = "block";
            fetchTimetable();
        } else {
            container.style.display = "none";
        }
    });

    async function fetchTimetable() {
        try {
            contentArea.innerHTML = "<p>データを取得中...</p>";
            
            // 💡 組織内GASのリダイレクトにしっかり対応するための設定
            const response = await fetch(GAS_API_URL, {
                method: "GET",
                mode: "cors",         // CORSを明示
                redirect: "follow",   // 💡 GAS特有のリダイレクトを自動追従する
                credentials: "include" // 組織内認証を引き継ぐ
            });
            
            // 転送先でうまくエラーが返った場合もキャッチできるようにする
            if (!response.ok) {
                throw new Error(`サーバーエラー (Status: ${response.status})`);
            }
            
            const data = await response.json();
            renderTimetable(data);
        } catch (error) {
            console.error("時間割の取得に失敗:", error);
            // 💡 画面にエラー原因を表示してデバッグしやすくする
            contentArea.innerHTML = `
                <p style='color:red; font-size:14px; font-weight:bold;'>時間割の取得に失敗しました。</p>
                <p style='color:#777; font-size:11px;'>原因: ${error.message}</p>
            `;
        }
    }

    function renderTimetable(data) {
        if (data.error) {
            contentArea.innerHTML = `<p style='color:orange;'>${data.error}</p>`;
            return;
        }

        let html = `<p style="font-weight: bold; margin-bottom: 8px; color: var(--md-sys-color-on-surface);">本日（${data.day}）の時間割</p>`;
        html += "<table style='width:100%; border-collapse: collapse; margin-top:5px; font-size:14px;'>";
        html += "<tr style='background: rgba(0,0,0,0.05);'><th style='border:1px solid #ccc; padding:6px; width:25%;'>時限</th><th style='border:1px solid #ccc; padding:6px;'>授業内容</th></tr>";

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
