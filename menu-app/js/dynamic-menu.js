/**
 * Dynamic Menu Loader - Maison du Croissant
 * Loads menu items from database dynamically
 */

// Initialize dynamic menu loading
document.addEventListener('DOMContentLoaded', function() {
    // Wait for database to be initialized
    setTimeout(() => {
        loadDynamicMenus();
    }, 100);
});

/**
 * Load menus dynamically from database
 */
function loadDynamicMenus() {
    const menus = getMenusFromStorage();
    
    if (!menus || menus.length === 0) {
        console.log('No menus found in database');
        return;
    }
    
    // Group menus by category
    const menusByCategory = groupMenusByCategory(menus);
    
    // Clear existing static content
    clearStaticMenus();
    
    // Load pastries
    if (menusByCategory.Pastry && menusByCategory.Pastry.length > 0) {
        loadPastryMenus(menusByCategory.Pastry);
    }
    
    // Load drinks
    const drinkCategories = ['Drink', 'Coffee'];
    const allDrinks = [];
    drinkCategories.forEach(category => {
        if (menusByCategory[category]) {
            allDrinks.push(...menusByCategory[category]);
        }
    });
    
    if (allDrinks.length > 0) {
        loadDrinkMenus(allDrinks);
    }
    
    // Load other categories
    const otherCategories = ['Bread', 'Cake'];
    otherCategories.forEach(category => {
        if (menusByCategory[category] && menusByCategory[category].length > 0) {
            loadOtherCategoryMenus(category, menusByCategory[category]);
        }
    });
    
    // Setup event delegation for dynamically loaded add to cart buttons
    setupAddToCartEventDelegation();
    
    console.log('Dynamic menus loaded successfully');
}

/**
 * Group menus by category
 */
function groupMenusByCategory(menus) {
    return menus.reduce((grouped, menu) => {
        // Only show active menus
        if (menu.status === 'active') {
            if (!grouped[menu.category]) {
                grouped[menu.category] = [];
            }
            grouped[menu.category].push(menu);
        }
        return grouped;
    }, {});
}

/**
 * Clear existing static menus
 */
function clearStaticMenus() {
    // Find the container that holds the static menus
    const pastryContainer = document.querySelector('.container-fluid.py-5');
    if (pastryContainer) {
        // Keep the header and structure, just clear the product rows
        const productRows = pastryContainer.querySelectorAll('.row.g-4.justify-content-center');
        productRows.forEach(row => {
            if (!row.classList.contains('menu-header')) {
                row.innerHTML = '';
            }
        });
    }
}

/**
 * Load pastry menus
 */
function loadPastryMenus(pastries) {
    const container = document.querySelector('.container-fluid.py-5 .container');
    if (!container) return;
    
    // Find or create pastry row
    let pastryRow = container.querySelector('.pastry-menu-row');
    if (!pastryRow) {
        pastryRow = document.createElement('div');
        pastryRow.className = 'row g-4 justify-content-center pastry-menu-row';
        
        // Insert after the title section
        const titleSection = container.querySelector('.text-center.mb-5');
        if (titleSection) {
            titleSection.parentNode.insertBefore(pastryRow, titleSection.nextSibling);
        }
    }
    
    pastryRow.innerHTML = '';
    
    pastries.forEach(menu => {
        const menuCard = createMenuCard(menu);
        pastryRow.appendChild(menuCard);
    });
}

/**
 * Load drink menus
 */
function loadDrinkMenus(drinks) {
    const container = document.querySelector('.container-fluid.py-5');
    if (!container) return;
    
    // Find or create drinks section
    let drinkSection = container.querySelector('.drinks-section');
    if (!drinkSection) {
        drinkSection = document.createElement('div');
        drinkSection.className = 'drinks-section';
        drinkSection.innerHTML = `
            <h1 class="text-center collection display-6 mb-4" id="drinks" style="color: var(--luxury-black); font-family: 'Playfair Display', serif;">
                Collection Boissons
            </h1>
            <div class="col-lg-12">
                <div class="row g-4 justify-content-center drinks-menu-row">
                </div>
            </div>
        `;
        container.appendChild(drinkSection);
    }
    
    const drinkRow = drinkSection.querySelector('.drinks-menu-row');
    drinkRow.innerHTML = '';
    
    drinks.forEach(menu => {
        const menuCard = createMenuCard(menu);
        drinkRow.appendChild(menuCard);
    });
}

/**
 * Load other category menus
 */
function loadOtherCategoryMenus(categoryName, menus) {
    const container = document.querySelector('.container-fluid.py-5');
    if (!container) return;
    
    // Create section for this category
    const categorySection = document.createElement('div');
    categorySection.className = `${categoryName.toLowerCase()}-section`;
    categorySection.innerHTML = `
        <h1 class="text-center collection display-6 mb-4" style="color: var(--luxury-black); font-family: 'Playfair Display', serif;">
            Collection ${getCategoryDisplayName(categoryName)}
        </h1>
        <div class="col-lg-12">
            <div class="row g-4 justify-content-center ${categoryName.toLowerCase()}-menu-row">
            </div>
        </div>
    `;
    
    container.appendChild(categorySection);
    
    const menuRow = categorySection.querySelector(`.${categoryName.toLowerCase()}-menu-row`);
    
    menus.forEach(menu => {
        const menuCard = createMenuCard(menu);
        menuRow.appendChild(menuCard);
    });
}

/**
 * Create menu card HTML element
 */
function createMenuCard(menu) {
    const col = document.createElement('div');
    col.className = 'col-md-3 col-lg-3 col-xl-3';
    
    const formattedPrice = formatCurrency(menu.price);
    const features = menu.features || getDefaultFeatures(menu.category);
    
    // Check if item is in favorites (only if user is logged in)
    const currentUser = UserAuth && UserAuth.getCurrentUser();
    const isInFavorites = currentUser ? checkIfInFavorites(menu.id, currentUser.id) : false;
    const favoriteClass = isInFavorites ? 'fas text-danger' : 'far text-muted';
    
    col.innerHTML = `
        <div class="rounded position-relative fruite-item">
            <div class="fruite-img">
                <img src="${menu.image}" class="img-fluid w-100 rounded-top" alt="${menu.name}" />
            </div>
            <div class="text-white luxury-badge px-3 py-1 rounded position-absolute" style="top: 10px; left: 10px">
                ${menu.category}
            </div>
            ${currentUser ? `
                <button class="btn btn-sm p-0 position-absolute favorite-btn" 
                    onclick="toggleFavorite(${menu.id})"
                    title="${isInFavorites ? 'Hapus dari favorit' : 'Tambah ke favorit'}"
                    style="top: 10px; right: 10px; background: rgba(255,255,255,0.9); border: none; border-radius: 50%; width: 35px; height: 35px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                    <i class="${favoriteClass} fa-heart"></i>
                </button>
            ` : ''}
            <div class="p-4 rounded-bottom" style="border: 2px solid var(--luxury-gold); border-top: none; background: rgba(245, 245, 220, 0.1);">
                <h4>${menu.name}</h4>
                <p>${menu.description}</p>
                <div class="mb-3">
                    <small class="product-features">${features}</small>
                </div>
                <div class="d-flex justify-content-between flex-lg-wrap mb-2">
                    <p class="text-dark fs-5 fw-bold mb-0">${formattedPrice}</p>
                </div>
                <div class="d-flex gap-2 mt-3">
                    <button class="btn btn-luxury-secondary flex-fill" onclick="showProductDetail('${menu.name}', '${menu.image}', '${formattedPrice}', '${menu.description}', '${menu.category}')">
                        <i class="fas fa-info-circle me-1"></i>Detail
                    </button>
                    <button class="btn btn-luxury-primary flex-fill add-to-cart-btn" 
                        data-product-name="${menu.name}"
                        data-product-image="${menu.image}"
                        data-product-price="${formattedPrice}"
                        data-product-price-num="${menu.price}">
                        <i class="fa fa-shopping-bag me-1"></i>Tambah
                    </button>
                </div>
            </div>
        </div>
    `;
    
    return col;
}

/**
 * Get category display name
 */
function getCategoryDisplayName(category) {
    const displayNames = {
        'Pastry': 'Pâtisserie',
        'Bread': 'Pain',
        'Cake': 'Gâteau',
        'Drink': 'Boissons',
        'Coffee': 'Café'
    };
    
    return displayNames[category] || category;
}

/**
 * Get default features for category
 */
function getDefaultFeatures(category) {
    const defaultFeatures = {
        'Pastry': '🥐 Artisan Made | 🧈 Premium Butter | 🇫🇷 French Style',
        'Bread': '🌾 Fresh Daily | 🔥 Stone Baked | 🇫🇷 Traditional',
        'Cake': '🍰 Handcrafted | 🥚 Fresh Ingredients | ✨ Premium',
        'Drink': '☕ Premium Quality | 🌿 Fresh | 🔥 Served Hot',
        'Coffee': '☕ Arabica Beans | 🔥 Fresh Brew | 💪 Perfect Strength'
    };
    
    return defaultFeatures[category] || '✨ Premium Quality';
}

/**
 * Format currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('IDR', 'Rp');
}

/**
 * Search functionality for dynamic menus
 */
function setupDynamicSearch() {
    const searchInput = document.querySelector('input[name="produk"]');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const menuCards = document.querySelectorAll('.fruite-item');
            
            menuCards.forEach(card => {
                const name = card.querySelector('h4').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const category = card.querySelector('.luxury-badge').textContent.toLowerCase();
                
                const isVisible = name.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                category.includes(searchTerm);
                
                card.closest('.col-md-3').style.display = isVisible ? '' : 'none';
            });
        });
    }
}

/**
 * Category filter functionality
 */
function setupCategoryFilters() {
    const categoryLinks = document.querySelectorAll('.breadcrumb-item a');
    
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (href === '#') {
                // Show all menus
                showAllMenus();
            } else if (href === '#pastry') {
                // Show only pastries
                showMenusByCategory(['Pastry']);
            } else if (href === '#drinks') {
                // Show only drinks
                showMenusByCategory(['Drink', 'Coffee']);
            }
            
            // Update active state
            categoryLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Show all menus
 */
function showAllMenus() {
    const menuSections = document.querySelectorAll('.pastry-menu-row, .drinks-section, .bread-section, .cake-section');
    menuSections.forEach(section => {
        section.style.display = '';
    });
}

/**
 * Show menus by category
 */
function showMenusByCategory(categories) {
    const allSections = document.querySelectorAll('.pastry-menu-row, .drinks-section, .bread-section, .cake-section');
    
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    
    categories.forEach(category => {
        const sectionClass = category.toLowerCase() === 'pastry' ? '.pastry-menu-row' : 
                            category.toLowerCase() === 'drink' || category.toLowerCase() === 'coffee' ? '.drinks-section' :
                            `.${category.toLowerCase()}-section`;
        
        const section = document.querySelector(sectionClass);
        if (section) {
            section.style.display = '';
        }
    });
}

// Initialize dynamic features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        setupDynamicSearch();
        setupCategoryFilters();
    }, 200);
});

/**
 * Check if menu item is in user's favorites
 */
function checkIfInFavorites(menuId, userId) {
    const favoritesKey = `user_favorites_${userId}`;
    const favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    return favorites.includes(menuId);
}

/**
 * Toggle favorite status for a menu item
 */
function toggleFavorite(menuId) {
    const currentUser = UserAuth && UserAuth.getCurrentUser();
    if (!currentUser) {
        showToast('Silakan login terlebih dahulu untuk menambah favorit', 'warning');
        return;
    }
    
    const favoritesKey = `user_favorites_${currentUser.id}`;
    let favorites = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
    
    const isInFavorites = favorites.includes(menuId);
    
    if (isInFavorites) {
        // Remove from favorites
        favorites = favorites.filter(id => id !== menuId);
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        showToast('Menu dihapus dari favorit', 'info');
    } else {
        // Add to favorites
        favorites.push(menuId);
        localStorage.setItem(favoritesKey, JSON.stringify(favorites));
        showToast('Menu ditambahkan ke favorit', 'success');
    }
    
    // Update the favorite button appearance
    updateFavoriteButton(menuId, !isInFavorites);
}

/**
 * Update favorite button appearance
 */
function updateFavoriteButton(menuId, isInFavorites) {
    const favoriteBtn = document.querySelector(`button[onclick="toggleFavorite(${menuId})"] i`);
    if (favoriteBtn) {
        favoriteBtn.className = isInFavorites ? 'fas fa-heart text-danger' : 'far fa-heart text-muted';
        
        const button = favoriteBtn.parentElement;
        button.title = isInFavorites ? 'Hapus dari favorit' : 'Tambah ke favorit';
    }
}

/**
 * Setup event delegation for add to cart buttons
 */
function setupAddToCartEventDelegation() {
    // Remove existing event listeners to prevent duplicates
    document.removeEventListener('click', handleAddToCartClick);
    
    // Add event delegation
    document.addEventListener('click', handleAddToCartClick);
}

/**
 * Handle add to cart button clicks with event delegation
 */
function handleAddToCartClick(event) {
    if (event.target.closest('.add-to-cart-btn')) {
        const button = event.target.closest('.add-to-cart-btn');
        const name = button.getAttribute('data-product-name');
        const image = button.getAttribute('data-product-image');
        const price = button.getAttribute('data-product-price');
        const priceNum = parseInt(button.getAttribute('data-product-price-num'));
        
        console.log('Add to cart clicked:', { name, image, price, priceNum });
        
        if (typeof showConfirmPurchase === 'function') {
            showConfirmPurchase(name, image, price, priceNum);
        } else {
            console.error('showConfirmPurchase function not found');
        }
    }
}

// Export functions for global use
window.DynamicMenu = {
    loadDynamicMenus,
    setupDynamicSearch,
    setupCategoryFilters,
    showAllMenus,
    showMenusByCategory
};

window.toggleFavorite = toggleFavorite;
window.checkIfInFavorites = checkIfInFavorites;
window.updateFavoriteButton = updateFavoriteButton;
