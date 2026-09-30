// Format data panduan gerakan (DESIGN §5.16). Satu file per latihan di data/,
// koordinat dalam satuan viewBox SVG, tampak samping.

// [x, y] tampak samping; z opsional = jarak dari garis tengah tubuh (gerakan ke samping)
export type Titik = [x: number, y: number, z?: number];

// Nama sendi -> posisi
export type Pose = Record<string, Titik>;

export type Alat =
  | { type: 'rect'; x: number; y: number; w: number; h: number; r?: number; d?: number } // d = kedalaman 3D
  | { type: 'line'; x1: number; y1: number; x2: number; y2: number };

// Kabel atau batang mesin: dari titik tetap ke sendi yang bergerak
export type Kabel = { dari: Titik; ke: string; keDy?: number; cermin?: boolean; r?: number };

// Tambalan otot di permukaan badan (khusus 3D), misal dada atau punggung
export type SorotTiga = {
  a: string;
  b: string;
  z: number;
  depan: [number, number];
  dorong: number;
  tebal: number;
  lebar: number;
};

export type Gerakan = {
  viewBox: string;
  tempo: number; // detik per rep
  bagi?: number; // porsi durasi pose 0 -> pose 1, default 0,6
  otot: { utama: string[]; bantu: string[] };
  cue: string[];
  alat: Alat[];
  kabel?: Kabel[];
  tulang: [string, string][];
  sorot: [string, string][]; // otot utama, digambar merah
  tiga?: { sorot: SorotTiga[] };
  kamera?: { theta?: number; phi?: number };
  kepala: { sendi: string; r: number };
  beban: { sendi: string; r: number; jenis?: 'barbel' | 'bar' | 'pegangan' };
  pose: [Pose, Pose];
};

export function sendi(p: Pose, nama: string): Titik {
  const t = p[nama];
  if (!t) throw new Error(`Sendi "${nama}" tidak ada di pose`);
  return t;
}
