# User Authentication Testing Guide - Maison du Croissant

## 🔐 User Login Testing

### **Demo Customer Credentials:**
- **Username:** `customer1`
- **Email:** `customer1@example.com`  
- **Password:** `password123`

### **Demo Admin Credentials:**
- **Username:** `admin`
- **Password:** `admin123`

---

## 🧪 Testing Scenarios

### **1. Guest User Experience (Not Logged In)**
1. Buka `menu.html`
2. **Expected:** Navbar menampilkan tombol "Daftar" dan "Masuk"
3. Klik "Masuk" → Redirect ke `login.html`
4. Klik "Daftar" → Redirect ke `register.html`

### **2. Customer Login Flow**
1. Buka `login.html`
2. Masukkan kredensial customer demo
3. Klik "Masuk"
4. **Expected:** Redirect ke `menu.html` 
5. **Expected:** Navbar sekarang menampilkan nama user "John Doe" dengan dropdown
6. Klik dropdown → Menampilkan: Edit Profile, Pesanan Saya, Favorit, Logout

### **3. Admin Login Flow**
1. Buka `admin-login.html`
2. Masukkan kredensial admin demo
3. Klik "Login"
4. **Expected:** Redirect ke `admin.html` (dashboard admin)

### **4. User Registration Flow**
1. Buka `register.html`
2. Isi form registrasi dengan data lengkap
3. Klik "Daftar Sekarang"
4. **Expected:** Redirect ke `login.html` dengan pesan sukses
5. Login dengan akun yang baru dibuat

---

## 🎯 Key Features to Test

### **User Navigation States:**
- ✅ Guest: Tombol "Daftar" + "Masuk" 
- ✅ Logged In: Nama user + dropdown profile

### **Navbar Consistency:**
- ✅ `menu.html` - User navigation integrated
- ✅ `cart.html` - User navigation integrated  
- ✅ `confirm-order.html` - User navigation integrated

### **Profile Features:**
- ✅ Edit Profile (modal)
- ✅ View Orders History
- ✅ Favorites Management
- ✅ Logout functionality

### **Favorite System:**
- ✅ Heart icon on menu items (only when logged in)
- ✅ Add/remove favorites
- ✅ View favorites in profile dropdown

---

## 🔄 Quick Test Commands

### **Auto-fill Demo Credentials:**
- **Customer Login:** Press `Ctrl + U` on login page
- **Admin Login:** Press `Ctrl + D` on admin-login page

### **Reset Test Data:**
```javascript
// Run in browser console to reset all user data
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 📱 Mobile Testing

1. Test pada viewport mobile (320px - 768px)
2. Verify navbar responsiveness
3. Check dropdown functionality on touch devices
4. Verify form usability on small screens

---

## 🚀 Expected User Experience

### **Before Login:**
```
Navbar: [Menu] [Keranjang] [Pesanan] [Admin] [Daftar] [Masuk]
```

### **After Login:**
```
Navbar: [Menu] [Keranjang] [Pesanan] [Admin] [👤 John Doe ▼]
                                              │
                                              ├─ Edit Profile
                                              ├─ Pesanan Saya  
                                              ├─ Favorit
                                              └─ Logout
```

---

## 🔧 Troubleshooting

**Issue:** Navbar tidak update setelah login
**Solution:** Cek browser console, pastikan `user-navigation.js` loaded

**Issue:** Dropdown tidak muncul  
**Solution:** Pastikan Bootstrap JS loaded dan `data-bs-toggle="dropdown"` ada

**Issue:** Favorit tidak tersimpan
**Solution:** Cek localStorage permissions dan browser compatibility

---

**Status:** ✅ Ready for testing
**Updated:** June 30, 2025
