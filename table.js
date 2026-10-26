// Define the table columns matching the keys in the "data" array
const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "machine_id", label: "Machine ID" },
    { key: "machine_type", label: "Machine Type" },
    { key: "vibration_rms", label: "Vibration (RMS)" },
    { key: "temperature_motor", label: "Motor Temp" },
    { key: "current_phase_avg", label: "Current Avg" },
    { key: "pressure_level", label: "Pressure" },
    { key: "rpm", label: "RPM" },
    { key: "operating_mode", label: "Operating Mode" },
    { key: "hours_since_maintenance", label: "Hours Since Maint." },
    { key: "ambient_temp", label: "Ambient Temp" },
    { key: "rul_hours", label: "RUL (Hours)" },
    { key: "failure_within_24h", label: "Failure < 24h" },
    { key: "failure_type", label: "Failure Type" },
    { key: "estimated_repair_cost", label: "Est. Repair Cost" }
];

// Get references to the HTML elements
const tableContainer = document.getElementById("tableContainer");
const searchInput = document.getElementById("searchInput");

// Create the table structure (<table>, <thead>, and <tbody>)
const table = document.createElement("table");
const thead = document.createElement("thead");
const tbody = document.createElement("tbody");

// Function to build the table header row
function createTableHeader() {
    const headerRow = document.createElement("tr");

    columns.forEach(function (col) {
        const th = document.createElement("th");
        th.textContent = col.label;
        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
}

// Function to populate the table body with a given list of records
function renderTableRows(records) {
    // Clear any existing rows inside the table body
    tbody.innerHTML = "";

    // Show a message if no records match the search query
    if (records.length === 0) {
        const emptyRow = document.createElement("tr");
        const emptyCell = document.createElement("td");
        emptyCell.colSpan = columns.length;
        emptyCell.className = "no-results";
        emptyCell.textContent = "No matching records found.";
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
        return;
    }

    // Loop through each record and create a table row (<tr>)
    records.forEach(function (item) {
        const row = document.createElement("tr");

        // Loop through each defined column to create a cell (<td>)
        columns.forEach(function (col) {
            const cell = document.createElement("td");
            const value = item[col.key];
            // Display the value, or an empty string if undefined/null
            cell.textContent = value !== undefined && value !== null ? value : "";
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });
}

// Function to filter the global "data" array live as the user types
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();

    // Filter rows where at least one column value contains the search text
    const filteredData = data.filter(function (item) {
        return columns.some(function (col) {
            const cellValue = String(item[col.key] ?? "").toLowerCase();
            return cellValue.includes(query);
        });
    });

    // Update the table with the filtered rows
    renderTableRows(filteredData);
}

// Initialize the table when the script loads
createTableHeader();
renderTableRows(data);

// Listen for typing in the search box to filter rows live
searchInput.addEventListener("input", handleSearch);