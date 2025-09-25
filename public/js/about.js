

// Save Stock
document.getElementById("stockForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const stockItem = {
    product: document.getElementById("productName").value,
    type: document.getElementById("productType").value,
    cost: document.getElementById("costPrice").value,
    price: document.getElementById("sellPrice").value,
    quantity: document.getElementById("quantity").value,
    supplier: document.getElementById("supplierName").value,
    quality: document.getElementById("quality").value,
    color: document.getElementById("color").value,
    measurements: document.getElementById("measurements").value,
    date: new Date().toLocaleDateString(),
  };
  let stock = JSON.parse(localStorage.getItem("stock")) || [];
  stock.push(stockItem);
  localStorage.setItem("stock", JSON.stringify(stock));
  alert("Stock Added!");
  this.reset();
});
