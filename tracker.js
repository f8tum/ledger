// Delete transaction on clicking the delete button
const deleteBtns = document.querySelectorAll(".delete-transaction");

deleteBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".history-card").remove();
  });
});

// toggle income and expense buttons
const typeBtns = document.querySelectorAll(".type-btn");

typeBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    typeBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
  });
});