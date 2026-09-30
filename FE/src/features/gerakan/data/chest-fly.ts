import type { Gerakan } from '../types';

// Chest Fly di mesin pec deck, tampak samping, duduk.
// Gerakan utamanya ke samping (sumbu z), jadi sendi lengan memakai koordinat ketiga:
// [x, y, z] dengan z = jarak dari garis tengah tubuh (satuan sama dengan viewBox).
const data: Gerakan = {
  viewBox: '0 0 240 160',
  tempo: 3,
  bagi: 0.4, // menutup (kontraksi) 40% durasi, membuka pelan 60%
  otot: { utama: ['Dada'], bantu: ['Bahu depan'] },
  cue: [
    'Duduk tegak, punggung menempel sandaran',
    'Siku sedikit ditekuk, tarik pegangan ke depan dada',
    'Buka pelan sampai dada terasa meregang',
  ],
  alat: [
    { type: 'rect', x: 78, y: 26, w: 6, h: 122, r: 2, d: 0.4 }, // tiang
    { type: 'rect', x: 78, y: 26, w: 30, h: 6, r: 2, d: 0.4 }, // lengan atas mesin
    { type: 'rect', x: 84, y: 62, w: 6, h: 54, r: 3, d: 1.0 }, // sandaran
    { type: 'rect', x: 88, y: 116, w: 34, h: 6, r: 3, d: 1.1 }, // dudukan
    { type: 'line', x1: 105, y1: 122, x2: 105, y2: 148 },
    { type: 'line', x1: 40, y1: 148, x2: 200, y2: 148 }, // lantai
  ],
  // Batang mesin dari poros di atas bahu ke pegangan
  kabel: [{ dari: [102, 32, 15], ke: 'tangan', keDy: -10, cermin: true, r: 0.07 }],
  tulang: [
    ['pinggul', 'lutut'], ['lutut', 'kaki'], ['kaki', 'jari'],
    ['bahu', 'pinggul'], ['bahu', 'siku'], ['siku', 'tangan'],
  ],
  sorot: [['bahu', 'dada']],
  tiga: { sorot: [{ a: 'bahu', b: 'dada', z: 0.28, depan: [1, 0], dorong: 0.3, tebal: 0.17, lebar: 0.3 }] },
  kepala: { sendi: 'kepala', r: 9 },
  beban: { sendi: 'tangan', jenis: 'pegangan', r: 10 },
  pose: [
    {
      kepala: [103, 56], bahu: [102, 70], dada: [103, 88], pinggul: [104, 110],
      lutut: [137, 112], kaki: [136, 146], jari: [146, 147],
      siku: [107, 71, 42], tangan: [119, 71, 65],
    },
    {
      kepala: [103, 56], bahu: [102, 70], dada: [103, 88], pinggul: [104, 110],
      lutut: [137, 112], kaki: [136, 146], jari: [146, 147],
      siku: [125, 71, 29], tangan: [141, 71, 8],
    },
  ],
};

export default data;
