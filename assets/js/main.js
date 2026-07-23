let companies = [];
let filteredCompanies = [];
let sortState = {
    column: "name",
    ascending: true
};

document.addEventListener("DOMContentLoaded", initTable);

async function initTable() {
    companies = await loadDataFromJson();
    companies.sort(function (a, b) {
        return a["name"].localeCompare(b["name"]);
    });
    filteredCompanies = [...companies];
    initFilterListeners();
    initSelectFilters();
    applyFilters();
    updateSortIcons();
}

async function loadDataFromJson() {
    try {
        const response = await fetch("/assets/data/dummy-unternehmen-100.json");
        if (!response.ok) {
            throw new Error(`${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.log(`error thrown when loading company data: ${error}`);
    }
    return [];
}

function fillTable(jsonData) {
    const tableBody = document.getElementById("companyDataTable");
    tableBody.innerHTML = "";

    if (jsonData.length == 0) {
        tableBody.innerHTML = "filled table with empty data"
    }

    jsonData.forEach(company => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${company.name}</td>
                <td>${company.land}</td>
                <td>${company.branche}</td>
                <td>${company.mitarbeiter.toLocaleString("de-DE")}</td>
                <td>${company.jahresumsatz.toLocaleString("de-DE")} €</td>
                <td>${company.co2Emissionen.toLocaleString("de-DE")} t/Jahr</td>`;
        tableBody.appendChild(row);
    });
}

// filtering functions

function initSelectFilters() {
    fillSelectFilter("filter-land", companies.map(function (company) {
        return company.land;
    }));

    fillSelectFilter("filter-branche", companies.map(function (company) {
        return company.branche;
    }));
}

function fillSelectFilter(id, values) {
    const selectFilter = document.getElementById(id);
    const uniqueValues = [...new Set(values)].sort(function (a, b) {
        return a.localeCompare(b)
    });
    uniqueValues.forEach(function (value) {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = value;
        selectFilter.appendChild(option);
    });
}

function initFilterListeners() {
    document.getElementById("filter-name").addEventListener("input", applyFilters);
    document.getElementById("filter-land").addEventListener("change", applyFilters);
    document.getElementById("filter-branche").addEventListener("change", applyFilters);
    document.getElementById("filter-mitarbeiter-min").addEventListener("input", applyFilters);
    document.getElementById("filter-mitarbeiter-max").addEventListener("input", applyFilters);
    document.getElementById("filter-jahresumsatz-min").addEventListener("input", applyFilters);
    document.getElementById("filter-jahresumsatz-max").addEventListener("input", applyFilters);
    document.getElementById("filter-co2Emissionen-min").addEventListener("input", applyFilters);
    document.getElementById("filter-co2Emissionen-max").addEventListener("input", applyFilters);
}

function applyFilters() {
    const nameFilterValue = document.getElementById("filter-name").value.trim().toLowerCase();
    const countryFilterValue = document.getElementById("filter-land").value;
    const industryFilterValue = document.getElementById("filter-branche").value;
    const employeesMinFilterValue = getNumberFromFilter("filter-mitarbeiter-min");
    const employeesMaxFilterValue = getNumberFromFilter("filter-mitarbeiter-max");
    const revenueMinFilterValue = getNumberFromFilter("filter-jahresumsatz-min");
    const revenueMaxFilterValue = getNumberFromFilter("filter-jahresumsatz-max");
    const emissionsMinFilterValue = getNumberFromFilter("filter-co2Emissionen-min");
    const emissionsMaxFilterValue = getNumberFromFilter("filter-co2Emissionen-max");

    filteredCompanies = companies.filter(function (company) {
        const matchesName = !nameFilterValue || company.name.toLowerCase().includes(nameFilterValue);
        const matchesCountry = !countryFilterValue || company.land === countryFilterValue;
        const matchesIndustry = !industryFilterValue || company.branche === industryFilterValue;
        const matchesEmployees = isWithinRange(company.mitarbeiter, employeesMinFilterValue, employeesMaxFilterValue);
        const matchesRevenue = isWithinRange(company.jahresumsatz, revenueMinFilterValue, revenueMaxFilterValue);
        const matchesEmissions = isWithinRange(company.co2Emissionen, emissionsMinFilterValue, emissionsMaxFilterValue);

        return matchesName && matchesCountry && matchesIndustry && matchesEmployees && matchesRevenue & matchesEmissions;
    });
    fillTable(filteredCompanies);
}

function getNumberFromFilter(id) {
    filterValue = document.getElementById(id).value;
    return filterValue === "" ? null : Number(filterValue);
}

function isWithinRange(value, min, max) {
    return (min === null || value >= min) && (max === null || value <= max);
}

// sorting functions

function sortTable(column) {
    fillTable(sortData(filteredCompanies, column));
    updateSortIcons();
}

function sortData(jsonData, column) {
    setSortDirection(column);
    data = [...jsonData].sort(function (a, b) {
        const valueA = a[column];
        const valueB = b[column];

        if (typeof valueA === "string") {
            return valueA.localeCompare(valueB);
        }
        return valueA - valueB;
    });
    return (sortState.ascending) ? data : data.reverse();
}

function setSortDirection(column) {
    if (sortState.column === column) {
        sortState.ascending = !sortState.ascending;
    } else {
        sortState.column = column;
        sortState.ascending = true;
    }
}

function updateSortIcons() {
    document.querySelectorAll(".sort-icon").forEach(function (icon) {
        icon.classList.remove("bi-caret-up", "bi-caret-up-fill", "bi-caret-down-fill");
        icon.classList.add("bi-caret-up");
    });
    const activeIcon = document.getElementById(`th-icon-${sortState.column}`);

    if (!activeIcon) return;

    activeIcon.classList.remove("bi-caret-up");
    activeIcon.classList.add(sortState.ascending ? "bi-caret-up-fill" : "bi-caret-down-fill");
}

