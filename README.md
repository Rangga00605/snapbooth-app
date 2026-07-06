# SnapBooth Photobooth Web App

Project MVP photobooth berbasis web menggunakan:

- Next.js
- Tailwind CSS
- Web Camera API / getUserMedia
- HTML Canvas untuk generate foto final
- Resend untuk kirim foto ke email
- Supabase untuk database dan storage, opsional

## Fitur MVP

- Halaman welcome
- Pilih template photobooth
- Kamera webcam/laptop/HP
- Countdown otomatis
- Capture beberapa foto sesuai template
- Preview hasil foto
- Retake foto
- Edit sederhana: filter, brightness, contrast, teks
- Generate foto final
- Download foto
- Print foto
- Kirim foto ke email
- Galeri lokal di browser

## Cara menjalankan project

1. Install Node.js versi LTS.
2. Buka terminal di folder project.
3. Install dependency:

```bash
npm install
```

4. Jalankan project:

```bash
npm run dev
```

5. Buka browser:

```bash
http://localhost:3000
```

## Izin kamera

Aplikasi kamera biasanya hanya berjalan di:

- `localhost`
- website HTTPS

Kalau nanti deploy ke hosting, gunakan HTTPS seperti Vercel.

## Konfigurasi email

Buat file `.env.local` berdasarkan `.env.example`.

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL="SnapBooth <onboarding@resend.dev>"
```

Jika `RESEND_API_KEY` belum diisi, fitur capture, preview, edit, download, dan print tetap bisa digunakan. Fitur kirim email akan menampilkan pesan konfigurasi.

## Konfigurasi Supabase opsional

Jika ingin menyimpan hasil foto ke database/storage, isi:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PHOTOBOOTH_BUCKET=photobooth-results
```

Lalu jalankan SQL di `database/schema.sql` melalui Supabase SQL Editor.

Buat bucket storage bernama:

```text
photobooth-results
```

Untuk testing cepat, bucket bisa dibuat public. Untuk production, sebaiknya gunakan signed URL.

## Struktur folder

```text
snapbooth-project
├── app
│   ├── api
│   │   └── send-email
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── database
│   └── schema.sql
├── .env.example
├── package.json
├── tailwind.config.ts
└── README.md
```

## Alur sistem

```text
Welcome
↓
Pilih Template
↓
Aktifkan Kamera
↓
Countdown
↓
Capture Foto
↓
Preview
↓
Edit
↓
Generate Final
↓
Download / Print / Kirim Email
```

## Catatan pengembangan berikutnya

Fitur yang bisa ditambahkan setelah MVP:

- Admin template/frame
- Upload frame custom
- QR Code download
- Integrasi printer otomatis dengan Electron
- Login admin
- Riwayat event
- Payment / paket photobooth
- Watermark brand/event
