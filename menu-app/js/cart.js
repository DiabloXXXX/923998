// Cart Management JavaScript
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateCartDisplay();
    
    // Add click event listeners to remove buttons (static content)
    document.querySelectorAll('button[title="Hapus item"]').forEach(button => {
        button.addEventListener('click', function() {
            showNotification('Produk telah dihapus dari keranjang', 'info');
        });
    });
    
    // Add click event listeners to quantity buttons
    const quantityButtons = document.querySelectorAll('.input-group .btn');
    quantityButtons.forEach(button => {
        button.addEventListener('click', function() {
            const icon = button.querySelector('i');
            if (icon.classList.contains('fa-plus')) {
                showNotification('Kuantitas ditambah', 'success');
            } else if (icon.classList.contains('fa-minus')) {
                showNotification('Kuantitas dikurangi', 'info');
            }
        });
    });
});

function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tableBody = document.querySelector('table tbody');
    
    if (cart.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5">
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart fa-3x mb-3" style="color: var(--luxury-gold);"></i>
                        <h4 style="color: var(--luxury-black); font-family: 'Playfair Display', serif;">Keranjang Kosong</h4>
                        <p style="color: var(--luxury-black); opacity: 0.7;">Silakan pilih produk dari menu untuk mulai berbelanja</p>
                        <a href="menu.html" class="btn btn-luxury-primary">
                            <i class="fas fa-shopping-bag me-2"></i>
                            Mulai Belanja
                        </a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    let cartHTML = '';
    cart.forEach((item, index) => {
        cartHTML += `
            <tr data-index="${index}">
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="img-fluid rounded-circle" style="width: 80px; height: 80px; object-fit: cover;" alt="${item.name}" />
                    </div>
                </td>
                <td class="align-middle">
                    <p class="mb-0" style="color: var(--luxury-black); font-weight: 500;">${item.name}</p>
                </td>
                <td class="align-middle">
                    <p class="mb-0" style="color: var(--luxury-gold); font-weight: 600;">${item.price}</p>
                </td>
                <td class="align-middle">
                    <div class="input-group" style="width: 120px;">
                        <button class="btn btn-sm" style="background: var(--luxury-gold); border: 1px solid var(--luxury-gold); color: var(--luxury-black); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" type="button" onclick="updateQuantity(${index}, -1)">
                            <i class="fa fa-minus" style="font-size: 0.75rem;"></i>
                        </button>
                        <input type="text" class="form-control form-control-sm text-center" style="border: 1px solid var(--luxury-gold); max-width: 56px;" value="${item.quantity}" readonly />
                        <button class="btn btn-sm" style="background: var(--luxury-gold); border: 1px solid var(--luxury-gold); color: var(--luxury-black); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" type="button" onclick="updateQuantity(${index}, 1)">
                            <i class="fa fa-plus" style="font-size: 0.75rem;"></i>
                        </button>
                    </div>
                </td>
                <td class="align-middle">
                    <p class="mb-0" style="color: var(--luxury-gold); font-weight: 600;">Rp ${(item.priceNum * item.quantity).toLocaleString('id-ID')}</p>
                </td>
                <td class="align-middle">
                    <button class="btn btn-sm" style="background: #dc3545; border: 1px solid #dc3545; color: white; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;" title="Hapus item" onclick="removeFromCart(${index})">
                        <i class="fa fa-times" style="font-size: 0.75rem;"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    tableBody.innerHTML = cartHTML;
}

function updateQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems();
        updateCartDisplay();
    }
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCartItems();
    updateCartDisplay();
    
    // Show notification
    showNotification('Produk telah dihapus dari keranjang', 'info');
}

function updateCartDisplay() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    let subtotal = 0;
    
    cart.forEach(item => {
        subtotal += item.priceNum * item.quantity;
    });
    
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    // Update subtotal, tax, and total
    const subtotalEl = document.querySelector('.d-flex.justify-content-between.mb-4 p');
    const taxEl = document.querySelector('.d-flex.justify-content-between:nth-child(2) p');
    const totalEl = document.getElementById('cartTotal');
    
    if (subtotalEl) subtotalEl.textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
    if (taxEl) taxEl.textContent = 'PPN 10%: Rp ' + tax.toLocaleString('id-ID');
    if (totalEl) totalEl.textContent = 'Rp ' + total.toLocaleString('id-ID');
    
    // Update cart count in navbar
    updateCartCount();
}

function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-luxury-${type} position-fixed`;
    notification.style.cssText = `
        top: 50%; 
        left: 50%; 
        transform: translate(-50%, -50%); 
        z-index: 9999; 
        min-width: 300px;
        background: var(--luxury-cream);
        border: 2px solid var(--luxury-gold);
        color: var(--luxury-black);
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'} me-2" style="color: var(--luxury-gold);"></i>
            <span style="color: var(--luxury-black); font-weight: 500;">${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize cart count in navbar (if exists)
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update cart badge if exists
    const cartBadge = document.querySelector('.cart-count');
    if (cartBadge) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = totalItems > 0 ? 'block' : 'none';
    }
}
