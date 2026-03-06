// ==========================================
//  全域變數與 API 設定
// ==========================================
const liffId = "2008940948-79xDumdY";
const fetchApiUrl =
  "https://dalene-phylar-ruttily.ngrok-free.dev/webhook/Entry-Edit";
const actionApiUrl =
  "https://dalene-phylar-ruttily.ngrok-free.dev/webhook/Update-Entry";

// ★ 狀態記憶變數 (新增 currentUserId 用來在背景記住 UserID) ★
let currentRowNumber = null;
let originalTime = "";
let currentUserId = "";

// ==========================================
//  UI 互動與基本邏輯
// ==========================================
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
let selectedDate = new Date();

document.addEventListener("DOMContentLoaded", () => {
  initCalendarSelects();
  renderCalendar();
  renderCategories();
  main();
});

// --- 帳本選單邏輯 ---
function toggleLedgerOptions() {
  const options = document.getElementById("ledger-options");
  const arrow = document.getElementById("ledger-arrow");
  options.classList.toggle("show");
  options.classList.contains("show")
    ? arrow.classList.add("open")
    : arrow.classList.remove("open");
}
function selectLedger(value, el) {
  document.getElementById("ledger-text").innerText = value;
  document
    .querySelectorAll(".custom-option")
    .forEach((opt) => opt.classList.remove("selected"));
  el.classList.add("selected");
  event.stopPropagation();
  document.getElementById("ledger-options").classList.remove("show");
  document.getElementById("ledger-arrow").classList.remove("open");
}
window.onclick = function (event) {
  if (
    !event.target.matches(".custom-select-wrapper") &&
    !event.target.closest(".custom-select-wrapper")
  ) {
    const opts = document.getElementById("ledger-options");
    if (opts) opts.classList.remove("show");
    const arr = document.getElementById("ledger-arrow");
    if (arr) arr.classList.remove("open");
  }
};

// --- 屬性與類別切換 ---
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

// --- 金額編輯 ---
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

// --- 日曆功能 ---
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

// ==========================================
//  API 資料處理 (讀取、更新、刪除)
// ==========================================

function populateData(apiData) {
  if (!apiData) return;

  // 0. 帳本選單
  if (apiData.sheetName) {
    document.getElementById("ledger-text").innerText = apiData.sheetName;
  }

  if (apiData.sheetList && Array.isArray(apiData.sheetList)) {
    const ledgerOptionsContainer = document.getElementById("ledger-options");
    if (ledgerOptionsContainer) {
      ledgerOptionsContainer.innerHTML = "";
      apiData.sheetList.forEach((sheet) => {
        const optionDiv = document.createElement("div");
        optionDiv.className = "custom-option";
        if (sheet === apiData.sheetName) optionDiv.classList.add("selected");
        optionDiv.innerText = sheet;
        optionDiv.onclick = function () {
          selectLedger(sheet, this);
        };
        ledgerOptionsContainer.appendChild(optionDiv);
      });
    }
  }

  if (!apiData.records || apiData.records.length === 0) return;
  const record = apiData.records[0];

  // 記憶資料列數
  currentRowNumber = record.row_number;

  // ★ 將 UserID 記憶在全域變數中，不顯示於畫面 ★
  currentUserId =
    record.USER_ID || record.UserID || record.userId || record.USERID || "";

  // 1. 金額與屬性
  let rawPrice = String(record.PRICE || "0");
  if (rawPrice.includes("-")) {
    setType("expense");
    rawPrice = rawPrice.replace("-", "");
  } else {
    setType("income");
  }
  document.getElementById("amount-text").innerText = rawPrice;
  document.getElementById("amount-input").value = rawPrice;

  // 2. 類型
  if (record.CATEGORY)
    document.getElementById("category-display-text").innerText =
      record.CATEGORY;

  // 3. 項目
  if (record.ITEM !== undefined)
    document.getElementById("item-input").value = record.ITEM;

  // 4. 備註
  if (record.DESCRIPTION !== undefined)
    document.getElementById("note-input").value = record.DESCRIPTION;

  // 5. 日期與時間處理
  if (record.TIMESTAMP) {
    const parts = record.TIMESTAMP.split(" ");
    const dateStr = parts[0];
    if (parts.length > 1) {
      originalTime = parts[1]; // 記憶原本的時分秒
    }

    const [y, m, d] = dateStr.split("-");
    selectedDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    document.getElementById("current-date-text").innerText =
      `${y}年${m}月${d}日`;
    document.getElementById("last-update-text").innerText =
      `最後更新 ${y}年${m}月${d}日`;

    const yearSelect = document.getElementById("cal-year");
    const monthSelect = document.getElementById("cal-month");
    if (yearSelect) yearSelect.value = parseInt(y);
    if (monthSelect) monthSelect.value = parseInt(m) - 1;
    renderCalendar();
  }
}

async function main() {
  try {
    await liff.init({ liffId });
    if (!liff.isLoggedIn()) {
      liff.login();
      return;
    }
    const profile = await liff.getProfile();

    // 讀取資料
    const res = await fetch(fetchApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: profile.userId, source: "liff-demo" }),
    });

    if (!res.ok) {
      console.log(`API 錯誤: ${res.status}`);
      return;
    }

    const data = await res.json();
    console.log("Fetched data:", data);
    populateData(data);
  } catch (err) {
    console.error("Initialization Error:", err);
  }
}

// --- ★ 更新與回傳 ★ ---
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
    action: "update",
    rowNumber: currentRowNumber,
    sheetName: sheetName,
    userId: currentUserId, // ★ 從背景變數讀取並回傳
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

// --- ★ 刪除與回傳 ★ ---
async function deleteEntry() {
  if (!currentRowNumber) {
    alert("無法獲取資料列號，請重新載入網頁！");
    return;
  }
  if (!confirm("確定要刪除這筆紀錄嗎？此動作無法復原。")) return;

  const btn = document.querySelector(".btn-delete");
  const originalText = btn.innerHTML;
  btn.innerText = "刪除中...";
  btn.disabled = true;

  const sheetName = document.getElementById("ledger-text").innerText;

  const payload = {
    action: "delete",
    rowNumber: currentRowNumber,
    sheetName: sheetName,
    userId: currentUserId, // ★ 從背景變數讀取並回傳
  };

  try {
    const response = await fetch(actionApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      btn.innerText = "已刪除！";
      document.querySelector(".app-container").style.opacity = "0.5";
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


