//--STOCKS FILTERS--
function filterProducts() {
    //Product search, category filter, and stock range filter
    const query = document.getElementById('stock-search').value.toLowerCase();
    const selectedCat = document.getElementById('category-filter').value.toLowerCase();
    const selectedRange = document.getElementById('range-filter').value;
    
    //Loop through each product card
    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('.product-name').innerText.toLowerCase();
        const category = card.getAttribute('data-category').toLowerCase();
        const stock = parseInt(card.getAttribute('data-stock'));

        //Define logic for each filter
        const matchesSearch = name.includes(query);

        //Matches if 'All' is selected || if product card's tag matches the category selected
        const matchesCat = selectedCat === 'all' || category === selectedCat;

        //Matches if 'All' is selected || if matches stock range selected
        const matchesRange = selectedRange === 'all' || (selectedRange === 'low' && stock <= 10);

        //Show/hide card based on filter logic
        card.style.display = (matchesSearch && matchesCat && matchesRange) ? "block" : "none";
    });
}

//--STOCK DETAILS--
function showStockDetails(name, cat, count) {
    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');
    //Puts low stock warning next to stock count if stock status is low
    let lowStockWarning = count <= 10 ? `<span class="stock-status-low">⚠️ Low stock!</span>` : "";

    //Sample Stock History
    body.innerHTML = `
        <div style="modal-header">
            <div>
                <h2 style="margin:0">${name}</h2>
                <span class="category-tag" style="position:static">${cat}</span>
            </div>
            <div style="text-align:right">
                <p>Current Stock: <strong style="font-size:1.5rem; color:${count <= 10 ? 'red' : 'black'}">${count}</strong></p>
                ${lowStockWarning}
            </div>
        </div>
        <h3 style="margin-top:20px;">Order History</h3>
        <table class="orders-table">
            <thead><tr><th>Date</th><th>Size / Variation</th><th>Quantity</th></tr></thead>
            <tbody>
                <tr><td>2/10/2026</td><td>Size 1</td><td>50</td></tr>
                <tr><td>1/15/2026</td><td>Size 1</td><td>50</td></tr>
                <tr><td>1/15/2026</td><td>Size 2</td><td>40</td></tr>
            </tbody>
        </table>`;
    modal.style.display = "flex";
}

//--MODAL--
function closeModal() {
    document.getElementById('details-modal').style.display = "none";
}

window.onload = () => {
    document.querySelectorAll('.product-card').forEach(card => {
        //Turns stock text to red if low stock
        if (parseInt(card.getAttribute('data-stock')) <= 10) card.classList.add('low-stock-alert');
    });
};

window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target == modal) {
        closeModal();
    }
}