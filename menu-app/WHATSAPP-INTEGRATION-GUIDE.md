# 📱 WhatsApp Integration Guide - Maison du Croissant

## 🎯 Overview
Fitur integrasi WhatsApp memungkinkan pelanggan untuk mengirim konfirmasi pesanan langsung melalui WhatsApp dengan template pesan yang sudah terformat rapi.

## ⚙️ Konfigurasi

### 📞 Nomor WhatsApp Bisnis

Nomor WhatsApp sudah dikonfigurasi sesuai dengan template yang diberikan:
- **Nomor**: `6289629749277`
- **Format**: International (62 + nomor tanpa 0)

### 📝 Format Template

Template pesan mengikuti format yang telah ditentukan:

```
*KONFIRMASI PESANAN - MAISON DU CROISSANT*

*DETAIL PESANAN*
Nomor Pesanan: ORD1751234545010
Nama: Agus Gunawan
No. Telepon: 089629749277
Email: yugiindra40@gmail.com

*JADWAL PENGAMBILAN*
Tanggal: Senin, 30 Juni 2025
Waktu: 08:00

*RINGKASAN PESANAN*
1. Eclair = Rp 35.000 x 1 = Rp35.000

*DETAIL PEMBAYARAN*
Subtotal: Rp35.000
PPN 10%: Rp3.500
*Total: Rp38.500*
Metode Pembayaran: E-wallet

Mohon konfirmasi pesanan ini untuk melanjutkan proses.

Terima kasih telah memilih Maison du Croissant 🍞
```

## 🚀 Cara Kerja

1. **Pelanggan mengisi form** di halaman konfirmasi pesanan
2. **Klik "Konfirmasi Pesanan"** 
3. **Sistem otomatis:**
   - Generate nomor pesanan unik
   - Hitung total pembayaran (termasuk PPN 10%)
   - Format pesan WhatsApp lengkap
   - Buka WhatsApp dengan pesan siap kirim
   - Tampilkan modal sukses

## 📄 Template Pesan WhatsApp

Template pesan telah disesuaikan dengan format yang diminta:

```
*KONFIRMASI PESANAN - MAISON DU CROISSANT*

*DETAIL PESANAN*
Nomor Pesanan: [AUTO-GENERATED]
Nama: [DARI FORM]
No. Telepon: [DARI FORM]
Email: [DARI FORM]

*JADWAL PENGAMBILAN*
Tanggal: [DARI FORM - FORMAT HARI, TANGGAL BULAN TAHUN]
Waktu: [DARI FORM]

*RINGKASAN PESANAN*
[ITEM]. [NAMA PRODUK] = [HARGA] x [QTY] = [SUBTOTAL]

*DETAIL PEMBAYARAN*
Subtotal: [TOTAL SEBELUM PAJAK]
PPN 10%: [PAJAK 10%]
*Total: [TOTAL AKHIR]*
Metode Pembayaran: [DARI FORM]

[PERMINTAAN KHUSUS - JIKA ADA]

Mohon konfirmasi pesanan ini untuk melanjutkan proses.

Terima kasih telah memilih Maison du Croissant 🍞
```

## 🎯 Contoh Output

Berdasarkan template yang diberikan:
- **URL Target**: `https://wa.me/6289629749277`
- **Format pesan**: Sesuai template tanpa emoji berlebihan
- **Encoding**: Otomatis menggunakan `encodeURIComponent()`

## 🎨 Kustomisasi

### Mengubah Nama Bisnis
```javascript
const WHATSAPP_CONFIG = {
    phoneNumber: '6281234567890',
    businessName: 'Nama Bisnis Anda' // Ganti ini
};
```

### Menambah/Mengubah Emoji dan Format
Edit fungsi `generateWhatsAppMessage()` untuk menyesuaikan:
- Emoji yang digunakan
- Format pesan
- Informasi tambahan
- Garis pemisah

## 🔧 Testing

1. Isi form konfirmasi pesanan
2. Klik "Konfirmasi Pesanan"
3. Pastikan WhatsApp terbuka dengan pesan yang benar
4. Cek apakah nomor tujuan sudah sesuai

## 📱 Kompatibilitas

- ✅ Desktop: Chrome, Firefox, Safari, Edge
- ✅ Mobile: WhatsApp Web atau aplikasi WhatsApp
- ✅ Tablet: Support penuh

## 🛠️ Troubleshooting

### WhatsApp tidak terbuka
- Pastikan WhatsApp terinstall di device
- Atau pastikan WhatsApp Web dapat diakses di browser

### Nomor salah
- Periksa format nomor (gunakan 62 untuk Indonesia)
- Pastikan tidak ada spasi atau karakter khusus

### Pesan tidak lengkap
- Periksa console browser untuk error JavaScript
- Pastikan localStorage memiliki data cart

## 📞 Support
Jika ada pertanyaan atau masalah, hubungi developer atau tim IT Anda.

---
*Dibuat untuk Maison du Croissant - Luxury Artisan Bakery*
