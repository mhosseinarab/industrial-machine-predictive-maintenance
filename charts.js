// Count how many records exist for each failure_type in the global "data" array
const failureCounts = {};

data.forEach(function (item) {
    // Read the failure_type property (fallback to "None" if empty or missing)
    const type = item.failure_type || "None";

    // Increment the count for this failure type
    if (failureCounts[type]) {
        failureCounts[type] += 1;
    } else {
        failureCounts[type] = 1;
    }
});

// Extract the failure type names (labels) and their record counts (values)
const chartLabels = Object.keys(failureCounts);
const chartValues = Object.values(failureCounts);

// Get the canvas element from index.html
const ctx = document.getElementById("failureChart").getContext("2d");

// Draw the bar chart using Chart.js
new Chart(ctx, {
    type: "bar",
    data: {
        labels: chartLabels,
        datasets: [
            {
                label: "Number of Records",
                data: chartValues,
                backgroundColor: "rgba(37, 99, 235, 0.75)",
                borderColor: "rgba(29, 78, 216, 1)",
                borderWidth: 1,
                borderRadius: 4
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top"
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Failure Type"
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Records"
                },
                ticks: {
                    precision: 0 // Show whole numbers only on the Y-axis
                }
            }
        }
    }
});