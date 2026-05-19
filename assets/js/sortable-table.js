// Tables with class .sortable-table: headers sort tbody by click or Enter/Space.
// Changing column sorts ascending first; same column toggles asc/desc. Updates aria-sort.

document.addEventListener("DOMContentLoaded", function () {
  const tables = document.querySelectorAll(".sortable-table");
  tables.forEach((table) => {
    const headers = table.querySelectorAll("thead th");
    headers.forEach((th, index) => {
      th.setAttribute("tabindex", "0");
      th.setAttribute("role", "columnheader");
      th.setAttribute("aria-sort", "none");
      th.style.cursor = "pointer";

      th.addEventListener("click", () => sortTable(table, index, th));

      th.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          sortTable(table, index, th);
        }
      });
    });
  });
});

// Sorts rows by column; clickedTh receives the aria-sort state for accessibility.
function sortTable(table, column, clickedTh) {
  const rows = Array.from(table.querySelectorAll("tbody tr"));

  const tbody = table.querySelector("tbody");

  let sortOrder = table.getAttribute("data-sort-order") || "asc";
  const currentCol = table.getAttribute("data-sort-col");

  // Different column clicked: start with ascending sort.
  if (currentCol !== String(column)) {
    sortOrder = "asc";
  }

  rows.sort((a, b) => {
    // textContent + trim: stable strings for collation.
    const aValue = a.querySelectorAll("td")[column].textContent.trim();
    const bValue = b.querySelectorAll("td")[column].textContent.trim();
    if (sortOrder === "asc") {
      return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: "base" });
    } else {
      return bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: "base" });
    }
  });

  rows.forEach((row) => tbody.appendChild(row));

  // Clear sort state on every header so only the active column has aria-sort set.
  const allHeaders = table.querySelectorAll("thead th");
  allHeaders.forEach((th) => {
    th.setAttribute("aria-sort", "none");
    th.removeAttribute("data-sort-dir");
  });

  const newOrder = (sortOrder === "asc") ? "desc" : "asc";
  clickedTh.setAttribute("aria-sort", sortOrder === "asc" ? "ascending" : "descending");
  clickedTh.setAttribute("data-sort-dir", sortOrder);

  table.setAttribute("data-sort-order", newOrder);
  table.setAttribute("data-sort-col", String(column));
}
