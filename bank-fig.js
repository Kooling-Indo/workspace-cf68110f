/* ============================================================
   ATMI ELITE BANK - T1 TES CAPABILITY (figural)
   Every answer is COMPUTED by the generator, never hardcoded.
   Exposes BANK_FIG.build() -> array of items
   item = {sec, topic, q, opts[4] (html allowed), a (index), why, diff}
   ============================================================ */
var BANK_FIG = (function () {
  "use strict";

  /* deterministic RNG */
  function mk(seed) {
    var a = seed >>> 0;
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function polyPts(n, start, r) {
    var out = [];
    for (var i = 0; i < n; i++) {
      var t = (start + i * 360 / n) * Math.PI / 180;
      out.push((r * Math.cos(t)).toFixed(1) + "," + (r * Math.sin(t)).toFixed(1));
    }
    return out.join(" ");
  }
  function starPts(n, R, r) {
    var out = [];
    for (var i = 0; i < n * 2; i++) {
      var rad = i % 2 ? r : R;
      var t = (-90 + i * 180 / n) * Math.PI / 180;
      out.push((rad * Math.cos(t)).toFixed(1) + "," + (rad * Math.sin(t)).toFixed(1));
    }
    return out.join(" ");
  }

  var SHAPES = ["circle", "square", "triangle", "diamond", "pentagon", "hexagon",
    "star", "cross", "arrow", "chevron", "semicircle", "ellipse", "lshape", "tshape", "quarter"];
  var NAMES = {
    circle: "lingkaran", square: "persegi", triangle: "segitiga", diamond: "belah ketupat",
    pentagon: "segilima", hexagon: "segienam", star: "bintang", cross: "palang",
    arrow: "tanda panah", chevron: "panah siku", semicircle: "setengah lingkaran",
    ellipse: "elips", lshape: "bentuk L", tshape: "bentuk T", quarter: "seperempat lingkaran",
    fsym: "huruf F"
  };

  function body(kind) {
    switch (kind) {
      case "circle": return '<circle cx="0" cy="0" r="34"/>';
      case "ellipse": return '<ellipse cx="0" cy="0" rx="40" ry="23"/>';
      case "square": return '<rect x="-30" y="-30" width="60" height="60"/>';
      case "triangle": return '<polygon points="0,-36 34,26 -34,26"/>';
      case "diamond": return '<polygon points="0,-36 36,0 0,36 -36,0"/>';
      case "pentagon": return '<polygon points="' + polyPts(5, -90, 34) + '"/>';
      case "hexagon": return '<polygon points="' + polyPts(6, 0, 34) + '"/>';
      case "star": return '<polygon points="' + starPts(5, 36, 15) + '"/>';
      case "cross": return '<path d="M-9,-34 L9,-34 L9,-9 L34,-9 L34,9 L9,9 L9,34 L-9,34 L-9,9 L-34,9 L-34,-9 L-9,-9 Z"/>';
      case "arrow": return '<polygon points="0,-36 30,-3 10,-3 10,31 -10,31 -10,-3 -30,-3"/>';
      case "chevron": return '<path d="M-28,-24 L0,4 L28,-24 L28,8 L0,36 L-28,8 Z"/>';
      case "semicircle": return '<path d="M-34,20 A34,34 0 0,1 34,20 Z"/>';
      case "lshape": return '<path d="M-28,-32 L-8,-32 L-8,-4 L30,-4 L30,24 L-28,24 Z"/>';
      case "tshape": return '<path d="M-32,-30 L32,-30 L32,-8 L8,-8 L8,30 L-8,30 L-8,-8 L-32,-8 Z"/>';
      case "quarter": return '<path d="M-30,-30 L-30,28 A58,58 0 0,0 28,-30 Z"/>';
      case "fsym": return '<path d="M-24,-32 L22,-32 L22,-16 L-6,-16 L-6,-2 L16,-2 L16,12 L-6,12 L-6,30 L-24,30 Z"/>';
      default: return '<circle cx="0" cy="0" r="34"/>';
    }
  }

  /* glyph(): rot in deg, mirror boolean, fill 'o' outline | 's' solid, mark '' | 'dot' | 'v' | 'h' */
  function glyph(kind, o) {
    o = o || {};
    var rot = o.rot || 0, size = o.size || 78;
    var fillAttr = o.fill === "s" ? "currentColor" : "none";
    var tf = "rotate(" + rot + ")";
    if (o.mirror) tf += " scale(-1,1)";
    var mark = "";
    if (o.mark === "dot") mark = '<circle cx="0" cy="0" r="7" fill="currentColor" stroke="none"/>';
    else if (o.mark === "v") mark = '<line x1="0" y1="-20" x2="0" y2="20" stroke="currentColor" stroke-width="5"/>';
    else if (o.mark === "h") mark = '<line x1="-20" y1="0" x2="20" y2="0" stroke="currentColor" stroke-width="5"/>';
    else if (o.mark === "x") mark = '<path d="M-14,-14 L14,14 M-14,14 L14,-14" stroke="currentColor" stroke-width="5" fill="none"/>';
    return '<svg class="fig" viewBox="-50 -50 100 100" width="' + size + '" height="' + size + '" aria-hidden="true">' +
      '<g transform="' + tf + '" fill="' + fillAttr + '" stroke="currentColor" stroke-width="5" ' +
      'stroke-linejoin="round" stroke-linecap="round">' + body(kind) + mark + "</g></svg>";
  }
  function cellHTML(inner, label) {
    return '<span class="figcell">' + inner + (label ? '<i>' + label + '</i>' : "") + "</span>";
  }
  function gap() { return '<span class="figgap" aria-hidden="true">&#8594;</span>'; }

  var LET = ["A", "B", "C", "D"];

  function makeOpts(rng, correctHTML, wrongHTMLs) {
    var all = shuffle(rng, [{ h: correctHTML, ok: true }].concat(wrongHTMLs.map(function (w) { return { h: w, ok: false }; })));
    var a = 0;
    var opts = all.map(function (o, i) { if (o.ok) a = i; return o.h; });
    return { opts: opts, a: a };
  }

  /* ---------------------------------------------------------------
     1. PENALARAN VERBAL A: which picture is different
     --------------------------------------------------------------- */
  var ODD_RULES = ["kind", "mark", "fill", "orient", "sides"];

  function oddItem(rng, i, rule) {
    var base = pick(rng, SHAPES), odd = base;
    while (SHAPES.indexOf(odd) >= 0 && SHAPES[Math.floor(rng() * SHAPES.length)] === base) {
      /* pick a different kind */
      odd = SHAPES[Math.floor(rng() * SHAPES.length)];
      if (odd !== base) break;
    }
    var commonMark = pick(rng, ["", "", "dot", "v", "h", "x"]);
    var commonFill = pick(rng, ["o", "o", "s"]);
    var q = "", why = "", correct, wrongs = [];
    var kindList = [], markList = [], fillList = [], rotList = [];

    if (rule === "kind") {
      for (var k = 0; k < 4; k++) { kindList.push(base); markList.push(commonMark); fillList.push(commonFill); rotList.push(0); }
      var oddIdx = Math.floor(rng() * 4);
      kindList[oddIdx] = odd;
      q = "Gambar manakah yang berbeda dari gambar lainnya?";
      var why = "Gambar <b>" + LET[oddIdx] + "</b> berbentuk " + NAMES[odd] +
        ", sedangkan tiga gambar lainnya semuanya berbentuk " + NAMES[base] +
        ". Perbedaan bentuk adalah satu-satunya pembeda pada soal ini.";
    } else if (rule === "mark") {
      var baseMark = pick(rng, ["", "dot", "v", "h", "x"]);
      var altMark = pick(rng, ["", "dot", "v", "h", "x"].filter(function (m) { return m !== baseMark; }));
      for (var k2 = 0; k2 < 4; k2++) { kindList.push(base); markList.push(baseMark); fillList.push("o"); rotList.push(0); }
      var oi2 = Math.floor(rng() * 4);
      markList[oi2] = altMark;
      q = "Gambar manakah yang berbeda dari gambar lainnya?";
      var markName = function (m) {
        return m === "dot" ? "titik di tengah" : m === "v" ? "garis tegak di tengah" :
          m === "h" ? "garis mendatar di tengah" : m === "x" ? "garis silang di tengah" : "tanpa tanda di tengah";
      };
      var why = "Ketiga gambar lain memiliki " + markName(baseMark) + ", sedangkan gambar <b>" + LET[oi2] +
        "</b> memiliki " + markName(altMark) + ". Bentuk luarnya sama, jadi yang membedakan adalah isi gambar.";
    } else if (rule === "fill") {
      var baseFill = pick(rng, ["o", "s"]);
      for (var k3 = 0; k3 < 4; k3++) { kindList.push(base); markList.push(""); fillList.push(baseFill); rotList.push(0); }
      var oi3 = Math.floor(rng() * 4);
      fillList[oi3] = baseFill === "o" ? "s" : "o";
      q = "Gambar manakah yang berbeda dari gambar lainnya?";
      var why = "Tiga gambar lain digambar dengan garis luar saja (" + (baseFill === "o" ? "berongga" : "berisi penuh") +
        "), sedangkan gambar <b>" + LET[oi3] + "</b> digambar " + (baseFill === "o" ? "berisi penuh" : "hanya garis luarnya") +
        ". Bentuk dan ukurannya sama, yang berbeda hanya cara pengisian.";
    } else if (rule === "orient") {
      var dirKind = pick(rng, ["arrow", "chevron", "triangle"]);
      var rot0 = pick(rng, [0, 90, 180, 270]);
      for (var k4 = 0; k4 < 4; k4++) { kindList.push(dirKind); markList.push(""); fillList.push("o"); rotList.push(rot0); }
      var oi4 = Math.floor(rng() * 4);
      rotList[oi4] = (rot0 + 180) % 360;
      q = "Gambar manakah yang berbeda dari gambar lainnya?";
      var dirName = function (r) { return r === 0 ? "atas" : r === 90 ? "kanan" : r === 180 ? "bawah" : "kiri"; };
      var why = "Tiga gambar menghadap ke <b>" + dirName(rot0) + "</b>, sedangkan gambar <b>" + LET[oi4] +
        "</b> menghadap ke <b>" + dirName(rotList[oi4]) + "</b> (diputar 180&deg;). Arah hadap adalah pembedanya, bukan bentuknya.";
    } else {
      /* sides: polygons with different vertex counts */
      var sidesList = [["triangle", "segitiga", 3], ["square", "persegi", 4], ["pentagon", "segilima", 5],
        ["hexagon", "segienam", 6]];
      var basePair = pick(rng, sidesList);
      var otherPair = pick(rng, sidesList.filter(function (s) { return s[2] !== basePair[2]; }));
      for (var k5 = 0; k5 < 4; k5++) { kindList.push(basePair[0]); markList.push(""); fillList.push("o"); rotList.push(0); }
      var oi5 = Math.floor(rng() * 4);
      kindList[oi5] = otherPair[0];
      q = "Gambar manakah yang berbeda dari gambar lainnya?";
      var why = "Tiga gambar adalah " + basePair[1] + " (" + basePair[2] + " sisi), sedangkan gambar <b>" + LET[oi5] +
        "</b> adalah " + otherPair[1] + " (" + otherPair[2] + " sisi). Jumlah sisilah yang membedakan.";
    }

    var cells = kindList.map(function (kd, idx) {
      return cellHTML(glyph(kd, { rot: rotList[idx], fill: fillList[idx], mark: markList[idx] }), LET[idx]);
    });
    var bodyHTML = '<div class="figrow">' + cells.join("") + "</div>";
    for (var d = 0; d < 4; d++) {
      if (d === 0) continue;
      wrongs.push(kindList.map(function (kd, idx) {
        var kd2 = kd, rt2 = rotList[idx], fl2 = fillList[idx], mk2 = markList[idx];
        if (idx !== d) { /* keeps same */ }
        return cellHTML(glyph(kd2, { rot: rt2, fill: fl2, mark: mk2 }), LET[idx]);
      }).join(""));
    }
    /* wrong options: the same four figures with a different one flagged -- replaced by
       "none of them" style distractors is not meaningful, so options are the four labels
       rendered as text rows. Simpler: options are letters. */
    var opts = LET.slice(0, 4).map(function (l) { return '<span class="optletter">' + l + "</span>"; });
    var answer = kindList.findIndex ? 0 : 0;
    /* recompute answer index from the rule branch */
    var ansIdx = 0;
    if (rule === "kind") ansIdx = kindList.findIndex(function (k6) { return k6 === odd; });
    if (ansIdx < 0) ansIdx = 0;
    return null; /* replaced below by oddItem2 */
  }

  /* clean implementation of the odd-one-out item */
  function oddItem2(rng, rule) {
    var L = ["A", "B", "C", "D"];
    var kinds = [], marks = [], fills = [], rots = [];
    var base = pick(rng, SHAPES);
    var q = "Gambar manakah yang paling berbeda dari gambar lainnya?";
    var why = "";
    var ans = 0;

    if (rule === "kind") {
      var other = pick(rng, SHAPES.filter(function (s) { return s !== base; }));
      for (var i = 0; i < 4; i++) { kinds.push(base); marks.push(""); fills.push("o"); rots.push(0); }
      ans = Math.floor(rng() * 4);
      kinds[ans] = other;
      var why = "Gambar <b>" + L[ans] + "</b> berbentuk " + NAMES[other] + ", sedangkan gambar lain berbentuk " +
        NAMES[base] + ". Jadi pembedanya adalah <b>jenis bangun</b>.";
    } else if (rule === "mark") {
      var bm = pick(rng, ["", "dot", "v", "h", "x"]);
      var alt = pick(rng, ["", "dot", "v", "h", "x"].filter(function (m) { return m !== bm; }));
      for (var i2 = 0; i2 < 4; i2++) { kinds.push(base); marks.push(bm); fills.push("o"); rots.push(0); }
      ans = Math.floor(rng() * 4);
      marks[ans] = alt;
      var nm = function (m) {
        return m === "dot" ? "titik di tengah" : m === "v" ? "garis tegak" :
          m === "h" ? "garis mendatar" : m === "x" ? "garis silang" : "tanpa tanda di dalam";
      };
      var why = "Bentuk luar keempat gambar sama (" + NAMES[base] + "). Tiga gambar berisi " + nm(bm) +
        ", sedangkan gambar <b>" + L[ans] + "</b> berisi " + nm(alt) + ".";
    } else if (rule === "fill") {
      var bf = pick(rng, ["o", "s"]);
      for (var i3 = 0; i3 < 4; i3++) { kinds.push(base); marks.push(""); fills.push(bf); rots.push(0); }
      ans = Math.floor(rng() * 4);
      fills[ans] = bf === "o" ? "s" : "o";
      var why = "Tiga gambar " + (bf === "o" ? "hanya digambar garis luarnya (berongga)" : "diisi penuh (solid)") +
        ", sedangkan gambar <b>" + L[ans] + "</b> " + (bf === "o" ? "diisi penuh" : "hanya garis luarnya") +
        ". Yang berbeda adalah <b>cara pengisian</b>, bukan bentuknya.";
    } else if (rule === "orient") {
      var dk = pick(rng, ["arrow", "chevron", "triangle"]);
      var r0 = pick(rng, [0, 90, 180, 270]);
      for (var i4 = 0; i4 < 4; i4++) { kinds.push(dk); marks.push(""); fills.push("o"); rots.push(r0); }
      ans = Math.floor(rng() * 4);
      rots[ans] = (r0 + 180) % 360;
      var dn = function (r) { return r === 0 ? "atas" : r === 90 ? "kanan" : r === 180 ? "bawah" : "kiri"; };
      var why = "Tiga gambar menghadap ke " + dn(r0) + ". Gambar <b>" + L[ans] + "</b> menghadap ke " +
        dn(rots[ans]) + " karena diputar 180&deg;. Pembedanya adalah <b>arah hadap</b>.";
    } else {
      var P = [["triangle", "segitiga", 3], ["square", "persegi", 4], ["pentagon", "segilima", 5],
        ["hexagon", "segienam", 6], ["diamond", "belah ketupat", 4], ["star", "bintang", 10]];
      var bp = pick(rng, P);
      var op = pick(rng, P.filter(function (s) { return s[2] !== bp[2]; }));
      for (var i5 = 0; i5 < 4; i5++) { kinds.push(bp[0]); marks.push(""); fills.push("o"); rots.push(0); }
      ans = Math.floor(rng() * 4);
      kinds[ans] = op[0];
      var why = "Tiga gambar adalah " + bp[1] + " dengan " + bp[2] + " sisi, sedangkan gambar <b>" + L[ans] +
        "</b> adalah " + op[1] + " dengan " + op[2] + " sisi. Pembedanya adalah <b>jumlah sisi</b>.";
    }
    var row = kinds.map(function (k, i) {
      return cellHTML(glyph(k, { rot: rots[i], fill: fills[i], mark: marks[i] }), L[i]);
    }).join("");
    var opts = L.map(function (l) { return '<b class="optletter">' + l + "</b>"; });
    return { q: '<div class="qlead">Perhatikan keempat gambar berikut.</div><div class="figrow">' + row + "</div><div class=\"qask\">" + q + "</div>", opts: opts, a: ans, why: why, diff: rule === "kind" || rule === "fill" ? 1 : 2 };
  }

  /* ---------------------------------------------------------------
     2. PENALARAN VERBAL B: which picture continues the series
     --------------------------------------------------------------- */
  function nextItem(rng, mode) {
    var L = ["A", "B", "C", "D"];
    var kinds, rots, marks, fills, answer, why, seq, opts, a;

    if (mode === "rotate") {
      var k = pick(rng, ["arrow", "chevron", "triangle", "lshape", "tshape", "semicircle", "quarter"]);
      var step = pick(rng, [45, 90, 135, 180]);
      var start = pick(rng, [0, 45, 90, 135, 180, 225, 270, 315]);
      seq = [];
      for (var i = 0; i < 5; i++) seq.push({ kind: k, rot: (start + i * step) % 360, fill: "o", mark: "" });
      var nextRot = (start + 5 * step) % 360;
      answer = { kind: k, rot: nextRot, fill: "o", mark: "" };
      var wrongs = [];
      var candRot = [nextRot + step, nextRot - step, nextRot + 2 * step, nextRot - 2 * step,
        nextRot + 90, nextRot + 180, nextRot + 45, nextRot + 135];
      candRot.forEach(function (r) { r = ((r % 360) + 360) % 360; if (r !== nextRot && wrongs.length < 3 && !wrongs.some(function (w) { return w.rot === r; })) wrongs.push({ kind: k, rot: r, fill: "o", mark: "" }); });
      var html = function (o) { return cellHTML(glyph(o.kind, o)); };
      var qhtml = '<div class="qlead">Perhatikan deret gambar berikut.</div><div class="figrow">' +
        seq.map(function (o) { return html(o); }).join("") + '<span class="figgap">&#8594;</span>' +
        cellHTML('<span class="qmark">?</span>') + "</div>" +
        '<div class="qask">Gambar manakah yang melanjutkan deret tersebut?</div>';
      var r = makeOpts(rng, html(answer), wrongs.map(html));
      var stepWord = step === 45 ? "45&deg;" : step === 90 ? "90&deg;" : step === 135 ? "135&deg;" : "180&deg;";
      var why = "Setiap gambar diputar <b>" + stepWord + " searah jarum jam</b> dari gambar sebelumnya. Gambar kelima berorientasi " +
        nextRot + "&deg;, sehingga gambar berikutnya berorientasi " + ((nextRot + step) % 360) +
        "&deg;. Pilihan lain adalah putaran yang melompati satu langkah atau berputar ke arah sebaliknya.";
      return { q: qhtml, opts: r.opts, a: r.a, why: why, diff: 2 };
    }

    if (mode === "alternate") {
      var p = pick(rng, [2, 3, 4]);
      var cycle = shuffle(rng, SHAPES).slice(0, p);
      seq = [];
      for (var i2 = 0; i2 < 6; i2++) seq.push({ kind: cycle[i2 % p], rot: 0, fill: "o", mark: "" });
      answer = { kind: cycle[6 % p], rot: 0, fill: "o", mark: "" };
      var w = [];
      for (var j = 1; j <= 3; j++) { w.push({ kind: cycle[(6 + j) % p], rot: 0, fill: "o", mark: "" }); }
      var uniq = [];
      w.forEach(function (o) { if (o.kind !== answer.kind && !uniq.some(function (u) { return u.kind === o.kind; })) uniq.push(o); });
      while (uniq.length < 3) {
        var cand = pick(rng, SHAPES.filter(function (s) { return s !== answer.kind && !uniq.some(function (u) { return u.kind === s; }); }));
        uniq.push({ kind: cand, rot: 0, fill: "o", mark: "" });
      }
      var html2 = function (o) { return cellHTML(glyph(o.kind, o)); };
      var q2 = '<div class="qlead">Perhatikan deret gambar berikut.</div><div class="figrow">' +
        seq.map(function (o) { return html2(o); }).join("") + '<span class="figgap">&#8594;</span>' +
        cellHTML('<span class="qmark">?</span>') + "</div>" +
        '<div class="qask">Gambar manakah yang melanjutkan deret tersebut?</div>';
      var r2 = makeOpts(rng, html2(answer), uniq.map(html2));
      var cycNames = cycle.map(function (c) { return NAMES[c]; }).join(", ");
      var why = "Deret berulang secara berkala dengan periode <b>" + p + "</b>: " + cycNames + ", lalu kembali ke awal. " +
        "Karena posisi ke-7 jatuh pada urutan ke-" + ((6 % p) + 1) + " dalam periode, jawabannya adalah <b>" + NAMES[answer.kind] + "</b>.";
      return { q: q2, opts: r2.opts, a: r2.a, why: why, diff: 1 };
    }

    /* grow: number of small elements increases */
    var baseKind = pick(rng, ["circle", "square", "diamond", "star"]);
    var startN = pick(rng, [1, 2, 3]);
    var add = pick(rng, [1, 1, 2]);
    var counts = [];
    for (var i3 = 0; i3 < 4; i3++) counts.push(startN + i3 * add);
    var nextN = startN + 4 * add;
    var many = function (kind, n) {
      var cols = n <= 1 ? 1 : n <= 4 ? 2 : 3;
      var rows = Math.ceil(n / cols);
      var gapx = 66 / cols, gapy = 66 / rows;
      var rad = Math.min(9, Math.min(gapx, gapy) * 0.28);
      var pos = [];
      for (var q = 0; q < n; q++) {
        var cx = q % cols, cy = Math.floor(q / cols);
        pos.push([-33 + gapx * (cx + 0.5), -33 + gapy * (cy + 0.5)]);
      }
      return '<svg class="fig" viewBox="-50 -50 100 100" width="78" height="78" aria-hidden="true"><g fill="currentColor" stroke="currentColor" stroke-width="3">' +
        pos.map(function (c) {
          if (kind === "circle") return '<circle cx="' + c[0].toFixed(1) + '" cy="' + c[1].toFixed(1) + '" r="' + rad.toFixed(1) + '"/>';
          return '<rect x="' + (c[0] - rad).toFixed(1) + '" y="' + (c[1] - rad).toFixed(1) + '" width="' + (2 * rad).toFixed(1) + '" height="' + (2 * rad).toFixed(1) + '"/>';
        }).join("") + "</g></svg>";
    };
    var seqHTML = counts.map(function (n) { return cellHTML(many(baseKind, n)); }).join("");
    var q3 = '<div class="qlead">Perhatikan deret gambar berikut.</div><div class="figrow">' + seqHTML +
      '<span class="figgap">&#8594;</span>' + cellHTML('<span class="qmark">?</span>') + "</div>" +
      '<div class="qask">Gambar manakah yang melanjutkan deret tersebut?</div>';
    var w3 = [{ n: nextN + add }, { n: nextN - 1 }, { n: nextN + 2 * add }].filter(function (o) { return o.n !== nextN && o.n >= 1 && o.n <= 6; });
    while (w3.length < 3) {
      var cand3 = nextN + (w3.length + 1) * add;
      if (cand3 !== nextN && cand3 <= 6 && !w3.some(function (x) { return x.n === cand3; })) w3.push({ n: cand3 });
      else if (nextN - (w3.length + 1) >= 1) w3.push({ n: nextN - (w3.length + 1) });
    }
    var r3 = makeOpts(rng, many(baseKind, nextN), w3.slice(0, 3).map(function (o) { return many(baseKind, o.n); }));
    var why = "Jumlah elemen bertambah <b>" + add + "</b> setiap langkah: " + counts.join(", ") +
      ". Maka gambar berikutnya berisi " + nextN + " elemen. Pilihan lain salah karena lonjakan jumlahnya tidak sesuai pola atau jumlahnya berkurang.";
    return { q: q3, opts: r3.opts, a: r3.a, why: why, diff: 1 };
  }

  /* ---------------------------------------------------------------
     3. PENALARAN URUTAN: numbered blanks inside a 12-cell series
     --------------------------------------------------------------- */
  function urutanItem(rng) {
    var L = ["A", "B", "C", "D"];
    var p = pick(rng, [3, 4, 3, 4, 2]);
    var kinds = shuffle(rng, SHAPES).slice(0, p);
    var N = 12;
    var seq = [];
    for (var i = 0; i < N; i++) seq.push(kinds[i % p]);

    /* two blank positions between 4 and 11 */
    var b1 = 4 + Math.floor(rng() * (N - 6));
    var b2 = b1 + 1 + Math.floor(rng() * (N - 1 - b1));
    if (b2 >= N) b2 = N - 1;

    var html = function (k) { return cellHTML(glyph(k, {})); };
    var rowA = [], rowB = [];
    for (var j = 0; j < 6; j++) {
      var idx = j;
      var inner = (idx === b1 || idx === b2) ? '<span class="blankbox">' + (idx === b1 ? "1" : "2") + "</span>" : html(seq[idx]);
      rowA.push('<span class="seqcell"><i>' + (idx + 1) + "</i>" + inner + "</span>");
    }
    for (var m = 6; m < 12; m++) {
      var inner2 = (m === b1 || m === b2) ? '<span class="blankbox">' + (m === b1 ? "1" : "2") + "</span>" : html(seq[m]);
      rowB.push('<span class="seqcell"><i>' + (m + 1) + "</i>" + inner2 + "</span>");
    }
    var q = '<div class="qlead">Deret berikut terdiri atas bentuk yang berulang. Dua bagian dihilangkan dan ditandai angka <b>1</b> dan <b>2</b>.</div>' +
      '<div class="seqgrid">' + rowA.join("") + rowB.join("") + "</div>" +
      '<div class="qask">Pilihan manakah yang tepat untuk mengisi bagian <b>1</b> dan <b>2</b> secara berurutan?</div>';

    var ansA = seq[b1], ansB = seq[b2];
    var pairHTML = function (ka, kb) {
      return '<span class="pair"><span class="pairbox">' + glyph(ka, { size: 62 }) + "<i>1</i></span>" +
        '<span class="pairbox">' + glyph(kb, { size: 62 }) + "<i>2</i></span></span>";
    };
    var correct = pairHTML(ansA, ansB);
    var wrongs = [];
    /* build wrong pairs from the cycle: shift each answer by k positions in the cycle */
    var tryShift = shuffle(rng, [1, 2, 3, -1, -2]);
    tryShift.forEach(function (s) {
      if (wrongs.length >= 3) return;
      var ka = kinds[((b1 % p) + s + p * 2) % p];
      var kb = kinds[((b2 % p) + s + p * 2) % p];
      if (ka === ansA && kb === ansB) return;
      var h = pairHTML(ka, kb);
      if (h === correct || wrongs.indexOf(h) >= 0) return;
      wrongs.push(h);
    });
    while (wrongs.length < 3) {
      var rk = pick(rng, SHAPES), rk2 = pick(rng, SHAPES);
      var h2 = pairHTML(rk, rk2);
      if (h2 !== correct && wrongs.indexOf(h2) < 0 && !(rk === ansA && rk2 === ansB)) wrongs.push(h2);
    }
    var r = makeOpts(rng, correct, wrongs.slice(0, 3));
    var cycNames = kinds.map(function (c, idx) { return (idx + 1) + ". " + NAMES[c]; }).join(", ");
    var why = "Deret berulang dengan periode <b>" + p + "</b> (" + cycNames + "), lalu kembali ke bentuk pertama. " +
      "Posisi " + (b1 + 1) + " jatuh pada urutan ke-" + ((b1 % p) + 1) + " dalam periode = <b>" + NAMES[ansA] + "</b>, " +
      "dan posisi " + (b2 + 1) + " jatuh pada urutan ke-" + ((b2 % p) + 1) + " = <b>" + NAMES[ansB] + "</b>. " +
      "Cara cepat: hitung sisa bagi nomor posisi dengan " + p + ".";
    return { q: q, opts: r.opts, a: r.a, why: why, diff: p === 2 ? 1 : 2 };
  }

  /* ---------------------------------------------------------------
     4. TES SPASIAL: 3 rotations + 1 mirror
     --------------------------------------------------------------- */
  function spatialItem(rng) {
    var L = ["A", "B", "C", "D"];
    var refRot = pick(rng, [0, 90, 180, 270]);
    var rots = shuffle(rng, [0, 90, 180, 270]).slice(0, 3);
    var mirrorIdx = Math.floor(rng() * 4);
    var cells = [], used = 0;
    for (var i = 0; i < 4; i++) {
      if (i === mirrorIdx) {
        cells.push(glyph("fsym", { rot: pick(rng, [0, 90, 180, 270]), mirror: true }));
      } else {
        cells.push(glyph("fsym", { rot: rots[used++ % rots.length] }));
      }
    }
    var q = '<div class="qlead">Bentuk acuan:</div><div class="figrow center">' +
      cellHTML(glyph("fsym", { rot: refRot, size: 96 })) + "</div>" +
      '<div class="qlead">Pilihan jawaban:</div><div class="figrow">' +
      cells.map(function (c, i2) { return cellHTML(c, L[i2]); }).join("") + "</div>" +
      '<div class="qask">Pilih <b>B</b> bila bentuk pada pilihan jawaban <b>sama</b> dengan acuan (hanya diputar), dan <b>S</b> bila <b>tidak sama</b> (ada bagian yang berubah atau dicerminkan). Manakah pilihan yang bernilai <b>S</b>?</div>';
    var why = "Perhatikan letak kaki pendek dan lengan panjang huruf F: pada rotasi, keduanya selalu berada pada sisi yang sama terhadap batang vertikal. " +
      "Gambar <b>" + L[mirrorIdx] + "</b> adalah hasil <b>pencerminan</b>, sehingga susunannya terbalik - inilah satu-satunya pilihan bernilai <b>S</b>. " +
      "Tiga pilihan lain hanya diputar (" + rots.slice(0, 3).join("&deg;, ") + "&deg;) sehingga bernilai <b>B</b>.";
    return { q: q, opts: L.slice(), a: mirrorIdx, why: why, diff: 3 };
  }

  /* ---------------------------------------------------------------
     5. TES SISTEMATIKA: letter <-> symbol coding
     --------------------------------------------------------------- */
  var SYMS = ["\u25B2", "\u25C7", "\u25A0", "\u2605", "\u2660", "\u2663", "\u2665", "\u2666",
    "\u21BA", "\u21BB", "\u21E7", "\u21E9", "\u2302", "\u263E", "\u2691", "\u273F",
    "\u2602", "\u2699", "\u2702", "\u27A4", "\u2692", "\u2744", "\u2618", "\u269C"];

  function sistematikaItem(rng, reverse) {
    var LET12 = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    var sy = shuffle(rng, SYMS).slice(0, 12);
    var map = {};
    LET12.forEach(function (l, i) { map[l] = sy[i]; });

    /* table */
    var t1 = "", t2 = "";
    LET12.forEach(function (l, i) {
      t1 += '<td class="h">' + l + "</td>";
      t2 += '<td class="sym">' + map[l] + "</td>";
    });
    var table = '<table class="codetbl"><tr>' + t1 + "</tr><tr>" + t2 + "</tr></table>";

    var wordLen = pick(rng, [4, 4, 5]);
    var word = "";
    var pool = shuffle(rng, LET12).slice(0, wordLen);
    word = pool.join("");

    if (!reverse) {
      var correct = word.split("").map(function (c) { return '<span class="symbox">' + map[c] + "</span>"; }).join("");
      var wrongs = [];
      var swaps = [[0, 1], [1, 2], [2, 3], [0, 2], [1, 3]];
      shuffle(rng, swaps).forEach(function (s) {
        if (wrongs.length >= 3) return;
        var arr = word.split("");
        if (s[1] >= arr.length) return;
        var tmp = arr[s[0]]; arr[s[0]] = arr[s[1]]; arr[s[1]] = tmp;
        var h = arr.map(function (c) { return '<span class="symbox">' + map[c] + "</span>"; }).join("");
        if (wrongs.indexOf(h) < 0 && h !== correct) wrongs.push(h);
      });
      var q = '<div class="qlead">Perhatikan pasangan huruf dan simbol pada tabel berikut.</div>' + table +
        '<div class="qask">Kode simbol untuk rangkaian huruf <b>' + word + "</b> adalah ...</div>";
      var r = makeOpts(rng, correct, wrongs.slice(0, 3));
      var why = "Bacakan huruf satu per satu lalu ambil simbolnya: " +
        word.split("").map(function (c) { return "<b>" + c + "</b> = " + map[c]; }).join(", ") + ". " +
        "Urutan simbol harus sama dengan urutan huruf; pilihan lain menukar posisi dua simbol.";
      return { q: q, opts: r.opts, a: r.a, why: why, diff: 2, optsClass: "symrow" };
    }

    var symWord = word.split("").map(function (c) { return '<span class="symbox">' + map[c] + "</span>"; }).join("");
    var correct2 = '<span class="wordbox">' + word + "</span>";
    var wrongs2 = [];
    var shuffles = [[0, 1], [1, 2], [2, 3]];
    shuffle(rng, shuffles).forEach(function (s) {
      if (wrongs2.length >= 3) return;
      var arr = word.split("");
      if (s[1] >= arr.length) return;
      var t = arr[s[0]]; arr[s[0]] = arr[s[1]]; arr[s[1]] = t;
      var h = '<span class="wordbox">' + arr.join("") + "</span>";
      if (h !== correct2 && wrongs2.indexOf(h) < 0) wrongs2.push(h);
    });
    while (wrongs2.length < 3) {
      var alt = shuffle(rng, LET12).slice(0, wordLen).join("");
      if (alt !== word) {
        var hh = '<span class="wordbox">' + alt + "</span>";
        if (wrongs2.indexOf(hh) < 0) wrongs2.push(hh);
      }
    }
    var q2 = '<div class="qlead">Perhatikan pasangan huruf dan simbol pada tabel berikut.</div>' + table +
      '<div class="qask">Rangkaian simbol <b>' + symWord + "</b> menyatakan huruf ...</div>";
    var r2 = makeOpts(rng, correct2, wrongs2.slice(0, 3));
    var why = "Cocokkan setiap simbol dengan huruf pada tabel, dari kiri ke kanan: " +
      word.split("").map(function (c) { return map[c] + " = <b>" + c + "</b>"; }).join(", ") +
      ". Hasilnya <b>" + word + "</b>. Pilihan lain mengacak posisi huruf, tetapi himpunan simbolnya sama.";
    return { q: q2, opts: r2.opts, a: r2.a, why: why, diff: 2 };
  }

  /* ---------------------------------------------------------------
     build
     --------------------------------------------------------------- */
  function build() {
    var rng = mk(20261120);
    var items = [];
    var seenQ = {};
    var rules = ["kind", "mark", "fill", "orient", "sides"];
    var modes = ["rotate", "alternate", "grow"];

    /* generate until n unique, fully-formed items are collected; a shortfall is an error, not a shrug */
    function add(n, sec, topic, gen) {
      var done = 0, guard = 0;
      while (done < n) {
        if (++guard > n * 80) throw new Error("bank shortfall " + sec + " " + done + "/" + n);
        var it = gen(guard);
        if (!it || !it.q || !it.why) continue;
        if (!it.opts || it.opts.length !== 4) continue;
        if (it.a == null || it.a < 0 || it.a > 3) continue;
        if (new Set(it.opts).size !== 4) continue;
        if (seenQ[it.q]) continue;
        seenQ[it.q] = 1;
        it.sec = sec; it.topic = topic;
        items.push(it); done++;
      }
    }

    add(50, "T1V", "Penalaran Verbal \u2014 gambar berbeda", function (i) { return oddItem2(rng, rules[i % rules.length]); });
    add(50, "T1V", "Penalaran Verbal \u2014 lanjutan deret", function (i) { return nextItem(rng, modes[i % modes.length]); });
    add(100, "T1U", "Penalaran Urutan", function () { return urutanItem(rng); });
    add(100, "T1S", "Tes Spasial", function () { return spatialItem(rng); });
    add(100, "T1Y", "Tes Sistematika", function (i) { return sistematikaItem(rng, i % 2 === 1); });
    return items;
  }

  return { build: build, glyph: glyph, NAMES: NAMES };
})();
if (typeof module !== "undefined" && module.exports) { module.exports = BANK_FIG; }
