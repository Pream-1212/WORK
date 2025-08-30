(() => {
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
  // document.addEventListener("DOMContentLoaded", () => {
  //   const returnsBtn = document.getElementById("returnsBtn");
  //   returnsBtn.addEventListener("click", function (event) {
  //     event.preventDefault();
  //     showReturnsInfo();
  //   });
  // });

  const returnsButtons = document.querySelectorAll(".btn.btn-warning");
  returnsButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      showReturnsInfo();
    });
  });
})();
//Show returns info
function showReturnsInfo() {
  alert(
    "Returns allowed only after 14 days, with no damages and proper storage."
  );
}



// {
//   /* // Utility: Show alert messages */
// }
// function showAlert(message, type = "danger") {
//   document.getElementById("alertBox").innerHTML = `
//       <div class="alert alert-${type} alert-dismissible fade show" role="alert">
//         ${message}
//         <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//       </div>
//     `;
// }

// {
//   /* /* // Hardcoded credentials (demo purposes only) */
// }
// const users = [
//   {
//     role: "manager",
//     firstName: "Samson",
//     lastName: "Kakande",
//     email: "smn@gmail.com",
//     password: "sam5",
//   },
//   {
//     role: "supretendent",
//     firstName: "Mark",
//     lastName: " Okello",
//     email: "mko@gmail.com",
//     password: "mar5",
//   },
//   {
//     role: "Director",
//     firstName: "Lala",
//     lastName: "Remmy",
//     email: "lar@gmail.com",
//     password: "lar5",
//   },
//   {
//     role: "sponsor",
//     firstName: "Jane",
//     lastName: "Otto",
//     email: "otj@gmail.com",
//     password: "ott5",
//   },
// ];

// {
//   /* // Handle login form */
// }
// document
//   .getElementById("loginForm")
//   .addEventListener("submit", function (event) {
//     event.preventDefault();

//     // Collect input values
//     const firstName = document.getElementById("firstName").value.trim();
//     const lastName = document.getElementById("lastName").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const password = document.getElementById("password").value;
//     const role = document.getElementById("role").value;

//     // Validate inputs
//     if (!firstName || !lastName || !email || !password) {
//       showAlert("All fields are required!");
//       return;
//     }

//     const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
//     if (!emailRegex.test(email)) {
//       showAlert("Please enter a valid email address!");
//       return;
//     }

//     // Find user
//     const user = users.find(
//       (u) =>
//         u.firstName === firstName &&
//         u.lastName === lastName &&
//         u.email === email &&
//         u.password === password
//     );

//     if (user) {
//       showAlert(
//         `Welcome ${user.firstName}! Redirecting to your dashboard...`,
//         "success"
//       );

//       // Redirect based on role
//       setTimeout(() => {
//         if (user.role === "manager") {
//           window.location.href = "man.html"; // Manager dashboard
//         } else {
//           window.location.href = "dash.html"; // Attendant dashboard
//         }
//       }, 1500);
//     } else {
//       showAlert("Invalid credentials! Please try again.");
//     }
//   });

// // Form + table

//   const orderForm = document.getElementById("addOrderForm");
//   const orderTableBody = document.getElementById("ordersTableBody");

//   // const ordersTableBody = document.querySelector(".table.table-striped tbody");

//   let orders = JSON.parse(localStorage.getItem("orders")) || [];
//   orders.forEach((order) => {
//     const row = document.createElement("tr");
//     row.innerHTML = `
//     <th scope="row">${order.customer}</th>
//     <td>${order.product}</td>
//     <td>${order.quantity}</td>
//     <td>${order.price}</td>
//     <td>${order.Payment}</td>
//           `;
//     ordersTableBody.appendChild(row);
//   });

//   orderForm.addEventListener("submit", function (event) {
//     event.preventDefault(); // stop page reload

//     // Read values
//     const price = document.getElementById("price").value;
//     const orderCustomer = document.getElementById("orderCustomer").value;
//     const orderProduct = document.getElementById("orderProduct").value;
//     const orderQuantity = document.getElementById("orderQuantity").value;
//     const orderPayment = document.getElementById("orderPayment").value;

//     // Save array to localStorage
//     // localStorage.setItem("sales", JSON.stringify(#salesTable tbody));

//     // Basic validation (optional)
//     if (
//       !orderCustomer ||
//       !orderProduct ||
//       !orderQuantity ||
//       !price||
//       !orderPayment
//                 )
//                 {
//       alert("Please fill in all fields.");
//       return;
//     }

//     // Build row
//     const newRow = document.createElement("tr");
//     newRow.innerHTML = `
//             <th scope="row">${orderCustomer}</th>
//       <td>${orderProduct}</td>
//       <td>${orderQuantity}</td>
//       <td>${price}</td>
//       <td>${orderPayment}</td>
//           `;

//     // Append
//     ordersTableBody.appendChild(newRow);

//     // Save new sale to array and localStorage
//     orders.push({
//       orderCustomer,
//       orderProduct,
//      orderQuantity,
//       price,
//       orderPayment,
//     });
//     localStorage.setItem("orders", JSON.stringify(orders));

//     // Clear form
//     orderForm.reset();
//   });

// <!-- LOGIN SECTION -->
// Utility: Show alert messages
// function showAlert(message, type = "danger") {
//  const alertBox =  document.getElementById("alertBox").innerHTML = `
//     <div class="alert alert-${type} alert-dismissible fade show" role="alert">
//       ${message}
//       <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
//     </div>
//   `;
// }

// Run login section only when DOM is loaded
// document.addEventListener("DOMContentLoaded", () => {
//   const loginForm = document.getElementById("loginForm");
//   if (!loginForm) return; // guard if no login form on this page

// Handle login form
// document.getElementById("loginForm").addEventListener("submit", function(event) {
//   event.preventDefault();

// Collect values
// const firstName = document.getElementById("firstName").value.trim();
// const lastName = document.getElementById("lastName").value.trim();
// const email = document.getElementById("email").value.trim();
// const password = document.getElementById("password").value;

// Validation
// if (!firstName || !lastName || !email || !password) {
//   showAlert("All fields are required!");
//   return;
// }

// Email format check
// const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
// if (!emailRegex.test(email)) {
//   showAlert("Please enter a valid email address!");
//   return;
// }

// Password check
// if (password.length < 6) {
//   showAlert("Password must be at least 6 characters long!");
//   return;
// }

// Success
// showAlert("Login successful! Redirecting...", "success");

// Simulate login redirect
//   setTimeout(() => {
//     window.location.href = "dashboard.html";
//   }, 1500);
// });

// })();

// Inside your handleAddSale or equivalent function:

// const handleAddSale = () => {
//   const sale = {
//     customer: newSale.customer,
//     product: newSale.product,
//     quantity: parseInt(newSale.quantity),
//     price: parseFloat(newSale.price),
//     date: new Date().toLocaleDateString(),
//     payment: newSale.payment,
//     transport: newSale.transport, // true/false
//     agent: currentUser.name
//   };

//   // Compute total with optional transport surcharge
//   let total = sale.price * sale.quantity;
//   if (sale.transport) {
//     total += total * 0.05;
//   }
//   sale.total = total;

//   setSales([...sales, sale]);
//   setNewSale({}); // reset form

//   // Auto-generate receipt content
//   setReceipt(sale);

//   // Wait a moment, then auto-print
//   setTimeout(() => {
//     window.print();
//   }, 500);
// };

// const [receipt, setReceipt] = React.useState(null);

// const handleAddSale = () => {
//   const sale = {
//     customer: newSale.customer,
//     product: newSale.product,
//     quantity: parseInt(newSale.quantity),
//     price: parseFloat(newSale.price),
//     date: new Date().toLocaleDateString(),
//     payment: newSale.payment,
//     transport: newSale.transport,
//     agent: currentUser.name,
//   };

//   let total = sale.price * sale.quantity;
//   if (sale.transport) {
//     total += total * 0.05;
//   }
//   sale.total = total;

//   setSales([...sales, sale]);
//   setNewSale({});
//   setReceipt(sale);

//   // trigger print automatically
//   setTimeout(() => window.print(), 500);
// };

// // Sales Trend Data
// let salesData = [
//   { month: "Jan", sales: 1200 },
//   { month: "Feb", sales: 1500 },
//   { month: "Mar", sales: 1800 },
//   { month: "Apr", sales: 2200 }
// ];

// // Product Distribution Data
// let productData = [
//   { name: "Timber", value: 400 },
//   { name: "Poles", value: 200 },
//   { name: "Sofas", value: 300 }
// ];

// // Initialize Sales Chart
// const salesCtx = document.getElementById("salesChart").getContext("2d");
// let salesChart = new Chart(salesCtx, {
//   type: "line",
//   data: {
//     labels: salesData.map(d => d.month),
//     datasets: [{
//       label: "Sales (UGX)",
//       data: salesData.map(d => d.sales),
//       borderColor: "blue",
//       fill: false,
//       tension: 0.2
//     }]
//   }
// });

// // Initialize Product Chart
// const productCtx = document.getElementById("productChart").getContext("2d");
// let productChart = new Chart(productCtx, {
//   type: "pie",
//   data: {
//     labels: productData.map(d => d.name),
//     datasets: [{
//       data: productData.map(d => d.value),
//       backgroundColor: ["#4CAF50", "#FFC107", "#FF5722"]
//     }]
//   }
// });

// // Helper to open modal
// function openEditChart(chartType) {
//   const modalBody = document.getElementById("modalBody");
//   modalBody.innerHTML = ""; // clear previous inputs

//   let dataArray = chartType === "sales" ? salesData : productData;

//   dataArray.forEach((item, index) => {
//     const div = document.createElement("div");
//     div.classList.add("mb-2");
//     const label = document.createElement("label");
//     label.textContent = chartType === "sales" ? item.month : item.name;
//     label.classList.add("form-label");
//     const input = document.createElement("input");
//     input.type = "number";
//     input.value = chartType === "sales" ? item.sales : item.value;
//     input.classList.add("form-control");
//     input.dataset.index = index;
//     div.appendChild(label);
//     div.appendChild(input);
//     modalBody.appendChild(div);
//   });

//   document.getElementById("saveChartEdit").onclick = () => {
//     const inputs = modalBody.querySelectorAll("input");
//     inputs.forEach(input => {
//       const i = input.dataset.index;
//       if (chartType === "sales") {
//         salesData[i].sales = Number(input.value);
//       } else {
//         productData[i].value = Number(input.value);
//       }
//     });

//     // Update charts
//     salesChart.data.datasets[0].data = salesData.map(d => d.sales);
//     salesChart.update();

//     productChart.data.datasets[0].data = productData.map(d => d.value);
//     productChart.update();

//     bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
//   };

//   new bootstrap.Modal(document.getElementById("editModal")).show();
// }

// // Attach buttons
// document.getElementById("editSalesBtn").addEventListener("click", () => openEditChart("sales"));
// document.getElementById("editProductBtn").addEventListener("click", () => openEditChart("product"));

// document.addEventListener("DOMContentLoaded", function () {
//   const stockList = document.getElementById("stockList");
//   let currentItem = null;

//   // Add click event to each edit button
//   stockList.querySelectorAll(".edit-btn").forEach((btn) => {
//     btn.addEventListener("click", function () {
//       currentItem = this.parentElement; // the <li>
//       const text = currentItem.textContent.replace("Edit", "").trim();
//       document.getElementById("editInput").value = text;

//       // Show modal
//       new bootstrap.Modal(document.getElementById("editModal")).show();
//     });
//   });

//   // Save changes
//   document.getElementById("saveEditBtn").addEventListener("click", function () {
//     const newValue = document.getElementById("editInput").value.trim();
//     if (newValue && currentItem) {
//       currentItem.innerHTML = `${newValue} <button class="btn btn-sm btn-warning float-end edit-btn">Edit</button>`;

//       // Reattach event listener to the new button
//       currentItem
//         .querySelector(".edit-btn")
//         .addEventListener("click", function () {
//           currentItem = this.parentElement;
//           document.getElementById("editInput").value = currentItem.textContent
//             .replace("Edit", "")
//             .trim();
//           new bootstrap.Modal(document.getElementById("editModal")).show();
//         });
//     }
//     bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
//   });
// });

// document.addEventListener("DOMContentLoaded", () => {
//   const stockList = document.getElementById("stockList");
//   let currentItem = null;

//   // Event delegation: handle all future edit buttons
//   stockList.addEventListener("click", (e) => {
//     if (e.target && e.target.classList.contains("edit-btn")) {
//       currentItem = e.target.parentElement;
//       const text = currentItem.textContent.replace("Edit", "").trim();
//       document.getElementById("editInput").value = text;

//       // Show modal
//       new bootstrap.Modal(document.getElementById("editModal")).show();
//     }
//   });

//   document.getElementById("saveEditBtn").addEventListener("click", () => {
//     const newValue = document.getElementById("editInput").value.trim();
//     if (newValue && currentItem) {
//       currentItem.innerHTML = `${newValue} <button class="btn btn-sm btn-warning float-end edit-btn">Edit</button>`;
//       currentItem = null;
//     }
//     bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
//   });
// });

//my clickable cards in the manager's page
document.querySelectorAll(".clickable-card").forEach((card) => {
  card.addEventListener("click", function (e) {
    if (!e.target.classList.contains("edit-btn")) {
      window.location.href = card.dataset.href;
    }
  });
});
