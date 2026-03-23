/*Sorting and Filtering Logic*/

//Column Sorter (Generic for Numbers or Text)
let sortDirection = true;
function sortTable(colIndex) {
    const table = document.getElementById("orders-table");
    const rows = Array.from(table.rows).slice(1);
    
    rows.sort((a, b) => {
        let valA = a.cells[colIndex].innerText;
        let valB = b.cells[colIndex].innerText;
        
        //Check if values are numeric
        if (!isNaN(valA) && !isNaN(valB)) {
            return sortDirection ? valA - valB : valB - valA;
        }
        return sortDirection ? valA.localeCompare(valB) : valB.localeCompare(valA);
    });

    sortDirection = !sortDirection;
    rows.forEach(row => table.tBodies[0].appendChild(row));
}

//Date Specific Filter/Sorter
function filterByDate() {
    const filter = document.getElementById('date-filter').value;
    const table = document.getElementById("orders-table");
    const rows = Array.from(table.rows).slice(1);

    if (filter === 'latest' || filter === 'oldest') {
        rows.sort((a, b) => {
            const dateA = new Date(a.querySelector('.order-date').innerText);
            const dateB = new Date(b.querySelector('.order-date').innerText);
            return filter === 'latest' ? dateB - dateA : dateA - dateB;
        });
        rows.forEach(row => table.tBodies[0].appendChild(row));
    } else if (filter === 'recent') {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        rows.forEach(row => {
            const rowDate = new Date(row.querySelector('.order-date').innerText);
            row.style.display = rowDate >= oneMonthAgo ? "" : "none";
        });
    } else {
        rows.forEach(row => row.style.display = "");
    }
}

//Existing Filter Functions
function filterProducts() {
    // 1. Get current from filters
    const query = document.getElementById('order-search').value.toLowerCase();
    const selectedCat = document.getElementById('category-filter').value.toLowerCase();
    const selectedRange = document.getElementById('range-filter').value;
    
    // 2. Loop through every product card
    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('.product-name').innerText.toLowerCase();
        const category = card.querySelector('.category-tag').innerText.toLowerCase();
        const stock = parseInt(card.querySelector('.stock-count').innerText);

        // 3. Define logic for each filter
        const matchesSearch = name.includes(query);
        
        // Matches if 'All' is selected OR the card's tag matches the dropdown
        const matchesCat = selectedCat === 'all' || category === selectedCat;
        
        // Matches if 'All' is selected OR it's 'low' and stock is 10 or less
        const matchesRange = selectedRange === 'all' || (selectedRange === 'low' && stock <= 10);

        // 4. Only show the card if it passes all three tests
        if (matchesSearch && matchesCat && matchesRange) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function filterOrders() {
    const filter = document.getElementById('order-search').value.toLowerCase();
    const rows = document.querySelectorAll("#orders-table tbody tr");
    rows.forEach(row => {
        const id = row.cells[1].innerText.toLowerCase();
        row.style.display = id.includes(filter) ? "" : "none";
    });
}

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
}

window.onload = () => {
    //Low stock visual logic
    document.querySelectorAll('.product-card').forEach(card => {
        const stock = parseInt(card.querySelector('.stock-count').innerText);
        if (stock <= 10) card.classList.add('low-stock-alert');
    });
};


function closeModal() {
    document.getElementById('details-modal').style.display = "none";
}

//Stock Details Logic
function showStockDetails(name, cat, count) {
    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');
    
    let lowStockWarning = count <= 10 ? `<span class="stock-status-low">⚠️ Low stock!</span>` : "";

    body.innerHTML = `
        <div class="modal-header">
            <div>
                <h2 style="margin:0">${name}</h2>
                <span class="category-tag" style="position:static">${cat}</span>
            </div>
            <div style="text-align:right">
                <p>Current Stock: <strong style="font-size:1.5rem; color:${count <= 10 ? 'red' : 'black'}">${count}</strong></p>
                ${lowStockWarning}
            </div>
        </div>
        <h3>Order History</h3>
        <table class="orders-table">
            <thead>
                <tr><th>Date</th><th>Size / Variation</th><th>Quantity</th></tr>
            </thead>
            <tbody>
                <tr><td>2/10/2026</td><td>Size 1</td><td>50</td></tr>
                <tr><td>1/15/2026</td><td>Size 1</td><td>50</td></tr>
                <tr><td>1/15/2026</td><td>Size 2</td><td>40</td></tr>
            </tbody>
        </table>
    `;
    modal.style.display = "flex";
}

//Transaction Details Logic
function showTransactionDetails(id, date) {
    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');

    body.innerHTML = `
        <h2>Order History</h2>
        <div class="summary-grid">
            <div><strong>Transaction ID:</strong> ${id}<br><strong>Date:</strong> ${date}</div>
            <div style="text-align:right"><strong>Total Item Quantity:</strong> 5<br><strong>Total Item Amount:</strong> 200</div>
        </div>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>No.</th>
                    <th>Item</th>
                    <th>Size</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>Product 1</td><td>-</td><td>40</td><td>5</td><td>200</td></tr>
            </tbody>
        </table>
    `;
    modal.style.display = "flex";
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target == modal) {
        closeModal();
    }
}