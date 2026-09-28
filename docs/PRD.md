# PRD Aplikasi Pencatat Latihan Gym

Sep 29, 2026 · @ade

## Ringkasan

Aplikasi web (mobile-first) untuk mencatat latihan gym cukup dengan tap: pilih latihan, tekan tombol untuk menambah rep, lalu simpan. Riwayat latihan tersimpan rapi dan bisa diperbaiki kapan saja.

**Masalah saat ini.** Latihan dicatat manual di WhatsApp. Di sela set, tangan capek dan waktu istirahat pendek, jadi mengetik nama latihan, set, dan rep terasa merepotkan. Catatan di chat juga sulit dicari dan tidak bisa dilihat sebagai riwayat per latihan.

**Solusi.** Ganti mengetik dengan tombol besar: daftar latihan siap pilih, penghitung rep satu tap, dan riwayat yang tersusun per sesi.

## Tujuan & metrik keberhasilan

Dua tujuan utama: mencatat latihan tanpa mengetik, dan melihat riwayat latihan dengan mudah.

| Tujuan | Metrik | Target MVP |
| --- | --- | --- |
| Mencatat tanpa mengetik | Jumlah ketikan keyboard untuk mencatat 1 set | 0 (semua lewat tap) |
| Mencatat dengan cepat | Waktu dari buka app sampai 1 set tersimpan | di bawah 10 detik |
| Mencatat dengan cepat | Jumlah tap untuk mencatat 1 set berikutnya pada latihan yang sama | maksimal 3 tap |
| Riwayat mudah dilihat | Waktu menemukan catatan latihan tertentu dari sesi sebelumnya | di bawah 15 detik |
| Data bisa dipercaya | Set yang salah bisa dikoreksi | 100% set bisa diedit atau dihapus |

Target angka di atas adalah usulan awal dan bisa disesuaikan setelah uji coba di gym.

## Pengguna & skenario

Pengguna utama adalah satu orang (pemilik aplikasi) yang latihan beban rutin di gym dan mencatat dari HP.

**Kondisi pemakaian di gym:**

- HP dipegang satu tangan, kadang tangan berkeringat atau pakai sarung tangan
- Waktu istirahat antar set sekitar 1 sampai 3 menit
- Perhatian terbagi, jadi layar harus bisa dipahami sekilas
- Sinyal internet di gym bisa lemah

**User stories:**

1. Sebagai pengguna, saya ingin memilih latihan dari daftar supaya tidak perlu mengetik nama latihan.
2. Sebagai pengguna, saya ingin menambah rep dengan satu tap per rep supaya tidak perlu mengetik angka.
3. Sebagai pengguna, saya ingin mencatat beban di setiap set dengan tombol, tanpa mengetik.
4. Sebagai pengguna, saya ingin mencatat kardio (waktu, incline, dan speed) di sesi yang sama.
5. Sebagai pengguna, saya ingin menyimpan set dengan satu tap dan lanjut ke set berikutnya.
6. Sebagai pengguna, saya ingin melihat riwayat latihan per tanggal dan per jenis latihan.
7. Sebagai pengguna, saya ingin mengedit rep, beban, atau mengganti jenis latihan kalau ternyata salah catat.
8. Sebagai pengguna, saya ingin membuka data yang sama dari HP maupun laptop dengan akun saya.

## Ruang lingkup

MVP mencakup empat fitur yang diminta (pilih latihan, hitung rep, simpan, edit) plus riwayat, pencatatan beban dan kardio, serta akun supaya data bisa dibuka di perangkat lain.

| Masuk MVP | Tidak masuk MVP (nanti) |
| --- | --- |
| Daftar latihan bawaan per kelompok otot, termasuk kardio | Program atau jadwal latihan otomatis |
| Tambah latihan custom sendiri (satu kali ketik, lalu tinggal pilih) | Grafik progres dan statistik |
| Penghitung rep dengan tombol + dan − | Input suara atau penghitung rep lewat kamera/sensor |
| Beban (kg) per set lewat tombol +/− | Timer istirahat |
| Kardio: waktu lewat stopwatch, incline dan speed lewat tombol +/− | Fitur sosial dan berbagi |
| Simpan set per latihan dalam satu sesi | Ekspor data ke CSV |
| Riwayat per tanggal dan per latihan | Impor catatan lama dari WhatsApp |
| Edit dan hapus set, ganti jenis latihan |  |
| Akun dan sinkron data antar perangkat |  |

## Kebutuhan fungsional

Semua input di layar latihan dilakukan dengan tap; keyboard hanya muncul saat menambah latihan custom dan saat login.

### F1. Memilih latihan

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F1.1 | Daftar latihan bawaan dikelompokkan per otot (dada, punggung, kaki, bahu, lengan, perut, kardio) | Minimal 30 latihan umum tersedia saat pertama kali dipakai |
| F1.2 | Latihan terakhir dan paling sering dipakai muncul paling atas | Bagian "Terakhir dipakai" berisi 5 latihan terbaru |
| F1.3 | Pencarian latihan | Hasil muncul sambil mengetik, tanpa tekan enter |
| F1.4 | Tambah latihan custom | Nama + kelompok otot, lalu langsung bisa dipilih |

### F2. Menghitung rep

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F2.1 | Tombol besar "+1 rep" | Area tap minimal 120×120 px, angka rep bertambah seketika |
| F2.2 | Tombol "−1" untuk koreksi cepat | Rep tidak bisa di bawah 0 |
| F2.3 | Getar singkat (haptic) di setiap tap, kalau HP mendukung | Tetap berfungsi normal kalau getar tidak didukung |
| F2.4 | Beban dicatat di setiap set dengan tombol +/− (langkah 2,5 kg) | Default = beban set sebelumnya di latihan yang sama; 0 kg untuk latihan beban badan |
| F2.5 | Rep dan beban set sebelumnya ditampilkan sebagai acuan | Teks kecil "Set lalu: 10 rep · 40 kg" |

### F3. Menyimpan data latihan

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F3.1 | Tombol "Simpan set" | Set tersimpan, penghitung reset ke 0, nomor set naik satu |
| F3.2 | Sesi dibuat otomatis per hari | Set pertama di hari itu membuka sesi baru |
| F3.3 | Tombol "Selesai latihan" menutup sesi | Muncul ringkasan: jumlah latihan, set, dan total rep |
| F3.4 | Data tersimpan di perangkat meski offline | Set tidak hilang saat sinyal putus atau tab tertutup |

### F4. Riwayat latihan

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F4.1 | Daftar sesi terbaru di atas | Tiap sesi menampilkan tanggal, kelompok otot, jumlah set |
| F4.2 | Detail sesi | Semua latihan beserta set, rep, dan beban |
| F4.3 | Riwayat per latihan | Semua set untuk satu latihan, dikelompokkan per tanggal |

### F5. Mengedit latihan

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F5.1 | Edit rep dan beban satu set | Tap set, ubah dengan tombol +/−, simpan |
| F5.2 | Ganti jenis latihan | Semua set di latihan itu pindah ke latihan yang baru dipilih |
| F5.3 | Hapus set | Ada tombol "Urungkan" selama 5 detik setelah dihapus |
| F5.4 | Edit bisa dari sesi hari ini maupun riwayat lama | Perubahan langsung terlihat di riwayat |

### F6. Mencatat kardio

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F6.1 | Latihan bertipe kardio (treadmill, sepeda, dll.) membuka layar kardio, bukan penghitung rep | Tipe latihan menentukan layar yang muncul |
| F6.2 | Waktu dicatat dengan stopwatch Mulai/Berhenti | Waktu terisi otomatis, bisa dikoreksi dengan tombol +/− 1 menit |
| F6.3 | Incline dengan tombol +/− (langkah 0,5%) | Default = incline sesi kardio sebelumnya; boleh kosong untuk alat tanpa incline |
| F6.4 | Speed dengan tombol +/− (langkah 0,1 km/jam) | Default = speed sesi kardio sebelumnya |
| F6.5 | Kardio tersimpan di sesi yang sama dan bisa diedit atau dihapus seperti set | Riwayat menampilkan waktu, incline, dan speed |

### F7. Akun & sinkron antar perangkat

| ID | Kebutuhan | Kriteria penerimaan |
| --- | --- | --- |
| F7.1 | Daftar dan masuk dengan email atau akun Google | Sekali login, tetap masuk di perangkat itu |
| F7.2 | Data tersinkron ke cloud | Catatan dari HP muncul di perangkat lain dengan akun yang sama beberapa detik setelah online |
| F7.3 | Tetap bisa mencatat saat offline | Data antre di perangkat dan tersinkron otomatis saat online lagi |
| F7.4 | Aturan konflik edit | Perubahan dengan `updated_at` paling baru yang dipakai |
| F7.5 | Keluar akun | Data lokal dihapus dari perangkat, data di cloud tetap aman |

## Alur pengguna utama

&#91;embedded content: alur satu sesi latihan · 8 langkah, 2 keputusan\]

Setelah latihan pertama dipilih, satu set berikutnya cukup: tap +1 rep beberapa kali, lalu Simpan set. Koreksi dilakukan dari Riwayat atau langsung dari daftar set hari ini.

## Kebutuhan non-fungsional

Aplikasi harus nyaman dipakai satu tangan di gym dan tetap jalan tanpa internet.

| Aspek | Kebutuhan |
| --- | --- |
| Platform | Web app responsif, dioptimalkan untuk layar HP 360 sampai 430 px, tetap rapi di tablet dan laptop, bisa dipasang ke home screen (PWA) |
| Offline | Offline-first: semua fitur utama jalan tanpa internet, data disimpan dulu di perangkat (IndexedDB) lalu disinkron ke cloud saat online |
| Kecepatan | Halaman pertama tampil di bawah 2 detik di 4G; respons tap terasa instan (di bawah 100 ms) |
| Ergonomi | Tombol utama di sepertiga bawah layar, area tap minimal 48 px, teks angka rep minimal 64 px |
| Keterbacaan | Kontras tinggi, dukung mode gelap, layar tidak mati saat penghitung aktif (Wake Lock API) |
| Keamanan data | Data hanya bisa diakses pemilik akun (setiap query API difilter per user\_id), koneksi lewat HTTPS, password di-hash oleh library auth |
| Browser | Chrome Android dan Safari iOS versi terbaru |

## Model data

Tiga entitas utama: Latihan, Sesi, dan Set, masing-masing terikat ke akun lewat `user_id`. Satu Sesi punya banyak Set, dan tiap Set menunjuk ke satu Latihan, jadi mengganti jenis latihan cukup mengubah `exercise_id` di set terkait. Satu Set menyimpan rep dan beban untuk latihan beban, atau waktu, incline, dan speed untuk kardio.

**Exercise (Latihan)**

| Field | Tipe | Keterangan |
| --- | --- | --- |
| id | string (UUID) | Kunci utama |
| user\_id | string, boleh kosong | Kosong untuk latihan bawaan, terisi untuk latihan custom milik akun |
| name | string | Contoh: Bench Press, Treadmill |
| type | enum | `beban` atau `kardio`; menentukan layar pencatatan |
| muscle\_group | enum | dada, punggung, kaki, bahu, lengan, perut, kardio |
| is\_custom | boolean | true kalau ditambah sendiri |
| last\_used\_at | datetime | Untuk urutan "Terakhir dipakai" |

**Session (Sesi)**

| Field | Tipe | Keterangan |
| --- | --- | --- |
| id | string (UUID) | Kunci utama |
| user\_id | string | Pemilik sesi (akun yang login) |
| date | date | Satu sesi per hari |
| started\_at | datetime | Waktu set pertama disimpan |
| ended\_at | datetime, boleh kosong | Diisi saat tap "Selesai latihan" |

**Set**

| Field | Tipe | Keterangan |
| --- | --- | --- |
| id | string (UUID) | Kunci utama, dibuat di perangkat supaya aman untuk sinkron offline |
| user\_id | string | Pemilik data |
| session\_id | string | Relasi ke Session |
| exercise\_id | string | Relasi ke Exercise; diubah saat ganti jenis latihan |
| set\_number | integer | Urutan set dalam latihan tersebut di sesi itu |
| reps | integer, boleh kosong | Wajib untuk latihan beban, minimal 0 |
| weight\_kg | decimal, boleh kosong | Wajib untuk latihan beban, kelipatan 2,5; 0 untuk beban badan |
| duration\_sec | integer, boleh kosong | Waktu kardio, wajib untuk kardio |
| incline\_pct | decimal, boleh kosong | Incline kardio dalam persen, kelipatan 0,5 |
| speed\_kmh | decimal, boleh kosong | Speed kardio dalam km/jam, kelipatan 0,1 |
| created\_at, updated\_at | datetime | Jejak waktu; `updated_at` dipakai untuk aturan konflik sinkron |
| deleted\_at | datetime, boleh kosong | Hapus lunak, supaya penghapusan ikut tersinkron |

## Rancangan layar

&#91;embedded content: wireframe 3 layar utama\]

Layar penghitung adalah inti aplikasi: angka rep besar di tengah dan tombol +1 bulat yang mudah ditekan tanpa melihat. Navigasi bawah berisi dua tab, Latihan dan Riwayat.

- **Pilih latihan:** pencarian di atas, lalu "Terakhir dipakai", lalu daftar per kelompok otot termasuk kardio.
- **Penghitung rep:** acuan set lalu, tombol +1, koreksi −1, beban, dan daftar set hari ini yang bisa di-tap untuk edit.
- **Layar kardio:** stopwatch Mulai/Berhenti besar, lalu tombol +/− untuk incline dan speed, lalu Simpan.
- **Riwayat:** tab Per sesi dan Per latihan; tap sesi untuk detail, tap set untuk edit atau hapus.
- **Masuk:** layar login sekali di awal (email atau Google), tidak muncul lagi selama belum keluar akun.

## Rencana rilis, asumsi & pertanyaan terbuka

Rilis dibagi tiga tahap; tahap 1 sudah cukup untuk menggantikan catatan WhatsApp.

1. **Tahap 1 (MVP):** akun dan sinkron, pilih latihan, penghitung rep dan beban, pencatatan kardio, simpan, riwayat, edit dan hapus. Bisa dipasang sebagai PWA.
2. **Tahap 2:** timer istirahat, grafik progres per latihan, ekspor CSV.
3. **Tahap 3:** program latihan dan pengingat jadwal.

**Tech stack:** React + Vite di frontend, Hono sebagai API, dan Neon sebagai database. Semuanya TypeScript supaya satu bahasa dari ujung ke ujung.

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| Frontend | React + Vite, PWA lewat vite-plugin-pwa | Build cepat, ringan, mudah dipasang ke home screen |
| Penyimpanan offline | IndexedDB lewat Dexie.js | Tetap bisa mencatat saat sinyal gym lemah |
| Backend / API | Hono (TypeScript) | Ringan, jalan di Node dalam container, satu bahasa dengan frontend |
| Auth | Better Auth (email + Google) | Open source, tabel user disimpan di Neon sendiri |
| ORM & migrasi | Drizzle ORM + Drizzle Kit | Type-safe dan cocok dengan driver serverless Neon |
| Database | Neon (Postgres serverless), region Singapura | Dekat dari Indonesia; nanti dikelola lewat Neon MCP |
| Sinkron | Endpoint push/pull berbasis `updated_at` | Sesuai aturan konflik F7.4, termasuk hapus lunak |
| Deploy | VPS Sumopod (region Jakarta) + Docker Compose + Caddy | Murah, paket 2 vCPU / 2 GB sudah cukup karena database ada di Neon; Caddy mengurus HTTPS otomatis |

**Struktur repo (monorepo):** satu repo Git berisi tiga folder, FE, BE, dan ENV.

```text
project/
├── FE/                 # React + Vite, PWA, Dexie (offline)
├── BE/                 # Hono API, Better Auth, Drizzle (skema + migrasi)
├── ENV/                # .env.example per lingkungan (dev, prod)
├── docker-compose.yml  # container BE + Caddy
├── Caddyfile           # HTTPS otomatis, sajikan FE, proxy /api ke BE
├── .gitignore          # abaikan ENV/.env* kecuali .env.example
└── package.json        # pnpm workspaces untuk FE dan BE
```

- **ENV:** hanya `.env.example` yang di-commit; file `.env` asli (berisi `DATABASE_URL` Neon dan secret auth) masuk `.gitignore`.
- **FE membaca ENV:** set `envDir: '../ENV'` di `vite.config`; hanya variabel berawalan `VITE_` yang terbaca di browser, jadi secret database tidak ikut ter-bundle.
- **BE membaca ENV:** load `../ENV/.env` lewat dotenv; di VPS, file `ENV/.env` dibuat langsung di server, tidak lewat Git.
- **Deploy:** di VPS, Caddy menyajikan hasil build FE dan meneruskan `/api` ke container BE. FE dan API ada di satu domain, jadi tidak perlu setting CORS. PWA dan login Google wajib HTTPS, jadi untuk sementara pakai subdomain DuckDNS gratis (contoh: namaapp.duckdns.org) yang diarahkan ke IP VPS; sertifikat HTTPS tetap dibuat otomatis oleh Caddy. Nanti bisa pindah ke domain sendiri cukup dengan ganti nama domain di Caddyfile dan redirect URI Google.

**Asumsi:**

- Satu akun dipakai satu orang; data bisa dibuka dari perangkat mana pun dengan akun yang sama.
- Latihan beban dicatat per set (rep dan beban); kardio dicatat per aktivitas (waktu, incline, dan speed).
- Beban wajib dicatat di setiap set latihan beban.
- Mulai dari data kosong; catatan lama di WhatsApp tidak diimpor.

**Pertanyaan terbuka:**

- [x] Perlu mencatat beban (kg)? Diputuskan: ya, di setiap set.
- [x] Impor catatan lama dari WhatsApp? Diputuskan: tidak, mulai dari nol.
- [x] Kardio (treadmill, sepeda) dicatat? Diputuskan: ya.
- [x] Bisa dibuka di perangkat lain? Diputuskan: ya, dengan akun yang sama.
- [x] Data kardio apa saja? Diputuskan: waktu, incline, dan speed.
