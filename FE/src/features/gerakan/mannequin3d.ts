import * as THREE from 'three';
import { sendi, type Gerakan, type Pose, type Titik } from './types';

// Manekin 3D prosedural. Tidak ada file model: tubuh disusun dari tabung dan bola,
// digerakkan dari data pose 2D yang sama dengan versi SVG (x, y tampak samping),
// ditambah kedalaman z untuk sisi kiri dan kanan tubuh.
// File ini hanya di-import lewat GerakanFigure3D (lazy), jadi Three.js tidak masuk bundle awal.

const S = 1 / 25; // 25 unit viewBox = 1 unit 3D

// Warna dari token (tokens.css) supaya ikut mode gelap; nilai cadangan = mode terang
const TOKEN = {
  latar: ['--bg', '#ffffff'],
  tubuh: ['--fig-body', '#a9a9a4'],
  otot: ['--muscle', '#d6361f'],
  alat: ['--fig-tool', '#cdcdc8'],
  lantai: ['--fig-floor', '#e2e2de'],
  besi: ['--fig-iron', '#2b2b2b'],
} as const;

function bacaWarna(el: Element): Record<keyof typeof TOKEN, THREE.Color> {
  const css = getComputedStyle(el);
  const hasil = {} as Record<keyof typeof TOKEN, THREE.Color>;
  for (const k of Object.keys(TOKEN) as (keyof typeof TOKEN)[]) {
    const [nama, cadangan] = TOKEN[k];
    hasil[k] = new THREE.Color(css.getPropertyValue(nama).trim() || cadangan);
  }
  return hasil;
}

// Sendi di garis tengah tubuh (tidak dicerminkan kiri kanan)
const TENGAH = new Set(['kepala', 'bahu', 'dada', 'pinggul']);

// Setengah lebar tubuh (z) per sendi anggota badan
const LEBAR: Record<string, number> = {
  bahu: 0.6,
  siku: 0.72,
  tangan: 0.82,
  pinggul: 0.34,
  lutut: 0.36,
  kaki: 0.38,
  jari: 0.38,
};
const lebar = (n: string) => LEBAR[n] ?? 0;

// Jari-jari per tulang
const JARI: Record<string, number> = {
  'bahu-siku': 0.17,
  'siku-tangan': 0.135,
  'pinggul-lutut': 0.24,
  'lutut-kaki': 0.175,
  'kaki-jari': 0.1,
};

const ease = (u: number) => (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);

export type Mannequin = {
  setData(d: Gerakan): void;
  play(): void;
  pause(): void;
  dispose(): void;
};

// Melempar error kalau WebGL tidak tersedia; pemanggil kembali ke figur garis.
export function createMannequin(canvas: HTMLCanvasElement): Mannequin {
  const W = bacaWarna(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(W.latar);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(28, 1.5, 0.1, 100);
  // Warna cahaya (bukan warna UI): putih dari atas, abu dari bawah
  scene.add(new THREE.HemisphereLight(0xffffff, 0x5e5e5b, 0.55));
  const sun = new THREE.DirectionalLight(0xffffff, 0.9);
  sun.position.set(4, 9, 6);
  scene.add(sun);
  const isi = new THREE.DirectionalLight(0xffffff, 0.45); // cahaya pengisi dari belakang
  isi.position.set(-5, 6, -6);
  scene.add(isi);

  const mat = (color: THREE.Color, roughness = 0.85) =>
    new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });
  const M = {
    tubuh: mat(W.tubuh),
    otot: mat(W.otot, 0.6),
    alat: mat(W.alat),
    lantai: mat(W.lantai, 1),
    besi: mat(W.besi, 0.45),
  };
  const G = {
    bola: new THREE.SphereGeometry(1, 24, 16),
    tabung: new THREE.CylinderGeometry(1, 1, 1, 20),
    kotak: new THREE.BoxGeometry(1, 1, 1),
  };

  const UP = new THREE.Vector3(0, 1, 0);
  const tmp = new THREE.Vector3();
  const orbit = { theta: 0.62, phi: 0.3, r: 10, target: new THREE.Vector3() };

  let root = new THREE.Group();
  let parts: ((p: Pose) => void)[] = [];
  let data: Gerakan | null = null;
  let cx = 0;
  let lantaiY = 0;
  let playing = false;
  let raf = 0;
  let t0 = 0;
  let fase = 0;

  const pt = (xy: Titik, z = 0) => new THREE.Vector3((xy[0] - cx) * S, (lantaiY - xy[1]) * S, z);
  // z sendi anggota badan: dari pose kalau ada (koordinat ketiga), kalau tidak dari LEBAR
  const zOf = (p: Pose, n: string, sgn: number) => {
    const z = sendi(p, n)[2];
    return sgn * (z != null ? z * S : lebar(n));
  };
  const mesh = (g: THREE.BufferGeometry, m: THREE.Material) => {
    const o = new THREE.Mesh(g, m);
    root.add(o);
    return o;
  };

  // Letakkan tabung dari titik a ke b. Sumbu lokal y = arah tulang.
  function tabung(o: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, r: number, rz = r) {
    tmp.subVectors(b, a);
    const len = tmp.length() || 0.0001;
    o.position.addVectors(a, b).multiplyScalar(0.5);
    o.quaternion.setFromUnitVectors(UP, tmp.normalize());
    o.scale.set(r, len, rz);
  }

  function kotak(x: number, y: number, w: number, h: number, d: number, m: THREE.Material) {
    const o = mesh(G.kotak, m);
    o.position.set((x + w / 2 - cx) * S, (lantaiY - (y + h / 2)) * S, 0);
    o.scale.set(w * S, h * S, d);
  }

  function atur(t: number) {
    if (!data) return;
    const b = data.bagi ?? 0.6;
    const u = t < b ? ease(t / b) : ease(1 - (t - b) / (1 - b));
    const [p0, p1] = data.pose;
    const p: Pose = {};
    const antara = (a: number, b: number) => a + (b - a) * u;
    for (const k in p0) {
      const [ax, ay, az] = sendi(p0, k);
      const [bx, by, bz] = sendi(p1, k);
      p[k] = az == null ? [antara(ax, bx), antara(ay, by)] : [antara(ax, bx), antara(ay, by), antara(az, bz ?? az)];
    }
    for (const f of parts) f(p);
  }

  function bangun(d: Gerakan) {
    scene.remove(root);
    root = new THREE.Group();
    scene.add(root);
    parts = [];
    data = d;

    const [vx = 0, vy = 0, vw = 240, vh = 160] = d.viewBox.split(' ').map(Number);
    cx = vx + vw / 2;
    const datar = d.alat.flatMap((s) => (s.type === 'line' && s.y1 === s.y2 ? [s.y1] : []));
    lantaiY = datar.length ? Math.max(...datar) : vy + vh;

    // Alat dan lantai (statis)
    for (const s of d.alat) {
      if (s.type === 'rect') kotak(s.x, s.y, s.w, s.h, s.d ?? 1.1, M.alat);
      else if (s.y1 === s.y2 && s.y1 === lantaiY) {
        const o = mesh(G.tabung, M.lantai);
        o.userData.lantai = true;
        o.scale.set(3.8, 0.04, 3.8);
        o.position.set(0, -0.02, 0);
      } else if (s.x1 === s.x2) {
        kotak(s.x1 - 2, Math.min(s.y1, s.y2), 4, Math.abs(s.y2 - s.y1), 0.9, M.alat);
      }
    }

    const gelap = new Set(d.sorot.map(([a, b]) => `${a}-${b}`));
    const sendiBola = new Map<string, { nama: string; sgn: number; r: number }>();
    const catatSendi = (nama: string, sgn: number, r: number) => {
      const k = `${nama}:${sgn}`;
      const lama = sendiBola.get(k);
      if (!lama || lama.r < r) sendiBola.set(k, { nama, sgn, r });
    };

    // Tulang otot utama yang berupa anggota badan ikut digambar (di 2D mereka lapisan terpisah)
    const semua = [...d.tulang, ...d.sorot.filter(([a, b]) => !(TENGAH.has(a) && TENGAH.has(b)))];
    for (const [a, b] of semua) {
      if (TENGAH.has(a) && TENGAH.has(b)) {
        // Badan: tabung pipih dengan ujung elips, plus bahu dan panggul melintang
        const o = mesh(G.tabung, M.tubuh);
        parts.push((p) => tabung(o, pt(sendi(p, a)), pt(sendi(p, b)), 0.42, 0.61));
        for (const n of [a, b]) {
          const e = mesh(G.bola, M.tubuh);
          e.scale.set(0.42, 0.42, 0.61);
          parts.push((p) => e.position.copy(pt(sendi(p, n))));
        }
        for (const [n, r] of [
          ['bahu', 0.19],
          ['pinggul', 0.26],
        ] as const) {
          if (n !== a && n !== b) continue;
          const bar = mesh(G.tabung, M.tubuh);
          parts.push((p) => tabung(bar, pt(sendi(p, n), -lebar(n)), pt(sendi(p, n), lebar(n)), r));
        }
        continue;
      }
      const key = `${a}-${b}`;
      const r = JARI[key] ?? 0.15;
      for (const sgn of [-1, 1]) {
        const o = mesh(G.tabung, gelap.has(key) ? M.otot : M.tubuh);
        parts.push((p) => tabung(o, pt(sendi(p, a), zOf(p, a, sgn)), pt(sendi(p, b), zOf(p, b, sgn)), r));
        catatSendi(a, sgn, r);
        catatSendi(b, sgn, r);
      }
    }

    for (const { nama, sgn, r } of sendiBola.values()) {
      if (TENGAH.has(nama)) continue;
      const o = mesh(G.bola, M.tubuh);
      o.scale.setScalar(r);
      parts.push((p) => o.position.copy(pt(sendi(p, nama), zOf(p, nama, sgn))));
    }

    // Leher dan kepala
    const leher = mesh(G.tabung, M.tubuh);
    const kepala = mesh(G.bola, M.tubuh);
    const rk = d.kepala.r * S * 1.1;
    kepala.scale.set(rk, rk * 1.12, rk * 0.92);
    parts.push((p) => {
      const bh = pt(sendi(p, 'bahu'));
      const kp = pt(sendi(p, d.kepala.sendi));
      tabung(leher, bh, bh.clone().lerp(kp, 0.6), 0.13);
      kepala.position.copy(kp);
    });

    // Tambalan otot di permukaan badan (misal dada)
    for (const s of d.tiga?.sorot ?? []) {
      const arah = new THREE.Vector3(s.depan[0], -s.depan[1], 0).normalize().multiplyScalar(s.dorong);
      for (const sgn of [-1, 1]) {
        const o = mesh(G.bola, M.otot);
        parts.push((p) => {
          const A = pt(sendi(p, s.a), s.z * sgn).add(arah);
          const B = pt(sendi(p, s.b), s.z * sgn).add(arah);
          tmp.subVectors(B, A);
          const len = tmp.length();
          o.position.addVectors(A, B).multiplyScalar(0.5);
          o.quaternion.setFromUnitVectors(UP, tmp.normalize());
          o.scale.set(s.tebal, len / 2 + s.tebal, s.lebar);
        });
      }
    }

    // Beban di tangan: barbel (dengan piringan), bar (pulldown), atau pegangan mesin
    const n = d.beban.sendi;
    const jenis = d.beban.jenis ?? 'barbel';
    if (jenis === 'pegangan') {
      for (const sgn of [-1, 1]) {
        const o = mesh(G.tabung, M.besi);
        parts.push((p) => {
          const z = zOf(p, n, sgn);
          const [hx, hy] = sendi(p, n);
          tabung(o, pt([hx, hy - d.beban.r], z), pt([hx, hy + d.beban.r], z), 0.07);
        });
      }
    } else {
      const bar = mesh(G.tabung, M.besi);
      const panjang = jenis === 'bar' ? 1.45 : 2.15;
      const piring: [THREE.Mesh, number][] = [];
      if (jenis === 'barbel') for (const z of [-1.68, -1.55, 1.55, 1.68]) piring.push([mesh(G.tabung, M.besi), z]);
      parts.push((p) => {
        const h = sendi(p, n);
        tabung(bar, pt(h, -panjang), pt(h, panjang), jenis === 'bar' ? 0.04 : 0.045);
        for (const [o, z] of piring) tabung(o, pt(h, z - 0.05), pt(h, z + 0.05), 0.6);
      });
    }

    // Kabel atau batang mesin: dari titik tetap ke sendi yang bergerak
    for (const k of d.kabel ?? []) {
      for (const sgn of k.cermin ? [-1, 1] : [1]) {
        const o = mesh(G.tabung, M.besi);
        parts.push((p) => {
          const [ux, uy] = sendi(p, k.ke);
          const z = k.cermin ? zOf(p, k.ke, sgn) : 0;
          const dari = pt(k.dari, sgn * (k.dari[2] ?? 0) * S);
          tabung(o, dari, pt([ux, uy + (k.keDy ?? 0)], z), k.r ?? 0.03);
        });
      }
    }

    // Kamera: bingkai semua benda (kecuali lantai) di pose atas dan bawah,
    // pakai bola pembatas supaya tetap muat saat diputar ke sudut mana pun
    const box = new THREE.Box3();
    for (const t of [0, d.bagi ?? 0.6]) {
      atur(t);
      root.updateMatrixWorld(true);
      for (const o of root.children) if (!o.userData.lantai) box.expandByObject(o);
    }
    const bola = box.getBoundingSphere(new THREE.Sphere());
    orbit.target.copy(bola.center);
    // Sudut awal kamera: bisa diatur per latihan (misal dari belakang untuk latihan punggung)
    orbit.theta = d.kamera?.theta ?? 0.62;
    orbit.phi = d.kamera?.phi ?? 0.3;
    const setengahV = (camera.fov * Math.PI) / 360;
    const setengah = Math.min(setengahV, Math.atan(Math.tan(setengahV) * camera.aspect));
    orbit.r = (bola.radius / Math.sin(setengah)) * 0.92;

    // Lantai: piringan di bawah tubuh, cukup besar untuk menapak
    for (const o of root.children) {
      if (!o.userData.lantai) continue;
      const rl = Math.max(box.max.x - box.min.x, box.max.z - box.min.z) * 0.55;
      o.scale.set(rl, 0.04, rl);
      o.position.set(bola.center.x, -0.02, bola.center.z);
    }

    atur(fase);
  }

  function render() {
    const { theta, phi, r, target } = orbit;
    camera.position.set(
      target.x + r * Math.sin(theta) * Math.cos(phi),
      target.y + r * Math.sin(phi),
      target.z + r * Math.cos(theta) * Math.cos(phi),
    );
    camera.lookAt(target);
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    if (!playing || !data) return;
    const dur = data.tempo * 1000;
    fase = ((now - t0) % dur) / dur;
    atur(fase);
    render();
    raf = requestAnimationFrame(frame);
  }

  // Ukuran ikut wadah
  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (data) {
      bangun(data);
      render();
    }
  });
  ro.observe(canvas);

  // Geser untuk memutar
  let drag: { x: number; y: number } | null = null;
  const down = (e: PointerEvent) => {
    drag = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  };
  const move = (e: PointerEvent) => {
    if (!drag) return;
    orbit.theta -= (e.clientX - drag.x) * 0.01;
    orbit.phi = Math.min(1.1, Math.max(0.02, orbit.phi + (e.clientY - drag.y) * 0.006));
    drag = { x: e.clientX, y: e.clientY };
    if (!playing) render();
  };
  const up = () => {
    drag = null;
  };
  canvas.addEventListener('pointerdown', down);
  canvas.addEventListener('pointermove', move);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  return {
    setData(d) {
      fase = 0;
      bangun(d);
      render();
    },
    play() {
      if (playing || !data) return;
      playing = true;
      t0 = performance.now() - fase * data.tempo * 1000;
      raf = requestAnimationFrame(frame);
    },
    pause() {
      playing = false;
      cancelAnimationFrame(raf);
      if (data) render();
    },
    dispose() {
      playing = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', up);
      Object.values(G).forEach((g) => g.dispose());
      Object.values(M).forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
}
