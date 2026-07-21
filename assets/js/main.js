let companyDataJson = [];
let sortState = {
    column: "name",
    ascending: true
};

initTable();

async function initTable() {
    companyDataJson = await loadDataFromJson();
    companyDataJson.sort(function (a, b) {
        return a["name"].localeCompare(b["name"]);
    });
    fillTable(companyDataJson);
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
        ableBody.innerHTML = "tried to fill table with empty data"
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

function sortData(jsonData, column) {
    setSortDirection(column);
    data = [...jsonData].sort(function(a, b) {
        const valueA = a[column];
        const valueB = b[column];

        if (typeof valueA === "string") {
            return valueA.localeCompare(valueB);
        }
        return valueA - valueB;
    });
    return (sortState.ascending) ? data : data.reverse();
}

function sortTable(column) {
    fillTable(sortData(companyDataJson, column));
}

function setSortDirection(column) {
    if (sortState.column === column) {
        sortState.ascending = !sortState.ascending;
    } else {
        sortState.column = column;
        sortState.ascending = true;
    }
}