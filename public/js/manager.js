// --------------------------
// Charts Initialization
// --------------------------

// Sales Trend (Line Chart)
const salesChart = new Chart(document.getElementById("salesChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "Sales (UGX)",
        data: [],
        borderColor: "blue",
        backgroundColor: "lightblue",
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
  },
});

// Revenue Per Product (Bar Chart)
const revenueChart = new Chart(document.getElementById("revenueChart"), {
  type: "bar",
  data: {
    labels: ["Timber", "Poles", "Sofas", "Beds", "Tables", "Cupboards"],
    datasets: [
      {
        label: "Revenue (UGX)",
        data: [],
        backgroundColor: "#17a2b8",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: { legend: { display: true } },
  },
});

// --------------------------
// Orders Handling
// --------------------------
const orderForm = document.getElementById("addOrderForm");
const ordersTableBody = document.querySelector("#salesOrders tbody");

// Load existing orders from localStorage
let orders = JSON.parse(localStorage.getItem("orders")) || [];

// Render existing orders
orders.forEach((order) => appendOrderRow(order));

// Update charts on page load
updateCharts();

// --------------------------
// Form Submission
// --------------------------
orderForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Read form values
  const orderDate = document.getElementById("orderDate").value;
  const customer = document.getElementById("customer").value;
  const product = document.getElementById("product").value;
  const quantity = parseInt(document.getElementById("quantity").value);
  const price = parseFloat(document.getElementById("price").value);
  const payment = document.getElementById("payment").value;

  if (!orderDate || !customer || !product || !quantity || !price || !payment) {
    alert("Please fill in all fields.");
    return;
  }

  const newOrder = { orderDate, customer, product, quantity, price, payment };

  // Add to orders array & localStorage
  orders.push(newOrder);
  localStorage.setItem("orders", JSON.stringify(orders));

  // Add to table
  appendOrderRow(newOrder);

  // Update charts
  updateCharts();

  // Reset form
  orderForm.reset();
});

// --------------------------
// Helper Functions
// --------------------------
function appendOrderRow(order) {
  const row = document.createElement("tr");
  row.innerHTML = `
      <th scope="row">${order.orderDate}</th>
      <td>${order.customer}</td>
      <td>${order.product}</td>
      <td>${order.quantity}</td>
      <td>${order.price}</td>
      <td>${order.payment}</td>
  `;
  ordersTableBody.appendChild(row);
}

// --------------------------
// Update Charts Function
// --------------------------
function updateCharts() {
  // Sales Trend
  const dates = orders.map((o) => o.orderDate);
  const totals = orders.map((o) => o.quantity * o.price);
  salesChart.data.labels = dates;
  salesChart.data.datasets[0].data = totals;
  salesChart.update();

  // Revenue per Product
  const productLabels = revenueChart.data.labels;
  const revenuePerProduct = productLabels.map((p) =>
    orders
      .filter((o) => o.product === p)
      .reduce((sum, o) => sum + o.quantity * o.price, 0)
  );
  revenueChart.data.datasets[0].data = revenuePerProduct;
  revenueChart.update();
}
