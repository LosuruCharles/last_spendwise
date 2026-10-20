/* ==========================================================
   SpendWise – script.js
   Flow: user action (event) -> update data (array) ->
         render() -> DOM shows the new state
   ========================================================== */

// ---------- DATA ----------
// An array of objects: each object is one expense record.
let expenses = [];
let monthlyBudget = 0;
let nextId = 1;

const CATEGORIES = ["Food", "Transport", "Bills", "Education", "Fun", "Other"];
const BIG_EXPENSE_LIMIT = 5000; // expenses at or above this are highlighted

// ---------- DOM REFERENCES ----------
const budgetForm = document.getElementById("budget-form");
const budgetInput = document.getElementById("budget-input");
const budgetError = document.getElementById("budget-error");

const expenseForm = document.getElementById("expense-form");
const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const expenseError = document.getElementById("expense-error");

const budgetDisplay = document.getElementById("budget-display");
const spentDisplay = document.getElementById("spent-display");
const remainingDisplay = document.getElementById("remaining-display");
const progressBar = document.getElementById("progress-bar");
const progressFill = document.getElementById("progress-fill");
const statusMessage = document.getElementById("status-message");

const categoryList = document.getElementById("category-list");
const expenseList = document.getElementById("expense-list");
const filterSelect = document.getElementById("filter");
const clearAllButton = document.getElementById("clear-all");

// ---------- STORAGE (keeps data after a page refresh) ----------
function saveData() {
  try {
    localStorage.setItem("spendwise", JSON.stringify({ expenses, monthlyBudget, nextId }));
  } catch (err) {
    // Storage can be blocked; the app still works for this session.
  }
}

function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem("spendwise"));
    if (saved) {
      expenses = Array.isArray(saved.expenses) ? saved.expenses : [];
      monthlyBudget = Number(saved.monthlyBudget) || 0;
      nextId = Number(saved.nextId) || expenses.length + 1;
    }
  } catch (err) {
    expenses = [];
  }
}

// ---------- HELPERS ----------
function formatMoney(amount) {
  return "KES " + amount.toLocaleString("en-KE");
}

// LOOP: add up every expense in the array
function getTotalSpent() {
  let total = 0;
  for (let i = 0; i < expenses.length; i++) {
    total += expenses[i].amount;
  }
  return total;
}

// LOOP: build a total for each category
function getCategoryTotals() {
  const totals = {};
  for (const name of CATEGORIES) {
    totals[name] = 0;
  }
  for (const expense of expenses) {
    totals[expense.category] += expense.amount;
  }
  return totals;
}

// CONDITIONALS: decide what feedback the user should see
function getBudgetStatus(spent, budget) {
  if (budget <= 0) {
    return { level: "empty", percent: 0, text: "Set a monthly budget to get started." };
  }

  const percent = Math.round((spent / budget) * 100);

  if (spent === 0) {
    return { level: "good", percent, text: "No spending yet. Your full budget is available." };
  } else if (spent > budget) {
    return {
      level: "bad",
      percent,
      text: "Over budget by " + formatMoney(spent - budget) + ". Cut back on non-essentials."
    };
  } else if (percent === 100) {
    return { level: "bad", percent, text: "You have used your whole budget." };
  } else if (percent >= 80) {
    return { level: "warn", percent, text: "Careful: you have used " + percent + "% of your budget." };
  } else if (percent >= 50) {
    return { level: "warn", percent, text: "You are past halfway (" + percent + "% used). Keep an eye on it." };
  } else {
    return { level: "good", percent, text: "On track: only " + percent + "% of your budget used." };
  }
}

// ---------- RENDER (DOM updates) ----------
function renderDashboard() {
  const spent = getTotalSpent();
  const remaining = monthlyBudget - spent;
  const status = getBudgetStatus(spent, monthlyBudget);

  budgetDisplay.textContent = formatMoney(monthlyBudget);
  spentDisplay.textContent = formatMoney(spent);
  remainingDisplay.textContent = formatMoney(remaining);
  remainingDisplay.style.color = remaining < 0 ? "var(--bad)" : "inherit";

  const width = Math.min(status.percent, 100);
  progressFill.style.width = width + "%";
  progressBar.setAttribute("aria-valuenow", width);

  if (status.level === "bad") {
    progressFill.style.backgroundColor = "var(--bad)";
  } else if (status.level === "warn") {
    progressFill.style.backgroundColor = "var(--warn)";
  } else {
    progressFill.style.backgroundColor = "var(--good)";
  }

  statusMessage.textContent = status.text;
  statusMessage.className = "status status-" + status.level;
}

function renderCategories() {
  const totals = getCategoryTotals();
  let topCategory = null;
  let topAmount = 0;

  // LOOP: find which category has the highest spending
  for (const name of CATEGORIES) {
    if (totals[name] > topAmount) {
      topAmount = totals[name];
      topCategory = name;
    }
  }

  categoryList.innerHTML = "";
  for (const name of CATEGORIES) {
    const li = document.createElement("li");
    if (name === topCategory) {
      li.className = "top";
    }
    const label = document.createElement("span");
    label.textContent = name === topCategory ? name + " (highest)" : name;
    const value = document.createElement("span");
    value.textContent = formatMoney(totals[name]);
    li.append(label, value);
    categoryList.appendChild(li);
  }
}

function renderExpenses() {
  const filter = filterSelect.value;
  expenseList.innerHTML = "";

  let shown = 0;
  // LOOP: newest first, skipping records that don't match the filter
  for (let i = expenses.length - 1; i >= 0; i--) {
    const expense = expenses[i];
    if (filter !== "All" && expense.category !== filter) {
      continue;
    }
    shown++;

    const li = document.createElement("li");

    const info = document.createElement("span");
    info.className = "name";
    info.textContent = expense.description;
    const meta = document.createElement("span");
    meta.className = "meta";
    meta.textContent = expense.category + " · " + expense.date;
    info.appendChild(meta);

    const amount = document.createElement("span");
    amount.className = "amount" + (expense.amount >= BIG_EXPENSE_LIMIT ? " big" : "");
    amount.textContent = formatMoney(expense.amount);

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "Delete";
    del.dataset.id = expense.id;
    del.setAttribute("aria-label", "Delete " + expense.description);

    li.append(info, amount, del);
    expenseList.appendChild(li);
  }

  if (shown === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = expenses.length === 0
      ? "No expenses yet. Add your first one using the form."
      : "No expenses in this category.";
    expenseList.appendChild(empty);
  }
}

function render() {
  renderDashboard();
  renderCategories();
  renderExpenses();
}

// ---------- EVENTS ----------
// Save the monthly budget
budgetForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const value = Number(budgetInput.value);

  if (budgetInput.value === "" || isNaN(value) || value <= 0) {
    budgetError.textContent = "Enter a budget greater than 0.";
    return;
  }

  budgetError.textContent = "";
  monthlyBudget = value;
  budgetInput.value = "";
  saveData();
  render();
});

// Add an expense
expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = Number(amountInput.value);

  // Validation with conditionals
  if (description === "") {
    expenseError.textContent = "Describe what the expense was for.";
    return;
  }
  if (amountInput.value === "" || isNaN(amount) || amount <= 0) {
    expenseError.textContent = "Enter an amount greater than 0.";
    return;
  }

  expenseError.textContent = "";

  expenses.push({
    id: nextId++,
    description: description,
    amount: amount,
    category: categoryInput.value,
    date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short" })
  });

  expenseForm.reset();
  descriptionInput.focus();
  saveData();
  render();
});

// Delete one expense (one listener on the list handles every Delete button)
expenseList.addEventListener("click", function (event) {
  const button = event.target.closest("button[data-id]");
  if (!button) {
    return;
  }
  const id = Number(button.dataset.id);
  expenses = expenses.filter(function (expense) {
    return expense.id !== id;
  });
  saveData();
  render();
});

// Filter by category
filterSelect.addEventListener("change", renderExpenses);

// Clear everything
clearAllButton.addEventListener("click", function () {
  if (expenses.length === 0) {
    return;
  }
  if (confirm("Delete all expenses? This cannot be undone.")) {
    expenses = [];
    saveData();
    render();
  }
});

// ---------- START ----------
loadData();
render();