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

// Performance settings
const BATCH_SIZE = 100;     // How many rows are added to the table each time
const DEBOUNCE_MS = 200;    // How long to wait after the last keystroke before searching
const SCROLL_MARGIN = 200;  // Load the next batch when this many pixels from the bottom

// Search index: one lowercase text per record, built once when the page loads.
// It contains the values of ALL columns, so searching it covers every column.
const searchIndex = data.map(function (item) {
    return columns.map(function (col) {
        return String(item[col.key] ?? "");
    }).join(" | ").toLowerCase();
});

// State used for loading rows in batches
let currentRecords = [];  // All records that match the current search
let renderedCount = 0;    // How many of them are already in the table

// Line above the table that shows the total number of matching records
const resultCount = document.createElement("div");
resultCount.className = "result-count";
tableContainer.parentNode.insertBefore(resultCount, tableContainer);

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

    // Remember the full list of matching records and start from the top
    currentRecords = records;
    renderedCount = 0;
    tableContainer.scrollTop = 0;

    // Show the total number of matching records
    resultCount.textContent = records.length.toLocaleString() + " of " +
        data.length.toLocaleString() + " records match";

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

    // Add only the first batch of rows; the rest are added while scrolling
    renderNextBatch();
}

// Function to add the next batch of rows to the table (infinite scroll)
function renderNextBatch() {
    const end = Math.min(renderedCount + BATCH_SIZE, currentRecords.length);

    // Build the rows in memory first, then add them to the page in one step
    const fragment = document.createDocumentFragment();

    for (let i = renderedCount; i < end; i++) {
        const item = currentRecords[i];
        const row = document.createElement("tr");

        // Loop through each defined column to create a cell (<td>)
        columns.forEach(function (col) {
            const cell = document.createElement("td");
            const value = item[col.key];
            // Display the value, or an empty string if undefined/null
            cell.textContent = value !== undefined && value !== null ? value : "";
            row.appendChild(cell);
        });

        fragment.appendChild(row);
    }

    tbody.appendChild(fragment);
    renderedCount = end;
}

// Function to filter the global "data" array live as the user types
function handleSearch() {
    const query = searchInput.value.toLowerCase().trim();

    // Filter rows using the prebuilt search index (covers all rows and all columns)
    const filteredData = data.filter(function (item, i) {
        return searchIndex[i].includes(query);
    });

    // Update the table with the filtered rows
    renderTableRows(filteredData);
}

// Initialize the table when the script loads
createTableHeader();
renderTableRows(data);

// Listen for typing in the search box, but wait until typing pauses (debounce)
let searchTimer = null;
searchInput.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(handleSearch, DEBOUNCE_MS);
});

// Load the next batch of rows when the user scrolls near the bottom of the table
tableContainer.addEventListener("scroll", function () {
    const nearBottom = tableContainer.scrollTop + tableContainer.clientHeight >=
        tableContainer.scrollHeight - SCROLL_MARGIN;

    if (nearBottom && renderedCount < currentRecords.length) {
        renderNextBatch();
    }
});