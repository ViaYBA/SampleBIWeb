//--ORDER HISTORY TABLE ORDER SORTING
let sortDirection = true;
function sortTable(colIndex) {
    const table = document.getElementById("orders-table");
    const rows = Array.from(table.rows).slice(1);
    rows.sort((a, b) => {
        let valA = a.cells[colIndex].innerText;
        let valB = b.cells[colIndex].innerText;
        return sortDirection ? valA.localeCompare(valB, undefined, {numeric: true}) : valB.localeCompare(valA, undefined, {numeric: true});
    });
    sortDirection = !sortDirection;
    rows.forEach(row => table.tBodies[0].appendChild(row));
}

//--ORDER HISTORY DATE SORTING--
function sortByDate() {
    const filter = document.getElementById('sortDate').value;
    const table = document.getElementById("orders-table");
    const rows = Array.from(table.rows).slice(1);
    if (filter === 'latest' || filter === 'oldest') {
        rows.sort((a, b) => {
            const dateA = new Date(a.querySelector('.order-date').innerText);
            const dateB = new Date(b.querySelector('.order-date').innerText);
            return filter === 'latest' ? dateB - dateA : dateA - dateB;
        });
        rows.forEach(row => table.tBodies[0].appendChild(row));
    }
}

//--ORDER SEARCH FILTER--
function filterOrders() {
    const filter = document.getElementById('order-search').value.toLowerCase();
    const rows = document.querySelectorAll("#orders-table tbody tr");
    rows.forEach(row => {
        const id = row.cells[1].innerText.toLowerCase();
        row.style.display = id.includes(filter) ? "" : "none";
    });
}

//--TRANSACTION DETAILS--
function showTransactionDetails(id, date) {
    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');

    //Sample Order History
    body.innerHTML = `
        <h2 style="margin-bottom:15px">Order History</h2>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px">
            <div><strong>Transaction ID:</strong> ${id}<br><strong>Date:</strong> ${date}</div>
            <div style="text-align:right"><strong>Total Item Quantity:</strong> 5<br><strong>Total Item Amount:</strong> 200</div>
        </div>
        <table class="orders-table">
            <thead><tr><th>No.</th><th>Item</th><th>Size</th><th>Price</th><th>Quantity</th><th>Total Amount</th></tr></thead>
            <tbody><tr><td>1</td><td>Product 1</td><td>-</td><td>40</td><td>5</td><td>200</td></tr></tbody>
        </table>`;
    modal.style.display = "flex";
}

//--MODAL--
function closeModal() {
    document.getElementById('details-modal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target == modal) {
        closeModal();
    }
}