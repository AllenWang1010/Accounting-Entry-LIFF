const liffId = "2008940948-79xDumdY"; // 在 LINE Developers 拿到後貼進來
const apiUrl =
  "https://dalene-phylar-ruttily.ngrok-free.dev/webhook/Entry-Edit";

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
  event.stopPropagation();
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
let selectedDate = new Date(2025, 10, 9);

document.addEventListener("DOMContentLoaded", () => {
  initCalendarSelects();
  renderCalendar();
  renderCategories();
  document.getElementById("category-display-text").innerText =
    expenseCategories[8];
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
  document.getElementById("category-display-text").innerText = "請選擇類別";
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
  const currentYear = selectedDate.getFullYear();
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

function updateEntry() {
  const btn = document.querySelector(".btn-update");
  const originalText = btn.innerText;
  btn.innerText = "更新中...";
  setTimeout(() => {
    btn.innerText = "更新成功！";
    setTimeout(() => {
      btn.innerText = originalText;
    }, 1000);
  }, 500);
}

function deleteEntry() {
  if (confirm("確定要刪除這筆紀錄嗎？")) {
    document.querySelector(".app-container").style.opacity = "0.5";
    alert("已刪除");
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

    // 取得使用者資訊（之後也可以把 userId 傳給 n8n 用來做個人化查詢）
    const profile = await liff.getProfile();

    // 呼叫 n8n 的報表 API

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // 可以先傳一些基本資訊過去，之後要區分 user 時會用到
        userId: profile.userId,
        source: "liff-demo",
      }),
    });

    if (!res.ok) {
      console.log(`n8n API error: ${res.status} ${res.statusText}`);
      return;
    }
    data = await res.json();
    // records = data.records; // 假設 API 回傳的 JSON 裡有個 records 陣列
    console.log("Fetched data:", data);
  } catch (err) {
    console.error(err);
  }
}

main();
// loadData();

