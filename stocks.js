//--SAMPLE PRODUCT DATABASE--
const stocksDb = [
    {
        name: "Product 1", category: "Cat1", stock: 40, barcode: "23304291", minStock: 10,
        history:[
            {date: "2026-02-10", size: "S", qty: 25},
            {date: "2026-02-10", size: "M", qty: 50},
            {date: "2026-01-15", size: "S", qty: 25}
        ]
    },
    {
        name: "Product 2", category: "Cat2", stock: 8, barcode: "23404203", minStock: 10,
        history:[
            {date: "2026-03-01", size: "-", qty: 10}
        ]
    },
    {
        name: "Product 3", category: "Cat1", stock: 15, barcode: "23404205", minStock: 5,
        history:[
            {date: "2026-02-17", size: "-", qty: 20}
        ]
    }
];

//--LOAD STOCKS CARDS--
function loadStocks() {
    const grid = document.querySelector('.stocks-grid');
    grid.innerHTML = '';

    stocksDb.forEach(product => {
        const isLow = product.stock <= product.minStock;
        const card = document.createElement('div');
        card.className = 'product-card';
        if (isLow) card.classList.add('low-stock-alert'); //Low stock red alert
        //Sets data attributes
        card.setAttribute('data-stock', product.stock);
        card.setAttribute('data-category', product.category.toLowerCase());
        card.setAttribute('data-barcode', product.barcode);
        card.setAttribute('data-minstock', product.minStock);

        card.innerHTML = `
            <div class="category-tag">${product.category}</div>
            ${isLow ? '<div class="alert-icon">!</div>' : ''}
            <div class="stock-count">${product.stock}</div>
            <div>Stocks</div>
            <div class="product-info">
                <span class="product-name">${product.name}</span> 
                <a href="javascript:void(0)" class="details-link" 
                    onclick="showStockDetails('${product.name}')">→
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

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
function showStockDetails(productName) {
    //Find product
    const product = stocksDb.find(p => p.name === productName);
    if (!product) return;

    const modal = document.getElementById('details-modal');
    const body = document.getElementById('modal-body');
    const isLow = product.stock <= product.minStock;

    //Load history rows or message
    let historyRows = "";
    if (product.history && product.history.length > 0) {
        historyRows = product.history.map(entry => `
            <tr>
                <td>${entry.date}</td>
                <td>${entry.size}</td>
                <td>${entry.qty}</td>
            </tr>
        `).join('');
    } else {
        historyRows = `<tr><td colspan="3" style="text-align:center; padding: 20px;">No transaction history available.</td></tr>`;
    }
    //Stock history modal
    body.innerHTML = `
        <div class="modal-header">
            <div>
                <h2 style="margin:0;">${product.name}</h2>
                <p style="color:#666; margin: 5px 0;">Category: ${product.category}</p>
                <p style="font-size: 0.9rem; color: #888;">Barcode: ${product.barcode}</p>
            </div>
            <div style="text-align:right">
                <p>Current Stock: <strong style="font-size:1.5rem; color:${isLow ? 'var(--low-stock-red)' : 'black'}">${product.stock}</strong></p>
                <p style="font-size: 0.85rem; color: #555;">Min. Stock Level: ${product.minStock}</p>
                ${isLow ? '<span class="stock-status-low">⚠️ Low stock!</span>' : ''}
            </div>
        </div>

        <h3 style="margin-top:25px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Stock In/Out History</h3>
        <table class="orders-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Size / Variation</th>
                    <th>Quantity</th>
                </tr>
            </thead>
            <tbody>
                ${historyRows}
            </tbody>
        </table>`;

    modal.style.display = "flex";
}

//--MODAL--
function closeModal() {
    document.getElementById('details-modal').style.display = "none";
}

window.onload = () => {
    loadStocks();
};

window.onclick = function(event) {
    const modal = document.getElementById('details-modal');
    if (event.target == modal) {
        closeModal();
    }
}