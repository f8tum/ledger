// toggle income and expense buttons
const typeBtns = document.querySelectorAll(".type-btn");

typeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    typeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// ---------- Helper Functions ----------

// update financials
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
  card.querySelector(".delete-transaction").addEventListener("click", () => {
    card.remove();
  });

  document.querySelector(".history").appendChild(card);
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

  renderTransaction(transaction);

  form.reset();
}); 