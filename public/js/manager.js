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
});

// Product Distribution (Pie Chart)
const productChart = new Chart(document.getElementById("productChart"), {
  type: "pie",
  data: {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          "#007bff",
          "#28a745",
          "#ffc107",
          "#dc3545",
          "#17a2b8",
          "#6f42c1",
        ],
      },
    ],
  },
});

// Revenue Per Product (Bar Chart)
const revenueChart = new Chart(document.getElementById("revenueChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Revenue (UGX)",
        data: [],
        backgroundColor: "#17a2b8",
      },
    ],
  },
});

// Product Margins (Bar Chart)
new Chart(document.getElementById("marginChart"), {
  type: "bar",
  data: {
    labels: [],
    datasets: [
      {
        label: "Profit Margin (%)",
        data: [],
        backgroundColor: "#28a745",
      },
    ],
  },
});

// Form + table

const orderForm = document.getElementById("addOrderForm");

const ordersTableBody = document.querySelector("#ordersTable tbody");

let orders = JSON.parse(localStorage.getItem("orders")) || [];
orders.forEach((order) => {
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
});

orderForm.addEventListener("submit", function (event) {
  event.preventDefault(); // stop page reload

  // Read values
  const orderDate = document.getElementById("orderDate").value;
  const customer = document.getElementById("customer").value;
  const product = document.getElementById("product").value;
  const quantity = document.getElementById("quantity").value;
  const price = document.getElementById("price").value;
  const payment = document.getElementById("payment").value;

  // Save array to localStorage
  // localStorage.setItem("sales", JSON.stringify(#salesTable tbody));

  // Basic validation (optional)
  if (!orderDate || !customer || !product || !quantity || !price || !payment) {
    alert("Please fill in all fields.");
    return;
  }

  // Build row
  const newRow = document.createElement("tr");
  newRow.innerHTML = `
      <th scope="row">${orderDate}</th>
      <td>${customer}</td>
      <td>${product}</td>
      <td>${quantity}</td>
      <td>${price}</td>
      <td>${payment}</td>
      
    `;

  // Append
  ordersTableBody.appendChild(newRow);

  // Save new sale to array and localStorage
  orders.push({
    orderDate,
    customer,
    product,
    quantity,
    price,
    payment,
  });
  localStorage.setItem("orders", JSON.stringify(orders));

  // Clear form
  orderForm.reset();
});

function updateCharts() {
  // Sales Trend (by date)
  const dates = orders.map((o) => o.orderDate);
  const totals = orders.map((o) => o.quantity * o.price);

  salesChart.data.labels = dates;
  salesChart.data.datasets[0].data = totals;
  salesChart.update();

  // Product Distribution & Revenue per Product
  const products = ["Timber", "Poles", "Sofas", "Beds", "Tables", "Cupboards"];
  const productCounts = products.map(
    (p) => orders.filter((o) => o.product === p).length
  );
  const revenuePerProduct = products.map((p) =>
    orders
      .filter((o) => o.product === p)
      .reduce((sum, o) => sum + o.quantity * o.price, 0)
  );

  productChart.data.datasets[0].data = productCounts;
  productChart.update();

  revenueChart.data.datasets[0].data = revenuePerProduct;
  revenueChart.update();

  // Product Margins (dummy formula: profit margin = revenue / 100000)
  marginChart.data.datasets[0].data = revenuePerProduct.map((rev) =>
    rev > 0 ? Math.round((rev / 100000) % 100) : 0
  );
  marginChart.update();
}
