async function loadCompanyData() {
    const tableBody = document.getElementById("companyDataTable");
    const response = await fetch("/assets/data/dummy-unternehmen-100.json")
        .then(async function (response) {
            const companyData = await response.json();
            companyData.forEach(company => {
                const row = document.createElement("tr");
                row.innerHTML = `<td>${company.name}</td>
                <td>${company.land}</td>
                <td>${company.branche}</td>
                <td>${company.mitarbeiter}</td>
                <td>${company.jahresumsatz}</td>
                <td>${company.co2Emissionen}</td>`;
                tableBody.appendChild(row);
            });
        }).catch(function (error) {
            tableBody.innerHTML = `<tr><td>Fehler beim Laden der Daten</td></tr>`;
            console.log(`error thrown when loading company data: ${error}`);
        });
}

loadCompanyData();