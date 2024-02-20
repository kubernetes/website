document.addEventListener("DOMContentLoaded", function () {
    const tables = document.querySelectorAll(".sortable-table");
    tables.forEach((table) => {
      const headers = table.querySelectorAll("thead th");
      headers.forEach((th, index) => {
        th.style.cursor = "pointer";
        th.addEventListener("click", () => sortTable(table, index));
      });
    });
  });

  function sortTable(table, column) {
    const rows = Array.from(table.querySelectorAll("tbody tr"));
    let sortOrder = table.getAttribute("data-sort-order") || "asc";
    
    rows.sort((a, b) => {
      const aValue = a.querySelectorAll("td")[column].innerText;
      const bValue = b.querySelectorAll("td")[column].innerText;
      if (sortOrder === "asc") {
        return aValue.localeCompare(bValue, undefined, { numeric: true, sensitivity: "base" });
      } else {
        return bValue.localeCompare(aValue, undefined, { numeric: true, sensitivity: "base" });
      }
    });

    rows.forEach((row) => table.querySelector("tbody").appendChild(row));
    
    sortOrder = (sortOrder === "asc") ? "desc" : "asc";
    table.setAttribute("data-sort-order", sortOrder);
  }