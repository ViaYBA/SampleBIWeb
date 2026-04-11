let purchaseList = [];
let editIndex = -1; // -1 means "Add mode"

//--SAMPLE PRODUCT DATABASE--
const productDb = {
    "pr1": {price: 100, category: "Cat1", barcode: "23304291", size: " "},
    "pr2": {price: 35, category: "Cat2", barcode: "23404203", size: " "},
    "pr3": {price: 50, category: "Cat1", barcode: "23404204", size: " "}
};

//--REAL TIME CLOCK--
function updateClock() {
    const now = new Date();
    const options = { 
        year: 'numeric', month: 'long', day: 'numeric', 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
    };
    const clockElement = document.getElementById('date-time-display');
    if(clockElement) {
        clockElement.innerText = "Date & Time: " + now.toLocaleString('en-US', options);
    }
}
setInterval(updateClock, 1000);
updateClock();

//--CALCULATIONS--
function calculateModalTotal() {
    const price = parseFloat(document.getElementById('p-price').value) || 0;
    const qty = parseInt(document.getElementById('p-qty').value) || 0;
    document.getElementById('p-total').value = (price * qty).toFixed(2);
}

//--PRODUCT INFORMATION AUTO-FILL--
function updateProductDetails() {
    const selectedProduct = document.getElementById('p-name').value;
    const data = productDb[selectedProduct];

    if (data) {
        document.getElementById('p-price').value = data.price.toFixed(2);
        document.getElementById('p-cat').value = data.category;
        document.getElementById('p-barcode').value = data.barcode;
        document.getElementById('p-size').value = data.size;
        calculateModalTotal();
    }
}

//--ADD OR EDIT ITEM IN TABLE--
function addItemToTable() {
    const nameSelect = document.getElementById('p-name');
    const name = nameSelect.options[nameSelect.selectedIndex].text;
    const price = parseFloat(document.getElementById('p-price').value);
    const qty = parseInt(document.getElementById('p-qty').value);
    const cat = document.getElementById('p-cat').value;
    const size = document.getElementById('p-size').value;

    if(!price || !qty || nameSelect.value === "") {
        return alert("Please fill in all required fields");
    }

    const item = {
        name: name,
        price: price,
        cat: cat,
        size: size,
        qty: qty,
        total: price * qty
    };

    if (editIndex > -1) {
        purchaseList[editIndex] = item; //Edit existing item
        editIndex = -1;                 //Reset to Add mode
    } else {
        purchaseList.push(item); //Add new item
    }

    loadTable();
    closeModal('add-modal');
    resetAddModal();
}

//--LOAD TABLE--
function loadTable() {
    const tbody = document.getElementById('purchase-body');
    const footer = document.getElementById('purchase-footer');
    tbody.innerHTML = '';
    let grandTotal = 0;

    footer.style.display = purchaseList.length > 0 ? 'flex' : 'none';

    purchaseList.forEach((item, index) => {
        grandTotal += item.total;
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.size}</td> <td>${item.cat}</td>
                <td>${item.qty}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${item.total.toFixed(2)}</td>
                <td>
                    <button onclick="editItem(${index})" style="color:blue; border:none; background:none; cursor:pointer; margin-right:10px;">EDIT DETAILS</button>
                    <button onclick="removeItem(${index})" style="color:red; border:none; background:none; cursor:pointer;">Remove</button>
                </td>
            </tr>`;
    });

    document.getElementById('grand-total').innerText = grandTotal.toFixed(2);
}

function editItem(index) {
    editIndex = index;
    const item = purchaseList[index];

    document.querySelector('#add-modal .modal-title').innerText = "EDIT PRODUCT";

    const productKey = Object.keys(productDb).find(key => {
        return item.name === `Product ${key.slice(2)}` || item.name === key;
    });

    if (productKey) {
        document.getElementById('p-name').value = productKey;
        updateProductDetails(); 
    }
    
    document.getElementById('p-qty').value = item.qty;
    document.getElementById('p-total').value = item.total.toFixed(2);

    openAddModal();
}

function removeItem(index) {
    purchaseList.splice(index, 1);
    loadTable();
}

//--TWO-STEP CHECKOUT LOGIC--
function openCheckoutModal() {
    //Reset to first part every time modal opens
    document.getElementById('checkout-step-1').style.display = 'block';
    document.getElementById('checkout-step-2').style.display = 'none';
    
    const total = document.getElementById('grand-total').innerText;
    document.getElementById('summary-total').innerText = total;
    document.getElementById('pay-amount').value = '';
    document.getElementById('checkout-modal').style.display = 'flex';
}

function processPayment() {
    const total = parseFloat(document.getElementById('grand-total').innerText);
    const payment = parseFloat(document.getElementById('pay-amount').value) || 0;

    if (payment < total) {
        return alert("Insufficient amount. Please enter an amount equal to or greater than the total.");
    }

    const change = payment - total;

    //Part 2 Checkout Modal
    document.getElementById('summary-payment').innerText = payment.toFixed(2);
    document.getElementById('summary-change').innerText = change.toFixed(2);

    //Switch Views
    document.getElementById('checkout-step-1').style.display = 'none';
    document.getElementById('checkout-step-2').style.display = 'block';
}

function finalizePurchase() {
    alert("Purchase Successful!");
    purchaseList = [];
    loadTable();
    closeModal('checkout-modal');
}

//--MODAL HELPERS--
function openAddModal() {
    if (editIndex === -1) {
        document.querySelector('#add-modal .modal-title').innerText = "ADD PRODUCT";
    }
    document.getElementById('add-modal').style.display = 'flex';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
    if(id === 'add-modal') {
        editIndex = -1; //Ensure reset if user cancels an edit
    }
}

function resetAddModal() {
    document.getElementById('p-name').selectedIndex = 0;
    document.getElementById('p-price').value = '';
    document.getElementById('p-cat').value = '';
    document.getElementById('p-barcode').value = '';
    document.getElementById('p-size').value = '';
    document.getElementById('p-qty').value = 1;
    document.getElementById('p-total').value = '0.00';
}