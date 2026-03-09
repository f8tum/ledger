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

// update financials
const transactions = [];
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

// update 

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
  updateCharts(transaction);

  // form.reset();
}); 