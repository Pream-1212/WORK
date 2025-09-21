// Sales Trend
new Chart(document.getElementById("salesTrend"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Sales Volume",
        data: [120, 150, 180, 200, 250, 300, 280],
        borderColor: "rgba(25,135,84,1)",
        backgroundColor: "rgba(25,135,84,0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  },
  options: { responsive: true },
});

// Category Breakdown
new Chart(document.getElementById("categoryBreakdown"), {
  type: "doughnut",
  data: {
    labels: ["Wood Products", "Furniture"],
    datasets: [
      {
        data: [60, 40],
        backgroundColor: ["#198754", "#0d6efd"],
      },
    ],
  },
  options: { responsive: true },
});

// Top Products
new Chart(document.getElementById("topProducts"), {
  type: "bar",
  data: {
    labels: ["Dining Tables", "Sofas", "Beds", "Timber", "Poles"],
    datasets: [
      {
        label: "Units Sold",
        data: [120, 95, 80, 150, 100],
        backgroundColor: [
          "#0d6efd",
          "#198754",
          "#ffc107",
          "#dc3545",
          "#6f42c1",
        ],
      },
    ],
  },
  options: {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  },
});
