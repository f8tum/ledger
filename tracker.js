// toggle income and expense buttons
const typeBtns = document.querySelectorAll(".type-btn");

typeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    typeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ---------- Helper Functions ----------

// render transaction history
const renderTransaction = (transaction) => {
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
        ${transaction.type === "income" ? "+" : "-"}₹${transaction.amount}
      </p>
      <p class="delete-transaction">
        <i class="fa-solid fa-xmark"></i> delete
      </p>
    </div>
  `;

  // delete transaction
  card.transaction = transaction;

  card.querySelector(".delete-transaction").addEventListener("click", () => {
    const index = transactions.indexOf(card.transaction);
    transactions.splice(index, 1);
    card.remove();
    updateFinancials();
  });

  document.querySelector(".history").appendChild(card);
};  

// Transactions array
const transactions = [];

// update financials
const updateFinancials = () => {
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
const updateCharts = () => {
  // Get this week's transactions
  const today = new Date();
  const daysFromMonday = (today.getDay() + 6) % 7;
  
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysFromMonday);
  monday.setHours(0, 0, 0, 0);
  
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);

  const weekTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= monday && transactionDate <= sunday;
  });

  // Group transactions by day
  const days = [
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
    { income: 0, expense: 0 },
  ];

  weekTransactions.forEach(t => {
    const dayIndex = (new Date(t.date).getDay() + 6) % 7;
    if (t.type === "income") {
      days[dayIndex].income += t.amount;
    } else {
      days[dayIndex].expense += t.amount;
    }
  });

  // Find max value for scaling
  const maxValue = Math.max(...days.map(d => Math.max(d.income, d.expense)));

  // Update bar heights
  const maxHeight = 100;
  const dayEls = document.querySelectorAll(".day");

  days.forEach((day, i) => {
    const incomeBar = dayEls[i].querySelector(".bar-income");
    const expenseBar = dayEls[i].querySelector(".bar-expense");

    incomeBar.style.height = maxValue ? `${Math.max((day.income / maxValue) * maxHeight, 1)}px` : "1px";
    expenseBar.style.height = maxValue ? `${Math.max((day.expense / maxValue) * maxHeight, 1)}px` : "1px";
  });
};

// take form data into an object
const form = document.getElementById("entry-form");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent page reload

  const transaction = {
    type: document.querySelector(".type-btn.active").id === "incomeBtn" ? "income" : "expense",
    description: document.getElementById("description").value,
    amount: parseFloat(document.getElementById("amount").value),
    date: document.getElementById("date").value,
    category: document.getElementById("category").value,
  };
  console.log(transaction);

  transactions.push(transaction);

  renderTransaction(transaction);
  updateFinancials();
  updateCharts();

  // form.reset();
}); 