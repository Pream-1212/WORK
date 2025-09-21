// (() => {
//   // Optional arrow button (guarded so it won't crash if missing)
const arrowBtn = document.getElementById("arrowBtn");
if (arrowBtn) {
  arrowBtn.addEventListener("click", function (event) {
    event.preventDefault();
    alert("Taking you to the Login page...");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1000);
  });
}

// Form + table

const saleForm = document.getElementById("addSaleForm");

const salesTableBody = document.querySelector("#salesTable tbody");

let sales = JSON.parse(localStorage.getItem("sales")) || [];
sales.forEach((sale) => {
  const row = document.createElement("tr");
  row.innerHTML = `
    <th scope="row">${sale.saleDate}</th>
    <td>${sale.customer}</td>
    <td>${sale.product}</td>
    <td>${sale.quantity}</td>
    <td>${sale.payment}</td>
    <td>${sale.agent}</td>
    <td>${sale.delivery}</td>
  `;
  salesTableBody.appendChild(row);
});

saleForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop page reload

  // Read values
  const saleDate = document.getElementById("saleDate").value;
  const customer = document.getElementById("customer").value;
  const product = document.getElementById("product").value;
  const quantity = document.getElementById("quantity").value;
  const payment = document.getElementById("payment").value;
  const agent = document.getElementById("agent").value;
  const delivery = document.getElementById("delivery").value;

  // Save array to localStorage
  // localStorage.setItem("sales", JSON.stringify(#salesTable tbody));

  // Basic validation (optional)
  if (
    !saleDate ||
    !customer ||
    !product ||
    !quantity ||
    !payment ||
    !agent ||
    !delivery
  ) {
    alert("Please fill in all fields.");
    return;
  }

  // Build row
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <th scope="row">${saleDate}</th>
      <td>${customer}</td>
      <td>${product}</td>
      <td>${quantity}</td>
      <td>${payment}</td>
      <td>${agent}</td>
      <td>${delivery}</td>
    `;

  // Append
  salesTableBody.appendChild(newRow);

  // Save new sale to array and localStorage
  sales.push({
    saleDate,
    customer,
    product,
    quantity,
    payment,
    agent,
    delivery,
  });
  localStorage.setItem("sales", JSON.stringify(sales));

  // Clear form
  saleForm.reset();
});


const returnsBtn = document.querySelectorAll(".btn.btn-warning");
returnsBtn.forEach((button) => {
  button.addEventListener("click", function (event) {
    event.preventDefault();
    showReturnsInfo();
  });
});
// })();
//Show returns info
function showReturnsInfo() {
  alert(
    "Returns allowed only after 14 days, with no damages and proper storage."
  );
}

