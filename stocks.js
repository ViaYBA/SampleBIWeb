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
        const minStock = parseInt(card.getAttribute('data-minstock')) || 10;

        //Define logic for each filter
        const matchesSearch = name.includes(query);

        //Matches if 'All' is selected || if product card's tag matches the category selected
        const matchesCat = selectedCat === 'all' || category === selectedCat;

        //Matches if 'All' is selected || if matches stock range selected
        const isLowStock = stock <= minStock; //Low stock range logic
        const matchesRange = selectedRange === 'all' || (selectedRange === 'low' && isLowStock);

        //Show/hide card based on filter logic
        card.style.display = (matchesSearch && matchesCat && matchesRange) ? "block" : "none";
    });
}

//--STOCK DETAILS--
function showStockDetails(name, cat, count, barcode, minStock) {
    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');
    //Default values if not provided
    const bCode = barcode || "N/A";
    const mStock = minStock || 10;
    const isLow = count <= mStock;

    //Sample Stock History
    body.innerHTML = `
        <div class="modal-header">
            <div>
                <h2 style="margin:0">${name}</h2>
                <span class="category-tag" style="position:static">${cat}</span>
                <p style="font-size: 0.9rem; margin-top: 8px; color: #666;">Barcode: ${bCode}</p>
            </div>
            <div style="text-align:right">
                <p>Current Stock: <strong style="font-size:1.5rem; color:${isLow ? 'red' : 'black'}">${count}</strong></p>
                <p style="font-size: 0.85rem; color: #555;">Min. Stock Level: ${mStock}</p>
                ${isLow ? '<span class="stock-status-low">⚠️ Low stock!</span>' : ''}
            </div>
        </div>
        <h3 style="margin-top:20px;">Order History</h3>
        <table class="orders-table">
            <thead><tr><th>Date</th><th>Size / Variation</th><th>Quantity</th></tr></thead>
            <tbody>
                <tr><td>2/10/2026</td><td>Size 1</td><td>50</td></tr>
                <tr><td>1/15/2026</td><td>Size 1</td><td>50</td></tr>
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
        const stock = parseInt(card.getAttribute('data-stock'));
        const minStock = parseInt(card.getAttribute('data-minstock'));
    
        card.classList.toggle('low-stock-alert', stock <= minStock);
    });
};

window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target == modal) {
        closeModal();
    }
}