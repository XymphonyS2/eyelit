# Panduan Penambahan Logo Metode Pembayaran & Ekspedisi

Dokumen ini menjelaskan cara menambahkan logo untuk metode pembayaran dan ekspedisi di website EyeLit.

---

## 1. Lokasi Folder

```
public/
└── images/
    ├── metopem/          ← Logo metode pembayaran
    │   ├── qris.svg / .png
    │   ├── bca.svg / .png
    │   └── bni.svg / .png
    └── ekspedisi/        ← Logo ekspedisi
        ├── jne.svg / .png
        ├── jt.svg / .png
        └── sicepat.svg / .png
```

---

## 2. Spesifikasi Gambar

| Atribut | Nilai |
|---------|-------|
| **Ukuran** | 80 × 80 pixel |
| **Format** | PNG atau SVG |
| **Resolusi** | 72–150 DPI |
| **Aspect Ratio** | 1:1 (persegi) |
| **Background** | Transparan atau putih (#FFFFFF) |

> **Penting:** Gunakan logo resmi dari masing-masing perusahaan. Logo tidak resmi bisa melanggar hak cipta.

---

## 3. Sumber Logo Resmi

### Metode Pembayaran

| Metode | Nama File | Sumber Logo Resmi |
|--------|-----------|-------------------|
| QRIS | `qris.png` | https://qris.id |
| BCA | `bca.png` | https://brandguidelines.bca.co.id |
| BNI | `bni.png` | https://brand.bni.co.id |

### Ekspedisi

| Ekspedisi | Nama File | Sumber Logo Resmi |
|-----------|-----------|-------------------|
| JNE | `jne.png` | Hubungi tim JNE untuk brand guideline |
| J&T | `jt.png` | Hubungi tim J&T untuk brand guideline |
| SiCepat | `sicepat.png` | Hubungi tim SiCepat untuk brand guideline |

---

## 4. Langkah-Langkah

### Langkah 1: Unduh Logo Resmi

1. Kunjungi link sumber logo resmi di atas
2. Download logo dalam format PNG atau SVG
3. Pastikan logo memiliki background transparan

### Langkah 2: Sesuaikan Ukuran

Jika logo tidak sesuai ukuran 80×80 pixel:

**Dengan Photoshop:**
1. Buka logo di Photoshop
2. Pilih Image → Image Size
3. Set width dan height menjadi 80 pixel
4. Pastikan constrain proportions tercentang
5. Save as PNG dengan resolution 72-150 DPI

**Dengan Canva (alternatif gratis):**
1. Buat design baru 80×80 pixel
2. Upload logo
3. Resize sesuai kebutuhan
4. Download sebagai PNG

### Langkah 3: Simpan ke Folder

1. Simpan logo metode pembayaran di `public/images/metopem/`
2. Simpan logo ekspedisi di `public/images/ekspedisi/`
3. Pastikan nama file sesuai tabel di atas (lowercase)

### Langkah 4: Update Kode (Opsional)

Jika ingin menggunakan logo dari file (bukan SVG inline), update `checkout.tsx`:

**Untuk metode pembayaran (checkout.tsx):**

```tsx
// Ganti SVG icon dengan <img> tag
{ id: 'BCA', label: 'Bank Central Asia', ... },
```

menjadi:

```tsx
{
    id: 'BCA',
    label: 'Bank Central Asia',
    desc: 'Transfer via BCA Virtual Account',
    icon: (
        <img
            src="/images/metopem/bca.png"
            alt="BCA"
            className="w-12 h-12 rounded-lg object-contain flex-shrink-0 bg-white"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
    ),
},
```

**Untuk ekspedisi** (jika ada halaman yang menampilkan logo ekspedisi):

```tsx
<img
    src="/images/ekspedisi/jne.png"
    alt="JNE"
    className="w-12 h-12 rounded-lg object-contain"
    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
/>
```

---

## 5. Checklist

- [ ] Logo memiliki ukuran 80×80 pixel
- [ ] Format file PNG atau SVG
- [ ] Background transparan atau putih
- [ ] Nama file lowercase dan sesuai standar
- [ ] File disimpan di folder yang benar
- [ ] Logo tampil dengan benar di browser

---

## 6. Troubleshooting

### Logo tidak muncul
- Pastikan nama file sudah benar (case-sensitive di Linux server)
- Periksa path di kode sudah sesuai
- Cek apakah file ada di folder yang benar
- Tambahkan `onError` handler untuk fallback

### Logo buram / pecah
- Gunakan resolusi asli yang lebih tinggi
- Pastikan DPI saat export 72-150
- Jangan stretch logo secara paksa

### Logo tidak sesuai ukuran
- Resize manual di Photoshop/Canva
- Jangan gunakan CSS width/height untuk resize logo
- Sesuaikan dimensi asli sesuai kebutuhan

---

## 7. Template SVG

File template SVG sudah tersedia di:
- `public/images/metopem/bca-template.svg`
- `public/images/metopem/bni-template.svg`
- `public/images/metopem/qris-template.svg`
- `public/images/ekspedisi/jne-template.svg`
- `public/images/ekspedisi/jt-template.svg`
- `public/images/ekspedisi/sicepat-template.svg`

File panduan visual:
- `public/images/metopem/SIZING-GUIDE.svg`

---

*Terakhir diupdate: 12 Mei 2026*