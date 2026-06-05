function validateStockData(body) {
  const errors = [];

  if (!body.productName) errors.push("productName is required.");
  if (!body.productType) errors.push("productType is required.");
  if (body.costPrice === undefined) errors.push("costPrice is required.");

  if (body.costPrice !== undefined) {
    if (isNaN(body.costPrice) || Number(body.costPrice) <= 0) {
      errors.push("Cost Price must be a valid positive number.");
    }
  }

  if (body.sellPrice !== undefined) {
    if (isNaN(body.sellPrice) || Number(body.sellPrice) <= 0) {
      errors.push("Selling Price must be a valid positive number.");
    }
  }

  if (body.quantity !== undefined) {
    if (
      isNaN(body.quantity) ||
      Number(body.quantity) <= 0 ||
      !Number.isInteger(Number(body.quantity))
    ) {
      errors.push("Quantity must be a valid whole number greater than 0.");
    }
  }

  return errors;
}

module.exports = validateStockData;
