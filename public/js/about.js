// Get form and inputs
const stockForm = document.getElementById("stock");

const productInput = document.getElementById("productName");
const typeInput = document.getElementById("productType");
const costInput = document.getElementById("costPrice");
const priceInput = document.getElementById("sellPrice");
const quantityInput = document.getElementById("quantity");
const supplierInput = document.getElementById("supplierName");
const qualityInput = document.getElementById("quality");
const colorInput = document.getElementById("color");
const measurementsInput = document.getElementById("measurements");

// ----- Reusable error handlers -----
const setError = (el, msg) => {
  const inputControl = el.closest(".mb-3");
  const errorDisplay = inputControl.querySelector(".error");
  if (errorDisplay) errorDisplay.innerText = msg;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (el) => {
  const inputControl = el.closest(".mb-3");
  const errorDisplay = inputControl.querySelector(".error");
  if (errorDisplay) errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

// ----- Validation logic -----
const validateStockInputs = () => {
  let isValid = true;

  if (!productInput.value.trim()) {
    setError(productInput, "Product name is required");
    isValid = false;
  } else setSuccess(productInput);

  if (!typeInput.value.trim()) {
    setError(typeInput, "Product type is required");
    isValid = false;
  } else setSuccess(typeInput);

  if (!costInput.value.trim() || Number(costInput.value) <= 0) {
    setError(costInput, "Enter valid cost price");
    isValid = false;
  } else setSuccess(costInput);

  if (!priceInput.value.trim() || Number(priceInput.value) <= 0) {
    setError(priceInput, "Enter valid selling price");
    isValid = false;
  } else setSuccess(priceInput);

  if (!quantityInput.value.trim() || Number(quantityInput.value) <= 0) {
    setError(quantityInput, "Enter valid quantity");
    isValid = false;
  } else setSuccess(quantityInput);

  if (!qualityInput.value.trim()) {
    setError(qualityInput, "Quality is required");
    isValid = false;
  } else setSuccess(qualityInput);

  // Optional fields: only mark success if they exist
  if (supplierInput.value.trim()) setSuccess(supplierInput);
  if (colorInput.value.trim()) setSuccess(colorInput);
  if (measurementsInput.value.trim()) setSuccess(measurementsInput);

  return isValid;
};

// ----- Submit handler -----
stockForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const isValid = validateStockInputs();
  if (!isValid) return;

  // Create stock object
  const stockItem = {
    productName: productInput.value.trim(),
    productType: typeInput.value.trim(),
    costPrice: costInput.value.trim(),
    sellPrice: priceInput.value.trim(),
    quantity: quantityInput.value.trim(),
    supplierName: supplierInput.value.trim(),
    quality: qualityInput.value.trim(),
    color: colorInput.value.trim(),
    measurements: measurementsInput.value.trim(),
  };

  try {
    // ✅ Send data to backend
    const response = await fetch("/stock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stockItem),
    });

    if (!response.ok) {
      const errorText = await response.text();
      alert("❌ Failed to save stock: " + errorText);
      return;
    }

    alert("✅ Stock added successfully!");
    window.location.href = "/stocklist"; // redirect after success
  } catch (err) {
    console.error(err);
    alert("⚠️ Network error: could not submit form");
  }
});
