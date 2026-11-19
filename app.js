/* app.js – Logika dashboard: penyimpanan, render KPI/grafik/tabel, form input, ekspor CSV.
   Bergantung pada data.js (PERALATAN, DATA_AWAL). */
(() => {
  "use strict";

  const STORAGE_KEY = "gardena_mtn_v2";
  const $ = id => document.getElementById(id);
  const cariAlat = k => PERALATAN.find(e => e.k === k);
  const hariIni = new Date().toISOString().slice(0, 10);

  /* ---------- Penyimpanan (localStorage, aman bila diblokir browser) ---------- */
  const salinDataAwal = () => DATA_AWAL.map(x => ({ ...x }));
  let data;
  try { data = JSON.parse(localStorage.getItem(STORAGE_KEY)); } catch (e) {}
  if (!Array.isArray(data)) data = salinDataAwal();
  const simpan = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (e) {} };

  /* ---------- Helper format ---------- */
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]));
  const fmtTgl = s => { if (!s) return "—"; const [y, m, d] = s.split("-"); return `${d}/${m}/${y}`; };
  const rp = n => "Rp" + Math.round(n).toLocaleString("id-ID");
  const jam = n => (Math.round(n * 10) / 10).toString().replace(".", ",");

  /* ---------- Grafik batang sederhana ---------- */
  function bars(el, arr) {
    const mx = Math.max(1, ...arr.map(a => a[1]));
    $(el).innerHTML = arr.length
      ? arr.map(a => `<div class="bar"><span title="${esc(a[0])}">${esc(a[0])}</span><i style="width:${a[1] / mx * 45}%"></i><em>${a[2]}</em></div>`).join("")
      : '<span class="muted">Belum ada data</span>';
  }

  function kelompok(kunci, nilai) {
    const g = {};
    data.forEach(x => { const k = kunci(x); if (k) g[k] = (g[k] || 0) + nilai(x); });
    return Object.entries(g).sort((a, b) => b[1] - a[1]);
  }

  /* ---------- Render ---------- */
  function render() {
    const n = data.length;
    const totDt = data.reduce((a, x) => a + +x.dt, 0);
    const totRs = data.reduce((a, x) => a + +x.rs, 0);
    const totBi = data.reduce((a, x) => a + +x.bi, 0);

    const kpi = [
      [n, "Total catatan gangguan"],
      [jam(totDt) + " jam", "Total downtime"],
      [jam(totRs / Math.max(1, n)) + " jam", "Rata-rata respons"],
      [rp(totBi), "Total biaya perbaikan"]
    ];
    $("kpis").innerHTML = kpi.map(k => `<div class="card kpi"><b>${k[0]}</b><span>${k[1]}</span></div>`).join("");

    bars("c1", kelompok(x => cariAlat(x.eq).n, () => 1).map(([k, v]) => [k, v, v + "×"]));
    bars("c2", kelompok(x => cariAlat(x.eq).n, x => +x.dt).map(([k, v]) => [k, v, jam(v)]));
    bars("c3", kelompok(x => x.sc.trim(), () => 1).map(([k, v]) => [k, v, v + "×"]));

    const fr = {};
    PERALATAN.forEach(e => (fr[e.f] = fr[e.f] || []).push(e.n));
    $("c4").innerHTML = Object.entries(fr).map(([f, a]) =>
      `<div class="bar top"><span class="tag PM">${f} (${a.length})</span><em>${esc(a.join(", "))}</em></div>`).join("");

    const q = $("q").value.toLowerCase(), fe = $("fe").value;
    const rows = data
      .filter(x => (!fe || x.eq === fe) && (!q || (cariAlat(x.eq).n + x.kk + x.pn + x.ti + x.sc + x.pl).toLowerCase().includes(q)))
      .sort((a, b) => b.tg.localeCompare(a.tg));

    $("tb").innerHTML = rows.map(x => `<tr>
      <td>${x.id > 1e6 ? "•" : x.id}</td>
      <td>${fmtTgl(x.tg)}</td>
      <td><b>${esc(cariAlat(x.eq).n)}</b><br><span class="muted">${x.eq}</span></td>
      <td><span class="tag ${x.jn}">${x.jn}</span></td>
      <td>${esc(x.kk)}<br><span class="muted">${esc(x.pn)}</span></td>
      <td>${esc(x.ti)}</td>
      <td>${esc(x.sc) || "—"}</td>
      <td>${jam(x.rs)} / ${jam(x.dt)} jam</td>
      <td>${rp(x.bi)}</td>
      <td>${esc(x.pl) || "—"}</td>
      <td><span class="tag ${x.vf}">${x.vf}</span></td>
      <td>${fmtTgl(x.nx)}</td></tr>`).join("")
      || '<tr><td colspan="12" class="muted">Tidak ada data</td></tr>';
  }

  /* ---------- Form catat maintenance ---------- */
  function bukaForm() {
    $("tg").value = hariIni;
    ["kk", "pn", "ti", "sc", "pl", "nx"].forEach(i => $(i).value = "");
    $("s1").textContent = "—";
    $("dlg").showModal();
  }

  function simpanForm() {
    if (!$("tg").value || !$("kk").value.trim() || !$("ti").value.trim()) {
      alert("Lengkapi tanggal, gangguan, dan tindakan.");
      return;
    }
    data.push({
      id: Date.now(), eq: $("eq").value, tg: $("tg").value, jn: $("jn").value,
      kk: $("kk").value, pn: $("pn").value, ti: $("ti").value, sc: $("sc").value, pl: $("pl").value,
      rs: +$("rs").value || 0, dt: +$("dt").value || 0, bi: +$("bi").value || 0,
      vf: $("vf").value, nx: $("nx").value
    });
    simpan();
    $("dlg").close();
    render();
  }

  /* ---------- Ekspor CSV (BOM agar terbaca benar di Excel) ---------- */
  function eksporCSV() {
    const kolom = ["No","Tanggal","Kode","Peralatan","Jenis","Gangguan","Penyebab","Tindakan","Suku Cadang","Respons (jam)","Downtime (jam)","Biaya (Rp)","Pelaksana","Verifikasi","Periksa Berikutnya"];
    const sel = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const baris = [...data].sort((a, b) => a.tg.localeCompare(b.tg)).map(x =>
      [x.id > 1e6 ? "" : x.id, x.tg, x.eq, cariAlat(x.eq).n, x.jn, x.kk, x.pn, x.ti, x.sc, x.rs, x.dt, x.bi, x.pl, x.vf, x.nx].map(sel).join(","));
    const blob = new Blob(["\ufeff" + [kolom.map(sel).join(","), ...baris].join("\r\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `riwayat-maintenance-${hariIni}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  /* ---------- Inisialisasi ---------- */
  const opsiAlat = PERALATAN.map(e => `<option value="${e.k}">${e.k} – ${e.n}</option>`).join("");
  $("fe").innerHTML = '<option value="">Semua peralatan</option>' + opsiAlat;
  $("eq").innerHTML = opsiAlat;

  ["q", "fe"].forEach(i => $(i).addEventListener("input", render));
  $("pl").addEventListener("input", () => $("s1").textContent = $("pl").value || "—");
  $("addB").addEventListener("click", bukaForm);
  $("saveB").addEventListener("click", simpanForm);
  $("cancelB").addEventListener("click", () => $("dlg").close());
  $("expB").addEventListener("click", eksporCSV);
  $("prtB").addEventListener("click", () => window.print());
  $("rstB").addEventListener("click", () => {
    if (confirm("Kembalikan ke data laporan?")) { data = salinDataAwal(); simpan(); render(); }
  });

  render();
})();
