import type { Gerakan } from '../types';

// Seated Cable Row, tampak samping. Duduk di bangku rendah menghadap katrol bawah,
// kaki di pijakan, tarik pegangan V ke perut.
const data: Gerakan = {
  viewBox: '0 0 240 160',
  tempo: 3,
  bagi: 0.4, // tarik 40% durasi, luruskan pelan 60%
  otot: { utama: ['Punggung tengah', 'Punggung (lat)'], bantu: ['Bisep', 'Bahu belakang'] },
  cue: [
    'Kaki di pijakan, lutut sedikit ditekuk, dada tegak',
    'Tarik pegangan ke perut, rapatkan tulang belikat',
    'Luruskan lengan pelan tanpa membungkuk berlebihan',
  ],
  alat: [
    { type: 'rect', x: 188, y: 30, w: 8, h: 118, r: 2, d: 0.5 }, // tiang dan tumpukan beban
    { type: 'rect', x: 181, y: 86, w: 8, h: 8, r: 2, d: 0.3 }, // katrol bawah
    { type: 'rect', x: 166, y: 96, w: 6, h: 30, r: 3, d: 1.1 }, // pijakan kaki
    { type: 'rect', x: 172, y: 120, w: 16, h: 5, r: 2, d: 0.3 }, // penyangga pijakan
    { type: 'rect', x: 70, y: 112, w: 80, h: 6, r: 3, d: 0.9 }, // bangku
    { type: 'line', x1: 80, y1: 118, x2: 80, y2: 148 },
    { type: 'line', x1: 140, y1: 118, x2: 140, y2: 148 },
    { type: 'line', x1: 40, y1: 148, x2: 210, y2: 148 }, // lantai
  ],
  kabel: [{ dari: [183, 90], ke: 'tangan', r: 0.025 }],
  tulang: [
    ['pinggul', 'lutut'], ['lutut', 'kaki'], ['kaki', 'jari'],
    ['bahu', 'pinggul'], ['bahu', 'siku'], ['siku', 'tangan'],
  ],
  sorot: [['latAtas', 'latBawah']],
  tiga: {
    sorot: [
      { a: 'latAtas', b: 'latBawah', z: 0.38, depan: [-1, -0.2], dorong: 0.24, tebal: 0.17, lebar: 0.24 }, // lat
      { a: 'bahu', b: 'latAtas', z: 0.14, depan: [-1, -0.2], dorong: 0.3, tebal: 0.15, lebar: 0.16 }, // punggung tengah
    ],
  },
  kamera: { theta: -0.8 }, // mulai dari belakang supaya otot punggung terlihat
  kepala: { sendi: 'kepala', r: 9 },
  beban: { sendi: 'tangan', jenis: 'pegangan', r: 6 },
  pose: [
    {
      kepala: [110, 51], bahu: [106, 65], latAtas: [104, 73], latBawah: [99, 92], pinggul: [96, 104],
      lutut: [128, 94], kaki: [160, 108], jari: [163, 97],
      siku: [129, 78, 10], tangan: [151, 90, 5],
    },
    {
      kepala: [99, 50], bahu: [98, 64], latAtas: [98, 72], latBawah: [97, 92], pinggul: [96, 104],
      lutut: [128, 94], kaki: [160, 108], jari: [163, 97],
      siku: [88, 87, 21], tangan: [111, 90, 6],
    },
  ],
};

export default data;
