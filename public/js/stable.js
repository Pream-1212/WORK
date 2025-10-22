// Get form and inputs
const saleForm = document.getElementById("addSaleForm");

const dateInput = document.getElementById("date");
const nameInput = document.getElementById("name");
const productNameInput = document.getElementById("productName");
const productTypeInput = document.getElementById("productType");
const quantityInput = document.getElementById("quantity");
const unitPriceInput = document.getElementById("unitPrice");
const paymentInput = document.getElementById("payment");
const transportOptionInput = document.getElementById("transportOption");
const transportChargeInput = document.getElementById("transportCharge");
const totalPriceInput = document.getElementById("totalPrice");
const delivery1 = document.getElementById("delivery1");
const delivery2 = document.getElementById("delivery2");
const delivery3 = document.getElementById("delivery3");

// Error/success handlers
const setError = (el, msg) => {
  const inputControl = el.closest(".mb-3");
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = msg;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (el) => {
  const inputControl = el.closest(".mb-3");
  const errorDisplay = inputControl.querySelector(".error");
  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

// Validate inputs
const validateInputs = () => {
  let isValid = true;

  if (!dateInput.value.trim()) {
    setError(dateInput, "Date is required");
    isValid = false;
  } else setSuccess(dateInput);

  if (!nameInput.value.trim()) {
    setError(nameInput, "Customer name required");
    isValid = false;
  } else setSuccess(nameInput);

  if (!productNameInput.value.trim()) {
    setError(productNameInput, "Select a product");
    isValid = false;
  } else setSuccess(productNameInput);

  if (!productTypeInput.value.trim()) {
    setError(productTypeInput, "Select product type");
    isValid = false;
  } else setSuccess(productTypeInput);

  if (!quantityInput.value.trim() || Number(quantityInput.value) <= 0) {
    setError(quantityInput, "Enter quantity");
    isValid = false;
  } else setSuccess(quantityInput);

  if (!unitPriceInput.value.trim() || Number(unitPriceInput.value) <= 0) {
    setError(unitPriceInput, "Enter unit price");
    isValid = false;
  } else setSuccess(unitPriceInput);

  if (!paymentInput.value.trim()) {
    setError(paymentInput, "Select payment type");
    isValid = false;
  } else setSuccess(paymentInput);

  if (!transportOptionInput.value.trim()) {
    setError(transportOptionInput, "Select transport option");
    isValid = false;
  } else setSuccess(transportOptionInput);

  const deliveryChecked =
    delivery1.checked || delivery2.checked || delivery3.checked;
  if (!deliveryChecked) {
    setError(delivery3, "Choose delivery time");
    isValid = false;
  } else setSuccess(delivery3);

  return isValid;
};

// Calculate totals
function calculateTotal() {
  const qty = parseFloat(quantityInput.value) || 0;
  const price = parseFloat(unitPriceInput.value) || 0;
  let total = qty * price;
  let transport = 0;

  if (transportOptionInput.value === "yes") {
    transport = total * 0.05;
    total += transport;
  }

  transportChargeInput.value = transport.toFixed(2);
  totalPriceInput.value = total.toFixed(2);
}

// Listen for input changes
quantityInput.addEventListener("input", calculateTotal);
unitPriceInput.addEventListener("input", calculateTotal);
transportOptionInput.addEventListener("change", calculateTotal);

// Handle form submission
saleForm.addEventListener("submit", function (e) {
  const isValid = validateInputs();

  if (!isValid) {
    e.preventDefault(); // stop submission if invalid
    return;
  }

  // Update hidden totals before submit
  calculateTotal();
  // form now submits to backend /Addsale and will redirect to receipt
});
