//--SAMPLE ORDER HISTORY DATABASE--
const orderHistoryDb = [
    {   id: "1234567890",
        date: "2026-01-11",
        items: [
            {name: "Product 1", size: "-", price: 100, qty: 2, total: 200}
        ]
    },
    {
        id: "1234567891",
        date: "2026-02-15",
        items: [
            {name: "Product 2", size: "-", price: 35, qty: 2, total: 70},
            {name: "Product 3", size: "-", price: 50, qty: 1, total: 50}
        ]
    }
];

//--LOAD ORDERS--
function loadOrders() {
    const tbody = document.querySelector("#orders-table tbody");
    tbody.innerHTML = "";

    orderHistoryDb.forEach((order, index) => {
        //Calculating total quantity and total amount
        const calculatedQty = order.items.reduce((sum, item) => sum + item.qty, 0);
        const calculatedAmount = order.items.reduce((sum, item) => sum + item.total, 0);

        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${order.id}</td>
                <td class="order-date">${order.date}</td>
                <td>${calculatedQty}</td>
                <td>${calculatedAmount.toFixed(2)}</td>
                <td><a href="javascript:void(0)" class="details-link" 
                    onclick="showTransactionDetails('${order.id}')">Details ▶</a>
                </td>
            </tr>`;
        tbody.innerHTML += row;
    });
}

//--ORDER HISTORY TABLE ORDER SORTING--
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
function applyDateLogic() {
    const filter = document.getElementById('sortDate').value;
    const now = new Date();
    
    //Filter data based on time ranges
    let filteredData = orderHistoryDb.filter(order => {
        const orderDate = new Date(order.date);
        //This Year
        if (filter === 'year') {return orderDate.getFullYear() === now.getFullYear();}
        //This Month
        if (filter === 'month') {
            return orderDate.getFullYear() === now.getFullYear() && 
                   orderDate.getMonth() === now.getMonth();
        }
        //This Week
        if (filter === 'week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay()); //Sunday
            startOfWeek.setHours(0,0,0,0);
            return orderDate >= startOfWeek && orderDate <= now;
        }
        
        return true; //'latest' and 'oldest' show everything
    });

    //Sort data
    filteredData.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return filter === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    //Load the specific filtered/sorted set
    loadFilteredOrders(filteredData);
}

//--LOAD SPECIFIC FILTERED DATA--
function loadFilteredOrders(data) {
    const tbody = document.querySelector("#orders-table tbody");
    tbody.innerHTML = "";

    data.forEach((order, index) => {
        const qty = order.items.reduce((sum, item) => sum + item.qty, 0);
        const amount = order.items.reduce((sum, item) => sum + item.total, 0);

        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${order.id}</td>
                <td class="order-date">${order.date}</td>
                <td>${qty}</td>
                <td>${amount.toFixed(2)}</td>
                <td><a href="javascript:void(0)" class="details-link" 
                    onclick="showTransactionDetails('${order.id}')">Details ▶</a></td>
            </tr>`;
    });
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
function showTransactionDetails(id) {
    const order = orderHistoryDb.find(o => o.id === id);
    if (!order) return;

    //Calculating total quantity and total amount
    const modalQty = order.items.reduce((sum, item) => sum + item.qty, 0);
    const modalTotal = order.items.reduce((sum, item) => sum + item.total, 0);

    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');

    let itemsHtml = order.items.map((item, i) => `
        <tr>
            <td>${i + 1}</td>
            <td>${item.name}</td>
            <td>${item.size}</td>
            <td>${item.price}</td>
            <td>${item.qty}</td>
            <td>${item.total}</td>
        </tr>
    `).join('');

    body.innerHTML = `
        <h2 style="margin-bottom:15px">Order Details</h2>
        <div style="display:flex; justify-content:space-between; margin-bottom:15px">
            <div>
                <strong>Transaction ID:</strong> ${order.id}<br>
                <strong>Date:</strong> ${order.date}
            </div>
            <div style="text-align:right">
                <strong>Total Qty:</strong> ${modalQty}<br>
                <strong>Total Amount:</strong> ${modalTotal.toFixed(2)}
                </div>
        </div>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
        </table>`;
    
    modal.style.display = "flex";
}

//--MODAL--
document.addEventListener('DOMContentLoaded', loadOrders);

function closeModal() {
    document.getElementById('details-modal').style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target == modal) {
        closeModal();
    }
}