// toggle income and expense buttons
const typeBtns = document.querySelectorAll(".type-btn");

typeBtns.forEach(btn =>
{
    btn.addEventListener("click", () =>
    {
        typeBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    });
});

// ---------- Helper Functions ----------

// Transactions array
const transactions = [];

// save to localStorage
const saveTransactions = () =>
{
    localStorage.setItem("transactions", JSON.stringify(transactions));
};

// update empty state visibility
const updateEmptyState = () =>
{
    const history = document.querySelector(".history");
    const emptyState = history.querySelector(".empty-state");

    if (transactions.length === 0)
    {
        emptyState.style.display = "block";
    }
    else
    {
        emptyState.style.display = "none";
    }
};

// render transaction history
const renderTransaction = (transaction) =>
{
    const card = document.createElement("div");
    card.classList.add("history-card");

    card.innerHTML = `
    <div class="history-left">
      <div class="history-left-icon">
        <i class="fa-solid fa-circle ${transaction.type}"></i>
      </div>
      <div class="history-left-text">
        <p class="description">${transaction.description}</p>
        <p class="category">${transaction.category} • ${transaction.date}</p>
      </div>
    </div>
    <div class="history-right">
      <p class="money ${transaction.type}">
        ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount.toFixed(2)}
      </p>
      <p class="delete-transaction">
        <i class="fa-solid fa-xmark"></i> delete
      </p>
    </div>
  `;

    card.transaction = transaction;

    card.querySelector(".delete-transaction").addEventListener("click", () =>
    {
        const index = transactions.indexOf(card.transaction);

        if (index > -1)
        {
            transactions.splice(index, 1);
            card.remove();
            updateFinancials();
            updateCharts();
            saveTransactions();
            updateEmptyState();
        }
    });

    document.querySelector(".history").appendChild(card);
    updateEmptyState();
};

// update financials
const updateFinancials = () =>
{
    const totalIncome = transactions
        .filter(t => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    document.querySelector("#balance h3").textContent = `₹${netBalance.toFixed(2)}`;
    document.querySelector("#income h3").textContent = `₹${totalIncome.toFixed(2)}`;
    document.querySelector("#expenses h3").textContent = `₹${totalExpenses.toFixed(2)}`;
};

// update charts
const updateCharts = () =>
{
    const today = new Date();
    const daysFromMonday = (today.getDay() + 6) % 7;

    const monday = new Date(today);
    monday.setDate(today.getDate() - daysFromMonday);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const weekTransactions = transactions.filter(t =>
    {
        const transactionDate = new Date(t.date + "T00:00");
        return transactionDate >= monday && transactionDate <= sunday;
    });

    const days = [
        { income: 0, expense: 0 },
        { income: 0, expense: 0 },
        { income: 0, expense: 0 },
        { income: 0, expense: 0 },
        { income: 0, expense: 0 },
        { income: 0, expense: 0 },
        { income: 0, expense: 0 },
    ];

    weekTransactions.forEach(t =>
    {
        const dayIndex = (new Date(t.date + "T00:00").getDay() + 6) % 7;

        if (t.type === "income")
        {
            days[dayIndex].income += t.amount;
        }
        else
        {
            days[dayIndex].expense += t.amount;
        }
    });

    const maxValue = Math.max(...days.map(d => Math.max(d.income, d.expense)));
    const maxHeight = 100;
    const dayEls = document.querySelectorAll(".day");

    days.forEach((day, i) =>
    {
        const incomeBar = dayEls[i].querySelector(".bar-income");
        const expenseBar = dayEls[i].querySelector(".bar-expense");

        incomeBar.style.height = maxValue ? `${Math.max((day.income / maxValue) * maxHeight, 1)}px` : "1px";
        expenseBar.style.height = maxValue ? `${Math.max((day.expense / maxValue) * maxHeight, 1)}px` : "1px";
    });
};

// load from localStorage
const loadTransactions = () =>
{
    const saved = localStorage.getItem("transactions");

    if (saved)
    {
        const parsed = JSON.parse(saved);

        parsed.forEach(t =>
        {
            // ensure amount is number
            t.amount = parseFloat(t.amount);
            transactions.push(t);
            renderTransaction(t);
        });

        updateFinancials();
        updateCharts();
        updateEmptyState();
    }
};

// take form data into an object
const form = document.getElementById("entry-form");

form.addEventListener("submit", (e) =>
{
    e.preventDefault();

    const activeBtn = document.querySelector(".type-btn.active");
    const type = activeBtn && activeBtn.id === "incomeBtn" ? "income" : "expense";

    const description = document.getElementById("description").value.trim();
    const amountInput = parseFloat(document.getElementById("amount").value);
    const amount = isNaN(amountInput) || amountInput < 0 ? 0 : amountInput;
    const date = document.getElementById("date").value;
    const category = document.getElementById("category").value;

    const transaction = { type, description, amount, date, category };

    transactions.push(transaction);
    renderTransaction(transaction);
    updateFinancials();
    updateCharts();
    saveTransactions();

    form.reset();
});

// load saved transactions on page load
loadTransactions();