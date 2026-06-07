# SiagaAI Frontend

SiagaAI adalah platform pemantauan risiko bencana banjir berbasis kecerdasan buatan (AI). Aplikasi ini memberikan prediksi risiko waktu nyata, asisten AI interaktif untuk panduan mitigasi, integrasi cuaca, serta fitur kedaruratan (SOS). SiagaAI dirancang untuk membantu masyarakat dan aparat terkait (seperti BPBD) dalam mengambil keputusan berbasis data yang cepat dan akurat di situasi krisis.

## 🌟 Features

- **Dashboard Monitoring:** Tinjauan komprehensif metrik risiko, kondisi cuaca, dan prediksi AI dalam antarmuka yang modern.
- **Multi-City Monitoring:** Dukungan pemantauan multi-kota dengan opsi deteksi lokasi otomatis (Geolocation) maupun pemilihan lokasi manual.
- **AI Assistant:** Obrolan AI (LLM) dengan dukungan *Multi-Session* dan riwayat obrolan (History Sidebar) persisten.
- **Emergency SOS:** Tombol darurat cepat dengan sistem eskalasi yang terintegrasi untuk mengirimkan detail lokasi ke otoritas/kontak penting.
- **System Health Monitoring:** Halaman pemantauan waktu-nyata status sistem, latensi ML Service, dan Backend API.
- **Dark Mode & Modern UI:** Antarmuka estetik yang mendukung mode gelap (Dark Mode) adaptif dan responsif untuk semua perangkat (Desktop/Tablet/Mobile).

## 🛠️ Tech Stack

Frontend SiagaAI dibangun menggunakan ekosistem dan *library* modern yang tangguh untuk menjamin performa tinggi:

- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Bahasa Utama:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** Zustand v5
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Date Formatting:** date-fns

## 📁 Project Structure

Struktur direktori didesain secara modular menggunakan pendekatan *feature-based*:

```text
pjk-gm011-frontend/
├── app/                  # Next.js App Router (Pages & Layouts)
│   ├── chat/             # Halaman AI Assistant
│   ├── dashboard/        # Halaman Utama Monitoring
│   ├── sistem/           # Halaman System Health
│   └── sos/              # Halaman Emergency SOS
├── components/           # Komponen UI Reusable (React Components)
│   ├── chat/             # Komponen khusus antarmuka Chat
│   ├── dashboard/        # Komponen khusus antarmuka Dashboard
│   ├── ui/               # Komponen dasar (Toast, Skeleton, Badge, dll)
│   └── ...
├── hooks/                # Custom React Hooks (Geolocation, API Health, dll)
├── services/             # Integrasi dan pemanggilan Backend API (ML, Chat, SOS)
├── stores/               # Zustand Global Stores (App State, Chat State)
├── types/                # Definisi Interface TypeScript
└── public/               # Static assets
```


## 🚀 Installation & Setup

1. **Clone repository:**
   ```bash
   git clone https://github.com/JonathanLukasW/PJK-FE.git
   cd pjk-gm011-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Setup environment variables:**
   ```bash
   cp .env.example .env.local
   # Sesuaikan nilai variabel pada .env.local jika diperlukan
   ```

4. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

## 📦 Production Build

Untuk mem-build proyek ke tahap *Production-ready*:

```bash
npm run lint

npm run build

npm run start
```

## 🔌 API Integration

Frontend ini dikonfigurasi untuk terhubung dengan backend AI & Monitoring yang berjalan di infrastruktur **Railway**.
- **ML Service:** Mengembalikan model prediksi risiko banjir dan indikator kesehatan sistem (`/api/ml/predict`, `/api/ml/health`).
- **Chat Service:** Menangani interaksi ke LLM, menjaga konteks lokasi dari *System Message* (`/api/chat/sessions`, `/api/chat/history`).
- **Location Service:** Mengintegrasikan koordinat OpenStreetMap/Nominatim via frontend sebelum dikirimkan ke endpoint backend.

*(Endpoints sensitif tidak dipublikasikan ke source control atau README demi keamanan arsitektur).*

## 🧠 State Management

Aplikasi menggunakan **Zustand** untuk *state management* agar interaksi lintas komponen lebih mulus tanpa prop-drilling berlebih. Terdapat dua *store* utama:
1. `app-store.ts`: Menampung data lokasi pengguna, status perizinan, mode tema, dan status kesehatan API *(System Health)*.
2. `chat-store.ts`: Menyimpan sesi riwayat obrolan AI secara luring (*LocalStorage persistence*) sehingga percakapan sebelumnya tidak hilang apabila halaman di-*refresh*.
