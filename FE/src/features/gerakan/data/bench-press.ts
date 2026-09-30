import type { Gerakan } from '../types';

// Bench Press, tampak samping. Dua pose (atas, bawah), animasi bolak-balik.
// Semua koordinat dalam viewBox 240 × 160.
const data: Gerakan = {
  viewBox: '0 0 240 160',
  tempo: 2.6, // detik per rep
  otot: { utama: ['Dada'], bantu: ['Trisep', 'Bahu depan'] },
  cue: [
    'Tulang belikat ditarik ke belakang, kaki menapak',
    'Turunkan bar pelan ke dada bawah',
    'Dorong sampai lengan lurus',
  ],
  alat: [
    { type: 'rect', x: 64, y: 118, w: 94, h: 8, r: 4 }, // bangku
    { type: 'line', x1: 78, y1: 126, x2: 78, y2: 147 },
    { type: 'line', x1: 144, y1: 126, x2: 144, y2: 147 },
    { type: 'line', x1: 40, y1: 147, x2: 200, y2: 147 }, // lantai
  ],
  tulang: [
    ['pinggul', 'lutut'], ['lutut', 'kaki'], ['kaki', 'jari'],
    ['bahu', 'pinggul'], ['bahu', 'siku'], ['siku', 'tangan'],
  ],
  sorot: [['bahu', 'dada']], // otot utama, digambar merah (--muscle)
  // Khusus 3D: otot dada berupa tambalan di permukaan badan, menghadap ke atas
  tiga: { sorot: [{ a: 'bahu', b: 'dada', z: 0.28, depan: [0, -1], dorong: 0.3, tebal: 0.17, lebar: 0.3 }] },
  kepala: { sendi: 'kepala', r: 9 },
  beban: { sendi: 'tangan', r: 11 },
  pose: [
    {
      kepala: [74, 108], bahu: [88, 110], dada: [110, 109], pinggul: [130, 112],
      lutut: [164, 106], kaki: [168, 141], jari: [178, 142],
      siku: [90, 82], tangan: [90, 56],
    },
    {
      kepala: [74, 108], bahu: [88, 110], dada: [110, 109], pinggul: [130, 112],
      lutut: [164, 106], kaki: [168, 141], jari: [178, 142],
      siku: [112, 118], tangan: [100, 96],
    },
  ],
};

export default data;
