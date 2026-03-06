// --- API 與 LIFF 設定 ---
const liffId = "2008940948-79xDumdY"; // 在 LINE Developers 拿到後貼進來
const apiUrl =
  "https://dalene-phylar-ruttily.ngrok-free.dev/webhook/Entry-Edit";

// --- 帳本選單邏輯 ---
function toggleLedgerOptions() {
  const options = document.getElementById("ledger-options");
  const arrow = document.getElementById("ledger-arrow");
  options.classList.toggle("show");

  if (options.classList.contains("show")) {
    arrow.classList.add("open");
  } else {
    arrow.classList.remove("open");
  }
}

function selectLedger(value, el) {
  document.getElementById("ledger-text").innerText = value;
  document
    .querySelectorAll(".custom-option")
    .forEach((opt) => opt.classList.remove("selected"));
  el.classList.add("selected");
  event.stopPropagation(); // 阻止事件冒泡
  document.getElementById("ledger-options").classList.remove("show");
  document.getElementById("ledger-arrow").classList.remove("open");
}

window.onclick = function (event) {
  if (
    !event.target.matches(".custom-select-wrapper") &&
    !event.target.closest(".custom-select-wrapper")
  ) {
    document.getElementById("ledger-options").classList.remove("show");
    document.getElementById("ledger-arrow").classList.remove("open");
  }
};

// --- 類別與基本邏輯 ---
const expenseCategories = [
  "房租",
  "水電",
  "交通",
  "購物",
  "運動",
  "醫療",
  "電話",
  "訂閱",
  "餐飲",
  "娛樂",
  "旅行",
  "其他",
];
const incomeCategories = [
  "薪水",
  "投資",
  "回饋",
  "租金",
  "其他",
  "獎金",
  "交易",
  "股利",
  "紅包",
];
let currentType = "expense";
let currentRowNumber = null; // 記憶目前編輯的是哪一列
let originalTime = ""; // 記憶原本的時分秒
let selectedDate = new Date(2025, 10, 9); // 預設值，之後會被 API 覆寫

document.addEventListener("DOMContentLoaded", () => {
  initCalendarSelects();
  renderCalendar();
  renderCategories();
  // 網頁載入後啟動主流程
  main();
});

function setType(type) {
  const btnExpense = document.getElementById("btn-expense");
  const btnIncome = document.getElementById("btn-income");
  const minusSign = document.getElementById("minus-sign");
  currentType = type;
  if (type === "expense") {
    btnExpense.classList.add("active");
    btnIncome.classList.remove("active");
    minusSign.style.display = "inline";
  } else {
    btnIncome.classList.add("active");
    btnExpense.classList.remove("active");
    minusSign.style.display = "none";
  }
  renderCategories();
}

function toggleCategory() {
  const catWrapper = document.getElementById("category-wrapper");
  const arrow = document.getElementById("category-arrow");
  document.getElementById("calendar-wrapper").style.display = "none";
  document.getElementById("date-arrow").classList.remove("open");
  if (catWrapper.style.display === "block") {
    catWrapper.style.display = "none";
    arrow.classList.remove("open");
  } else {
    catWrapper.style.display = "block";
    arrow.classList.add("open");
  }
}

function renderCategories() {
  const listContainer = document.getElementById("category-list");
  listContainer.innerHTML = "";
  const categories =
    currentType === "expense" ? expenseCategories : incomeCategories;
  categories.forEach((cat) => {
    const btn = document.createElement("button");
    btn.className = "category-btn";
    btn.innerText = cat;
    btn.onclick = () => {
      document.getElementById("category-display-text").innerText = cat;
      toggleCategory();
    };
    listContainer.appendChild(btn);
  });
}

// --- 金額編輯邏輯 ---
function toggleAmountEdit() {
  const textDisplay = document.getElementById("amount-text");
  const inputDisplay = document.getElementById("amount-input");
  const editBtn = document.getElementById("edit-btn");
  if (inputDisplay.style.display === "none") {
    inputDisplay.style.display = "block";
    inputDisplay.value = textDisplay.innerText;
    textDisplay.style.display = "none";
    editBtn.style.color = "#2ecc71";
    inputDisplay.focus();
  } else {
    saveAmount();
  }
}

function saveAmount() {
  const textDisplay = document.getElementById("amount-text");
  const inputDisplay = document.getElementById("amount-input");
  const editBtn = document.getElementById("edit-btn");
  if (inputDisplay.value.trim() !== "")
    textDisplay.innerText = inputDisplay.value;
  inputDisplay.style.display = "none";
  textDisplay.style.display = "inline";
  editBtn.style.color = "#999";
}

function handleEnter(e) {
  if (e.key === "Enter") saveAmount();
}

// --- 日曆選單邏輯 ---
function toggleCalendar() {
  const calWrapper = document.getElementById("calendar-wrapper");
  const arrow = document.getElementById("date-arrow");
  document.getElementById("category-wrapper").style.display = "none";
  document.getElementById("category-arrow").classList.remove("open");
  if (calWrapper.style.display === "block") {
    calWrapper.style.display = "none";
    arrow.classList.remove("open");
  } else {
    calWrapper.style.display = "block";
    arrow.classList.add("open");
  }
}

function initCalendarSelects() {
  const yearSelect = document.getElementById("cal-year");
  const monthSelect = document.getElementById("cal-month");
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 5; y <= currentYear + 5; y++)
    yearSelect.add(new Option(y + "年", y));
  for (let m = 0; m < 12; m++) monthSelect.add(new Option(m + 1 + "月", m));
}

function renderCalendar() {
  const yearSelect = document.getElementById("cal-year");
  const monthSelect = document.getElementById("cal-month");
  if (!yearSelect.value) yearSelect.value = selectedDate.getFullYear();
  if (!monthSelect.value) monthSelect.value = selectedDate.getMonth();
  const year = parseInt(yearSelect.value);
  const month = parseInt(monthSelect.value);
  const daysContainer = document.getElementById("calendar-days");
  daysContainer.innerHTML = "";
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  for (let i = 0; i < firstDay.getDay(); i++)
    daysContainer.appendChild(document.createElement("div"));
  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dayEl = document.createElement("div");
    dayEl.className = "day";
    dayEl.innerText = d;
    if (
      d === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    )
      dayEl.classList.add("selected");
    dayEl.onclick = (e) => {
      e.stopPropagation();
      selectedDate = new Date(year, month, d);
      document.getElementById("current-date-text").innerText =
        `${year}年${String(month + 1).padStart(2, "0")}月${String(d).padStart(2, "0")}日`;
      renderCalendar();
      toggleCalendar();
    };
    daysContainer.appendChild(dayEl);
  }
}

function changeMonth(offset) {
  const monthSelect = document.getElementById("cal-month");
  const yearSelect = document.getElementById("cal-year");
  let m = parseInt(monthSelect.value) + offset;
  let y = parseInt(yearSelect.value);
  if (m > 11) {
    m = 0;
    y++;
  }
  if (m < 0) {
    m = 11;
    y--;
  }
  monthSelect.value = m;
  yearSelect.value = y;
  renderCalendar();
}

const actionApiUrl =
  "https://dalene-phylar-ruttily.ngrok-free.dev/webhook/Update-Entry";

// --- 1. 修改後的：更新資料 ---
async function updateEntry() {
  if (!currentRowNumber) {
    alert("無法獲取資料列號，請重新載入網頁！");
    return;
  }

  const btn = document.querySelector(".btn-update");
  const originalText = btn.innerText;
  btn.innerText = "更新中...";
  btn.disabled = true;

  const sheetName = document.getElementById("ledger-text").innerText;
  const amount = document.getElementById("amount-text").innerText;
  const category = document.getElementById("category-display-text").innerText;
  const item = document.getElementById("item-input").value;
  const description = document.getElementById("note-input").value;

  const y = selectedDate.getFullYear();
  const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
  const d = String(selectedDate.getDate()).padStart(2, "0");
  const formattedDate = `${y}-${m}-${d}`;

  const payload = {
    action: "update", // ★ 新增：告訴 n8n 這是更新動作 ★
    rowNumber: currentRowNumber,
    sheetName: sheetName,
    type: currentType,
    amount: amount,
    category: category,
    item: item,
    description: description,
    date: formattedDate,
    originalTime: originalTime,
  };

  try {
    const response = await fetch(actionApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      btn.innerText = "更新成功！";
      setTimeout(() => {
        if (liff.isInClient()) liff.closeWindow();
      }, 1500);
    } else {
      throw new Error(`伺服器錯誤`);
    }
  } catch (error) {
    console.error("更新失敗:", error);
    btn.innerText = "更新失敗";
    btn.style.backgroundColor = "var(--primary-red)";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.style.backgroundColor = "var(--primary-green)";
      btn.disabled = false;
    }, 2000);
  }
}

// --- 2. 修改後的：刪除資料 ---
async function deleteEntry() {
  if (!currentRowNumber) {
    alert("無法獲取資料列號，請重新載入網頁！");
    return;
  }

  // 加入確認對話框
  if (!confirm("確定要刪除這筆紀錄嗎？此動作無法復原。")) {
    return;
  }

  const btn = document.querySelector(".btn-delete");
  const originalText = btn.innerHTML; // 因為裡面有 SVG，所以用 innerHTML
  btn.innerText = "刪除中...";
  btn.disabled = true;

  const sheetName = document.getElementById("ledger-text").innerText;

  const payload = {
    action: "delete", // ★ 新增：告訴 n8n 這是刪除動作 ★
    rowNumber: currentRowNumber,
    sheetName: sheetName,
    // 刪除只需要知道在哪個帳本、哪一列即可，不需要傳送其他內容
  };

  try {
    const response = await fetch(actionApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      btn.innerText = "已刪除！";
      document.querySelector(".app-container").style.opacity = "0.5"; // 畫面變淡示意完成
      setTimeout(() => {
        if (liff.isInClient()) liff.closeWindow();
      }, 1500);
    } else {
      throw new Error(`伺服器錯誤`);
    }
  } catch (error) {
    console.error("刪除失敗:", error);
    btn.innerText = "刪除失敗";
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }, 2000);
  }
}

// ---- 資料寫入介面邏輯 (新增) ----
function populateData(apiData) {
  // 防呆：確認有資料
  if (!apiData) return;

  // 0. 帳本選單 (sheetList & sheetName)
  if (apiData.sheetName) {
    document.getElementById("ledger-text").innerText = apiData.sheetName;
  }

  if (apiData.sheetList && Array.isArray(apiData.sheetList)) {
    const ledgerOptionsContainer = document.getElementById("ledger-options");
    if (ledgerOptionsContainer) {
      ledgerOptionsContainer.innerHTML = ""; // 清空 HTML 中寫死的選項

      apiData.sheetList.forEach((sheet) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "custom-option";

        // 若為預設選項，加上 selected 標記
        if (sheet === apiData.sheetName) {
          optionDiv.classList.add("selected");
        }

        optionDiv.innerText = sheet;

        // 綁定點擊事件
        optionDiv.onclick = function () {
          selectLedger(sheet, this);
        };

        ledgerOptionsContainer.appendChild(optionDiv);
      });
    }
  }

  // 確認有 records 資料再繼續渲染下方欄位
  if (!apiData.records || apiData.records.length === 0) return;

  const record = apiData.records[0];

  // ★ 新增這兩行：儲存列號與原始時間 ★
  currentRowNumber = record.row_number;
  if (record.TIMESTAMP && record.TIMESTAMP.includes(" ")) {
    originalTime = record.TIMESTAMP.split(" ")[1]; // 取出 21:02:22 的部分
  }
  // 1. 金額與屬性 (有負號為支出，無負號為收入)
  let rawPrice = String(record.PRICE || "0");
  if (rawPrice.includes("-")) {
    setType("expense");
    rawPrice = rawPrice.replace("-", ""); // 移除數值上的負號，交給 UI 的減號顯示
  } else {
    setType("income");
  }
  document.getElementById("amount-text").innerText = rawPrice;
  document.getElementById("amount-input").value = rawPrice;

  // 2. 類型 (CATEGORY)
  if (record.CATEGORY) {
    document.getElementById("category-display-text").innerText =
      record.CATEGORY;
  }

  // 3. 項目 (ITEM)
  if (record.ITEM !== undefined) {
    document.getElementById("item-input").value = record.ITEM;
  }

  // 4. 備註 (DESCRIPTION)
  if (record.DESCRIPTION !== undefined) {
    document.getElementById("note-input").value = record.DESCRIPTION;
  }

  // 5. 日期 (TIMESTAMP)
  if (record.TIMESTAMP) {
    // 切割 "2026-03-02 21:02:22" 取得 "2026-03-02"
    const dateStr = record.TIMESTAMP.split(" ")[0];
    const [y, m, d] = dateStr.split("-");

    // 更新內部狀態
    selectedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));

    // 更新畫面的文字
    document.getElementById("current-date-text").innerText =
      `${y}年${m}月${d}日`;

    // 同步更新下拉月曆的選單值
    const yearSelect = document.getElementById("cal-year");
    const monthSelect = document.getElementById("cal-month");
    if (yearSelect) yearSelect.value = parseInt(y);
    if (monthSelect) monthSelect.value = parseInt(m) - 1;

    // 重新繪製月曆讓高亮樣式落在正確日期
    renderCalendar();
  }
}

// ---- 資料載入與主流程 ----
async function main() {
  try {
    // 初始化 LIFF
    await liff.init({ liffId });

    // 確保登入
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }

    // 取得使用者資訊
    const profile = await liff.getProfile();

    // 呼叫 n8n 的報表 API
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: profile.userId,
        source: "liff-demo",
      }),
    });

    if (!res.ok) {
      console.log(`n8n API error: ${res.status} ${res.statusText}`);
      return;
    }

    const data = await res.json();
    console.log("Fetched data:", data);

    // ★ 呼叫函式，將取得的資料填入 UI 介面 ★
    populateData(data);
  } catch (err) {
    console.error("Initialization / Fetch Error:", err);
  }
}
