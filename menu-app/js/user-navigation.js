/**
 * User Navigation Management
 * Handles user authentication state in navigation
 */

// Initialize user navigation when page loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('User navigation initializing...');
    
    // Initialize database first
    if (typeof initializeDatabase === 'function') {
        initializeDatabase();
    }
    
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        console.log('Updating user navigation...');
        updateUserNavigation();
        updateCartCount();
    }, 500);
});

// Listen for user authentication changes
document.addEventListener('userAuthChange', function(e) {
    console.log('User auth change detected in navigation:', e.detail.type);
    
    // Update navigation immediately
    setTimeout(() => {
        updateUserNavigation();
        updateCartCount();
    }, 100);
});

/**
 * Update user navigation based on login status
 */
function updateUserNavigation() {
    console.log('updateUserNavigation called');
    
    // Add dropdown styles
    addDropdownStyles();
    
    const userNavElement = document.getElementById('userNav');
    
    if (!userNavElement) {
        console.log('userNav element not found');
        return;
    }
    
    // Check if user is logged in
    const isLoggedIn = UserAuth && UserAuth.isLoggedIn && UserAuth.isLoggedIn();
    console.log('User logged in status:', isLoggedIn);
    
    if (isLoggedIn) {
        const currentUser = UserAuth.getCurrentUser();
        console.log('Current user data:', currentUser);
        
        if (currentUser) {
            console.log('Showing user profile for:', currentUser.fullName || currentUser.username);
            // Show ONLY user name with dropdown - NO login/register buttons
            userNavElement.innerHTML = `
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle user-profile-link" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fas fa-user-circle me-2"></i>
                        ${currentUser.fullName || currentUser.username}
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end user-dropdown-menu">
                        <li><a class="dropdown-item user-logout-item" href="#" onclick="logoutUser()">
                            <i class="fas fa-sign-out-alt me-2"></i>Logout
                        </a></li>
                    </ul>
                </div>
            `;
            console.log('User navigation HTML updated');
        } else {
            console.log('Current user is null');
        }
    } else {
        // Show ONLY guest navigation (Login & Register buttons) - NO user name
        console.log('Showing guest navigation');
        userNavElement.innerHTML = `
            <div class="d-flex align-items-center">
                <a class="nav-link me-2" href="register.html" style="color: var(--luxury-cream); text-decoration: none;">
                    <i class="fas fa-user-plus me-1"></i>Daftar
                </a>
                <a class="nav-link" href="login.html" style="color: var(--luxury-gold); text-decoration: none;">
                    <i class="fas fa-sign-in-alt me-1"></i>Login
                </a>
            </div>
        `;
        console.log('Guest navigation HTML updated');
    }
}

/**
 * Update cart count in navigation
 */
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const cartCountElements = document.querySelectorAll('.cart-count');
    
    cartCountElements.forEach(element => {
        if (cartItems.length > 0) {
            element.textContent = cartItems.length;
            element.style.display = 'inline';
        } else {
            element.style.display = 'none';
        }
    });
}

/**
 * Logout user function
 */
function logoutUser() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        UserAuth.logout();
        
        // Dispatch logout event
        const event = new CustomEvent('userAuthChange', {
            detail: {
                type: 'logout',
                user: null
            }
        });
        document.dispatchEvent(event);
        
        // Show success message
        showToast('Logout berhasil!', 'success');
        
        // Redirect to menu page after short delay
        setTimeout(() => {
            window.location.href = 'menu.html';
        }, 1000);
    }
}

/**
 * Show user profile modal
 */
function showProfile() {
    const currentUser = UserAuth.getCurrentUser();
    if (!currentUser) return;
    
    const profileModal = `
        <div class="modal fade" id="profileModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: var(--luxury-gold); color: var(--luxury-black);">
                        <h5 class="modal-title">
                            <i class="fas fa-user-circle me-2"></i>Profile Saya
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="profileForm">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Nama Lengkap</label>
                                    <input type="text" class="form-control" name="fullName" value="${currentUser.fullName}" required>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Username</label>
                                    <input type="text" class="form-control" value="${currentUser.username}" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" value="${currentUser.email}" readonly>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <label class="form-label">Telepon</label>
                                    <input type="text" class="form-control" name="phone" value="${currentUser.phone || ''}">
                                </div>
                                <div class="col-12 mb-3">
                                    <label class="form-label">Alamat</label>
                                    <textarea class="form-control" name="address" rows="3">${currentUser.address || ''}</textarea>
                                </div>
                            </div>
                            <div id="profileAlert" style="display: none;"></div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                        <button type="button" class="btn btn-luxury" onclick="updateProfile()">Update Profile</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('profileModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', profileModal);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

/**
 * Update user profile
 */
function updateProfile() {
    const form = document.getElementById('profileForm');
    const alertContainer = document.getElementById('profileAlert');
    const currentUser = UserAuth.getCurrentUser();
    
    if (!form || !currentUser) return;
    
    const formData = new FormData(form);
    const updateData = {
        fullName: formData.get('fullName'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    // Validate
    if (!updateData.fullName || updateData.fullName.length < 3) {
        showAlert(alertContainer, 'Nama lengkap minimal 3 karakter', 'error');
        return;
    }
    
    // Update profile
    const result = UserAuth.updateProfile(currentUser.id, updateData);
    
    if (result.success) {
        showAlert(alertContainer, result.message, 'success');
        
        // Update user nav
        setTimeout(() => {
            updateUserNavigation();
            bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
            showToast('Profile berhasil diupdate!', 'success');
        }, 1500);
    } else {
        showAlert(alertContainer, result.message, 'error');
    }
}

/**
 * Show user orders
 */
function showOrders() {
    const currentUser = UserAuth.getCurrentUser();
    if (!currentUser) return;
    
    // Get user orders from database
    const orders = DatabaseManager.getOrdersByCustomer(currentUser.id);
    
    const ordersModal = `
        <div class="modal fade" id="ordersModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header" style="background: var(--luxury-gold); color: var(--luxury-black);">
                        <h5 class="modal-title">
                            <i class="fas fa-shopping-bag me-2"></i>Riwayat Pesanan
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="ordersContent">
                            ${orders.length > 0 ? generateOrdersTable(orders) : '<p class="text-center text-muted">Belum ada pesanan</p>'}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('ordersModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', ordersModal);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('ordersModal'));
    modal.show();
}

/**
 * Generate orders table HTML
 */
function generateOrdersTable(orders) {
    return `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>ID Pesanan</th>
                        <th>Tanggal</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td>${order.id}</td>
                            <td>${new Date(order.createdAt).toLocaleDateString('id-ID')}</td>
                            <td>${order.items.length} item(s)</td>
                            <td>Rp ${order.total.toLocaleString('id-ID')}</td>
                            <td>
                                <span class="badge ${getStatusBadgeClass(order.status)}">
                                    ${order.status}
                                </span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status) {
    switch(status) {
        case 'pending': return 'bg-warning';
        case 'processing': return 'bg-info';
        case 'completed': return 'bg-success';
        case 'cancelled': return 'bg-danger';
        default: return 'bg-secondary';
    }
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info', duration = 3000) {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles if not already present
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--luxury-black);
                color: var(--luxury-cream);
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 9999;
                animation: slideInRight 0.3s ease;
                max-width: 350px;
                border-left: 4px solid var(--luxury-gold);
            }
            .toast-success { border-left-color: #28a745; }
            .toast-error { border-left-color: #dc3545; }
            .toast-info { border-left-color: var(--luxury-gold); }
            .toast-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add to body
    document.body.appendChild(toast);
    
    // Remove after duration
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, duration);
}

// Make toast function globally available
window.showToast = showToast;

/**
 * Show alert in container
 */
function showAlert(container, message, type) {
    if (!container) return;
    
    const alertClass = type === 'error' ? 'alert-danger' : 
                      type === 'success' ? 'alert-success' : 'alert-info';
    
    const iconClass = type === 'error' ? 'fa-exclamation-circle' : 
                     type === 'success' ? 'fa-check-circle' : 'fa-info-circle';
    
    container.innerHTML = `
        <div class="alert ${alertClass}" role="alert">
            <i class="fas ${iconClass} me-2"></i>
            ${message}
        </div>
    `;
    container.style.display = 'block';
    
    // Scroll to alert
    container.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Auto hide after 5 seconds for success messages
    if (type === 'success' || type === 'info') {
        setTimeout(() => {
            container.style.display = 'none';
        }, 5000);
    }
}

/**
 * Show user favorites
 */
function showFavorites() {
    const currentUser = UserAuth.getCurrentUser();
    if (!currentUser) return;
    
    // Get user favorites from localStorage
    const favorites = JSON.parse(localStorage.getItem(`user_favorites_${currentUser.id}`) || '[]');
    
    const favoritesModal = `
        <div class="modal fade" id="favoritesModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header" style="background: var(--luxury-gold); color: var(--luxury-black);">
                        <h5 class="modal-title">
                            <i class="fas fa-heart me-2"></i>Menu Favorit Saya
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div id="favoritesContent">
                            ${favorites.length > 0 ? generateFavoritesGrid(favorites) : '<div class="text-center text-muted py-5"><i class="fas fa-heart fa-3x mb-3"></i><p>Belum ada menu favorit</p><p><small>Tambahkan menu ke favorit dari halaman menu</small></p></div>'}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    const existingModal = document.getElementById('favoritesModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', favoritesModal);
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('favoritesModal'));
    modal.show();
}

/**
 * Generate favorites grid HTML
 */
function generateFavoritesGrid(favorites) {
    // Get menu data to match favorites
    const allMenus = DatabaseManager.getAllMenus();
    const favoriteMenus = favorites.map(favId => allMenus.find(menu => menu.id == favId)).filter(Boolean);
    
    if (favoriteMenus.length === 0) {
        return '<div class="text-center text-muted py-5"><i class="fas fa-heart fa-3x mb-3"></i><p>Menu favorit tidak ditemukan</p></div>';
    }
    
    return `
        <div class="row">
            ${favoriteMenus.map(menu => `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 shadow-sm">
                        <img src="${menu.image}" class="card-img-top" style="height: 200px; object-fit: cover;" alt="${menu.name}">
                        <div class="card-body d-flex flex-column">
                            <h6 class="card-title">${menu.name}</h6>
                            <p class="card-text text-muted small flex-grow-1">${menu.description.substring(0, 80)}...</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="h6 mb-0" style="color: var(--luxury-gold);">Rp ${menu.price.toLocaleString('id-ID')}</span>
                                <button class="btn btn-sm btn-outline-danger" onclick="removeFavorite(${menu.id})" title="Hapus dari favorit">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

/**
 * Remove item from favorites
 */
function removeFavorite(menuId) {
    const currentUser = UserAuth.getCurrentUser();
    if (!currentUser) return;
    
    const favoritesKey = `user_favorites_${currentUser.id}`;
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    
    favorites = favorites.filter(id => id != menuId);
    localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    
    // Refresh modal content
    showFavorites();
    showToast('Menu dihapus dari favorit', 'info');
}

/**
 * Add dropdown menu styles for better visibility
 */
function addDropdownStyles() {
    if (!document.getElementById('user-dropdown-styles')) {
        const style = document.createElement('style');
        style.id = 'user-dropdown-styles';
        style.textContent = `
            /* User Profile Link Styling */
            .user-profile-link {
                color: var(--luxury-gold) !important;
                font-weight: 600 !important;
                display: flex !important;
                align-items: center !important;
                text-decoration: none !important;
                padding: 8px 15px !important;
                border-radius: 25px !important;
                transition: all 0.3s ease !important;
                background: rgba(212, 175, 55, 0.1) !important;
                border: 1px solid var(--luxury-gold) !important;
            }
            
            .user-profile-link:hover {
                background: var(--luxury-gold) !important;
                color: var(--luxury-black) !important;
                transform: translateY(-1px) !important;
                box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3) !important;
            }
            
            .user-profile-link i {
                font-size: 18px !important;
                color: inherit !important;
            }
            
            /* Dropdown Menu Styling */
            .user-dropdown-menu {
                background: white !important;
                border: 2px solid var(--luxury-gold) !important;
                border-radius: 8px !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
                min-width: 160px !important;
                padding: 8px 0 !important;
                margin-top: 8px !important;
            }
            
            .user-logout-item {
                color: #333 !important;
                font-weight: 500 !important;
                padding: 12px 20px !important;
                transition: all 0.3s ease !important;
                display: flex !important;
                align-items: center !important;
            }
            
            .user-logout-item:hover {
                background: #dc3545 !important;
                color: white !important;
            }
            
            .user-logout-item i {
                color: #dc3545 !important;
                width: 20px !important;
                font-size: 16px !important;
            }
            
            .user-logout-item:hover i {
                color: white !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export functions for global use
window.updateUserNavigation = updateUserNavigation;
window.updateCartCount = updateCartCount;
window.logoutUser = logoutUser;
window.showProfile = showProfile;
window.updateProfile = updateProfile;
window.showOrders = showOrders;
window.showFavorites = showFavorites;
window.removeFavorite = removeFavorite;
window.showToast = showToast;
addDropdownStyles();
