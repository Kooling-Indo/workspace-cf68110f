/* ============================================================
   ATMI SPMB Elite Mock — engine
   ============================================================ */
(function () {
  "use strict";

  /* ---------- sections (per panduan SPMB ATMI) ---------- */
  var SECTIONS = [
    { key: "T1", name: "Tes Capability", dur: 40, subs: [
        { key: "T1V", name: "Penalaran Verbal", desc: "Gambar berbeda & lanjutan rangkaian" },
        { key: "T1U", name: "Penalaran Urutan", desc: "Lengkapi pola deret gambar" },
        { key: "T1S", name: "Tes Spasial", desc: "Bentuk sama setelah diputar" },
        { key: "T1Y", name: "Tes Sistematika", desc: "Pemetaan huruf–simbol" } ] },
    { key: "T2", name: "Kemampuan Dasar Teknik", dur: 30, subs: [
        { key: "T2", name: "Berhitung, satuan & pengukuran", desc: "Aritmetika teknik, toleransi, geometri, grafik" } ] },
    { key: "T3", name: "Tes Potensi Akademik", dur: 25, subs: [
        { key: "T3", name: "Numerik, deret & logika", desc: "Deret angka, perbandingan, silogisme, analitis" } ] },
    { key: "T4", name: "Bahasa Inggris", dur: 15, subs: [
        { key: "T4", name: "Grammar, vocabulary & reading", desc: "Structure, technical English, pemahaman bacaan" } ] }
  ];

  /* ---------- state ---------- */
  var S = {
    bank: [], byId: {}, bySec: {},
    view: "home",
    run: null,           /* active attempt */
    last: null,          /* last finished attempt */
    ai: { provider: "pollinations", model: "", key: "", base: "" },
    timer: null
  };

  /* ---------- utils ---------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pad2(n) { return (n < 10 ? "0" : "") + n; }
  function clock(sec) { sec = Math.max(0, Math.round(sec)); var h = Math.floor(sec / 3600), m = Math.floor(sec % 3600 / 60), s = sec % 60; return (h ? h + ":" + pad2(m) : pad2(m)) + ":" + pad2(s); }
  function toast(msg) { var t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove("on"); }, 2200); }
  function letters(i) { return "ABCD"[i]; }

  /* ---------- storage ---------- */
  var LS = "atmi_elite_v1";
  function loadStore() {
    try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; }
  }
  function saveStore(o) { try { localStorage.setItem(LS, JSON.stringify(o)); } catch (e) {} }
  function patchStore(p) { var o = loadStore(); for (var k in p) o[k] = p[k]; saveStore(o); return o; }

  /* ---------- bank ---------- */
  function bankItem(it, idx) {
    return { id: "q" + idx, sec: it.sec, topic: it.topic, q: it.q, opts: it.opts, a: it.a, why: it.why, diff: it.diff || 2 };
  }
  function buildBank() {
    var raw = [];
    if (window.BANK_FIG) raw = raw.concat(window.BANK_FIG.build());
    if (window.BANK_NUM) raw = raw.concat(window.BANK_NUM.build());
    if (window.BANK_EN) raw = raw.concat(window.BANK_EN.build());
    var out = [], seen = {};
    raw.forEach(function (it) {
      if (!it || !it.q || !it.opts || it.opts.length !== 4) return;
      if (seen[it.q]) return;
      seen[it.q] = 1;
      var sec = it.sec || (/^T4/.test(it.topic || "") ? "T4" : "T3");
      out.push(bankItem({ sec: sec, topic: it.topic, q: it.q, opts: it.opts, a: it.a, why: it.why, diff: it.diff }, out.length));
    });
    S.bank = out;
    S.byId = {}; S.bySec = {};
    out.forEach(function (it) { S.byId[it.id] = it; (S.bySec[it.sec] = S.bySec[it.sec] || []).push(it); });
    return out;
  }

  function secOf(key) { for (var i = 0; i < SECTIONS.length; i++) if (SECTIONS[i].key === key) return SECTIONS[i]; return null; }
  function subOf(key) { for (var i = 0; i < SECTIONS.length; i++) { var s = SECTIONS[i]; for (var j = 0; j < s.subs.length; j++) if (s.subs[j].key === key) return s.subs[j]; } return null; }
  function secName(k) { var s = secOf(k); return s ? s.key + " · " + s.name : k; }

  /* ---------- pick questions ---------- */
  function sample(arr, n) {
    var a = arr.slice();
    shuffle(a);
    return a.slice(0, Math.min(n, a.length));
  }
  function pickForSection(secKey, n) {
    if (secKey !== "T1") return sample(S.bySec[secKey] || [], n);
    var subs = ["T1V", "T1U", "T1S", "T1Y"], per = Math.ceil(n / subs.length), out = [];
    subs.forEach(function (k) { out = out.concat(sample(S.bySec[k] || [], per)); });
    return shuffle(out).slice(0, n);
  }

  /* ---------- router ---------- */
  function go(view) {
    if (S.run && view !== "exam" && !S.run.finished) {
      if (!confirm("Tes sedang berjalan. Tinggalkan dan simpan progres?")) return;
      saveRun();
    }
    S.view = view;
    $$("#app > section").forEach(function (s) { s.classList.add("hide"); });
    var el = $("#v-" + view);
    if (el) el.classList.remove("hide");
    $$("#nav button").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-go") === view); });
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
    if (view === "home") renderHome();
    if (view === "setup") renderSetup();
    if (view === "history") renderHistory();
    if (view === "ai") renderAI();
    if (view === "practice") renderPractice();
  }

  /* ---------- home ---------- */
  function renderHome() {
    var st = loadStore(), hist = st.history || [];
    $("#sTotal").textContent = S.bank.length || 1000;
    $("#sAttempt").textContent = hist.length;
    var best = hist.length ? Math.max.apply(null, hist.map(function (h) { return h.score; })) : null;
    $("#sBest").textContent = best == null ? "—" : best;
    var fast = hist.filter(function (h) { return h.mode !== "practice"; }).map(function (h) { return h.seconds; });
    $("#sTime").textContent = fast.length ? clock(Math.min.apply(null, fast)) : "—";
    var pend = st.pending;
    $("#btnResume").style.display = pend && pend.left > 0 ? "" : "none";

    var html = SECTIONS.map(function (s) {
      var n = (S.bySec[s.key] || []).length;
      var cls = s.key === "T1" ? "" : (s.key === "T3" ? "c" : "y");
      return '<div class="secrow"><div class="badge ' + cls + '">' + s.key + '</div>' +
        '<div style="flex:1"><b>' + esc(s.name) + '</b><div class="muted" style="font-size:13px">' +
        s.subs.map(function (u) { return esc(u.name); }).join(" · ") + '</div></div>' +
        '<div style="text-align:right"><b class="mono">' + n + '</b><div class="muted" style="font-size:12px">soal · ' + s.dur + ' menit</div></div></div>';
    }).join("");
    $("#secList").innerHTML = html;
  }

  /* ---------- setup ---------- */
  function renderSetup() {
    var host = $("#v-setup");
    host.innerHTML =
      '<h2 style="margin:18px 0 4px">Mulai sesi</h2>' +
      '<p class="muted" style="margin:0 0 16px">Pilih format, lalu atur fokus subtes bila perlu.</p>' +
      '<div class="grid g3" style="margin-bottom:16px">' +
        modeCard("quick", "Mock Cepat", "100 soal campuran", "60 menit") +
        modeCard("full", "Simulasi Resmi", "200 soal, timer per subtes", "±110 menit") +
        modeCard("elite", "Elite 1000", "seluruh bank soal", "180 menit") +
      '</div>' +
      '<div class="card pad">' +
        '<div class="row2">' +
          '<div class="field"><label>Fokus subtes</label><select id="setupSec"><option value="all">Semua subtes (campuran)</option>' +
            SECTIONS.map(function (s) { return '<option value="' + s.key + '">' + s.key + " · " + esc(s.name) + "</option>"; }).join("") +
          '</select></div>' +
          '<div class="field"><label>Jumlah soal</label><select id="setupN"><option>20</option><option>40</option><option selected>100</option><option>200</option></select></div>' +
        '</div>' +
        '<div class="note">Pembahasan hanya muncul setelah tes dikumpulkan — sama seperti tes sebenarnya. Mode latihan (menu Latihan) memberi umpan balik langsung per soal.</div>' +
        '<div style="display:flex;gap:10px;margin-top:16px"><button class="btn btn-p" data-do="start">Mulai sekarang</button>' +
        '<button class="btn btn-g" data-go="home">Batal</button></div>' +
      '</div>';
  }
  function modeCard(m, title, sub, time) {
    return '<button class="mode" data-mode="' + m + '"><h3>' + title + '</h3><p>' + sub + '</p><div class="meta">' + time + '</div></button>';
  }

  /* ---------- build a run ---------- */
  function buildPlan(mode, focus, n) {
    var items = [], blocks = [];
    if (mode === "elite") {
      SECTIONS.forEach(function (s) {
        var from = items.length;
        items = items.concat((S.bySec[s.key] || []).map(function (x) { return x.id; }));
        blocks.push({ key: s.key, label: s.key + " · " + s.name, dur: 999999, from: from, to: items.length });
      });
      blocks = [{ key: "ALL", label: "Elite 1000 — semua subtes", dur: 180 * 60, from: 0, to: items.length }];
    } else if (mode === "full") {
      SECTIONS.forEach(function (s) {
        var from = items.length;
        items = items.concat(pickForSection(s.key, 50).map(function (x) { return x.id; }));
        blocks.push({ key: s.key, label: s.key + " · " + s.name, dur: s.dur * 60, from: from, to: items.length });
      });
    } else {
      if (focus && focus !== "all") {
        items = pickForSection(focus, n).map(function (x) { return x.id; });
      } else {
        var per = Math.ceil(n / SECTIONS.length);
        SECTIONS.forEach(function (s) { items = items.concat(pickForSection(s.key, per).map(function (x) { return x.id; })); });
        items = shuffle(items).slice(0, n);
      }
      blocks = [{ key: focus || "ALL", label: (focus && focus !== "all") ? secName(focus) : "Campuran semua subtes", dur: 60 * 60, from: 0, to: items.length }];
    }
    return { items: items, blocks: blocks };
  }

  function startRun(mode, focus, n) {
    if (!n) n = mode === "full" ? 50 : mode === "elite" ? 1000 : 100;
    var plan = buildPlan(mode, focus, n);
    S.run = {
      mode: mode, startedAt: Date.now(), answers: {}, flags: {},
      items: plan.items, blocks: plan.blocks, i: 0, finished: false, remaining: 0
    };
    S.run.blocks.forEach(function (b) { b.remain = b.dur; });
    startTimer();
    go("exam");
    renderExam();
  }

  function blockIndexFor(i) {
    for (var k = 0; k < S.run.blocks.length; k++) { var b = S.run.blocks[k]; if (i >= b.from && i < b.to) return k; }
    return 0;
  }

  function startTimer() {
    if (S.timer) clearInterval(S.timer);
    S.timer = setInterval(function () {
      if (!S.run || S.run.finished) return;
      var bi = blockIndexFor(S.run.i), b = S.run.blocks[bi];
      b.remain--;
      paintTimer();
      if (b.remain <= 0) {
        if (bi < S.run.blocks.length - 1) { S.run.i = S.run.blocks[bi + 1].from; renderExam(); toast("Waktu subtes habis — lanjut ke subtes berikutnya."); }
        else finishRun(true);
      }
    }, 1000);
  }

  function paintTimer() {
    if (!S.run) return;
    var bi = blockIndexFor(S.run.i), b = S.run.blocks[bi];
    var el = $("#exTimer");
    if (!el) return;
    el.textContent = clock(b.remain);
    el.classList.toggle("warn", b.remain < 300);
    $("#exSec").textContent = b.label.length > 26 ? b.label.slice(0, 26) + "…" : b.label;
    var answered = Object.keys(S.run.answers).length;
    $("#exCount").textContent = (S.run.i + 1) + "/" + S.run.items.length;
    $("#exProg").style.width = (answered / S.run.items.length * 100) + "%";
  }

  /* ---------- exam render ---------- */
  function renderExam() {
    var r = S.run;
    if (!r || r.finished) return;
    var it = S.byId[r.items[r.i]];
    var sel = r.answers[it.id];
    var bi = blockIndexFor(r.i);
    var opts = it.opts.map(function (o, k) {
      return '<button class="opt' + (sel === k ? " sel" : "") + '" data-pick="' + k + '">' +
        '<span class="k">' + letters(k) + '</span><span class="body">' + o + '</span></button>';
    }).join("");
    $("#qHost").innerHTML =
      '<div class="qcard">' +
        '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap">' +
          '<div class="qnum">Soal ' + (r.i + 1) + ' · ' + esc(it.topic || "") + '</div>' +
          (r.flags[it.id] ? '<span class="pill" style="background:#fff3cf;color:#8a6200">Ditandai</span>' : '') +
        '</div>' +
        it.q +
        '<div class="opts">' + opts + '</div>' +
        '<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">' +
          '<button class="btn btn-g" data-do="prev"' + (r.i === 0 ? " disabled" : "") + '>&larr; Sebelumnya</button>' +
          '<button class="btn btn-n" data-do="next">' + (r.i === r.items.length - 1 ? "Selesai & kumpulkan" : "Berikutnya &rarr;") + '</button>' +
          '<button class="btn btn-g" data-do="clear"' + (sel == null ? " disabled" : "") + '>Hapus jawaban</button>' +
        '</div>' +
      '</div>';
    paintTimer();
    renderNavpad();
  }

  function renderNavpad() {
    var r = S.run, host = $("#navpad");
    if (!host) return;
    var lo = r.blocks[blockIndexFor(r.i)].from, hi = r.blocks[blockIndexFor(r.i)].to;
    var html = "";
    for (var k = lo; k < hi; k++) {
      var id = r.items[k];
      var cls = r.answers[id] != null ? "done" : "";
      if (r.flags[id]) cls += " flag";
      if (k === r.i) cls += " cur";
      html += '<button class="' + cls + '" data-jump="' + k + '">' + (k - lo + 1) + '</button>';
    }
    host.innerHTML = html;
  }

  function answer(k) {
    var r = S.run, it = S.byId[r.items[r.i]];
    r.answers[it.id] = k;
    renderExam();
  }

  function move(d) {
    var r = S.run;
    var ni = r.i + d;
    if (ni < 0) return;
    if (ni >= r.items.length) { askSubmit(); return; }
    var cb = blockIndexFor(r.i), nb = blockIndexFor(ni);
    if (nb !== cb) { r.i = r.blocks[nb].from; toast("Mulai subtes: " + r.blocks[nb].label); }
    else r.i = ni;
    renderExam();
  }

  function askSubmit() {
    var unanswered = S.run.items.length - Object.keys(S.run.answers).length;
    if (unanswered > 0 && !confirm(unanswered + " soal belum dijawab. Kumpulkan sekarang?")) return;
    finishRun(false);
  }

  function finishRun(timedOut) {
    if (!S.run || S.run.finished) return;
    S.run.finished = true;
    if (S.timer) clearInterval(S.timer);
    var r = S.run, items = r.items.map(function (id) { return S.byId[id]; });
    var correct = 0, perSec = {}, perTopic = {};
    items.forEach(function (it, k) {
      var pick = r.answers[it.id];
      var ok = pick === it.a;
      if (ok) correct++;
      var sKey = /^T1/.test(it.sec) ? "T1" : it.sec;
      perSec[sKey] = perSec[sKey] || { ok: 0, n: 0 };
      perSec[sKey].n++; if (ok) perSec[sKey].ok++;
      var t = it.topic || "lain";
      perTopic[t] = perTopic[t] || { ok: 0, n: 0 };
      perTopic[t].n++; if (ok) perTopic[t].ok++;
    });
    var score = Math.round(correct / items.length * 1000) / 10;
    var rec = {
      id: "a" + Date.now(), mode: r.mode, when: Date.now(),
      seconds: Math.round((Date.now() - r.startedAt) / 1000),
      total: items.length, correct: correct, score: score, timedOut: !!timedOut,
      perSec: perSec, perTopic: perTopic,
      items: items.map(function (it) { return { id: it.id, sec: it.sec, topic: it.topic, pick: r.answers[it.id] == null ? null : r.answers[it.id], a: it.a }; })
    };
    var st = loadStore(); st.history = (st.history || []).concat([rec]).slice(-40); delete st.pending; saveStore(st);
    S.last = rec;
    go("result");
    renderResult(rec);
  }

  function saveRun() {
    if (!S.run || S.run.finished) return;
    var r = S.run;
    patchStore({ pending: { mode: r.mode, items: r.items, blocks: r.blocks, answers: r.answers, flags: r.flags, i: r.i, startedAt: r.startedAt, left: 1 } });
  }

  function resumeRun() {
    var st = loadStore(), p = st.pending;
    if (!p) return;
    S.run = { mode: p.mode, startedAt: p.startedAt, answers: p.answers || {}, flags: p.flags || {}, items: p.items, blocks: p.blocks, i: p.i || 0, finished: false };
    S.run.blocks.forEach(function (b) { if (b.remain == null) b.remain = b.dur; });
    startTimer();
    go("exam");
    renderExam();
  }

  /* ---------- result ---------- */
  function verdict(score) {
    if (score >= 85) return { t: "Sangat kompetitif", d: "Konsisten di semua subtes — pertahankan kecepatan dan ketelitian.", c: "#0f9d58" };
    if (score >= 70) return { t: "Lolos ambang aman", d: "Modal kuat. Rapikan subtes terlemah agar tidak jadi penentu.", c: "#1d7a4d" };
    if (score >= 55) return { t: "Di garis batas", d: "Perlu latihan terarah: kejar akurasi di subtes dengan skor terendah.", c: "#c98a12" };
    if (score >= 40) return { t: "Belum aman", d: "Fokus latihan per subtes dulu, baru ulangi simulasi penuh.", c: "#c26a26" };
    return { t: "Butuh pembenahan dasar", d: "Mulai dari latihan berpanduan: satu topik, satu pembahasan, ulangi.", c: "#a1231b" };
  }

  function renderResult(rec) {
    var host = $("#v-result");
    var v = verdict(rec.score);
    var secRows = SECTIONS.map(function (s) {
      var d = rec.perSec[s.key] || { ok: 0, n: 0 };
      var p = d.n ? Math.round(d.ok / d.n * 100) : 0;
      return '<div class="bar"><span>' + s.key + '</span><span class="t"><i class="' + (p < 55 ? "low" : "") + '" style="width:' + p + '%"></i></span><span class="mono">' + d.ok + "/" + d.n + '</span></div>';
    }).join("");

    var topics = Object.keys(rec.perTopic).map(function (k) {
      var d = rec.perTopic[k];
      return { k: k, p: d.n ? d.ok / d.n : 1, ok: d.ok, n: d.n };
    }).filter(function (t) { return t.n >= 4; }).sort(function (a, b) { return a.p - b.p; });
    var weak = topics.slice(0, 4), strong = topics.slice(-2).reverse();

    host.innerHTML =
      '<div class="card pad" style="margin:18px 0">' +
        '<div style="display:flex;gap:26px;align-items:center;flex-wrap:wrap">' +
          '<div class="ring" style="--p:' + rec.score + '"><span>' + rec.score.toFixed(1) + '</span></div>' +
          '<div style="flex:1;min-width:240px">' +
            '<div class="eyebrow">Hasil ' + rec.mode.toUpperCase() + (rec.timedOut ? " · waktu habis" : "") + '</div>' +
            '<h2 style="font-size:26px;margin:4px 0 6px">' + rec.correct + ' benar dari ' + rec.total + ' soal</h2>' +
            '<div style="color:' + v.c + ';font-weight:800">' + v.t + '</div>' +
            '<p class="muted" style="margin:4px 0 0">' + v.d + ' Waktu pengerjaan ' + clock(rec.seconds) + '.</p>' +
          '</div>' +
        '</div>' +
        '<div class="bars" style="margin-top:20px">' + secRows + '</div>' +
      '</div>' +
      '<div class="grid g2" style="margin-bottom:18px">' +
        '<div class="card pad"><h4 style="font-size:14px;margin-bottom:10px">Perlu digenjot</h4>' +
          (weak.length ? weak.map(function (t) { return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed var(--line);font-size:13.5px"><span>' + esc(t.k) + '</span><b class="mono">' + t.ok + '/' + t.n + '</b></div>'; }).join("") : '<p class="muted" style="margin:0">Belum cukup data.</p>') +
        '</div>' +
        '<div class="card pad"><h4 style="font-size:14px;margin-bottom:10px">Sudah kuat</h4>' +
          (strong.length ? strong.map(function (t) { return '<div style="display:flex;justify-content:space-between;gap:10px;padding:6px 0;border-bottom:1px dashed var(--line);font-size:13.5px"><span>' + esc(t.k) + '</span><b class="mono">' + t.ok + '/' + t.n + '</b></div>'; }).join("") : '<p class="muted" style="margin:0">Belum cukup data.</p>') +
        '</div>' +
      '</div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px">' +
        '<button class="btn btn-p" data-do="reviewAll">Lihat pembahasan semua</button>' +
        '<button class="btn btn-n" data-do="reviewWrong">Hanya yang salah</button>' +
        '<button class="btn btn-g" data-do="retrySame">Ulangi format ini</button>' +
        '<button class="btn btn-g" data-go="home">Beranda</button>' +
        '<button class="btn btn-g" data-do="print">Cetak / PDF</button>' +
      '</div>' +
      '<div id="reviewHost"></div>';
  }

  /* ---------- review ---------- */
  function reviewCard(entry, idx) {
    var it = S.byId[entry.id];
    if (!it) return "";
    var pick = entry.pick, right = it.a;
    var tag = pick == null ? '<span class="rtag null">kosong</span>' : (pick === right ? '<span class="rtag ok">benar</span>' : '<span class="rtag bad">salah</span>');
    var opts = it.opts.map(function (o, k) {
      var cls = k === right ? " right" : (k === pick ? " wrong" : "");
      return '<div class="opt' + cls + '" style="cursor:default"><span class="k">' + letters(k) + '</span><span class="body">' + o + '</span></div>';
    }).join("");
    return '<div class="rcard" data-qid="' + it.id + '">' +
      '<div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;margin-bottom:8px">' +
        '<div class="qnum">#' + idx + ' · ' + it.sec + ' · ' + esc(it.topic || "") + '</div><div>' + tag + '</div>' +
      '</div>' + it.q + '<div class="opts" style="margin-top:14px">' + opts + '</div>' +
      '<div class="explain"><h5>Pembahasan</h5>' + it.why + '</div>' +
      '<div class="ai-actions">' +
        '<button class="btn btn-g btn-s" data-ai="deep" data-qid="' + it.id + '">AI: jelaskan lebih rinci</button>' +
        (pick != null && pick !== right ? '<button class="btn btn-g btn-s" data-ai="why" data-qid="' + it.id + '">AI: kenapa pilihan saya salah</button>' : '') +
        '<button class="btn btn-g btn-s" data-ai="similar" data-qid="' + it.id + '">AI: buat soal serupa</button>' +
      '</div>' +
      '<div class="ai-box hide" data-ai-out="' + it.id + '"></div>' +
    '</div>';
  }

  function renderReview(filter) {
    var rec = S.last;
    if (!rec) return;
    var host = $("#reviewHost");
    if (!host) return;
    var rows = rec.items.filter(function (e) {
      if (filter === "wrong") return e.pick !== e.a;
      return true;
    });
    host.innerHTML = '<h3 style="margin:0 0 4px">Pembahasan ' + rows.length + ' soal</h3>' +
      '<p class="muted" style="margin:0 0 14px;font-size:13.5px">Hijau = kunci, merah = jawabanmu. Tiap soal punya pembahasan; AI coach bisa menerangkan ulang dengan gaya lain.</p>' +
      rows.map(function (e, i) { return reviewCard(e, i + 1); }).join("") +
      '<div style="height:20px"></div>';
    host.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- practice ---------- */
  var P = { sub: "T1V", n: 10, items: [], i: 0, picks: {} };

  function renderPractice() {
    var host = $("#v-practice");
    var subs = [];
    SECTIONS.forEach(function (s) { s.subs.forEach(function (u) { subs.push({ key: u.key, name: u.name, sec: s.key, desc: u.desc }); }); });
    host.innerHTML =
      '<h2 style="margin:18px 0 4px">Latihan per subtes</h2>' +
      '<p class="muted" style="margin:0 0 16px">Umpan balik langsung per soal — cocok untuk membangun dasar sebelum simulasi penuh.</p>' +
      '<div class="card pad" style="margin-bottom:16px"><div class="row2">' +
        '<div class="field"><label>Subtes</label><select id="pSub">' +
          subs.map(function (u) { return '<option value="' + u.key + '"' + (u.key === P.sub ? " selected" : "") + '>' + esc(u.name) + ' — ' + (S.bySec[u.key] || []).length + ' soal</option>'; }).join("") +
        '</select></div>' +
        '<div class="field"><label>Jumlah soal</label><select id="pN"><option>10</option><option>20</option><option>40</option></select></div>' +
      '</div><button class="btn btn-p" data-do="pStart">Mulai latihan</button></div>' +
      '<div id="pHost"></div>';
    if (P.items.length) renderPracticeItem();
  }

  function startPractice() {
    P.sub = $("#pSub").value; P.n = +$("#pN").value;
    P.items = sample(S.bySec[P.sub] || [], P.n); P.i = 0; P.picks = {};
    renderPracticeItem();
  }

  function renderPracticeItem() {
    var host = $("#pHost");
    if (!P.items.length) { host.innerHTML = ""; return; }
    var it = P.items[P.i], pick = P.picks[it.id], done = pick != null;
    var opts = it.opts.map(function (o, k) {
      var cls = "";
      if (done) { if (k === it.a) cls = " right"; else if (k === pick) cls = " wrong"; }
      return '<button class="opt' + cls + '" data-ppick="' + k + '"><span class="k">' + letters(k) + '</span><span class="body">' + o + '</span></button>';
    }).join("");
    host.innerHTML =
      '<div class="qcard">' +
        '<div class="qnum">Latihan ' + (P.i + 1) + '/' + P.items.length + ' · ' + esc(it.topic || "") + '</div>' +
        it.q + '<div class="opts">' + opts + '</div>' +
        (done ? '<div class="explain"><h5>Pembahasan</h5>' + it.why + '</div>' +
          '<div class="ai-actions"><button class="btn btn-g btn-s" data-ai="deep" data-qid="' + it.id + '">AI: jelaskan lebih rinci</button>' +
          '<button class="btn btn-g btn-s" data-ai="similar" data-qid="' + it.id + '">AI: buat soal serupa</button></div>' +
          '<div class="ai-box hide" data-ai-out="' + it.id + '"></div>' : '') +
        '<div style="display:flex;gap:10px;margin-top:16px">' +
          '<button class="btn btn-g" data-do="pPrev"' + (P.i === 0 ? " disabled" : "") + '>&larr; Sebelumnya</button>' +
          '<button class="btn btn-n" data-do="pNext"' + (P.i === P.items.length - 1 ? " disabled" : "") + '>Berikutnya &rarr;</button>' +
        '</div>' +
      '</div>';
  }

  /* ---------- history ---------- */
  function renderHistory() {
    var hist = (loadStore().history || []).slice().reverse();
    var host = $("#v-history");
    if (!hist.length) { host.innerHTML = '<div class="card pad" style="margin-top:18px"><h3>Belum ada riwayat</h3><p class="muted" style="margin:0">Selesaikan satu mock test, hasilnya tersimpan otomatis di browser ini.</p></div>'; return; }
    host.innerHTML = '<h2 style="margin:18px 0 14px">Riwayat tes</h2>' +
      hist.map(function (h) {
        var dated = new Date(h.when).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" });
        var v = verdict(h.score);
        return '<div class="card pad" style="margin-bottom:10px;display:flex;gap:14px;align-items:center;flex-wrap:wrap">' +
          '<b class="mono" style="font-size:24px;color:' + v.c + '">' + h.score.toFixed(1) + '</b>' +
          '<div style="flex:1;min-width:180px"><b>' + h.mode.toUpperCase() + '</b> · ' + h.correct + '/' + h.total +
          '<div class="muted" style="font-size:12.5px">' + dated + ' · ' + clock(h.seconds) + '</div></div>' +
          '<button class="btn btn-g btn-s" data-do="openHist" data-id="' + h.id + '">Pembahasan</button></div>';
      }).join("");
  }

  function openHistory(id) {
    var h = (loadStore().history || []).filter(function (x) { return x.id === id; })[0];
    if (!h) return;
    S.last = h; go("result"); renderResult(h); renderReview("all");
  }

  /* ---------- AI ---------- */
  var PRESETS = {
    pollinations: { label: "Pollinations (gratis, tanpa API key)", model: "openai", base: "https://text.pollinations.ai/openai", keyless: true, note: "Model gratis dari Pollinations.ai. Tanpa kunci, langsung jalan." },
    longcat: { label: "LongCat (Meituan, gratis dengan API key)", model: "LongCat-Flash-Chat", base: "https://api.longcat.chat/openai/v1", note: "Daftar di longcat.chat → API key gratis. Dipanggil lewat proxy lokal agar bebas CORS." },
    ollama: { label: "AI lokal (Ollama)", model: "llama3.2", base: "http://localhost:11434/v1", note: "Jalankan Ollama di laptop ini. Setel OLLAMA_ORIGINS=* agar browser diizinkan." },
    custom: { label: "OpenAI-compatible lain", model: "", base: "", note: "Isi base URL yang berakhiran /v1, misalnya endpoint Groq, OpenRouter, atau LM Studio." }
  };

  function renderAI() {
    var a = loadStore().ai || S.ai;
    S.ai = a;
    var pres = PRESETS[a.provider] || PRESETS.pollinations;
    $("#v-ai").innerHTML =
      '<h2 style="margin:18px 0 4px">AI Coach</h2>' +
      '<p class="muted" style="margin:0 0 16px">Dipakai untuk menjelaskan ulang pembahasan, mendiagnosis kesalahanmu, dan membuat soal serupa.</p>' +
      '<div class="card pad" style="max-width:720px">' +
        '<div class="field"><label>Provider</label><select id="aiProv">' +
          Object.keys(PRESETS).map(function (k) { return '<option value="' + k + '"' + (k === a.provider ? " selected" : "") + '>' + esc(PRESETS[k].label) + '</option>'; }).join("") +
        '</select></div>' +
        '<div class="note" style="margin-bottom:14px">' + esc(pres.note) + '</div>' +
        '<div class="row2"><div class="field"><label>Model</label><input id="aiModel" value="' + esc(a.model || pres.model) + '" placeholder="' + esc(pres.model) + '"></div>' +
        '<div class="field"><label>API key</label><input id="aiKey" type="password" value="' + esc(a.key || "") + '" placeholder="' + (pres.keyless ? "tidak wajib" : "tempel API key") + '"></div></div>' +
        '<div class="field"><label>Base URL</label><input id="aiBase" value="' + esc(a.base || pres.base) + '" placeholder="' + esc(pres.base) + '"></div>' +
        '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-p" data-do="aiSave">Simpan</button>' +
        '<button class="btn btn-n" data-do="aiTest">Tes koneksi</button></div>' +
        '<div class="ai-box hide" id="aiTestOut" style="margin-top:14px"></div>' +
        '<p class="muted" style="font-size:12.5px;margin:14px 0 0">Kunci disimpan hanya di localStorage browser ini. Jangan pakai kunci akun berbayar pada komputer bersama.</p>' +
      '</div>';
  }

  function currentAI() { return loadStore().ai || S.ai; }

  function aiSave() {
    var a = { provider: $("#aiProv").value, model: $("#aiModel").value.trim(), key: $("#aiKey").value.trim(), base: $("#aiBase").value.trim() };
    patchStore({ ai: a }); S.ai = a; toast("Pengaturan AI disimpan.");
  }

  function providerPayload(a) {
    var p = PRESETS[a.provider] || PRESETS.pollinations;
    return { provider: a.provider, model: a.model || p.model, key: a.key || "", base: (a.base || p.base).replace(/\/+$/, "") };
  }

  function aiChat(messages) {
    var a = currentAI(), cfg = providerPayload(a);
    var label = (PRESETS[cfg.provider] || {}).label || cfg.provider;

    function direct() {
      var url = cfg.base.replace(/\/+$/, "") + "/chat/completions";
      if (cfg.provider === "pollinations" && !cfg.key) url = "https://text.pollinations.ai/openai";
      var headers = { "Content-Type": "application/json" };
      if (cfg.key) headers.Authorization = "Bearer " + cfg.key;
      var body = { model: cfg.model, messages: messages, stream: false };
      if (cfg.provider === "pollinations" && !cfg.key) body.model = "openai";
      return fetch(url, { method: "POST", headers: headers, body: JSON.stringify(body) }).then(function (r) {
        return r.text().then(function (t) {
          if (!r.ok) throw new Error(label + " menolak permintaan (" + r.status + "): " + t.slice(0, 200));
          try {
            var j = JSON.parse(t);
            var c = j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content;
            return c || j.reply || (typeof j === "string" ? j : t);
          } catch (e) { return t; }
        });
      });
    }

    /* Local launcher offers a proxy that strips CORS problems.
       Hosted copy has no proxy and no server-side key: requests go straight
       from this browser to the provider with the key this browser stores. */
    var local = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
    if (!local) return direct();
    return fetch("/api/chat", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider: cfg.provider, model: cfg.model, key: cfg.key, base: cfg.base, messages: messages })
    }).then(function (r) {
      if (r.status === 404) return direct();
      return r.text().then(function (t) {
        if (!r.ok) throw new Error(t.slice(0, 300) || ("HTTP " + r.status));
        try { var j = JSON.parse(t); return (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || j.reply || t; }
        catch (e) { return t; }
      });
    }).catch(function () { return direct(); });
  }

  function askAI(kind, qid) {
    var it = S.byId[qid];
    if (!it) return;
    var box = $('[data-ai-out="' + qid + '"]');
    if (!box) return;
    box.classList.remove("hide");
    box.innerHTML = '<span class="spin"></span> Menghubungi AI…';
    var rec = S.last || { items: [] };
    var entry = rec.items.filter(function (x) { return x.id === qid; })[0] || {};
    var prompt = {
      deep: "Jelaskan langkah demi langkah, dengan bahasa sederhana, mengapa jawaban " + letters(it.a) + " benar pada soal berikut.",
      why: "Jawaban saya " + (entry.pick != null ? letters(entry.pick) + ". " + strip(it.opts[entry.pick]) : "kosong") + ". Jelaskan kesalahan penalaran saya dan cara berpikir yang benar.",
      similar: "Buat satu soal baru yang menguji konsep sama dengan soal ini, lengkap dengan 4 opsi, kunci, dan pembahasan singkat."
    }[kind];
    var ctx = "Soal (" + it.sec + ", topik " + (it.topic || "-") + "):\n" + strip(it.q) + "\n" +
      it.opts.map(function (o, k) { return letters(k) + ". " + strip(o); }).join("\n") + "\n" +
      "Kunci resmi: " + letters(it.a) + "\nPembahasan tersimpan: " + strip(it.why);
    aiChat([
      { role: "system", content: "Kamu tutor seleksi masuk politeknik teknik di Indonesia. Jawab dalam bahasa Indonesia yang ringkas, maksimal 220 kata, pakai langkah bernomor bila relevan. Jangan mengubah kunci jawaban yang diberikan." },
      { role: "user", content: ctx + "\n\n" + prompt }
    ]).then(function (txt) {
      box.innerHTML = '<h5>AI coach</h5>' + esc(txt).replace(/\n/g, "<br>");
    }).catch(function (e) {
      box.innerHTML = '<h5>AI coach</h5>Gagal menghubungi provider. ' + esc(e.message) +
        '<br><span class="muted">Coba provider lain di menu AI Coach, atau jalankan aplikasi lewat start.bat agar proxy /api/chat aktif.</span>';
    });
  }

  function strip(h) {
    var d = document.createElement("div"); d.innerHTML = h; return (d.textContent || "").replace(/\s+/g, " ").trim();
  }

  function aiTest() {
    var out = $("#aiTestOut"); out.classList.remove("hide"); out.innerHTML = '<span class="spin"></span> Menguji…';
    aiChat([{ role: "user", content: "Balas satu kalimat: koneksi AI coach berhasil." }]).then(function (t) {
      out.innerHTML = '<h5>Koneksi berhasil</h5>' + esc(t.slice(0, 400));
    }).catch(function (e) {
      out.innerHTML = '<h5>Gagal</h5>' + esc(e.message) + '<br><span class="muted">Pastikan aplikasi dibuka via start.bat (bukan file://) agar proxy aktif.</span>';
    });
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (ev) {
    var t = ev.target.closest("[data-go],[data-do],[data-mode],[data-pick],[data-jump],[data-ppick],[data-ai]");
    if (!t) return;

    if (t.hasAttribute("data-mode")) {
      ev.preventDefault();
      var m = t.getAttribute("data-mode");
      if (S.bank.length < 50) { toast("Bank soal belum termuat."); return; }
      if (!confirm("Mulai " + (m === "elite" ? "Elite 1000 (3 jam)" : m === "full" ? "Simulasi Resmi (4 subtes)" : "Mock Cepat") + " sekarang?")) return;
      startRun(m);
      return;
    }
    if (t.hasAttribute("data-go")) { ev.preventDefault(); go(t.getAttribute("data-go")); return; }
    if (t.hasAttribute("data-pick")) { answer(+t.getAttribute("data-pick")); return; }
    if (t.hasAttribute("data-jump")) { S.run.i = +t.getAttribute("data-jump"); renderExam(); return; }
    if (t.hasAttribute("data-ppick")) {
      var it = P.items[P.i];
      if (P.picks[it.id] == null) { P.picks[it.id] = +t.getAttribute("data-ppick"); renderPracticeItem(); }
      return;
    }
    if (t.hasAttribute("data-ai")) { askAI(t.getAttribute("data-ai"), t.getAttribute("data-qid")); return; }

    var d = t.getAttribute("data-do");
    if (!d) return;
    ev.preventDefault();
    switch (d) {
      case "resume": resumeRun(); break;
      case "start":
        startRun($("#setupSec").value === "all" ? "quick" : "quick", $("#setupSec").value, +$("#setupN").value);
        break;
      case "prev": move(-1); break;
      case "next": move(1); break;
      case "clear": delete S.run.answers[S.run.items[S.run.i]]; renderExam(); break;
      case "flag":
        var id = S.run.items[S.run.i];
        if (S.run.flags[id]) delete S.run.flags[id]; else S.run.flags[id] = 1;
        renderExam(); break;
      case "submit": askSubmit(); break;
      case "endSection":
        if (!confirm("Akhiri subtes ini dan lanjut?")) return;
        var bi = blockIndexFor(S.run.i), nx = S.run.blocks[bi + 1];
        if (nx) { S.run.i = nx.from; renderExam(); toast("Mulai subtes: " + nx.label); } else askSubmit();
        break;
      case "reviewAll": renderReview("all"); break;
      case "reviewWrong": renderReview("wrong"); break;
      case "retrySame": startRun(S.last.mode); break;
      case "openHist": openHistory(t.getAttribute("data-id")); break;
      case "print": window.print(); break;
      case "pStart": startPractice(); break;
      case "pPrev": if (P.i > 0) { P.i--; renderPracticeItem(); } break;
      case "pNext": if (P.i < P.items.length - 1) { P.i++; renderPracticeItem(); } break;
      case "aiSave": aiSave(); break;
      case "aiTest": aiTest(); break;
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (S.view !== "exam" || !S.run || S.run.finished) return;
    if (/input|select|textarea/i.test((ev.target.tagName || ""))) return;
    if (ev.key >= "1" && ev.key <= "4") { answer(+ev.key - 1); }
    if (ev.key === "ArrowRight") move(1);
    if (ev.key === "ArrowLeft") move(-1);
    if (ev.key === "f" || ev.key === "F") { $('[data-do="flag"]').click(); }
  });

  window.addEventListener("beforeunload", function (ev) {
    if (S.run && !S.run.finished) { saveRun(); ev.preventDefault(); ev.returnValue = ""; }
  });

  /* ---------- private access gate ---------- */
  var GATE = "4b02c4e9eedbe40f36eb1ba8701299ebfcfe4ee955aef8e35192d1507344d3f4";

  function sha256(s) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }

  function renderLock() {
    document.body.innerHTML =
      '<div style="min-height:100vh;display:grid;place-items:center;padding:24px;font-family:system-ui,Segoe UI,sans-serif;background:#f4f6f9">' +
      '<div style="max-width:420px;width:100%;background:#fff;border:1px solid #dfe4ec;border-radius:16px;padding:28px;box-shadow:0 10px 30px rgba(15,23,42,.07)">' +
      '<div style="font-size:11.5px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;color:#0e7490">Akses terbatas</div>' +
      '<h1 style="margin:6px 0 6px;font-size:21px;color:#0f172a">ATMI SPMB Elite Mock</h1>' +
      '<p style="margin:0 0 18px;color:#5b6577;font-size:14px;line-height:1.55">Halaman ini privat. Masukkan kode akses yang kamu terima untuk membuka 1000 soal.</p>' +
      '<input id="gateIn" type="password" placeholder="Kode akses" autocomplete="off" style="width:100%;box-sizing:border-box;padding:12px 14px;border:1px solid #dfe4ec;border-radius:10px;font-size:15px;outline:none">' +
      '<button id="gateGo" style="margin-top:12px;width:100%;padding:12px;border:0;border-radius:10px;background:#0f766e;color:#fff;font-weight:700;font-size:15px;cursor:pointer">Buka</button>' +
      '<div id="gateErr" style="color:#b42318;font-size:13px;margin-top:10px;min-height:18px"></div>' +
      '</div></div>';
    function attempt() {
      var v = ($("#gateIn").value || "").trim();
      sha256(v).then(function (h) {
        if (h === GATE) { localStorage.setItem("atmi_gate", GATE); location.reload(); }
        else { $("#gateErr").textContent = "Kode salah. Coba lagi."; $("#gateIn").select(); }
      });
    }
    $("#gateGo").addEventListener("click", attempt);
    $("#gateIn").addEventListener("keydown", function (e) { if (e.key === "Enter") attempt(); });
    $("#gateIn").focus();
  }

  /* ---------- init ---------- */
  function init() {
    buildBank();
    var st = loadStore();
    if (st.ai) S.ai = st.ai;
    if (localStorage.getItem("atmi_gate") !== GATE) { renderLock(); return; }
    var counts = SECTIONS.map(function (s) { return s.key + ":" + (S.bySec[s.key] || []).length; }).join(" ");
    console.log("[ATMI] bank loaded:", S.bank.length, counts);
    go("home");
  }
  window.ATMI = { S: S, go: go, startRun: startRun, aiChat: aiChat, counts: function () { return S.bank.length; } };
  init();
})();
