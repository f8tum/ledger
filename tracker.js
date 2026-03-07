// Delete transaction on clicking the delete button
const deleteBtns = document.querySelectorAll(".delete-transaction");

deleteBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".history-card").remove();
  });
});

