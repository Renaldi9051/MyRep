import type { Gerakan } from '../types';

// Lat Pulldown, tampak samping, duduk menghadap mesin.
const data: Gerakan = {
  viewBox: '0 0 240 160',
  tempo: 3,
  bagi: 0.4, // tarik turun 40% durasi, naik pelan 60%
  otot: { utama: ['Punggung (lat)'], bantu: ['Bisep', 'Bahu belakang'] },
  cue: [
    'Kunci paha di bawah bantalan, dada sedikit dibusungkan',
    'Tarik bar ke dada atas, dorong siku ke bawah',
    'Naikkan pelan sampai lengan hampir lurus',
  ],
  alat: [
    { type: 'rect', x: 160, y: 4, w: 7, h: 144, r: 2, d: 0.5 }, // tiang dan tumpukan beban
    { type: 'rect', x: 100, y: 4, w: 67, h: 6, r: 2, d: 0.3 }, // palang atas
    { type: 'rect', x: 128, y: 98, w: 20, h: 7, r: 3.5, d: 1.2 }, // bantalan paha
    { type: 'rect', x: 146, y: 99, w: 14, h: 4, r: 2, d: 0.2 }, // penyangga bantalan
    { type: 'rect', x: 86, y: 118, w: 38, h: 6, r: 3, d: 1.1 }, // dudukan
    { type: 'line', x1: 106, y1: 124, x2: 106, y2: 148 },
    { type: 'line', x1: 40, y1: 148, x2: 200, y2: 148 }, // lantai
  ],
  kabel: [{ dari: [106, 10], ke: 'tangan', r: 0.025 }],
  tulang: [
    ['pinggul', 'lutut'], ['lutut', 'kaki'], ['kaki', 'jari'],
    ['bahu', 'pinggul'], ['bahu', 'siku'], ['siku', 'tangan'],
  ],
  sorot: [['latAtas', 'latBawah']],
  tiga: { sorot: [{ a: 'latAtas', b: 'latBawah', z: 0.4, depan: [-1, 0], dorong: 0.24, tebal: 0.17, lebar: 0.24 }] },
  kamera: { theta: -0.8 }, // mulai dari belakang supaya otot punggung terlihat
  kepala: { sendi: 'kepala', r: 9 },
  beban: { sendi: 'tangan', jenis: 'bar', r: 4 },
  pose: [
    {
      kepala: [97, 58], bahu: [98, 72], latAtas: [99, 80], latBawah: [102, 100], pinggul: [104, 112],
      lutut: [137, 112], kaki: [136, 146], jari: [146, 147],
      siku: [101, 46, 26], tangan: [104, 20, 31],
    },
    {
      kepala: [93, 59], bahu: [95, 73], latAtas: [97, 81], latBawah: [101, 100], pinggul: [104, 112],
      lutut: [137, 112], kaki: [136, 146], jari: [146, 147],
      siku: [95, 90, 33], tangan: [108, 66, 31],
    },
  ],
};

export default data;
