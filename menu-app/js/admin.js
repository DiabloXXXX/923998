/**
 * Admin Panel JavaScript - Maison du Croissant
 * Handles admin interface functionality
 */

// Global variables
let currentSection = 'dashboard';
let editingMenuId = null;
let salesChart = null;

// Initialize admin panel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

/**
 * Initialize admin panel
 */
function initializeAdmin() {
    // Hide spinner
    setTimeout(() => {
        document.getElementById('spinner').classList.remove('show');
    }, 500);
    
    // Load initial data
    loadDashboardData();
    loadMenuData();
    loadOrdersData();
    
    // Initialize chart
    initializeSalesChart();
    
    // Setup search functionality
    setupSearch();
    
    // Setup image preview
    setupImagePreview();
    
    console.log('Admin panel initialized');
}

/**
 * Show specific admin section
 */
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to selected menu item
    document.querySelector(`[onclick="showSection('${sectionName}')"]`).classList.add('active');
    
    currentSection = sectionName;
    
    // Load section-specific data
    switch(sectionName) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'menu-management':
            loadMenuData();
            break;
        case 'orders':
            loadOrdersData();
            break;
    }
}

/**
 * Load dashboard data
 */
function loadDashboardData() {
    const menus = getMenusFromStorage();
    const orders = getOrdersFromStorage();
    
    // Update stats
    document.getElementById('totalMenus').textContent = menus.length;
    document.getElementById('todayOrders').textContent = getTodayOrdersCount(orders);
    document.getElementById('todayRevenue').textContent = formatCurrency(getTodayRevenue(orders));
    document.getElementById('totalCustomers').textContent = getUniqueCustomersCount(orders);
    
    // Load popular menus
    loadPopularMenus();
    
    // Update chart
    updateSalesChart();
}

/**
 * Load menu data
 */
function loadMenuData() {
    const menus = getMenusFromStorage();
    const tbody = document.getElementById('menuTableBody');
    
    tbody.innerHTML = '';
    
    menus.forEach(menu => {
        const row = createMenuTableRow(menu);
        tbody.appendChild(row);
    });
}

/**
 * Create menu table row
 */
function createMenuTableRow(menu) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td>${menu.id}</td>
        <td>
            <img src="${menu.image}" alt="${menu.name}" class="rounded" style="width: 50px; height: 50px; object-fit: cover;">
        </td>
        <td>
            <strong>${menu.name}</strong>
            <br>
            <small class="text-muted">${menu.description.substring(0, 50)}...</small>
        </td>
        <td><span class="badge bg-secondary">${menu.category}</span></td>
        <td><strong>${formatCurrency(menu.price)}</strong></td>
        <td>
            <span class="status-badge status-${menu.status}">
                ${menu.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
            </span>
        </td>
        <td>
            <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" onclick="editMenu(${menu.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-danger" onclick="deleteMenu(${menu.id})" title="Hapus">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="btn btn-outline-secondary" onclick="toggleMenuStatus(${menu.id})" title="Toggle Status">
                    <i class="fas fa-power-off"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Show add menu modal
 */
function showAddMenuModal() {
    editingMenuId = null;
    document.getElementById('menuModalTitle').textContent = 'Tambah Menu Baru';
    document.getElementById('menuForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
    
    const modal = new bootstrap.Modal(document.getElementById('menuModal'));
    modal.show();
}

/**
 * Edit menu
 */
function editMenu(menuId) {
    const menus = getMenusFromStorage();
    const menu = menus.find(m => m.id === menuId);
    
    if (!menu) {
        showAlert('Menu tidak ditemukan', 'error');
        return;
    }
    
    editingMenuId = menuId;
    document.getElementById('menuModalTitle').textContent = 'Edit Menu';
    
    // Fill form with menu data
    document.getElementById('menuId').value = menu.id;
    document.getElementById('menuName').value = menu.name;
    document.getElementById('menuCategory').value = menu.category;
    document.getElementById('menuPrice').value = menu.price;
    document.getElementById('menuStatus').value = menu.status;
    document.getElementById('menuDescription').value = menu.description;
    document.getElementById('menuFeatures').value = menu.features || '';
    
    // Show image preview
    if (menu.image) {
        document.getElementById('imagePreview').innerHTML = `
            <img src="${menu.image}" alt="Current image" class="image-preview img-fluid">
        `;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('menuModal'));
    modal.show();
}

/**
 * Save menu (add or update)
 */
function saveMenu() {
    const form = document.getElementById('menuForm');
    const formData = new FormData(form);
    
    // Validate form
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const menuData = {
        name: formData.get('menuName'),
        category: formData.get('menuCategory'),
        price: parseInt(formData.get('menuPrice')),
        status: formData.get('menuStatus'),
        description: formData.get('menuDescription'),
        features: formData.get('menuFeatures') || '',
        image: null // Will be set below
    };
    
    // Handle image
    const imageFile = formData.get('menuImage');
    if (imageFile && imageFile.size > 0) {
        // In a real application, you would upload this to a server
        // For now, we'll use a placeholder or existing image
        const reader = new FileReader();
        reader.onload = function(e) {
            menuData.image = e.target.result;
            saveMenuData(menuData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Use existing image if editing
        if (editingMenuId) {
            const menus = getMenusFromStorage();
            const existingMenu = menus.find(m => m.id === editingMenuId);
            menuData.image = existingMenu ? existingMenu.image : getDefaultMenuImage(menuData.category);
        } else {
            menuData.image = getDefaultMenuImage(menuData.category);
        }
        saveMenuData(menuData);
    }
}

/**
 * Save menu data to storage
 */
function saveMenuData(menuData) {
    let menus = getMenusFromStorage();
    
    if (editingMenuId) {
        // Update existing menu
        const index = menus.findIndex(m => m.id === editingMenuId);
        if (index !== -1) {
            menus[index] = { ...menus[index], ...menuData };
            showAlert('Menu berhasil diperbarui!', 'success');
        }
    } else {
        // Add new menu
        const newId = menus.length > 0 ? Math.max(...menus.map(m => m.id)) + 1 : 1;
        menuData.id = newId;
        menuData.createdAt = new Date().toISOString();
        menus.push(menuData);
        showAlert('Menu baru berhasil ditambahkan!', 'success');
    }
    
    // Save to storage
    saveMenusToStorage(menus);
    
    // Reload data
    loadMenuData();
    loadDashboardData();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('menuModal'));
    modal.hide();
}

/**
 * Delete menu
 */
function deleteMenu(menuId) {
    const menus = getMenusFromStorage();
    const menu = menus.find(m => m.id === menuId);
    
    if (!menu) {
        showAlert('Menu tidak ditemukan', 'error');
        return;
    }
    
    // Show confirmation modal
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
    
    // Set up confirmation button
    document.getElementById('confirmDelete').onclick = function() {
        const updatedMenus = menus.filter(m => m.id !== menuId);
        saveMenusToStorage(updatedMenus);
        
        showAlert('Menu berhasil dihapus!', 'success');
        loadMenuData();
        loadDashboardData();
        
        modal.hide();
    };
}

/**
 * Toggle menu status
 */
function toggleMenuStatus(menuId) {
    const menus = getMenusFromStorage();
    const menu = menus.find(m => m.id === menuId);
    
    if (!menu) {
        showAlert('Menu tidak ditemukan', 'error');
        return;
    }
    
    menu.status = menu.status === 'active' ? 'inactive' : 'active';
    saveMenusToStorage(menus);
    
    showAlert(`Menu ${menu.status === 'active' ? 'diaktifkan' : 'dinonaktifkan'}!`, 'success');
    loadMenuData();
    loadDashboardData();
}

/**
 * Load orders data
 */
function loadOrdersData() {
    const orders = getOrdersFromStorage();
    const tbody = document.getElementById('ordersTableBody');
    
    tbody.innerHTML = '';
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-4">
                    <i class="fas fa-shopping-cart fa-2x text-muted mb-2"></i>
                    <p class="text-muted">Belum ada pesanan</p>
                </td>
            </tr>
        `;
        return;
    }
    
    orders.forEach(order => {
        const row = createOrderTableRow(order);
        tbody.appendChild(row);
    });
}

/**
 * Create order table row
 */
function createOrderTableRow(order) {
    const row = document.createElement('tr');
    
    row.innerHTML = `
        <td><strong>#${order.id}</strong></td>
        <td>${formatDate(order.date)}</td>
        <td>
            <strong>${order.customerName}</strong>
            <br>
            <small class="text-muted">${order.customerPhone}</small>
        </td>
        <td>
            <small>${order.items.length} item(s)</small>
            <br>
            <button class="btn btn-sm btn-outline-info" onclick="showOrderItems(${order.id})">Detail</button>
        </td>
        <td><strong>${formatCurrency(order.total)}</strong></td>
        <td>
            <span class="status-badge status-${order.status}">
                ${getOrderStatusText(order.status)}
            </span>
        </td>
        <td>
            <div class="btn-group btn-group-sm">
                <button class="btn btn-outline-primary" onclick="updateOrderStatus(${order.id})" title="Update Status">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-success" onclick="viewOrderDetails(${order.id})" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </td>
    `;
    
    return row;
}

/**
 * Initialize sales chart
 */
function initializeSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    salesChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Penjualan (Rp)',
                data: [1200000, 1900000, 3000000, 5000000, 2000000, 3000000],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return formatCurrency(value);
                        }
                    }
                }
            }
        }
    });
}

/**
 * Update sales chart
 */
function updateSalesChart() {
    if (!salesChart) return;
    
    // In a real application, you would fetch actual sales data
    // For demo purposes, we'll use sample data
    const sampleData = [1200000, 1900000, 3000000, 5000000, 2000000, 3000000];
    salesChart.data.datasets[0].data = sampleData;
    salesChart.update();
}

/**
 * Load popular menus
 */
function loadPopularMenus() {
    const menus = getMenusFromStorage();
    const container = document.getElementById('popularMenus');
    
    // Get first 5 menus as popular (in real app, this would be based on sales data)
    const popularMenus = menus.slice(0, 5);
    
    container.innerHTML = '';
    
    if (popularMenus.length === 0) {
        container.innerHTML = '<p class="text-muted">Belum ada data menu populer</p>';
        return;
    }
    
    popularMenus.forEach(menu => {
        const item = document.createElement('div');
        item.className = 'popular-menu-item';
        item.innerHTML = `
            <img src="${menu.image}" alt="${menu.name}" class="popular-menu-image">
            <div class="popular-menu-info flex-grow-1">
                <h6>${menu.name}</h6>
                <small>${formatCurrency(menu.price)}</small>
            </div>
        `;
        container.appendChild(item);
    });
}

/**
 * Setup search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('searchMenu');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const rows = document.querySelectorAll('#menuTableBody tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    }
}

/**
 * Setup image preview
 */
function setupImagePreview() {
    const imageInput = document.getElementById('menuImage');
    if (imageInput) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            const preview = document.getElementById('imagePreview');
            
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    preview.innerHTML = `
                        <img src="${e.target.result}" alt="Preview" class="image-preview img-fluid">
                    `;
                };
                reader.readAsDataURL(file);
            } else {
                preview.innerHTML = '';
            }
        });
    }
}

/**
 * Get default menu image based on category
 */
function getDefaultMenuImage(category) {
    const defaults = {
        'Pastry': 'img/pastry1.jpg',
        'Bread': 'img/best-product-1.jpg',
        'Cake': 'img/best-product-2.jpg',
        'Drink': 'img/drink1.jpg',
        'Coffee': 'img/drink2.jpg'
    };
    
    return defaults[category] || 'img/pastry1.jpg';
}

/**
 * Utility functions
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getTodayOrdersCount(orders) {
    const today = new Date().toDateString();
    return orders.filter(order => 
        new Date(order.date).toDateString() === today
    ).length;
}

function getTodayRevenue(orders) {
    const today = new Date().toDateString();
    return orders
        .filter(order => new Date(order.date).toDateString() === today)
        .reduce((total, order) => total + order.total, 0);
}

function getUniqueCustomersCount(orders) {
    const uniqueCustomers = new Set(orders.map(order => order.customerPhone));
    return uniqueCustomers.size;
}

function getOrderStatusText(status) {
    const statusTexts = {
        'pending': 'Pending',
        'confirmed': 'Dikonfirmasi',
        'preparing': 'Sedang Disiapkan',
        'ready': 'Siap Diambil',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    
    return statusTexts[status] || status;
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    alert.style.top = '80px';
    alert.style.right = '20px';
    alert.style.zIndex = '9999';
    alert.style.minWidth = '300px';
    
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        // Clear any stored admin session data
        localStorage.removeItem('adminLoggedIn');
        
        // Redirect to login page
        window.location.href = 'login.html';
    }
}

// Additional utility functions for orders
function showOrderItems(orderId) {
    // Implementation for showing order items detail
    console.log('Show order items for order:', orderId);
}

function updateOrderStatus(orderId) {
    // Implementation for updating order status
    console.log('Update order status for order:', orderId);
}

function viewOrderDetails(orderId) {
    // Implementation for viewing full order details
    console.log('View order details for order:', orderId);
}
