/**
 * User Authentication - Maison du Croissant
 * Handles user login and registration
 */

// User form handlers
document.addEventListener('DOMContentLoaded', function() {
    // Initialize database
    if (typeof initializeDatabase === 'function') {
        initializeDatabase();
    }
    
    // Handle registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        handleRegistrationForm(registerForm);
    }
    
    // Handle login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        handleLoginForm(loginForm);
    }
    
    // Check if user is already logged in
    if (UserAuth && UserAuth.isLoggedIn()) {
        showLoggedInState();
    }
});

/**
 * Handle registration form submission
 */
function handleRegistrationForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertContainer = document.getElementById('registerAlert');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading
        showButtonLoading(submitBtn, 'Mendaftar...');
        
        // Get form data
        const formData = new FormData(form);
        const userData = {
            fullName: formData.get('fullName'),
            username: formData.get('username'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            password: formData.get('password')
        };
        
        // Validate form
        const validation = validateRegistrationForm(userData, formData.get('confirmPassword'));
        if (!validation.isValid) {
            showAlert(alertContainer, validation.message, 'error');
            hideButtonLoading(submitBtn, 'Daftar Sekarang');
            return;
        }
        
        // Simulate server delay
        setTimeout(() => {
            // Register user
            const result = UserAuth.register(userData);
            
            if (result.success) {
                // Dispatch register event
                dispatchUserAuthEvent('register', result.user);
                
                showAlert(alertContainer, result.message + ' Mengarahkan ke halaman login...', 'success');
                
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                showAlert(alertContainer, result.message, 'error');
                hideButtonLoading(submitBtn, 'Daftar Sekarang');
            }
        }, 1000);
    });
}

/**
 * Handle login form submission
 */
function handleLoginForm(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const alertContainer = document.getElementById('loginAlert');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading
        showButtonLoading(submitBtn, 'Masuk...');
        
        // Get form data
        const formData = new FormData(form);
        const credentials = {
            username: formData.get('username'), // This can be username or email
            password: formData.get('password')
        };
        const rememberMe = formData.get('rememberMe') === 'on';
        
        // Validate form
        if (!credentials.username || !credentials.password) {
            showAlert(alertContainer, 'Username/email dan password harus diisi', 'error');
            hideButtonLoading(submitBtn, 'Masuk');
            return;
        }
        
        // Simulate server delay
        setTimeout(() => {
            // Login user
            const result = UserAuth.login(credentials);
            
            if (result.success) {
                // Set user session
                UserAuth.setCurrentUser(result.user, rememberMe);
                
                // Dispatch login event
                dispatchUserAuthEvent('login', result.user);
                
                showAlert(alertContainer, result.message + ' Mengarahkan ke menu...', 'success');
                
                // Redirect to menu page after 1.5 seconds
                setTimeout(() => {
                    window.location.href = 'menu.html';
                }, 1500);
            } else {
                showAlert(alertContainer, result.message, 'error');
                hideButtonLoading(submitBtn, 'Masuk');
            }
        }, 1000);
    });
}

/**
 * Validate registration form
 */
function validateRegistrationForm(userData, confirmPassword) {
    // Check required fields
    if (!userData.fullName || userData.fullName.length < 3) {
        return { isValid: false, message: 'Nama lengkap minimal 3 karakter' };
    }
    
    if (!userData.username || userData.username.length < 3) {
        return { isValid: false, message: 'Username minimal 3 karakter' };
    }
    
    if (!userData.email || !isValidEmail(userData.email)) {
        return { isValid: false, message: 'Email tidak valid' };
    }
    
    if (!userData.password || userData.password.length < 6) {
        return { isValid: false, message: 'Password minimal 6 karakter' };
    }
    
    if (userData.password !== confirmPassword) {
        return { isValid: false, message: 'Password tidak sama' };
    }
    
    // Validate username format
    if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
        return { isValid: false, message: 'Username hanya boleh huruf, angka, dan underscore' };
    }
    
    return { isValid: true };
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show alert message
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
 * Show button loading state
 */
function showButtonLoading(button, loadingText) {
    if (!button) return;
    
    button.disabled = true;
    button.dataset.originalText = button.innerHTML;
    button.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        ${loadingText}
    `;
    button.classList.add('loading');
}

/**
 * Hide button loading state
 */
function hideButtonLoading(button, originalText) {
    if (!button) return;
    
    button.disabled = false;
    button.innerHTML = originalText || button.dataset.originalText || 'Submit';
    button.classList.remove('loading');
}

/**
 * Show logged in state
 */
function showLoggedInState() {
    const currentUser = UserAuth.getCurrentUser();
    if (!currentUser) return;
    
    // Update navbar or show user info
    const userNavElement = document.getElementById('userNav');
    if (userNavElement) {
        userNavElement.innerHTML = `
            <div class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user me-2"></i>${currentUser.fullName}
                </a>
                <ul class="dropdown-menu dropdown-menu-end">
                    <li><a class="dropdown-item" href="#" onclick="showProfile()">
                        <i class="fas fa-user-circle me-2"></i>Profile
                    </a></li>
                    <li><a class="dropdown-item" href="#" onclick="showOrders()">
                        <i class="fas fa-shopping-bag me-2"></i>Pesanan Saya
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            </div>
        `;
        
        // Hide guest navigation
        const guestNav = document.getElementById('guestNav');
        if (guestNav) {
            guestNav.style.display = 'none';
        }
    }
}

/**
 * Logout function
 */
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        UserAuth.logout();
        
        // Dispatch logout event
        dispatchUserAuthEvent('logout');
        
        // Show success message if showToast is available
        if (typeof showToast === 'function') {
            showToast('Logout berhasil!', 'success');
        }
        
        // Redirect after short delay
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
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header bg-luxury-gold">
                        <h5 class="modal-title text-luxury-black">
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
            showLoggedInState();
            bootstrap.Modal.getInstance(document.getElementById('profileModal')).hide();
        }, 1500);
    } else {
        showAlert(alertContainer, result.message, 'error');
    }
}

/**
 * Show user orders
 */
function showOrders() {
    // This would show user's order history
    alert('Fitur riwayat pesanan akan segera hadir!');
}

// Auto-fill demo credentials for testing
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        
        // Auto-fill login form
        const usernameField = document.querySelector('input[name="username"]');
        const passwordField = document.querySelector('input[name="password"]');
        
        if (usernameField && passwordField) {
            usernameField.value = 'customer1';
            passwordField.value = 'password123';
            
            // Show notification
            const alertContainer = document.getElementById('loginAlert') || document.getElementById('registerAlert');
            if (alertContainer) {
                showAlert(alertContainer, 'Demo credentials filled! (customer1 / password123)', 'info');
            }
        }
    }
});

/**
 * User Authentication Events
 * Custom events for user state changes
 */

// Create custom events for user authentication
function dispatchUserAuthEvent(eventType, userData = null) {
    const event = new CustomEvent('userAuthChange', {
        detail: {
            type: eventType, // 'login', 'logout', 'register'
            user: userData
        }
    });
    document.dispatchEvent(event);
}

// Listen for user authentication changes
document.addEventListener('userAuthChange', function(e) {
    console.log('User auth change detected:', e.detail.type);
    
    // Update navigation
    if (typeof updateUserNavigation === 'function') {
        setTimeout(() => {
            updateUserNavigation();
        }, 100);
    }
    
    // Update cart count
    if (typeof updateCartCount === 'function') {
        setTimeout(() => {
            updateCartCount();
        }, 100);
    }
});

// Make functions globally available
window.logout = logout;
window.showProfile = showProfile;
window.updateProfile = updateProfile;
window.showOrders = showOrders;
