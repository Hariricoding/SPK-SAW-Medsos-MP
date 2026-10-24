// ─── Dummy Data Seed — SPK SAW Media Sosial ──────────────────────────────────
// Sesuai IMPLEMENTATION_PLAN.md §7

import type { Konten, Kriteria, Bobot, Penilaian } from '../types';

// ── Konten (5 Alternatif) ─────────────────────────────────────────────────────
export const dummyKonten: Konten[] = [
  {
    id: 'K1',
    nama: 'Tutorial Desain UI/UX Terbaik 2026',
    platform: 'youtube',
    url: 'https://youtube.com/watch?v=example1',
    tanggalPublikasi: '2026-09-01',
    createdAt: '2026-09-01T08:00:00Z',
  },
  {
    id: 'K2',
    nama: 'Behind the Scene Proses Kreatif',
    platform: 'instagram',
    url: 'https://instagram.com/p/example2',
    tanggalPublikasi: '2026-09-05',
    createdAt: '2026-09-05T10:30:00Z',
  },
  {
    id: 'K3',
    nama: 'Tips Produktivitas Remote Work',
    platform: 'tiktok',
    url: 'https://tiktok.com/@user/video/example3',
    tanggalPublikasi: '2026-09-10',
    createdAt: '2026-09-10T14:00:00Z',
  },
  {
    id: 'K4',
    nama: 'Thread Viral: Cara Bangun Personal Brand',
    platform: 'twitter',
    url: 'https://twitter.com/user/status/example4',
    tanggalPublikasi: '2026-09-15',
    createdAt: '2026-09-15T09:15:00Z',
  },
  {
    id: 'K5',
    nama: 'Live Q&A Bersama Community',
    platform: 'facebook',
    url: 'https://facebook.com/watch/live/example5',
    tanggalPublikasi: '2026-09-20',
    createdAt: '2026-09-20T19:00:00Z',
  },
];

// ── Kriteria (5 Kriteria, semua Benefit) ──────────────────────────────────────
export const dummyKriteria: Kriteria[] = [
  {
    id: 'C1',
    kode: 'C1',
    nama: 'Views',
    jenis: 'benefit',
    keterangan: 'Jumlah tayangan / penayangan konten',
  },
  {
    id: 'C2',
    kode: 'C2',
    nama: 'Likes',
    jenis: 'benefit',
    keterangan: 'Jumlah suka / apresiasi dari pengguna',
  },
  {
    id: 'C3',
    kode: 'C3',
    nama: 'Comments',
    jenis: 'benefit',
    keterangan: 'Jumlah komentar pada konten',
  },
  {
    id: 'C4',
    kode: 'C4',
    nama: 'Shares',
    jenis: 'benefit',
    keterangan: 'Jumlah berbagi / repost konten',
  },
  {
    id: 'C5',
    kode: 'C5',
    nama: 'Engagement Rate (%)',
    jenis: 'benefit',
    keterangan: 'Persentase interaksi dibanding total penonton',
  },
];

// ── Bobot (total = 1.00) ──────────────────────────────────────────────────────
export const dummyBobot: Bobot[] = [
  { kriteriaId: 'C1', nilai: 0.25 },
  { kriteriaId: 'C2', nilai: 0.25 },
  { kriteriaId: 'C3', nilai: 0.20 },
  { kriteriaId: 'C4', nilai: 0.15 },
  { kriteriaId: 'C5', nilai: 0.15 },
];

// ── Penilaian (Matriks 5×5) ───────────────────────────────────────────────────
// Sesuai tabel di IMPLEMENTATION_PLAN.md §7
export const dummyPenilaian: Penilaian[] = [
  // K1 YouTube: Views=125000, Likes=8500, Comments=420, Shares=310, EngRate=7.2
  { kontenId: 'K1', kriteriaId: 'C1', nilai: 125000 },
  { kontenId: 'K1', kriteriaId: 'C2', nilai: 8500   },
  { kontenId: 'K1', kriteriaId: 'C3', nilai: 420    },
  { kontenId: 'K1', kriteriaId: 'C4', nilai: 310    },
  { kontenId: 'K1', kriteriaId: 'C5', nilai: 7.2    },

  // K2 Instagram: Views=89000, Likes=12400, Comments=680, Shares=520, EngRate=9.8
  { kontenId: 'K2', kriteriaId: 'C1', nilai: 89000  },
  { kontenId: 'K2', kriteriaId: 'C2', nilai: 12400  },
  { kontenId: 'K2', kriteriaId: 'C3', nilai: 680    },
  { kontenId: 'K2', kriteriaId: 'C4', nilai: 520    },
  { kontenId: 'K2', kriteriaId: 'C5', nilai: 9.8    },

  // K3 TikTok: Views=210000, Likes=18900, Comments=940, Shares=780, EngRate=11.4
  { kontenId: 'K3', kriteriaId: 'C1', nilai: 210000 },
  { kontenId: 'K3', kriteriaId: 'C2', nilai: 18900  },
  { kontenId: 'K3', kriteriaId: 'C3', nilai: 940    },
  { kontenId: 'K3', kriteriaId: 'C4', nilai: 780    },
  { kontenId: 'K3', kriteriaId: 'C5', nilai: 11.4   },

  // K4 Twitter: Views=67000, Likes=5200, Comments=1250, Shares=1100, EngRate=8.6
  { kontenId: 'K4', kriteriaId: 'C1', nilai: 67000  },
  { kontenId: 'K4', kriteriaId: 'C2', nilai: 5200   },
  { kontenId: 'K4', kriteriaId: 'C3', nilai: 1250   },
  { kontenId: 'K4', kriteriaId: 'C4', nilai: 1100   },
  { kontenId: 'K4', kriteriaId: 'C5', nilai: 8.6    },

  // K5 Facebook: Views=45000, Likes=3800, Comments=290, Shares=240, EngRate=5.1
  { kontenId: 'K5', kriteriaId: 'C1', nilai: 45000  },
  { kontenId: 'K5', kriteriaId: 'C2', nilai: 3800   },
  { kontenId: 'K5', kriteriaId: 'C3', nilai: 290    },
  { kontenId: 'K5', kriteriaId: 'C4', nilai: 240    },
  { kontenId: 'K5', kriteriaId: 'C5', nilai: 5.1    },
];
