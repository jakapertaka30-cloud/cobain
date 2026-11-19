/* data.js – Data master peralatan, aturan frekuensi PM, dan data awal (seed) dari Laporan KP.
   Dimuat sebelum app.js. Semua nilai tersedia sebagai variabel global. */

const NAMA_PERALATAN = ["Palu","Gergaji tangan","Pahat (Chisel)","Obeng","Meteran & siku","Serut kayu manual","Klem (Clamp)","Mesin potong kayu","Mesin serut listrik","Mesin bor","Mesin amplas (Sander)","Mesin bubut kayu","Mesin router kayu","Paku tembak (Nail gun)","Staples gun","Glue gun / lem kayu","Mesin jahit","Gunting kain","Kuas / roller","Spray gun sederhana","Amplas manual"];

const OP = "Operator Produksi", SM = "Staff Maintenance", CO = "Coordinator Produksi", OF = "Operator Finishing";

/* Jadwal PM usulan (Tabel 3.10): nomor peralatan -> [frekuensi, penanggung jawab].
   Peralatan yang tidak tercantum memakai default Bulanan / Coordinator Produksi. */
const FREKUENSI_PM = {
  8:["Harian",OP], 9:["Harian",OP], 10:["Harian",OP], 11:["Harian",OP],
  12:["Mingguan",SM], 13:["Mingguan",SM], 14:["Mingguan",SM], 15:["Mingguan",SM], 17:["Mingguan",SM],
  20:["Setiap selesai pakai",OP],
  16:["Bulanan",SM], 18:["Bulanan",CO],
  19:["Mingguan",OF], 21:["Mingguan",OF]
};

const PERALATAN = NAMA_PERALATAN.map((n, i) => {
  const f = FREKUENSI_PM[i + 1] || ["Bulanan", CO];
  return { k: "P" + String(i + 1).padStart(2, "0"), n, f: f[0], p: f[1] };
});

/* Riwayat gangguan (Tabel 3.9).
   Urutan kolom: [no, kodePeralatan, tanggal, gangguan, penyebab, tindakan, sukuCadang, responJam, downtimeJam, biaya] */
const DATA_AWAL = [
  [1,"P10","2026-01-10","Mata bor tumpul","Pemakaian berulang","Penggantian mata bor","Mata bor",1,1.5,75000],
  [2,"P11","2026-01-18","Amplas tidak optimal","Media amplas aus","Penggantian media amplas","Media amplas",.8,1,60000],
  [3,"P08","2026-02-05","Hasil potong kurang presisi","Penyesuaian atau keausan komponen","Pemeriksaan dan penyetelan","",1.5,2,120000],
  [4,"P09","2026-02-21","Hasil serutan tidak rata","Pisau serut perlu diperiksa","Penyetelan dan penggantian bagian","Bagian (tidak dirinci)",2,2.5,150000],
  [5,"P17","2026-03-12","Benang tidak stabil","Penyesuaian mesin","Penyetelan","",1,1.5,80000],
  [6,"P20","2026-03-27","Semprotan tidak merata","Pembersihan saluran","Pembersihan dan pemeriksaan","",.7,1,50000],
  [7,"P11","2026-04-14","Getaran meningkat","Pemasangan atau komponen perlu pemeriksaan","Pemeriksaan dan penyetelan","",1.2,1.5,90000],
  [8,"P14","2026-05-02","Paku tidak keluar lancar","Mekanisme perlu dibersihkan","Pembersihan dan pemeriksaan","",.6,.8,45000],
  [9,"P08","2026-05-19","Mesin berhenti sementara","Gangguan komponen","Pemeriksaan dan perbaikan","",2.5,3,200000],
  [10,"P10","2026-06-07","Putaran kurang stabil","Komponen perlu diperiksa","Pemeriksaan dan penyetelan","",1,1.2,85000],
  [11,"P09","2026-06-22","Hasil serutan kurang rata","Pisau perlu penyesuaian","Penyetelan","",1.3,1.5,100000],
  [12,"P17","2026-07-03","Mesin macet sementara","Kotoran atau penyesuaian","Pembersihan dan penyetelan","",.9,1.2,70000],
  [13,"P11","2026-07-17","Media amplas aus","Pemakaian","Penggantian media","Media amplas",.5,.8,60000],
  [14,"P20","2026-08-04","Aliran cat tersendat","Saluran kotor","Pembersihan","",.7,.9,40000],
  [15,"P08","2026-08-21","Suara operasi meningkat","Komponen perlu pemeriksaan","Pemeriksaan dan penyetelan","",1.8,2.2,140000],
  [17,"P10","2026-09-20","Mata bor cepat panas","Pemakaian dan kondisi mata bor","Penggantian mata bor","Mata bor",.8,1,70000],
  [18,"P09","2026-09-29","Hasil tidak rata","Penyesuaian pisau","Penyetelan","",1.1,1.4,95000]
].map(r => ({ id:r[0], eq:r[1], tg:r[2], jn:"CM", kk:r[3], pn:r[4], ti:r[5], sc:r[6], rs:r[7], dt:r[8], bi:r[9], pl:"", vf:"Normal", nx:"" }));
