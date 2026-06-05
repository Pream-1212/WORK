const validateStockData = require("./validateStockData");

describe("validateStockData", () => {
  it("should return errors for missing required fields", () => {
    const body = {};
    const errors = validateStockData(body);

    expect(errors).toContain("productName is required.");
    expect(errors).toContain("productType is required.");
    expect(errors).toContain("costPrice is required.");
  });

  it("should return error for invalid numbers", () => {
    const body = {
      productName: "Wood",
      productType: "Plywood",
      costPrice: -5, // invalid
      sellPrice: "abc", // invalid
      quantity: 0, // invalid
    };

    const errors = validateStockData(body);

    expect(errors).toContain("Cost Price must be a valid positive number.");
    expect(errors).toContain("Selling Price must be a valid positive number.");
    expect(errors).toContain(
      "Quantity must be a valid whole number greater than 0."
    );
  });

  it("should return empty array if data is valid", () => {
    const body = {
      productName: "Wood",
      productType: "Plywood",
      costPrice: 100,
      sellPrice: 150,
      quantity: 10,
    };

    const errors = validateStockData(body);

    expect(errors).toEqual([]);
  });
});
