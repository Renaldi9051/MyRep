# Deploy ke VPS (Docker Compose)

Dua container: `be` (Hono di Node) dan `caddy` (menyajikan hasil build FE, meneruskan `/api/*` ke `be`, serta mengurus HTTPS otomatis). Database tetap di Neon, jadi VPS tidak menyimpan data.

## Yang perlu disiapkan

- VPS Linux (Ubuntu/Debian) dengan port **80** dan **443** terbuka (TCP, plus UDP 443 untuk HTTP/3).
- Domain yang mengarah ke IP publik VPS, misalnya subdomain DuckDNS (`namaapp.duckdns.org`). Caddy baru bisa mengambil sertifikat HTTPS kalau domainnya sudah mengarah ke VPS.
- RAM minimal 1 GB untuk build FE. Kalau kurang, tambahkan swap dulu (lihat bagian bawah).

## Pertama kali

```sh
# 1. Pasang Docker (sudah termasuk docker compose)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER   # lalu logout dan login lagi

# 2. Ambil kode
git clone <url-repo> myrep
cd myrep

# 3. Buat .env dari contoh lalu isi
cp .env.example .env
nano .env
```

Isi `.env` di VPS:

| Variabel | Nilai |
| --- | --- |
| `DATABASE_URL` | Connection string Neon **branch production** |
| `BETTER_AUTH_SECRET` | Buat dengan `openssl rand -base64 32` (minimal 32 karakter) |
| `BETTER_AUTH_URL` | Biarkan saja; di Docker otomatis diganti `https://DOMAIN` |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Dari Google Cloud Console (kosongkan kalau tidak pakai login Google) |
| `DOMAIN` | Domain VPS tanpa `https://`, contoh `namaapp.duckdns.org` |

Kalau memakai login Google, tambahkan di Google Cloud Console (Credentials → OAuth client):

- Authorized JavaScript origins: `https://DOMAIN`
- Authorized redirect URIs: `https://DOMAIN/api/auth/callback/google`

Lalu jalankan:

```sh
docker compose up -d --build
docker compose logs -f be       # tunggu "Migrasi selesai" dan "BE jalan di ..."
curl https://DOMAIN/api/health
```

Migrasi database dan seed latihan bawaan otomatis dijalankan setiap container `be` start. Keduanya aman diulang.

## Update setelah ada perubahan kode

```sh
cd myrep
git pull
docker compose up -d --build
docker image prune -f           # hapus image lama supaya disk tidak penuh
```

## Perintah berguna

```sh
docker compose ps               # status container
docker compose logs -f caddy    # log HTTPS/proxy
docker compose restart be       # restart BE
docker compose down             # hentikan semua
```

Setelah mengubah `.env`, jalankan `docker compose up -d` supaya container dibuat ulang dengan env baru. `restart` saja tidak membaca ulang `env_file`.

## Swap untuk VPS RAM kecil

```sh
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```
