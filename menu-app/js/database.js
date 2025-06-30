/**
 * Database Management - Maison du Croissant
 * Handles local storage database operations
 */

// Database configuration
const DB_CONFIG = {
    version: '1.0',
    prefix: 'maison_du_croissant_',
    tables: {
        menus: 'menus',
        orders: 'orders',
        customers: 'customers',
        users: 'users', // Tambahan untuk user authentication
        settings: 'settings'
    }
};

/**
 * Initialize database with sample data
 */
function initializeDatabase() {
    // Check if database is already initialized
    if (!localStorage.getItem(DB_CONFIG.prefix + 'initialized')) {
        console.log('Initializing database with sample data...');
        
        // Initialize sample menus
        initializeSampleMenus();
        
        // Initialize sample orders
        initializeSampleOrders();
        
        // Initialize sample customers
        initializeSampleCustomers();
        
        // Initialize settings
        initializeSettings();
        
        // Initialize sample users
        initializeSampleUsers();
        
        // Mark as initialized
        localStorage.setItem(DB_CONFIG.prefix + 'initialized', 'true');
        localStorage.setItem(DB_CONFIG.prefix + 'version', DB_CONFIG.version);
        
        console.log('Database initialized successfully');
    }
}

/**
 * Initialize sample menus
 */
function initializeSampleMenus() {
    const sampleMenus = [
        {
            id: 1,
            name: 'Croissant',
            category: 'Pastry',
            price: 35000,
            status: 'active',
            description: 'Pastry berlapis mentega yang renyah berbentuk bulan sabit, dibuat dari adonan berlapis dengan teknik laminating tradisional Prancis.',
            features: '🌙 Bentuk Bulan Sabit | 🧈 Berlapis Mentega | 🥐 Klasik Prancis',
            image: 'img/pastry1.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            name: 'Pain au Chocolate',
            category: 'Pastry',
            price: 35000,
            status: 'active',
            description: 'Pastry berlapis dengan cokelat dark premium di dalamnya, dipanggang hingga golden brown dengan tekstur yang flaky dan buttery.',
            features: '🍫 Cokelat Premium | 🥐 Pastry Berlapis | ☕ Pas untuk Kopi',
            image: 'img/pastry2.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            name: 'Danish Pastry',
            category: 'Pastry',
            price: 40000,
            status: 'active',
            description: 'Pastry Denmark dengan lapisan mentega yang lembut, diisi dengan krim custard atau buah-buahan segar.',
            features: '🧈 Danish Style | 🍓 Topping Buah | 🥧 Krim Custard',
            image: 'img/pastry3.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            name: 'Éclair',
            category: 'Pastry',
            price: 45000,
            status: 'active',
            description: 'Choux pastry yang diisi dengan krim vanilla atau cokelat, dilapisi dengan glazur cokelat yang mengkilap.',
            features: '🍮 Krim Vanilla | 🍫 Glazur Cokelat | 🇫🇷 Pastry Prancis',
            image: 'img/pastry4.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            name: 'Mille-feuille',
            category: 'Pastry',
            price: 50000,
            status: 'active',
            description: 'Napoleon cake dengan lapisan puff pastry yang renyah dan krim pastry yang lembut, ditaburi gula halus.',
            features: '🥧 Berlapis-lapis | 🍰 Krim Pastry | ✨ Gula Halus',
            image: 'img/pastry5.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 6,
            name: 'Baguette',
            category: 'Bread',
            price: 25000,
            status: 'active',
            description: 'Roti Prancis klasik dengan kulit yang renyah dan interior yang lembut, dipanggang dengan teknik tradisional.',
            features: '🥖 Klasik Prancis | 🔥 Fresh Baked | 🌾 Gandum Premium',
            image: 'img/best-product-1.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 7,
            name: 'Sourdough',
            category: 'Bread',
            price: 35000,
            status: 'active',
            description: 'Roti asam dengan fermentasi alami selama 24 jam, memberikan rasa yang unik dan tekstur yang chewy.',
            features: '🦠 Fermentasi Alami | ⏰ 24 Jam Proses | 🍞 Tekstur Chewy',
            image: 'img/best-product-2.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 8,
            name: 'Chocolate Cake',
            category: 'Cake',
            price: 65000,
            status: 'active',
            description: 'Kue cokelat moist dengan lapisan ganache yang kaya, dihiasi dengan chocolate chips dan krim butter.',
            features: '🍫 Cokelat Premium | 🧁 Moist Texture | 🍰 Butter Cream',
            image: 'img/best-product-3.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 9,
            name: 'Espresso',
            category: 'Coffee',
            price: 20000,
            status: 'active',
            description: 'Kopi espresso premium dengan biji kopi arabica pilihan, diseduh dengan mesin espresso profesional.',
            features: '☕ Arabica Premium | 🔥 Fresh Brew | 💪 Strong Kick',
            image: 'img/drink1.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 10,
            name: 'Cappuccino',
            category: 'Coffee',
            price: 30000,
            status: 'active',
            description: 'Perpaduan sempurna antara espresso, steamed milk, dan milk foam, disajikan dalam cangkir porselen.',
            features: '☕ Espresso Base | 🥛 Steamed Milk | ☁️ Perfect Foam',
            image: 'img/drink2.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 11,
            name: 'Fresh Orange Juice',
            category: 'Drink',
            price: 25000,
            status: 'active',
            description: 'Jus jeruk segar dari jeruk pilihan, diperas langsung tanpa pengawet atau pemanis buatan.',
            features: '🍊 100% Fresh | 🚫 No Preservatives | 🌿 Natural Sweet',
            image: 'img/drink3.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 12,
            name: 'Fruit Tart',
            category: 'Pastry',
            price: 55000,
            status: 'active',
            description: 'Tart dengan base pastry renyah, diisi dengan krim custard dan dihiasi dengan buah-buahan segar musiman.',
            features: '🍓 Seasonal Fruits | 🍮 Custard Cream | 🥧 Crispy Base',
            image: 'img/pastry6.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 13,
            name: 'Latte',
            category: 'Coffee',
            price: 35000,
            status: 'active',
            description: 'Minuman kopi dengan perpaduan espresso dan steamed milk yang creamy, dengan latte art yang indah.',
            features: '☕ Smooth Espresso | 🥛 Creamy Milk | 🎨 Latte Art',
            image: 'img/drink1.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 14,
            name: 'Hot Chocolate',
            category: 'Drink',
            price: 28000,
            status: 'active',
            description: 'Cokelat panas premium dengan dark chocolate Belgium, disajikan dengan whipped cream.',
            features: '🍫 Belgium Chocolate | ☁️ Whipped Cream | 🔥 Served Hot',
            image: 'img/drink2.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 15,
            name: 'French Toast',
            category: 'Bread',
            price: 45000,
            status: 'active',
            description: 'Roti tebal yang dicelup dalam custard dan dipanggang hingga golden, disajikan dengan maple syrup.',
            features: '🍞 Thick Bread | 🥚 Rich Custard | 🍯 Maple Syrup',
            image: 'img/best-product-1.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 16,
            name: 'Chocolate Cake',
            category: 'Cake',
            price: 65000,
            status: 'active',
            description: 'Kue cokelat berlapis dengan dark chocolate ganache dan hiasan berries segar.',
            features: '🍫 Dark Chocolate | 🍓 Fresh Berries | ✨ Premium',
            image: 'img/best-product-3.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 17,
            name: 'Iced Coffee',
            category: 'Coffee',
            price: 25000,
            status: 'active',
            description: 'Kopi dingin segar dengan es batu, perfect untuk cuaca panas.',
            features: '❄️ Ice Cold | ☕ Strong Coffee | 🌿 Refreshing',
            image: 'img/drink3.jpg',
            createdAt: new Date().toISOString()
        },
        {
            id: 18,
            name: 'Lemon Tart',
            category: 'Pastry',
            price: 50000,
            status: 'active',
            description: 'Tart dengan filling lemon curd yang asam segar, topped dengan meringue yang lembut.',
            features: '🍋 Fresh Lemon | ☁️ Soft Meringue | 🥧 Crispy Tart',
            image: 'img/pastry7.jpg',
            createdAt: new Date().toISOString()
        }
    ];
    
    saveMenusToStorage(sampleMenus);
}

/**
 * Initialize sample orders
 */
function initializeSampleOrders() {
    const sampleOrders = [
        {
            id: 1,
            customerName: 'Budi Santoso',
            customerPhone: '+6281234567890',
            customerEmail: 'budi@email.com',
            items: [
                { id: 1, name: 'Croissant', price: 35000, quantity: 2 },
                { id: 9, name: 'Espresso', price: 20000, quantity: 1 }
            ],
            subtotal: 90000,
            tax: 9000,
            total: 99000,
            status: 'completed',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
            notes: 'Pesanan untuk acara kantor'
        },
        {
            id: 2,
            customerName: 'Sari Dewi',
            customerPhone: '+6281987654321',
            customerEmail: 'sari@email.com',
            items: [
                { id: 2, name: 'Pain au Chocolate', price: 35000, quantity: 1 },
                { id: 10, name: 'Cappuccino', price: 30000, quantity: 1 }
            ],
            subtotal: 65000,
            tax: 6500,
            total: 71500,
            status: 'confirmed',
            date: new Date().toISOString(), // Today
            notes: 'Delivery ke Jl. Sudirman 123'
        },
        {
            id: 3,
            customerName: 'Ahmad Rahman',
            customerPhone: '+6282345678901',
            customerEmail: 'ahmad@email.com',
            items: [
                { id: 8, name: 'Chocolate Cake', price: 65000, quantity: 1 },
                { id: 11, name: 'Fresh Orange Juice', price: 25000, quantity: 2 }
            ],
            subtotal: 115000,
            tax: 11500,
            total: 126500,
            status: 'preparing',
            date: new Date().toISOString(), // Today
            notes: 'Untuk ulang tahun anak'
        }
    ];
    
    saveOrdersToStorage(sampleOrders);
}

/**
 * Initialize sample customers
 */
function initializeSampleCustomers() {
    const sampleCustomers = [
        {
            id: 1,
            name: 'Budi Santoso',
            phone: '+6281234567890',
            email: 'budi@email.com',
            address: 'Jl. Merdeka No. 45, Jakarta',
            totalOrders: 5,
            totalSpent: 750000,
            createdAt: new Date(Date.now() - 30 * 86400000).toISOString() // 30 days ago
        },
        {
            id: 2,
            name: 'Sari Dewi',
            phone: '+6281987654321',
            email: 'sari@email.com',
            address: 'Jl. Sudirman No. 123, Jakarta',
            totalOrders: 3,
            totalSpent: 450000,
            createdAt: new Date(Date.now() - 15 * 86400000).toISOString() // 15 days ago
        },
        {
            id: 3,
            name: 'Ahmad Rahman',
            phone: '+6282345678901',
            email: 'ahmad@email.com',
            address: 'Jl. Thamrin No. 67, Jakarta',
            totalOrders: 7,
            totalSpent: 920000,
            createdAt: new Date(Date.now() - 45 * 86400000).toISOString() // 45 days ago
        }
    ];
    
    saveCustomersToStorage(sampleCustomers);
}

/**
 * Initialize settings
 */
function initializeSettings() {
    const defaultSettings = {
        storeName: 'Maison du Croissant',
        storeAddress: 'Jl. Luxury Street No. 123, Jakarta',
        storePhone: '089629749277',
        storeEmail: 'info@maisondicroissant.com',
        whatsappNumber: '6289629749277',
        taxRate: 10, // 10%
        deliveryFee: 15000,
        minOrderAmount: 50000,
        operatingHours: {
            open: '07:00',
            close: '22:00'
        },
        socialMedia: {
            instagram: '@maisondicroissant',
            facebook: 'Maison du Croissant',
            twitter: '@maisondicroissant'
        }
    };
    
    saveSettingsToStorage(defaultSettings);
}

/**
 * Menu storage functions
 */
function getMenusFromStorage() {
    const stored = localStorage.getItem(DB_CONFIG.prefix + DB_CONFIG.tables.menus);
    return stored ? JSON.parse(stored) : [];
}

function saveMenusToStorage(menus) {
    localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.menus, JSON.stringify(menus));
}

function getMenuById(menuId) {
    const menus = getMenusFromStorage();
    return menus.find(menu => menu.id === menuId);
}

function addMenu(menuData) {
    const menus = getMenusFromStorage();
    const newId = menus.length > 0 ? Math.max(...menus.map(m => m.id)) + 1 : 1;
    
    const newMenu = {
        ...menuData,
        id: newId,
        createdAt: new Date().toISOString()
    };
    
    menus.push(newMenu);
    saveMenusToStorage(menus);
    
    return newMenu;
}

function updateMenu(menuId, updates) {
    const menus = getMenusFromStorage();
    const index = menus.findIndex(menu => menu.id === menuId);
    
    if (index !== -1) {
        menus[index] = { ...menus[index], ...updates, updatedAt: new Date().toISOString() };
        saveMenusToStorage(menus);
        return menus[index];
    }
    
    return null;
}

function deleteMenu(menuId) {
    const menus = getMenusFromStorage();
    const filteredMenus = menus.filter(menu => menu.id !== menuId);
    
    if (filteredMenus.length !== menus.length) {
        saveMenusToStorage(filteredMenus);
        return true;
    }
    
    return false;
}

/**
 * Order storage functions
 */
function getOrdersFromStorage() {
    const stored = localStorage.getItem(DB_CONFIG.prefix + DB_CONFIG.tables.orders);
    return stored ? JSON.parse(stored) : [];
}

function saveOrdersToStorage(orders) {
    localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.orders, JSON.stringify(orders));
}

function getOrderById(orderId) {
    const orders = getOrdersFromStorage();
    return orders.find(order => order.id === orderId);
}

function addOrder(orderData) {
    const orders = getOrdersFromStorage();
    const newId = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    
    const newOrder = {
        ...orderData,
        id: newId,
        date: new Date().toISOString(),
        status: 'pending'
    };
    
    orders.push(newOrder);
    saveOrdersToStorage(orders);
    
    return newOrder;
}

function updateOrder(orderId, updates) {
    const orders = getOrdersFromStorage();
    const index = orders.findIndex(order => order.id === orderId);
    
    if (index !== -1) {
        orders[index] = { ...orders[index], ...updates, updatedAt: new Date().toISOString() };
        saveOrdersToStorage(orders);
        return orders[index];
    }
    
    return null;
}

function updateOrderStatus(orderId, newStatus) {
    return updateOrder(orderId, { status: newStatus });
}

/**
 * Customer storage functions
 */
function getCustomersFromStorage() {
    const stored = localStorage.getItem(DB_CONFIG.prefix + DB_CONFIG.tables.customers);
    return stored ? JSON.parse(stored) : [];
}

function saveCustomersToStorage(customers) {
    localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.customers, JSON.stringify(customers));
}

function getCustomerById(customerId) {
    const customers = getCustomersFromStorage();
    return customers.find(customer => customer.id === customerId);
}

function getCustomerByPhone(phone) {
    const customers = getCustomersFromStorage();
    return customers.find(customer => customer.phone === phone);
}

function addCustomer(customerData) {
    const customers = getCustomersFromStorage();
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    
    const newCustomer = {
        ...customerData,
        id: newId,
        totalOrders: 0,
        totalSpent: 0,
        createdAt: new Date().toISOString()
    };
    
    customers.push(newCustomer);
    saveCustomersToStorage(customers);
    
    return newCustomer;
}

function updateCustomer(customerId, updates) {
    const customers = getCustomersFromStorage();
    const index = customers.findIndex(customer => customer.id === customerId);
    
    if (index !== -1) {
        customers[index] = { ...customers[index], ...updates, updatedAt: new Date().toISOString() };
        saveCustomersToStorage(customers);
        return customers[index];
    }
    
    return null;
}

/**
 * Settings storage functions
 */
function getSettingsFromStorage() {
    const stored = localStorage.getItem(DB_CONFIG.prefix + DB_CONFIG.tables.settings);
    return stored ? JSON.parse(stored) : {};
}

function saveSettingsToStorage(settings) {
    localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.settings, JSON.stringify(settings));
}

function getSetting(key) {
    const settings = getSettingsFromStorage();
    return settings[key];
}

function setSetting(key, value) {
    const settings = getSettingsFromStorage();
    settings[key] = value;
    saveSettingsToStorage(settings);
}

/**
 * User authentication functions
 */
const UserAuth = {
    /**
     * Register new user
     */
    register: function(userData) {
        try {
            const users = this.getAllUsers();
            
            // Check if email already exists
            if (users.some(user => user.email === userData.email)) {
                return {
                    success: false,
                    message: 'Email sudah terdaftar'
                };
            }
            
            // Check if username already exists
            if (users.some(user => user.username === userData.username)) {
                return {
                    success: false,
                    message: 'Username sudah digunakan'
                };
            }
            
            // Create new user
            const newUser = {
                id: Date.now().toString(),
                username: userData.username,
                email: userData.email,
                password: userData.password, // In production, this should be hashed
                fullName: userData.fullName,
                phone: userData.phone || '',
                address: userData.address || '',
                createdAt: new Date().toISOString(),
                lastLogin: null,
                isActive: true,
                role: 'customer'
            };
            
            users.push(newUser);
            localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.users, JSON.stringify(users));
            
            return {
                success: true,
                message: 'Registrasi berhasil',
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    email: newUser.email,
                    fullName: newUser.fullName
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan sistem'
            };
        }
    },
    
    /**
     * Login user
     */
    login: function(credentials) {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => 
                (u.username === credentials.username || u.email === credentials.username) &&
                u.password === credentials.password &&
                u.isActive
            );
            
            if (user) {
                // Update last login
                user.lastLogin = new Date().toISOString();
                localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.users, JSON.stringify(users));
                
                return {
                    success: true,
                    message: 'Login berhasil',
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        fullName: user.fullName,
                        phone: user.phone,
                        address: user.address,
                        role: user.role
                    }
                };
            } else {
                return {
                    success: false,
                    message: 'Username/email atau password salah'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan sistem'
            };
        }
    },
    
    /**
     * Get current logged in user
     */
    getCurrentUser: function() {
        let userData = localStorage.getItem('current_user') || sessionStorage.getItem('current_user');
        console.log('Getting current user from storage:', userData);
        const user = userData ? JSON.parse(userData) : null;
        console.log('Parsed user:', user);
        return user;
    },
    
    /**
     * Set current user session
     */
    setCurrentUser: function(user, rememberMe = false) {
        console.log('Setting current user:', user, 'rememberMe:', rememberMe);
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('current_user', JSON.stringify(user));
        storage.setItem('user_logged_in', 'true');
        storage.setItem('user_login_time', new Date().toISOString());
        console.log('User session saved to:', rememberMe ? 'localStorage' : 'sessionStorage');
    },
    
    /**
     * Logout user
     */
    logout: function() {
        localStorage.removeItem('current_user');
        sessionStorage.removeItem('current_user');
        localStorage.removeItem('user_logged_in');
        sessionStorage.removeItem('user_logged_in');
        localStorage.removeItem('user_login_time');
        sessionStorage.removeItem('user_login_time');
    },
    
    /**
     * Check if user is logged in
     */
    isLoggedIn: function() {
        const loginStatus = localStorage.getItem('user_logged_in') === 'true' || 
                           sessionStorage.getItem('user_logged_in') === 'true';
        console.log('Checking login status:', loginStatus);
        return loginStatus;
    },
    
    /**
     * Get all users (admin only)
     */
    getAllUsers: function() {
        const users = localStorage.getItem(DB_CONFIG.prefix + DB_CONFIG.tables.users);
        return users ? JSON.parse(users) : [];
    },
    
    /**
     * Update user profile
     */
    updateProfile: function(userId, updateData) {
        try {
            const users = this.getAllUsers();
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex === -1) {
                return {
                    success: false,
                    message: 'User tidak ditemukan'
                };
            }
            
            // Update user data
            users[userIndex] = { ...users[userIndex], ...updateData };
            localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.users, JSON.stringify(users));
            
            // Update current user session if it's the same user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                this.setCurrentUser(users[userIndex]);
            }
            
            return {
                success: true,
                message: 'Profile berhasil diupdate',
                user: users[userIndex]
            };
        } catch (error) {
            console.error('Update profile error:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan sistem'
            };
        }
    },
    
    /**
     * Change password
     */
    changePassword: function(userId, oldPassword, newPassword) {
        try {
            const users = this.getAllUsers();
            const user = users.find(u => u.id === userId);
            
            if (!user) {
                return {
                    success: false,
                    message: 'User tidak ditemukan'
                };
            }
            
            if (user.password !== oldPassword) {
                return {
                    success: false,
                    message: 'Password lama salah'
                };
            }
            
            user.password = newPassword;
            localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.users, JSON.stringify(users));
            
            return {
                success: true,
                message: 'Password berhasil diubah'
            };
        } catch (error) {
            console.error('Change password error:', error);
            return {
                success: false,
                message: 'Terjadi kesalahan sistem'
            };
        }
    }
};

/**
 * Initialize sample users
 */
function initializeSampleUsers() {
    const sampleUsers = [
        {
            id: 'user_001',
            username: 'customer1',
            email: 'customer1@example.com',
            password: 'password123',
            fullName: 'John Doe',
            phone: '089629749277',
            address: 'Jl. Contoh No. 123, Jakarta',
            createdAt: '2024-01-15T08:00:00.000Z',
            lastLogin: '2024-06-29T10:30:00.000Z',
            isActive: true,
            role: 'customer'
        },
        {
            id: 'user_002',
            username: 'customer2',
            email: 'customer2@example.com',
            password: 'password123',
            fullName: 'Jane Smith',
            phone: '081234567891',
            address: 'Jl. Contoh No. 456, Bandung',
            createdAt: '2024-02-20T09:15:00.000Z',
            lastLogin: '2024-06-28T14:20:00.000Z',
            isActive: true,
            role: 'customer'
        }
    ];
    
    localStorage.setItem(DB_CONFIG.prefix + DB_CONFIG.tables.users, JSON.stringify(sampleUsers));
}

/**
 * Database utility functions
 */
function clearDatabase() {
    const keys = Object.keys(localStorage).filter(key => key.startsWith(DB_CONFIG.prefix));
    keys.forEach(key => localStorage.removeItem(key));
    console.log('Database cleared');
}

function exportDatabase() {
    const data = {
        menus: getMenusFromStorage(),
        orders: getOrdersFromStorage(),
        customers: getCustomersFromStorage(),
        settings: getSettingsFromStorage()
    };
    
    return JSON.stringify(data, null, 2);
}

function importDatabase(jsonData) {
    try {
        const data = JSON.parse(jsonData);
        
        if (data.menus) saveMenusToStorage(data.menus);
        if (data.orders) saveOrdersToStorage(data.orders);
        if (data.customers) saveCustomersToStorage(data.customers);
        if (data.settings) saveSettingsToStorage(data.settings);
        
        console.log('Database imported successfully');
        return true;
    } catch (error) {
        console.error('Error importing database:', error);
        return false;
    }
}

function getDatabaseStats() {
    return {
        menus: getMenusFromStorage().length,
        orders: getOrdersFromStorage().length,
        customers: getCustomersFromStorage().length,
        totalRevenue: getOrdersFromStorage().reduce((total, order) => total + order.total, 0)
    };
}

// Initialize database when this script loads
document.addEventListener('DOMContentLoaded', function() {
    initializeDatabase();
});

// Export functions for use in other scripts
window.DB = {
    // Menu functions
    getMenusFromStorage,
    saveMenusToStorage,
    getMenuById,
    addMenu,
    updateMenu,
    deleteMenu,
    
    // Order functions
    getOrdersFromStorage,
    saveOrdersToStorage,
    getOrderById,
    addOrder,
    updateOrder,
    updateOrderStatus,
    
    // Customer functions
    getCustomersFromStorage,
    saveCustomersToStorage,
    getCustomerById,
    getCustomerByPhone,
    addCustomer,
    updateCustomer,
    
    // Settings functions
    getSettingsFromStorage,
    saveSettingsToStorage,
    getSetting,
    setSetting,
    
    // Utility functions
    clearDatabase,
    exportDatabase,
    importDatabase,
    getDatabaseStats,
    initializeDatabase,
    
    // User authentication functions
    UserAuth
};
