import type { Gerakan } from '../types';

// Squat (barbell di punggung), tampak samping.
const data: Gerakan = {
  viewBox: '0 0 240 160',
  tempo: 3,
  otot: { utama: ['Paha depan'], bantu: ['Bokong', 'Paha belakang'] },
  cue: [
    'Kaki selebar bahu, dada tegak',
    'Turun sampai paha sejajar lantai',
    'Dorong lewat tumit untuk naik',
  ],
  alat: [{ type: 'line', x1: 40, y1: 148, x2: 200, y2: 148 }],
  tulang: [
    ['kaki', 'jari'], ['lutut', 'kaki'],
    ['bahu', 'pinggul'], ['bahu', 'siku'], ['siku', 'tangan'],
  ],
  sorot: [['pinggul', 'lutut']],
  kepala: { sendi: 'kepala', r: 9 },
  beban: { sendi: 'tangan', r: 11 },
  pose: [
    {
      kepala: [121, 26], bahu: [120, 40], pinggul: [120, 80], lutut: [121, 114],
      kaki: [120, 148], jari: [132, 148], siku: [106, 52], tangan: [117, 38],
    },
    {
      kepala: [132, 64], bahu: [125, 78], pinggul: [103, 112], lutut: [136, 118],
      kaki: [120, 148], jari: [132, 148], siku: [112, 92], tangan: [122, 76],
    },
  ],
};

export default data;
