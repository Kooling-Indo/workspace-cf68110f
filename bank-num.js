/* ============================================================
   ATMI ELITE BANK - T2 KEMAMPUAN DASAR TEKNIK + T3 TPA (500)
   Every key is COMPUTED from the parameters, never hardcoded.
   Exposes BANK_NUM.build()
   ============================================================ */
var BANK_NUM = (function () {
  "use strict";

  function ri(rng, a, b) { return a + Math.floor(rng() * (b - a + 1)); }
  function pick(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
  function shuffle(rng, arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rng() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function mk(seed) {
    var s = seed >>> 0;
    return function () {
      s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0;
      return s / 4294967296;
    };
  }
  /* Indonesian-style number: comma decimal, dot thousands */
  function num(v) {
    var r = Math.round(v * 1000) / 1000;
    var neg = r < 0; r = Math.abs(r);
    var parts = String(r).split(".");
    var ip = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    var out = parts[1] ? ip + "," + parts[1] : ip;
    return (neg ? "-" : "") + out;
  }

  /* options: correct string + wrong strings, unique, shuffled */
  function makeOpts(rng, correct, wrongs) {
    var opts = [correct], tries = 0;
    wrongs.forEach(function (w) {
      if (opts.length < 4 && w != null && String(w) !== "" && opts.indexOf(String(w)) < 0) opts.push(String(w));
    });
    while (opts.length < 4 && tries < 40) {
      tries++;
      var base = parseFloat(String(correct).replace(/\./g, "").replace(",", "."));
      if (isNaN(base)) break;
      var delta = Math.max(1, Math.round(Math.abs(base) * 0.07)) * pick(rng, [-1, 1]) * ri(rng, 1, 4);
      var cand = num(base + delta);
      if (opts.indexOf(cand) < 0) opts.push(cand);
    }
    while (opts.length < 4) opts.push("Tidak dapat ditentukan");
    opts = shuffle(rng, opts.slice(0, 4));
    return { opts: opts, a: opts.indexOf(correct) };
  }

  function unit(s) { return " " + s; }

  /* =========================================================
     T2 - KEMAMPUAN DASAR TEKNIK
     ========================================================= */

  /* 1. gear ratio */
  function gear(rng) {
    var z1 = pick(rng, [12, 15, 18, 20, 24, 30, 36, 40]);
    var z2 = pick(rng, [48, 60, 72, 80, 90, 100]);
    var n1 = pick(rng, [300, 600, 900, 1200, 1500]);
    if (z1 === z2) z2 = z1 * 2;
    var n2 = n1 * z1 / z2;
    var r = makeOpts(rng, num(n2), [num(n1 * z2 / z1), num(n1 * z2 / z1 / 2), num(n2 * 2), num(n1 - n2)]);
    return {
      q: '<div class="qlead">Sebuah roda gigi dengan <b>' + z1 + ' gigi</b> berputar ' + num(n1) + ' rpm dan menggerakkan roda gigi <b>' + z2 + ' gigi</b>.</div>' +
        '<div class="qask">Berapa putaran per menit (rpm) roda gigi yang digerakkan?</div>',
      opts: r.opts, a: r.a, diff: 2,
      why: 'Perbandingan transmisi = gigi penggerak : gigi yang digerakkan = ' + z1 + ' : ' + z2 + ' = 1 : ' + num(z2 / z1) + '. ' +
        'Maka n<sub>2</sub> = n<sub>1</sub> &times; (z<sub>1</sub>/z<sub>2</sub>) = ' + num(n1) + ' &times; (' + z1 + '/' + z2 + ') = <b>' + num(n2) + ' rpm</b>. ' +
        'Roda gigi yang lebih besar selalu berputar lebih lambat, jadi pilihan yang lebih besar dari ' + num(n1) + ' rpm salah arah.'
    };
  }

  /* 2. lever / torque balance */
  function lever(rng) {
    var d1 = pick(rng, [20, 25, 30, 40, 50]);
    var d2 = pick(rng, [10, 15, 20, 25]);
    var f1 = pick(rng, [40, 60, 80, 100, 120]);
    if (d1 === d2) d2 = d1 / 2;
    var f2 = f1 * d1 / d2;
    var r = makeOpts(rng, num(f2), [num(f1 * d2 / d1), num(f1 + d1), num(f2 / 2), num(f1)]);
    return {
      q: '<div class="qlead">Pada sebuah tuas, beban ' + num(f1) + ' N bekerja pada lengan ' + d1 + ' cm dari titik tumpu. Tuas dalam keadaan seimbang.</div>' +
        '<div class="qask">Berapa gaya yang harus diberikan pada lengan ' + d2 + ' cm di sisi lain?</div>',
      opts: r.opts, a: r.a, diff: 2,
      why: 'Syarat kesetimbangan tuas: F<sub>1</sub> &times; L<sub>1</sub> = F<sub>2</sub> &times; L<sub>2</sub>. ' +
        'F<sub>2</sub> = (' + num(f1) + ' &times; ' + d1 + ') / ' + d2 + ' = <b>' + num(f2) + ' N</b>. ' +
        'Lengan yang lebih pendek membutuhkan gaya lebih besar, sehingga pilihan yang lebih kecil dari ' + num(f1) + ' N salah.'
    };
  }

  /* 3. pulley system */
  function pulley(rng) {
    var n = pick(rng, [2, 3, 4, 5, 6]);
    var w = pick(rng, [120, 180, 240, 300, 360, 480]);
    var f = w / n;
    var r = makeOpts(rng, num(f), [num(w * n), num(w / 2), num(w - n), num(f * 2)]);
    return {
      q: '<div class="qlead">Sebuah beban ' + num(w) + ' N diangkat dengan sistem katrol yang memiliki <b>' + n + ' tali penyangga</b> (katrol bergerak). Gesekan diabaikan.</div>' +
        '<div class="qask">Berapa gaya tarik minimum yang diperlukan?</div>',
      opts: r.opts, a: r.a, diff: 1,
      why: 'Keuntungan mekanis sistem katrol bergerak sama dengan jumlah tali yang menyangga beban, yaitu ' + n + '. ' +
        'Gaya tarik = W / KM = ' + num(w) + ' / ' + n + ' = <b>' + num(f) + ' N</b>. ' +
        'Gaya sebesar ' + num(w) + ' N hanya berlaku bila tidak memakai katrol bergerak.'
    };
  }

  /* 4. resistor series / parallel */
  function resistor(rng) {
    var mode = pick(rng, ["seri", "paralel"]);
    var R1, R2, total;
    if (mode === "seri") {
      R1 = pick(rng, [10, 12, 15, 20, 22, 30, 47]);
      R2 = pick(rng, [8, 10, 15, 20, 22, 30, 33]);
      total = R1 + R2;
    } else {
      var pair = pick(rng, [[10, 10], [20, 20], [6, 12], [10, 15], [12, 24], [20, 30], [15, 30], [4, 12]]);
      R1 = pair[0]; R2 = pair[1];
      total = (R1 * R2) / (R1 + R2);
    }
    var V = pick(rng, [6, 9, 12, 24]);
    var I = V / total;
    var r = makeOpts(rng, num(Math.round(I * 1000) / 1000) + unit("A"), [num(V / R1) + unit("A"), num(V / R2) + unit("A"), num(V * total) + unit("A"), num(I * 2) + unit("A")]);
    var totalTxt = mode === "seri" ? "" + total : num(total);
    return {
      q: '<div class="qlead">Dua resistor ' + R1 + ' &Omega; dan ' + R2 + ' &Omega; disusun <b>' + mode + '</b> lalu dihubungkan pada sumber tegangan ' + V + ' V.</div>' +
        '<div class="qask">Berapa kuat arus total yang mengalir?</div>',
      opts: r.opts, a: r.a, diff: 2,
      why: (mode === "seri"
        ? 'Pada rangkaian seri hambatan dijumlahkan: R<sub>total</sub> = ' + R1 + ' + ' + R2 + ' = ' + totalTxt + ' &Omega;. '
        : 'Pada rangkaian paralel: 1/R<sub>total</sub> = 1/' + R1 + ' + 1/' + R2 + ', sehingga R<sub>total</sub> = (' + R1 + ' &times; ' + R2 + ')/(' + R1 + ' + ' + R2 + ') = ' + totalTxt + ' &Omega;. ') +
        'Hukum Ohm: I = V / R = ' + V + ' / ' + totalTxt + ' = <b>' + num(I) + ' A</b>.'
    };
  }

  /* 5. work, power, efficiency */
  function power(rng) {
    var kind = pick(rng, ["usaha", "daya", "efisiensi"]);
    if (kind === "usaha") {
      var F = pick(rng, [50, 80, 120, 150, 200]);
      var s = pick(rng, [4, 6, 8, 10, 12]);
      var W = F * s;
      var r = makeOpts(rng, num(W) + unit("J"), [num(F / s) + unit("J"), num(W * 2) + unit("J"), num(F + s) + unit("J"), num(W / 2) + unit("J")]);
      return {
        q: '<div class="qlead">Sebuah gaya ' + F + ' N mendorong benda sejauh ' + s + ' m searah dengan gaya tersebut.</div><div class="qask">Berapa usaha yang dilakukan?</div>',
        opts: r.opts, a: r.a, diff: 1,
        why: 'Usaha W = F &times; s = ' + F + ' &times; ' + s + ' = <b>' + num(W) + ' J</b>. Pembagian gaya dengan jarak bukan rumus usaha.'
      };
    }
    if (kind === "daya") {
      var W2 = pick(rng, [600, 900, 1200, 1800, 2400]);
      var t = pick(rng, [5, 10, 15, 20, 30]);
      var P = W2 / t;
      var r2 = makeOpts(rng, num(P) + unit("W"), [num(W2 * t) + unit("W"), num(t / W2) + unit("W"), num(P * 2) + unit("W"), num(W2) + unit("W")]);
      return {
        q: '<div class="qlead">Sebuah motor melakukan usaha ' + num(W2) + ' joule dalam waktu ' + t + ' sekon.</div><div class="qask">Berapa daya motor tersebut?</div>',
        opts: r2.opts, a: r2.a, diff: 1,
        why: 'Daya P = W / t = ' + num(W2) + ' / ' + t + ' = <b>' + num(P) + ' W</b>. Mengalikan usaha dengan waktu adalah kesalahan satuan yang umum.'
      };
    }
    var Pin = pick(rng, [500, 800, 1000, 1200, 1500]);
    var eff = pick(rng, [60, 70, 75, 80, 85, 90]);
    var Pout = Pin * eff / 100;
    var r3 = makeOpts(rng, num(Pout) + unit("W"), [num(Pin - Pout) + unit("W"), num(Pin) + unit("W"), num(Pin * 100 / eff) + unit("W"), num(Pout / 2) + unit("W")]);
    return {
      q: '<div class="qlead">Sebuah mesin menyerap daya ' + num(Pin) + ' W dan bekerja dengan efisiensi <b>' + eff + '%</b>.</div><div class="qask">Berapa daya keluaran (usaha berguna per sekon) mesin itu?</div>',
      opts: r3.opts, a: r3.a, diff: 2,
      why: '&eta; = (P<sub>keluar</sub>/P<sub>masuk</sub>) &times; 100%, maka P<sub>keluar</sub> = ' + eff + '% &times; ' + num(Pin) + ' = <b>' + num(Pout) + ' W</b>. ' +
        'Sisanya (' + num(Pin - Pout) + ' W) hilang sebagai panas dan gesekan.'
    };
  }

  /* 6. pressure / hydraulics */
  function pressure(rng) {
    var kind = pick(rng, ["padat", "hidrolik"]);
    if (kind === "padat") {
      var F = pick(rng, [100, 200, 300, 400, 600]);
      var A = pick(rng, [0.02, 0.04, 0.05, 0.1, 0.2]);
      var P = F / A;
      var r = makeOpts(rng, num(P) + unit("Pa"), [num(F * A) + unit("Pa"), num(P / 10) + unit("Pa"), num(P * 2) + unit("Pa"), num(F) + unit("Pa")]);
      return {
        q: '<div class="qlead">Gaya ' + F + ' N bekerja tegak lurus pada permukaan seluas ' + num(A) + ' m<sup>2</sup>.</div><div class="qask">Berapa tekanan yang timbul?</div>',
        opts: r.opts, a: r.a, diff: 1,
        why: 'Tekanan P = F / A = ' + F + ' / ' + num(A) + ' = <b>' + num(P) + ' Pa</b> (N/m<sup>2</sup>). Luas kecil menghasilkan tekanan besar.'
      };
    }
    var d1 = pick(rng, [2, 4, 5, 10]);
    var d2 = pick(rng, [10, 20, 25, 40]);
    var F1 = pick(rng, [20, 50, 100, 200]);
    var F2 = F1 * (d2 * d2) / (d1 * d1);
    var r2 = makeOpts(rng, num(F2) + unit("N"), [num(F1 * d2 / d1) + unit("N"), num(F1 * d1 / d2) + unit("N"), num(F1) + unit("N"), num(F2 / 2) + unit("N")]);
    return {
      q: '<div class="qlead">Pada dongkrak hidrolik, piston kecil berdiameter ' + d1 + ' cm diberi gaya ' + F1 + ' N. Piston besar berdiameter ' + d2 + ' cm.</div>' +
        '<div class="qask">Berapa gaya angkat yang dihasilkan piston besar?</div>',
      opts: r2.opts, a: r2.a, diff: 3,
      why: 'Hukum Pascal: tekanan sama di kedua sisi, F<sub>1</sub>/A<sub>1</sub> = F<sub>2</sub>/A<sub>2</sub>, dengan A sebanding d<sup>2</sup>. ' +
        'F<sub>2</sub> = ' + F1 + ' &times; (' + d2 + '/' + d1 + ')<sup>2</sup> = ' + F1 + ' &times; ' + num((d2 * d2) / (d1 * d1)) + ' = <b>' + num(F2) + ' N</b>. ' +
        'Memakai perbandingan diameter (bukan kuadratnya) memberi ' + num(F1 * d2 / d1) + ' N, itu pilihan jebakan.'
    };
  }

  /* 7. density / mass / volume */
  function density(rng) {
    var mat = pick(rng, [["baja", 7850], ["aluminium", 2700], ["tembaga", 8900], ["kuningan", 8500], ["besi cor", 7200]]);
    var Vcm3 = pick(rng, [100, 200, 250, 500, 1000]);
    var m = mat[1] * Vcm3 / 1000000; /* kg */
    var r = makeOpts(rng, num(m) + unit("kg"), [num(m * 10) + unit("kg"), num(m / 10) + unit("kg"), num(mat[1] * Vcm3 / 1000) + unit("kg"), num(m * 2) + unit("kg")]);
    return {
      q: '<div class="qlead">Massa jenis ' + mat[0] + ' adalah ' + num(mat[1]) + ' kg/m<sup>3</sup>. Sebuah benda ' + mat[0] + ' memiliki volume ' + num(Vcm3) + ' cm<sup>3</sup>.</div>' +
        '<div class="qask">Berapa massa benda tersebut?</div>',
      opts: r.opts, a: r.a, diff: 2,
      why: 'Volume harus diubah dulu: ' + num(Vcm3) + ' cm<sup>3</sup> = ' + num(Vcm3 / 1000000) + ' m<sup>3</sup>. ' +
        'm = &rho; &times; V = ' + num(mat[1]) + ' &times; ' + num(Vcm3 / 1000000) + ' = <b>' + num(m) + ' kg</b>. ' +
        'Kesalahan umum adalah lupa membagi 1.000.000 sehingga hasilnya 1000 kali terlalu besar.'
    };
  }

  /* 8. toleransi dimensi */
  function tolerance(rng) {
    var nom = pick(rng, [20, 25, 30, 40, 50, 60, 80]);
    var up = pick(rng, [0.1, 0.2, 0.3, 0.05]);
    var lo = pick(rng, [0.1, 0.2, 0.15, 0.05]);
    var max = nom + up, min = nom - lo, tol = max - min;
    var kind = pick(rng, ["toleransi", "maksimum", "minimum"]);
    if (kind === "maksimum") {
      var r1 = makeOpts(rng, num(max) + unit("mm"), [num(min) + unit("mm"), num(nom) + unit("mm"), num(tol) + unit("mm"), num(max + up) + unit("mm")]);
      return {
        q: '<div class="qlead">Sebuah komponen digambar dengan ukuran <b>' + nom + ' <sup>+' + num(up) + '</sup><sub>-' + num(lo) + '</sub> mm</b>.</div><div class="qask">Berapa ukuran maksimum yang masih diterima?</div>',
        opts: r1.opts, a: r1.a, diff: 1,
        why: 'Batas atas = ukuran nominal + penyimpangan atas = ' + nom + ' + ' + num(up) + ' = <b>' + num(max) + ' mm</b>. ' +
          'Batas bawahnya ' + num(min) + ' mm, dan selisih keduanya adalah toleransi ' + num(tol) + ' mm.'
      };
    }
    if (kind === "minimum") {
      var r2 = makeOpts(rng, num(min) + unit("mm"), [num(max) + unit("mm"), num(nom) + unit("mm"), num(tol) + unit("mm"), num(min - lo) + unit("mm")]);
      return {
        q: '<div class="qlead">Sebuah komponen digambar dengan ukuran <b>' + nom + ' <sup>+' + num(up) + '</sup><sub>-' + num(lo) + '</sub> mm</b>.</div><div class="qask">Berapa ukuran minimum yang masih diterima?</div>',
        opts: r2.opts, a: r2.a, diff: 1,
        why: 'Batas bawah = ukuran nominal &minus; penyimpangan bawah = ' + nom + ' &minus; ' + num(lo) + ' = <b>' + num(min) + ' mm</b>. ' +
          'Batas atasnya ' + num(max) + ' mm; daerah yang diizinkan adalah ' + num(min) + ' sampai ' + num(max) + ' mm.'
      };
    }
    var r3 = makeOpts(rng, num(tol) + unit("mm"), [num(up) + unit("mm"), num(lo) + unit("mm"), num(nom) + unit("mm"), num(tol * 2) + unit("mm")]);
    return {
      q: '<div class="qlead">Sebuah komponen digambar dengan ukuran <b>' + nom + ' <sup>+' + num(up) + '</sup><sub>-' + num(lo) + '</sub> mm</b>.</div><div class="qask">Berapa nilai toleransi (rentang ukuran yang diizinkan)?</div>',
      opts: r3.opts, a: r3.a, diff: 2,
      why: 'Toleransi = batas atas &minus; batas bawah = (' + nom + ' + ' + num(up) + ') &minus; (' + nom + ' &minus; ' + num(lo) + ') = ' + num(max) + ' &minus; ' + num(min) + ' = <b>' + num(tol) + ' mm</b>. ' +
        'Toleransi sama dengan jumlah kedua penyimpangan, bukan salah satunya saja.'
    };
  }

  /* 9. CNC: spindle speed, feed rate, machining time */
  function cnc(rng) {
    var kind = pick(rng, ["rpm", "feed", "waktu"]);
    if (kind === "rpm") {
      var D = pick(rng, [10, 12, 16, 20, 25, 32]);
      var Vc = pick(rng, [60, 80, 100, 120, 150]);
      var n = Math.round((1000 * Vc) / (Math.PI * D));
      var r = makeOpts(rng, num(n) + unit("rpm"), [num(Math.round((Math.PI * D * Vc) / 1000)) + unit("rpm"), num(n * 2) + unit("rpm"), num(Math.round(n / 2)) + unit("rpm"), num(Math.round((1000 * Vc) / D)) + unit("rpm")]);
      return {
        q: '<div class="qlead">Pemesinan dilakukan pada baja dengan kecepatan potong ' + Vc + ' m/menit menggunakan end mill diameter ' + D + ' mm.</div>' +
          '<div class="qask">Berapa putaran spindel (n) yang harus disetel?</div>',
        opts: r.opts, a: r.a, diff: 3,
        why: 'Rumus kecepatan potong: V<sub>c</sub> = (&pi; &times; D &times; n) / 1000, maka n = (1000 &times; V<sub>c</sub>) / (&pi; &times; D). ' +
          'n = (1000 &times; ' + Vc + ') / (3,14 &times; ' + D + ') &asymp; <b>' + num(n) + ' rpm</b>. ' +
          'Pilihan ' + num(Math.round((1000 * Vc) / D)) + ' rpm muncul bila &pi; terlupakan.'
      };
    }
    if (kind === "feed") {
      var n2 = pick(rng, [500, 800, 1000, 1200, 1500]);
      var fz = pick(rng, [0.05, 0.08, 0.1, 0.12]);
      var z = pick(rng, [2, 3, 4, 6]);
      var vf = n2 * fz * z;
      var r2 = makeOpts(rng, num(vf) + unit("mm/menit"), [num(n2 * fz) + unit("mm/menit"), num(fz * z) + unit("mm/menit"), num(vf * 2) + unit("mm/menit"), num(vf / z) + unit("mm/menit")]);
      return {
        q: '<div class="qlead">Sebuah cutter dengan <b>' + z + ' mata potong (flute)</b> berputar ' + num(n2) + ' rpm. Feed per tooth ditetapkan ' + num(fz) + ' mm.</div>' +
          '<div class="qask">Berapa kecepatan pemakanan (feed rate) meja mesin?</div>',
        opts: r2.opts, a: r2.a, diff: 3,
        why: 'Feed rate v<sub>f</sub> = n &times; f<sub>z</sub> &times; z = ' + num(n2) + ' &times; ' + num(fz) + ' &times; ' + z + ' = <b>' + num(vf) + ' mm/menit</b>. ' +
          'Jika jumlah flute diabaikan, hasilnya hanya ' + num(n2 * fz) + ' mm/menit sehingga pahat bergerak terlalu lambat.'
      };
    }
    var L = pick(rng, [120, 150, 200, 240, 300]);
    var vf2 = pick(rng, [200, 250, 300, 400, 500]);
    var t = L / vf2 * 60;
    var r3 = makeOpts(rng, num(t) + unit("detik"), [num(L / vf2) + unit("detik"), num(L * vf2 / 60) + unit("detik"), num(t * 2) + unit("detik"), num(L) + unit("detik")]);
    return {
      q: '<div class="qlead">Panjang lintasan pemesinan ' + L + ' mm dikerjakan dengan feed rate ' + num(vf2) + ' mm/menit.</div>' +
        '<div class="qask">Berapa waktu pemesinan (cutting time) yang dibutuhkan?</div>',
      opts: r3.opts, a: r3.a, diff: 2,
      why: 'Waktu = panjang lintasan / feed rate = ' + L + ' / ' + num(vf2) + ' menit = ' + num(L / vf2) + ' menit = <b>' + num(t) + ' detik</b> ' +
        '(dikalikan 60 untuk mengubah menit ke detik). Lupa mengalikan 60 memberi jawaban ' + num(L / vf2) + ' detik.'
    };
  }

  /* 10. tegangan / stress */
  function stress(rng) {
    var F = pick(rng, [2000, 4000, 5000, 8000, 10000, 12000]);
    var d = pick(rng, [5, 8, 10, 12, 16]);
    var A = Math.PI * d * d / 4;
    var sig = F / A;
    var r = makeOpts(rng, num(Math.round(sig * 10) / 10) + unit("N/mm²"), [num(Math.round(F / d * 10) / 10) + unit("N/mm²"), num(Math.round(sig * 2 * 10) / 10) + unit("N/mm²"), num(Math.round(A * 10) / 10) + unit("N/mm²"), num(Math.round(sig / 2 * 10) / 10) + unit("N/mm²")]);
    return {
      q: '<div class="qlead">Sebuah batang silindris berdiameter ' + d + ' mm menahan gaya tarik ' + num(F) + ' N.</div>' +
        '<div class="qask">Berapa tegangan tarik yang terjadi pada batang?</div>',
      opts: r.opts, a: r.a, diff: 3,
      why: 'Luas penampang A = &pi;d<sup>2</sup>/4 = 3,14 &times; ' + d + '<sup>2</sup>/4 &asymp; ' + num(Math.round(A * 10) / 10) + ' mm<sup>2</sup>. ' +
        'Tegangan &sigma; = F/A = ' + num(F) + ' / ' + num(Math.round(A * 10) / 10) + ' &asymp; <b>' + num(Math.round(sig * 10) / 10) + ' N/mm² (= MPa)</b>. ' +
        'Membagi gaya dengan diameter saja (bukan luas) adalah kesalahan yang paling sering terjadi.'
    };
  }

  /* 11. konversi satuan teknik */
  function convert(rng) {
    var kind = pick(rng, ["inci", "mpa", "berat"]);
    if (kind === "inci") {
      var inch = pick(rng, [0.25, 0.5, 0.75, 1, 1.5, 2, 0.375]);
      var mm = inch * 25.4;
      var r = makeOpts(rng, num(mm) + unit("mm"), [num(inch * 2.54) + unit("mm"), num(inch * 10) + unit("mm"), num(inch * 25) + unit("mm"), num(mm / 2) + unit("mm")]);
      return {
        q: '<div class="qlead">Sebuah baut berukuran <b>' + num(inch) + ' inci</b>.</div><div class="qask">Berapa ukurannya dalam milimeter?</div>',
        opts: r.opts, a: r.a, diff: 1,
        why: '1 inci = 25,4 mm, maka ' + num(inch) + ' &times; 25,4 = <b>' + num(mm) + ' mm</b>. Memakai 2,54 (faktor cm) memberi ' + num(inch * 2.54) + ' mm yang salah satuan.'
      };
    }
    if (kind === "mpa") {
      var mpa = pick(rng, [100, 200, 235, 300, 400, 600]);
      var r2 = makeOpts(rng, num(mpa) + unit("N/mm²"), [num(mpa * 1000) + unit("N/mm²"), num(mpa / 10) + unit("N/mm²"), num(mpa * 10) + unit("N/mm²"), num(mpa * 2) + unit("N/mm²")]);
      return {
        q: '<div class="qlead">Kekuatan luluh (yield strength) sebuah baja dituliskan <b>' + num(mpa) + ' MPa</b>.</div><div class="qask">Nilai itu sama dengan ...</div>',
        opts: r2.opts, a: r2.a, diff: 2,
        why: '1 MPa = 1 N/mm<sup>2</sup> (karena 1 N/m<sup>2</sup> = 10<sup>-6</sup> N/mm<sup>2</sup>), jadi ' + num(mpa) + ' MPa = <b>' + num(mpa) + ' N/mm<sup>2</sup></b>. ' +
          'Nilai ' + num(mpa * 1000) + ' adalah konversi ke kPa, bukan N/mm<sup>2</sup>.'
      };
    }
    var kg = pick(rng, [5, 10, 20, 25, 50, 100]);
    var g = 9.81;
    var N = kg * g;
    var r3 = makeOpts(rng, num(Math.round(N * 10) / 10) + unit("N"), [num(kg) + unit("N"), num(Math.round(kg / g * 10) / 10) + unit("N"), num(Math.round(N * 2 * 10) / 10) + unit("N"), num(Math.round(kg * 10 * 10) / 10) + unit("N")]);
    return {
      q: '<div class="qlead">Sebuah komponen bermassa ' + num(kg) + ' kg digantung pada sebuah tali. Gunakan g = 9,81 m/s<sup>2</sup>.</div><div class="qask">Berapa gaya berat komponen tersebut?</div>',
      opts: r3.opts, a: r3.a, diff: 1,
      why: 'Gaya berat w = m &times; g = ' + num(kg) + ' &times; 9,81 = <b>' + num(Math.round(N * 10) / 10) + ' N</b>. ' +
        'Massa (kg) bukan gaya (N); menuliskan ' + num(kg) + ' N berarti mencampur massa dengan berat.'
    };
  }

  /* 12. persentase / rasio produksi */
  function production(rng) {
    var total = pick(rng, [120, 200, 240, 300, 400, 500, 800]);
    var pct = pick(rng, [5, 8, 10, 12, 15, 20, 25]);
    var defect = total * pct / 100;
    var good = total - defect;
    var kind = pick(rng, ["cacat", "baik", "naik"]);
    if (kind === "cacat") {
      var r = makeOpts(rng, num(defect) + unit("unit"), [num(total - defect) + unit("unit"), num(pct) + unit("unit"), num(defect * 2) + unit("unit"), num(total / pct) + unit("unit")]);
      return {
        q: '<div class="qlead">Dari ' + num(total) + ' unit produk yang diperiksa, <b>' + pct + '%</b> dinyatakan cacat.</div><div class="qask">Berapa unit yang cacat?</div>',
        opts: r.opts, a: r.a, diff: 1,
        why: 'Cacat = ' + pct + '% &times; ' + num(total) + ' = (' + pct + '/100) &times; ' + num(total) + ' = <b>' + num(defect) + ' unit</b>. ' +
          'Produk yang lolos adalah ' + num(good) + ' unit, bukan jawaban yang ditanyakan.'
      };
    }
    if (kind === "baik") {
      var r2 = makeOpts(rng, num(good) + unit("unit"), [num(defect) + unit("unit"), num(total) + unit("unit"), num(total * (100 - pct) / 1000) + unit("unit"), num(good / 2) + unit("unit")]);
      return {
        q: '<div class="qlead">Dari ' + num(total) + ' unit produk yang diperiksa, <b>' + pct + '%</b> dinyatakan cacat.</div><div class="qask">Berapa unit yang lolos pemeriksaan?</div>',
        opts: r2.opts, a: r2.a, diff: 1,
        why: 'Bagian cacat = ' + num(defect) + ' unit, sehingga yang lolos = ' + num(total) + ' &minus; ' + num(defect) + ' = <b>' + num(good) + ' unit</b> ' +
          '(atau langsung ' + (100 - pct) + '% &times; ' + num(total) + ').'
      };
    }
    var old = pick(rng, [1200, 1500, 2000, 2500]);
    var rise = pick(rng, [10, 15, 20, 25, 30]);
    var now = old * (1 + rise / 100);
    var r3 = makeOpts(rng, num(now) + unit("unit"), [num(old * rise / 100) + unit("unit"), num(old + rise) + unit("unit"), num(now * 2) + unit("unit"), num(old) + unit("unit")]);
    return {
      q: '<div class="qlead">Kapasitas produksi bulan lalu ' + num(old) + ' unit. Bulan ini naik <b>' + rise + '%</b>.</div><div class="qask">Berapa kapasitas produksi bulan ini?</div>',
      opts: r3.opts, a: r3.a, diff: 2,
      why: 'Kenaikan = ' + rise + '% &times; ' + num(old) + ' = ' + num(old * rise / 100) + ' unit, sehingga bulan ini = ' + num(old) + ' + ' + num(old * rise / 100) + ' = <b>' + num(now) + ' unit</b>. ' +
        'Menjawab ' + num(old * rise / 100) + ' berarti berhenti di besar kenaikannya, belum pada total akhir.'
    };
  }

  /* =========================================================
     T3 - TES POTENSI AKADEMIK
     ========================================================= */

  /* deret angka */
  function series(rng) {
    var kind = pick(rng, ["aritmetika", "geometri", "kuadrat", "fibonacci", "selang-seling"]);
    var seq = [], ans, why, step, i;
    if (kind === "aritmetika") {
      var a0 = ri(rng, 3, 20), d = pick(rng, [3, 4, 5, 6, 7, 8, 9, 12]);
      for (i = 0; i < 5; i++) seq.push(a0 + i * d);
      ans = a0 + 5 * d;
      why = 'Selisih antar suku tetap <b>+' + d + '</b>, jadi suku berikutnya = ' + seq[4] + ' + ' + d + ' = <b>' + ans + '</b>.';
    } else if (kind === "geometri") {
      var g0 = pick(rng, [2, 3, 4, 5]), r0 = pick(rng, [2, 3]);
      for (i = 0; i < 4; i++) seq.push(g0 * Math.pow(r0, i));
      ans = g0 * Math.pow(r0, 4);
      why = 'Setiap suku dikali <b>' + r0 + '</b> dari suku sebelumnya, jadi suku berikutnya = ' + seq[3] + ' &times; ' + r0 + ' = <b>' + ans + '</b>.';
    } else if (kind === "kuadrat") {
      var p0 = ri(rng, 1, 5), p1 = p0 + 1, p2 = p1 + 1, p3 = p2 + 1, p4 = p3 + 1;
      seq = [p0 * p0, p1 * p1, p2 * p2, p3 * p3, p4 * p4];
      ans = (p4 + 1) * (p4 + 1);
      why = 'Bilangan-bilangan ini adalah kuadrat: ' + p0 + '<sup>2</sup>, ' + p1 + '<sup>2</sup>, ' + p2 + '<sup>2</sup>, ' + p3 + '<sup>2</sup>, ' + p4 + '<sup>2</sup>. Suku berikutnya ' + (p4 + 1) + '<sup>2</sup> = <b>' + ans + '</b>.';
    } else if (kind === "fibonacci") {
      var f1 = ri(rng, 1, 5), f2 = f1 + ri(rng, 1, 4);
      seq = [f1, f2];
      for (i = 2; i < 5; i++) seq.push(seq[i - 1] + seq[i - 2]);
      ans = seq[4] + seq[3];
      why = 'Setiap suku adalah jumlah dua suku sebelumnya (' + seq[3] + ' + ' + seq[4] + '), jadi suku berikutnya = <b>' + ans + '</b>.';
    } else {
      var s0 = ri(rng, 5, 30), k1 = pick(rng, [2, 3, 4]), k2 = pick(rng, [5, 6, 7]);
      for (i = 0; i < 4; i++) seq.push(s0 + i * k1);
      /* inject second interleaved: build 6 terms alternating +k1 then +k2 */
      seq = [s0, s0 + k1, s0 + k1 + k2, s0 + 2 * k1 + k2, s0 + 2 * k1 + 2 * k2, s0 + 3 * k1 + 2 * k2];
      ans = s0 + 3 * k1 + 3 * k2;
      why = 'Pola berselang: suku ke-1, ke-3, ke-5 bertambah ' + k1 + ', sedangkan suku ke-2, ke-4, ke-6 bertambah ' + k2 + '. Suku ke-7 melanjutkan kelompok ganjil: ' + seq[5] + ' + ' + k1 + ' = <b>' + ans + '</b>.';
    }
    var wrongs = [String(ans + 1), String(ans - 1), String(ans + (seq[4] - seq[3])), String(ans * 2)];
    var r = makeOpts(rng, String(ans), wrongs);
    return {
      q: '<div class="qlead">Perhatikan deret bilangan berikut.</div><div class="seqline"><b>' + seq.join(", ") + ", ...</b></div><div class=\"qask\">Bilangan manakah yang melanjutkan deret tersebut?</div>",
      opts: r.opts, a: r.a, diff: kind === "selang-seling" ? 3 : 1, why: why
    };
  }

  /* perbandingan / rasio */
  function ratio(rng) {
    var a = pick(rng, [2, 3, 4, 5]);
    var b = a + pick(rng, [1, 2, 3]);
    var k = pick(rng, [6, 8, 10, 12, 15]);
    var A = a * k, B = b * k, tot = A + B;
    var ask = pick(rng, ["selisih", "total", "A"]);
    if (ask === "selisih") {
      var r = makeOpts(rng, num(B - A), [num(tot), num(a + b), num(B), num(k)]);
      return {
        q: '<div class="qlead">Uang Ali dan Budi berbanding <b>' + a + ' : ' + b + '</b>. Jumlah uang Budi Rp' + num(B) + '.000.</div><div class="qask">Berapa selisih uang mereka (dalam ribu rupiah)?</div>',
        opts: r.opts, a: r.a, diff: 2,
        why: 'Faktor pengali = ' + B + ' : ' + b + ' = ' + k + ', sehingga uang Ali = ' + a + ' &times; ' + k + ' = ' + A + '. Selisih = ' + B + ' &minus; ' + A + ' = <b>' + num(B - A) + '</b> ribu rupiah. ' +
          'Menjumlahkan kedua bagian (' + num(tot) + ') menjawab pertanyaan yang tidak diminta.'
      };
    }
    if (ask === "total") {
      var r2 = makeOpts(rng, num(tot), [num(B - A), num(A), num(a + b), num(B)]);
      return {
        q: '<div class="qlead">Perbandingan kelereng Ani dan Bayu adalah <b>' + a + ' : ' + b + '</b>. Kelereng Ani ' + A + ' butir.</div><div class="qask">Berapa jumlah kelereng mereka seluruhnya?</div>',
        opts: r2.opts, a: r2.a, diff: 2,
        why: 'Satu bagian senilai ' + A + ' : ' + a + ' = ' + k + ', maka kelereng Bayu = ' + b + ' &times; ' + k + ' = ' + B + '. Jumlah = ' + A + ' + ' + B + ' = <b>' + num(tot) + ' butir</b>.'
      };
    }
    var r3 = makeOpts(rng, num(A), [num(B), num(tot), num(k), num(B - A)]);
    return {
      q: '<div class="qlead">Jumlah uang Candra dan Dodi Rp' + num(tot) + '.000 dengan perbandingan <b>' + a + ' : ' + b + '</b>.</div><div class="qask">Berapa uang Candra (dalam ribu rupiah)?</div>',
      opts: r3.opts, a: r3.a, diff: 1,
      why: 'Jumlah bagian = ' + a + ' + ' + b + ' = ' + (a + b) + '. Satu bagian = ' + tot + ' : ' + (a + b) + ' = ' + k + '. Uang Candra = ' + a + ' &times; ' + k + ' = <b>' + num(A) + '</b> ribu rupiah.'
    };
  }

  /* persen: diskon / bunga */
  function percent(rng) {
    var kind = pick(rng, ["diskon", "bunga", "kenaikan"]);
    if (kind === "diskon") {
      var price = pick(rng, [120000, 150000, 200000, 240000, 350000, 480000]);
      var d1 = pick(rng, [10, 15, 20, 25]);
      var d2 = pick(rng, [5, 10]);
      var final = price * (1 - d1 / 100) * (1 - d2 / 100);
      var naive = price * (1 - (d1 + d2) / 100);
      var r = makeOpts(rng, "Rp" + num(final), ["Rp" + num(naive), "Rp" + num(price * (1 - d1 / 100)), "Rp" + num(price - d1 - d2), "Rp" + num(final / 2)]);
      return {
        q: '<div class="qlead">Sebuah komponen berharga Rp' + num(price) + ' mendapat diskon <b>' + d1 + '%</b>, lalu diskon tambahan <b>' + d2 + '%</b> dari harga setelah diskon pertama.</div>' +
          '<div class="qask">Berapa harga akhir yang dibayar?</div>',
        opts: r.opts, a: r.a, diff: 3,
        why: 'Diskon berurutan tidak dijumlahkan. Harga setelah diskon pertama = ' + num(price) + ' &times; ' + (100 - d1) + '% = Rp' + num(price * (1 - d1 / 100)) + '. ' +
          'Setelah diskon kedua = Rp' + num(price * (1 - d1 / 100)) + ' &times; ' + (100 - d2) + '% = <b>Rp' + num(final) + '</b>. ' +
          'Menjumlahkan diskon menjadi ' + (d1 + d2) + '% memberi Rp' + num(naive) + ', itu jebakan.'
      };
    }
    if (kind === "bunga") {
      var M = pick(rng, [2000000, 3000000, 4000000, 5000000]);
      var pct = pick(rng, [4, 5, 6, 8, 10]);
      var yr = pick(rng, [3, 4, 5]);
      var bunga = M * pct / 100 * yr;
      var r2 = makeOpts(rng, "Rp" + num(bunga), ["Rp" + num(M * pct / 100), "Rp" + num(M + bunga), "Rp" + num(bunga / yr), "Rp" + num(M)]);
      return {
        q: '<div class="qlead">Uang Rp' + num(M) + ' ditabung dengan bunga tunggal <b>' + pct + '% per tahun</b> selama ' + yr + ' tahun.</div><div class="qask">Berapa total bunga yang diperoleh?</div>',
        opts: r2.opts, a: r2.a, diff: 2,
        why: 'Bunga tunggal = M &times; i &times; t = ' + num(M) + ' &times; ' + pct + '% &times; ' + yr + ' = <b>Rp' + num(bunga) + '</b>. ' +
          'Nilai Rp' + num(M + bunga) + ' adalah saldo akhir (pokok + bunga), bukan bunganya saja.'
      };
    }
    var awal = pick(rng, [40000, 50000, 60000, 80000]);
    var naik = pick(rng, [10, 12, 15, 20, 25]);
    var akhir = awal * (1 + naik / 100);
    var r3 = makeOpts(rng, "Rp" + num(akhir), ["Rp" + num(awal * naik / 100), "Rp" + num(awal + naik), "Rp" + num(awal), "Rp" + num(akhir * 2)]);
    return {
      q: '<div class="qlead">Harga sebuah jasa naik <b>' + naik + '%</b> dari Rp' + num(awal) + '.</div><div class="qask">Berapa harga baru jasa tersebut?</div>',
      opts: r3.opts, a: r3.a, diff: 1,
      why: 'Kenaikan = ' + naik + '% &times; ' + num(awal) + ' = Rp' + num(awal * naik / 100) + '. Harga baru = ' + num(awal) + ' + ' + num(awal * naik / 100) + ' = <b>Rp' + num(akhir) + '</b>.'
    };
  }

  /* kerja bersama */
  function workRate(rng) {
    var pairs = [];
    for (var pa = 2; pa <= 12; pa++) {
      for (var pb = pa + 1; pb <= 20; pb++) pairs.push([pa, pb]);
    }
    var p = pick(rng, pairs);
    var a = p[0], b = p[1];
    var noun = pick(rng, ["order produksi", "proyek perakitan", "pekerjaan finishing", "pesanan komponen", "pekerjaan pengepakan"]);
    var t = (a * b) / (a + b);
    var r = makeOpts(rng, num(Math.round(t * 100) / 100) + unit("hari"), [num(a + b) + unit("hari"), num(Math.round((a + b) / 2 * 100) / 100) + unit("hari"), num(Math.round(t * 2 * 100) / 100) + unit("hari"), num(Math.max(a, b)) + unit("hari")]);
    return {
      q: '<div class="qlead">Pekerja A dapat menyelesaikan sebuah ' + noun + ' dalam <b>' + a + ' hari</b>, pekerja B dalam <b>' + b + ' hari</b>. Keduanya bekerja bersama dengan kecepatan masing-masing tetap.</div>' +
        '<div class="qask">Dalam berapa hari ' + noun + ' itu selesai?</div>',
      opts: r.opts, a: r.a, diff: 3,
      why: 'Laju gabungan = 1/' + a + ' + 1/' + b + ' = ' + num(Math.round((1 / a + 1 / b) * 1000) / 1000) + ' bagian per hari. ' +
        'Waktu = 1 / laju = (' + a + ' &times; ' + b + ')/(' + a + ' + ' + b + ') = <b>' + num(Math.round(t * 100) / 100) + ' hari</b>. ' +
        'Hasilnya selalu lebih cepat dari pekerja tercepat (' + Math.min(a, b) + ' hari), jadi pilihan ' + num(a + b) + ' hari mustahil.'
    };
  }

  /* kecepatan */
  function speed(rng) {
    var kind = pick(rng, ["jarak", "waktu", "kecepatan", "berpapasan"]);
    if (kind === "jarak") {
      var v = pick(rng, [40, 45, 50, 60, 72, 80]);
      var t = pick(rng, [1.5, 2, 2.5, 3, 4]);
      var s = v * t;
      var r = makeOpts(rng, num(s) + unit("km"), [num(v / t) + unit("km"), num(v + t) + unit("km"), num(s * 2) + unit("km"), num(s / 2) + unit("km")]);
      return {
        q: '<div class="qlead">Sebuah kendaraan melaju dengan kecepatan tetap ' + v + ' km/jam selama ' + num(t) + ' jam.</div><div class="qask">Berapa jarak yang ditempuh?</div>',
        opts: r.opts, a: r.a, diff: 1,
        why: 'Jarak s = v &times; t = ' + v + ' &times; ' + num(t) + ' = <b>' + num(s) + ' km</b>. Membagi kecepatan dengan waktu bukan rumus jarak.'
      };
    }
    if (kind === "waktu") {
      var s2 = pick(rng, [120, 150, 180, 240, 300]);
      var v2 = pick(rng, [40, 50, 60, 75, 80]);
      var t2 = s2 / v2;
      var r2 = makeOpts(rng, num(t2) + unit("jam"), [num(s2 * v2) + unit("jam"), num(t2 * 2) + unit("jam"), num(Math.round(t2 * 60)) + unit("jam"), num(t2 / 2) + unit("jam")]);
      return {
        q: '<div class="qlead">Jarak dua kota ' + s2 + ' km ditempuh dengan kecepatan rata-rata ' + v2 + ' km/jam.</div><div class="qask">Berapa lama perjalanan itu?</div>',
        opts: r2.opts, a: r2.a, diff: 1,
        why: 'Waktu t = s / v = ' + s2 + ' / ' + v2 + ' = <b>' + num(t2) + ' jam</b>. Pilihan ' + num(Math.round(t2 * 60)) + ' adalah hasil mengubah ke menit, bukan jam.'
      };
    }
    if (kind === "kecepatan") {
      var s3 = pick(rng, [90, 150, 210, 240, 360]);
      var t3 = pick(rng, [1.5, 2, 2.5, 3]);
      var v3 = s3 / t3;
      var r3 = makeOpts(rng, num(v3) + unit("km/jam"), [num(s3 * t3) + unit("km/jam"), num(Math.round(v3 / 2)) + unit("km/jam"), num(Math.round(v3 * 2)) + unit("km/jam"), num(t3) + unit("km/jam")]);
      return {
        q: '<div class="qlead">Sebuah bus menempuh ' + s3 + ' km dalam ' + num(t3) + ' jam tanpa berhenti.</div><div class="qask">Berapa kecepatan rata-ratanya?</div>',
        opts: r3.opts, a: r3.a, diff: 1,
        why: 'v = s / t = ' + s3 + ' / ' + num(t3) + ' = <b>' + num(v3) + ' km/jam</b>.'
      };
    }
    var jarak = pick(rng, [180, 240, 300, 360]);
    var va = pick(rng, [40, 50, 60]);
    var vb = pick(rng, [30, 40, 50, 60, 80]);
    var t4 = jarak / (va + vb);
    var r4 = makeOpts(rng, num(Math.round(t4 * 100) / 100) + unit("jam"), [num(jarak / Math.abs(va - vb)) + unit("jam"), num(Math.round(t4 * 2 * 100) / 100) + unit("jam"), num(va + vb) + unit("jam"), num(jarak / va) + unit("jam")]);
    return {
      q: '<div class="qlead">Dua kendaraan berangkat bersamaan dari dua kota yang berjarak ' + jarak + ' km dan bergerak saling mendekat dengan kecepatan ' + va + ' km/jam dan ' + vb + ' km/jam.</div>' +
        '<div class="qask">Setelah berapa jam keduanya berpapasan?</div>',
      opts: r4.opts, a: r4.a, diff: 2,
      why: 'Kecepatan saling mendekat = ' + va + ' + ' + vb + ' = ' + (va + vb) + ' km/jam. Waktu papasan = jarak / kecepatan gabungan = ' + jarak + ' / ' + (va + vb) + ' = <b>' + num(Math.round(t4 * 100) / 100) + ' jam</b>. ' +
        'Mengurangkan kecepatan berlaku untuk kendaraan searah (menyusul), bukan berpapasan.'
    };
  }

  /* peluang / kombinatorika */
  function prob(rng) {
    var kind = pick(rng, ["peluang", "kombinasi", "permutasi"]);
    if (kind === "peluang") {
      var r = pick(rng, [3, 4, 5, 6, 8]);
      var b = pick(rng, [4, 5, 7, 9]);
      var tot = r + b;
      var p = r / tot;
      var r1 = makeOpts(rng, num(Math.round(p * 1000) / 1000), [num(Math.round(b / tot * 1000) / 1000), num(Math.round(r / b * 1000) / 1000), num(Math.round(1 / tot * 1000) / 1000), num(Math.round(p * 2 * 1000) / 1000)]);
      return {
        q: '<div class="qlead">Sebuah kotak berisi <b>' + r + ' bola merah</b> dan <b>' + b + ' bola biru</b>. Satu bola diambil secara acak.</div><div class="qask">Berapa peluang terambil bola merah?</div>',
        opts: r1.opts, a: r1.a, diff: 2,
        why: 'Jumlah bola = ' + r + ' + ' + b + ' = ' + tot + '. Peluang = kejadian yang diharapkan / seluruh kemungkinan = ' + r + '/' + tot + ' &asymp; <b>' + num(Math.round(p * 1000) / 1000) + '</b>. ' +
          'Nilai ' + num(Math.round(b / tot * 1000) / 1000) + ' adalah peluang bola biru, dan ' + num(Math.round(r / b * 1000) / 1000) + ' adalah perbandingan jumlah (bukan peluang).'
      };
    }
    if (kind === "kombinasi") {
      var n = pick(rng, [5, 6, 7, 8]);
      var k = pick(rng, [2, 3]);
      function fact(x) { var f = 1; for (var i = 2; i <= x; i++) f *= i; return f; }
      var C = fact(n) / (fact(k) * fact(n - k));
      var P = fact(n) / fact(n - k);
      var r2 = makeOpts(rng, num(C), [num(P), num(n * k), num(C * 2), num(n + k)]);
      return {
        q: '<div class="qlead">Dari <b>' + n + ' siswa</b> akan dipilih <b>' + k + ' orang</b> untuk sebuah tim. Urutan pemilihan tidak diperhatikan.</div><div class="qask">Berapa banyak susunan tim yang mungkin?</div>',
        opts: r2.opts, a: r2.a, diff: 3,
        why: 'Karena urutan tidak diperhatikan, gunakan kombinasi C(' + n + ',' + k + ') = ' + n + '!/(' + k + '!&middot;' + (n - k) + '!) = <b>' + num(C) + '</b>. ' +
          'Nilai ' + num(P) + ' adalah permutasi (urutan diperhatikan), sehingga terlalu besar untuk kasus ini.'
      };
    }
    var n3 = pick(rng, [4, 5, 6]);
    var k3 = pick(rng, [2, 3]);
    function fact2(x) { var f = 1; for (var i = 2; i <= x; i++) f *= i; return f; }
    var P3 = fact2(n3) / fact2(n3 - k3);
    var C3 = fact2(n3) / (fact2(k3) * fact2(n3 - k3));
    var r3 = makeOpts(rng, num(P3), [num(C3), num(n3 + k3), num(P3 * 2), num(n3 * k3)]);
    return {
      q: '<div class="qlead">Tiga dari <b>' + n3 + ' peserta</b> akan dipilih sebagai ketua, sekretaris, dan bendahara.</div><div class="qask">Berapa banyak susunan pengurus yang mungkin?</div>',
      opts: r3.opts, a: r3.a, diff: 3,
      why: 'Jabatan berbeda sehingga urutan diperhatikan: permutasi P(' + n3 + ',' + k3 + ') = ' + n3 + '!/(' + (n3 - k3) + ')! = <b>' + num(P3) + '</b>. ' +
        'Kombinasi ' + num(C3) + ' hanya berlaku bila ketiga orang dianggap setara tanpa jabatan.'
    };
  }

  /* rata-rata / statistik */
  function stat(rng) {
    var kind = pick(rng, ["rata2", "hilang", "median"]);
    if (kind === "rata2") {
      var arr = [], n = 5;
      for (var i = 0; i < n; i++) arr.push(ri(rng, 60, 95));
      var sum = arr.reduce(function (a, b) { return a + b; }, 0);
      var avg = sum / n;
      var r = makeOpts(rng, num(Math.round(avg * 100) / 100), [num(sum), num(Math.round(sum / (n - 1) * 100) / 100), num(Math.round(avg * 2 * 100) / 100), num(Math.max.apply(null, arr))]);
      return {
        q: '<div class="qlead">Nilai lima siswa: <b>' + arr.join(", ") + '</b>.</div><div class="qask">Berapa nilai rata-ratanya?</div>',
        opts: r.opts, a: r.a, diff: 1,
        why: 'Jumlah nilai = ' + sum + '. Rata-rata = ' + sum + ' / 5 = <b>' + num(Math.round(avg * 100) / 100) + '</b>. ' +
          'Menuliskan ' + num(sum) + ' berarti berhenti di jumlah, belum dibagi banyak data.'
      };
    }
    if (kind === "hilang") {
      var target = pick(rng, [70, 72, 75, 78, 80]);
      var n4 = pick(rng, [4, 5, 6]);
      var known = [];
      var need = target * n4;
      var partial = 0;
      for (var j = 0; j < n4 - 1; j++) { var v = ri(rng, 60, 88); known.push(v); partial += v; }
      var last = need - partial;
      var r2 = makeOpts(rng, num(last), [num(target), num(Math.round(partial / (n4 - 1))), num(last + 10), num(need)]);
      return {
        q: '<div class="qlead">Rata-rata nilai <b>' + n4 + ' siswa</b> adalah ' + target + '. Nilai ' + (n4 - 1) + ' siswa di antaranya: <b>' + known.join(", ") + '</b>.</div>' +
          '<div class="qask">Berapa nilai siswa yang terakhir?</div>',
        opts: r2.opts, a: r2.a, diff: 3,
        why: 'Jumlah seluruh nilai harus = ' + target + ' &times; ' + n4 + ' = ' + need + '. Jumlah nilai yang diketahui = ' + partial + '. ' +
          'Nilai terakhir = ' + need + ' &minus; ' + partial + ' = <b>' + num(last) + '</b>.'
      };
    }
    var data = [], n5 = 7;
    for (var k = 0; k < n5; k++) data.push(ri(rng, 40, 90));
    var sorted = data.slice().sort(function (a, b) { return a - b; });
    var med = sorted[3];
    var r3 = makeOpts(rng, num(med), [num(sorted[0]), num(sorted[6]), num(Math.round((sorted[2] + sorted[4]) / 2)), num(Math.round(data.reduce(function (a, b) { return a + b; }, 0) / n5))]);
    return {
      q: '<div class="qlead">Data hasil pengukuran: <b>' + data.join(", ") + '</b>.</div><div class="qask">Berapa median data tersebut?</div>',
      opts: r3.opts, a: r3.a, diff: 2,
      why: 'Urutkan data: ' + sorted.join(", ") + '. Karena banyak data ganjil (' + n5 + '), median adalah nilai tengah ke-4, yaitu <b>' + num(med) + '</b>. ' +
        'Pilihan ' + num(Math.round(data.reduce(function (a, b) { return a + b; }, 0) / n5)) + ' adalah rata-rata, bukan median.'
    };
  }

  /* geometri */
  function geo(rng) {
    var kind = pick(rng, ["luas", "volume", "keliling", "pythagoras"]);
    if (kind === "luas") {
      var r = pick(rng, [7, 10, 14, 21]);
      var L = Math.PI * r * r;
      var r1 = makeOpts(rng, num(Math.round(L * 10) / 10) + unit("cm²"), [num(Math.round(2 * Math.PI * r * 10) / 10) + unit("cm²"), num(Math.round(L * 2 * 10) / 10) + unit("cm²"), num(Math.round(Math.PI * r * 10) / 10) + unit("cm²"), num(Math.round(L / 2 * 10) / 10) + unit("cm²")]);
      return {
        q: '<div class="qlead">Sebuah pelat berbentuk lingkaran memiliki jari-jari ' + r + ' cm. Gunakan &pi; = 3,14.</div><div class="qask">Berapa luas pelat tersebut?</div>',
        opts: r1.opts, a: r1.a, diff: 1,
        why: 'Luas lingkaran = &pi;r<sup>2</sup> = 3,14 &times; ' + r + '<sup>2</sup> = <b>' + num(Math.round(L * 10) / 10) + ' cm<sup>2</sup></b>. ' +
          'Nilai ' + num(Math.round(2 * Math.PI * r * 10) / 10) + ' adalah keliling (2&pi;r), bukan luas.'
      };
    }
    if (kind === "volume") {
      var p = pick(rng, [8, 10, 12, 15]);
      var l = pick(rng, [5, 6, 8, 10]);
      var t = pick(rng, [4, 6, 10, 12]);
      var V = p * l * t;
      var r2 = makeOpts(rng, num(V) + unit("cm³"), [num(2 * (p * l + p * t + l * t)) + unit("cm³"), num(p + l + t) + unit("cm³"), num(V * 2) + unit("cm³"), num(Math.round(V / 3)) + unit("cm³")]);
      return {
        q: '<div class="qlead">Sebuah balok memiliki panjang ' + p + ' cm, lebar ' + l + ' cm, dan tinggi ' + t + ' cm.</div><div class="qask">Berapa volumenya?</div>',
        opts: r2.opts, a: r2.a, diff: 1,
        why: 'Volume balok = p &times; l &times; t = ' + p + ' &times; ' + l + ' &times; ' + t + ' = <b>' + num(V) + ' cm<sup>3</sup></b>. ' +
          'Nilai ' + num(2 * (p * l + p * t + l * t)) + ' adalah luas permukaan, bukan volume.'
      };
    }
    if (kind === "keliling") {
      var a = pick(rng, [6, 9, 12, 15, 18]);
      var b = a + pick(rng, [3, 6, 9]);
      var c = Math.sqrt(a * a + b * b);
      var isInt = Math.abs(c - Math.round(c)) < 1e-9;
      var K = a + b + (isInt ? Math.round(c) : Math.round(c * 100) / 100);
      var r3 = makeOpts(rng, num(Math.round(K * 100) / 100) + unit("cm"), [num((a * b) / 2) + unit("cm"), num(Math.round(K * 2 * 100) / 100) + unit("cm"), num(a * b) + unit("cm"), num(a + b) + unit("cm")]);
      return {
        q: '<div class="qlead">Sebuah segitiga siku-siku memiliki sisi tegak ' + a + ' cm dan ' + b + ' cm.</div><div class="qask">Berapa keliling segitiga tersebut?</div>',
        opts: r3.opts, a: r3.a, diff: 2,
        why: 'Sisi miring = &radic;(' + a + '<sup>2</sup> + ' + b + '<sup>2</sup>) = &radic;' + (a * a + b * b) + ' = ' + num(Math.round(c * 100) / 100) + ' cm. ' +
          'Keliling = ' + a + ' + ' + b + ' + ' + num(Math.round(c * 100) / 100) + ' = <b>' + num(Math.round(K * 100) / 100) + ' cm</b>. ' +
          'Nilai ' + num((a * b) / 2) + ' adalah luas segitiga.'
      };
    }
    var trip = pick(rng, [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [7, 24, 25]]);
    var scale = pick(rng, [1, 2, 3]);
    var A = trip[0] * scale, B = trip[1] * scale, C = trip[2] * scale;
    var r4 = makeOpts(rng, num(C) + unit("cm"), [num(A + B) + unit("cm"), num(Math.round(Math.sqrt(A * A + B * B + 1) * 100) / 100) + unit("cm"), num(C + scale) + unit("cm"), num(Math.round(C / 2 * 100) / 100) + unit("cm")]);
    return {
      q: '<div class="qlead">Sebuah tangga bersandar pada dinding. Jarak kaki tangga ke dinding ' + A + ' cm dan tinggi ujung tangga ' + B + ' cm.</div>' +
        '<div class="qask">Berapa panjang tangga tersebut?</div>',
      opts: r4.opts, a: r4.a, diff: 2,
      why: 'Panjang tangga adalah sisi miring: &radic;(' + A + '<sup>2</sup> + ' + B + '<sup>2</sup>) = &radic;' + (A * A + B * B) + ' = <b>' + num(C) + ' cm</b>. ' +
        'Menjumlahkan kedua sisi (' + num(A + B) + ' cm) mengabaikan sifat segitiga siku-siku.'
    };
  }

  /* silogisme / logika */
  function logic(rng) {
    var forms = [
      { p: "Semua teknisi memakai alat pelindung diri.", q: "Budi adalah teknisi.", concl: "Budi memakai alat pelindung diri.", wrong: ["Budi tidak memakai alat pelindung diri.", "Semua yang memakai alat pelindung diri adalah teknisi.", "Budi mungkin teknisi."], why: "Silogisme modus ponens: premis umum berlaku untuk setiap anggota yang memenuhi syarat, sehingga Budi pasti memakai APD." },
      { p: "Semua mesin bubut di bengkel ini berumur lebih dari lima tahun.", q: "Mesin M-07 ada di bengkel ini dan bukan mesin bubut.", concl: "Tidak dapat disimpulkan apakah M-07 berumur lebih dari lima tahun.", wrong: ["M-07 berumur lebih dari lima tahun.", "M-07 berumur kurang dari lima tahun.", "M-07 bukan mesin."], why: "Premis hanya mengatur mesin bubut. Untuk mesin yang bukan bubut, tidak ada informasi, sehingga kesimpulan pasti tidak dapat diambil." },
      { p: "Jika sensor mendeteksi panas berlebih, maka sistem otomatis berhenti.", q: "Sistem tidak berhenti.", concl: "Sensor tidak mendeteksi panas berlebih.", why: "Modus tollens: dari p &rarr; q dan &not;q dapat disimpulkan &not;p. Jika sensor mendeteksi panas, sistem seharusnya berhenti.", wrong: ["Sensor mendeteksi panas berlebih.", "Sistem rusak.", "Tidak ada kesimpulan yang sah."] },
      { p: "Semua produk yang lolos uji tekan memiliki kekuatan di atas 30 MPa.", q: "Produk X memiliki kekuatan 25 MPa.", concl: "Produk X tidak lolos uji tekan.", wrong: ["Produk X lolos uji tekan.", "Produk X memiliki kekuatan di atas 30 MPa.", "Uji tekan tidak dapat dilakukan."], why: "Kontraposisi dari pernyataan pertama: kekuatan tidak di atas 30 MPa berarti tidak lolos uji tekan." },
      { p: "Beberapa mahasiswa mengikuti lomba robotik.", q: "Beberapa peserta lomba robotik adalah perempuan.", concl: "Tidak dapat disimpulkan secara pasti.", wrong: ["Semua mahasiswa perempuan.", "Tidak ada mahasiswa perempuan yang ikut lomba.", "Semua peserta lomba adalah mahasiswa."], why: "Kata 'beberapa' tidak menetapkan jumlah maupun jenis kelamin. Dua premis partikular tidak menghasilkan kesimpulan pasti." },
      { p: "Tidak ada komponen cacat yang dikirim ke pelanggan.", q: "Komponen K-12 dikirim ke pelanggan.", concl: "Komponen K-12 tidak cacat.", wrong: ["Komponen K-12 cacat.", "Semua komponen yang dikirim cacat.", "K-12 tidak dikirim."], why: "Pernyataan 'tidak ada A yang B' setara dengan 'semua B bukan A'. Karena K-12 termasuk B, ia bukan A, artinya tidak cacat." },
      { p: "Semua lulusan program ini menguasai gambar teknik.", q: "Sari tidak menguasai gambar teknik.", concl: "Sari bukan lulusan program ini.", wrong: ["Sari lulusan program ini.", "Sari menguasai gambar teknik.", "Semua yang menguasai gambar teknik lulusan program ini."], why: "Ini kontraposisi sah: jika semua A adalah B, maka yang bukan B pasti bukan A." },
      { p: "Jika mesin dihidupkan tanpa pelumas, bearing cepat aus.", q: "Bearing mesin Z tidak cepat aus.", concl: "Mesin Z tidak dihidupkan tanpa pelumas.", why: "Modus tollens: p &rarr; q dan &not;q memberi &not;p. Bearing yang tidak aus menandakan mesin tidak dijalankan tanpa pelumas.", wrong: ["Mesin Z dihidupkan tanpa pelumas.", "Bearing mesin Z pasti diganti.", "Pelumas tidak berpengaruh."] },
      { p: "Semua mahasiswa tingkat akhir wajib mengambil proyek akhir.", q: "Semua yang mengambil proyek akhir memakai laboratorium.", concl: "Mahasiswa tingkat akhir memakai laboratorium.", why: "Silogisme berantai: A &sub; B dan B &sub; C, maka A &sub; C. Karena setiap mahasiswa tingkat akhir termasuk kelompok pemakai laboratorium, ia pasti memakainya.", wrong: ["Semua pemakai laboratorium adalah mahasiswa tingkat akhir.", "Mahasiswa tingkat akhir tidak memakai laboratorium.", "Hanya mahasiswa tingkat akhir yang memakai laboratorium."] },
      { p: "Kerusakan produk hanya mungkin berasal dari setelan mesin atau dari bahan baku, tidak keduanya.", q: "Bahan baku terbukti sesuai spesifikasi dan tidak menjadi penyebab.", concl: "Kerusakan berasal dari setelan mesin.", why: "Silogisme disjungtif: dari A atau B dan &not;B dapat disimpulkan A. Karena bahan baku sudah disingkirkan, penyebab yang tersisa adalah setelan mesin.", wrong: ["Kerusakan bukan dari setelan mesin.", "Kerusakan berasal dari kedua faktor.", "Tidak dapat disimpulkan apa pun."] },
      { p: "Nilai uji kekerasan Rina lebih tinggi daripada Doni.", q: "Nilai Doni lebih tinggi daripada Bayu, dan nilai Bayu lebih tinggi daripada Sinta.", concl: "Nilai uji Sinta paling rendah di antara keempatnya.", why: "Relasi &gt; bersifat transitif: Rina &gt; Doni &gt; Bayu &gt; Sinta, sehingga Sinta berada di urutan terakhir.", wrong: ["Nilai uji Rina paling rendah.", "Nilai uji Bayu paling tinggi.", "Nilai Doni dan Sinta sama."] },
      { p: "Beberapa komponen hasil casting memiliki porositas internal.", q: "Semua komponen berporositas internal harus melalui proses impregnasi.", concl: "Beberapa komponen hasil casting harus melalui proses impregnasi.", why: "Silogisme partikular: sebagian A adalah B, dan semua B adalah C, maka sebagian A adalah C. Kesimpulan tetap memakai kata 'beberapa', bukan 'semua'.", wrong: ["Semua komponen hasil casting harus diimpregnasi.", "Tidak ada komponen casting yang diimpregnasi.", "Semua komponen yang diimpregnasi hasil casting."] },
      { p: "Tidak ada komponen yang belum melalui uji akhir yang boleh dikirim.", q: "Komponen yang dikirim adalah komponen yang lolos gate pengiriman.", concl: "Komponen yang dikirim telah melalui uji akhir.", why: "'Tidak ada A yang B' berarti semua B bukan A. Karena komponen yang dikirim termasuk B (bukan yang belum diuji), ia sudah melalui uji akhir.", wrong: ["Komponen yang dikirim belum diuji.", "Semua komponen yang diuji langsung dikirim.", "Gate pengiriman tidak memeriksa uji akhir."] },
      { p: "Jika alat ukur dikalibrasi, penyimpangan pengukuran di bawah 0,05 mm.", q: "Penyimpangan pengukuran yang tercatat 0,08 mm.", concl: "Alat ukur tersebut tidak dikalibrasi.", why: "Kontraposisi implikasi: jika p &rarr; q, maka &not;q &rarr; &not;p. Penyimpangan di atas batas berarti syarat kalibrasi tidak terpenuhi.", wrong: ["Alat ukur tersebut sudah dikalibrasi.", "Penyimpangan 0,08 mm masih dalam toleransi.", "Kalibrasi tidak memengaruhi penyimpangan."] },
      { p: "Semua peserta yang lulus uji kompetensi menerima sertifikat.", q: "Andi telah menerima sertifikat.", concl: "Tidak dapat disimpulkan bahwa Andi lulus uji kompetensi.", why: "Ini kekeliruan afirmasi konsekuen: sertifikat bisa diperoleh lewat jalur lain (rekognisi pengalaman kerja), sehingga status kelulusan Andi tidak pasti.", wrong: ["Andi pasti lulus uji kompetensi.", "Andi pasti tidak lulus uji kompetensi.", "Sertifikat tidak berkaitan dengan uji kompetensi."] },
      { p: "Setiap komponen yang diproduksi pada shift malam diperiksa dua kali.", q: "Komponen Q hanya diperiksa satu kali.", concl: "Komponen Q tidak diproduksi pada shift malam.", why: "Modus tollens pada pernyataan universal: satu kali pemeriksaan menyalahi konsekuensi wajib, jadi antesedennya tidak berlaku.", wrong: ["Komponen Q diproduksi pada shift malam.", "Komponen Q tidak diperiksa sama sekali.", "Semua komponen diperiksa satu kali."] },
      { p: "Jika order masuk, bahan baku dipesan.", q: "Jika bahan baku dipesan, jadwal produksi diperbarui. Order telah masuk.", concl: "Jadwal produksi diperbarui.", why: "Rantai implikasi p &rarr; q &rarr; r dengan p benar menghasilkan r benar (modus ponens berantai).", wrong: ["Jadwal produksi tidak diperbarui.", "Bahan baku tidak dipesan.", "Order belum masuk."] },
      { p: "Semua operator CNC di lini ini bersertifikat.", q: "Sebagian operator CNC di lini ini bertugas pada shift malam.", concl: "Sebagian pekerja bersertifikat bertugas pada shift malam.", why: "Operator shift malam adalah operator CNC (karena itu bersertifikat) sekaligus bertugas malam, sehingga irisan keduanya tidak kosong.", wrong: ["Semua pekerja bersertifikat bertugas malam.", "Tidak ada operator shift malam yang bersertifikat.", "Semua operator CNC bertugas malam."] },
      { p: "Komponen cacat geometri hanya dapat berasal dari program NC yang salah atau dari pencekaman benda kerja yang longgar, tidak keduanya.", q: "Program NC telah diverifikasi dan terbukti benar.", concl: "Cacat geometri berasal dari pencekaman benda kerja yang longgar.", why: "Silogisme disjungtif eksklusif: satu kemungkinan gugur, maka kemungkinan lain yang berlaku.", wrong: ["Pencekaman benda kerja sudah benar.", "Kedua faktor menjadi penyebab.", "Cacat geometri tidak dapat dilacak."] }
    ];
    var nm1 = pick(rng, ["Budi", "Rizky", "Fajar", "Yoga", "Dimas", "Hendra"]);
    var nm2 = pick(rng, ["Sari", "Dewi", "Intan", "Nadia", "Putri", "Ayu"]);
    var cd1 = pick(rng, ["M-07", "M-12", "M-31", "M-45", "M-58", "M-63"]);
    var cd2 = pick(rng, ["K-04", "K-12", "K-19", "K-27", "K-33", "K-41"]);
    var cd3 = pick(rng, ["Z", "V", "H", "L", "Q", "S"]);
    var sub = function (t) {
      return String(t).replace(/Budi/g, nm1).replace(/Sari/g, nm2).replace(/Andi/g, nm1)
        .replace(/M-07/g, cd1).replace(/K-12/g, cd2).replace(/mesin Z/g, "mesin " + cd3);
    };
    var raw = pick(rng, forms);
    var f = { p: sub(raw.p), q: sub(raw.q), concl: sub(raw.concl), wrong: raw.wrong.map(sub), why: sub(raw.why) };
    var r = makeOpts(rng, f.concl, f.wrong);
    return {
      q: '<div class="qlead">Perhatikan premis berikut.</div><div class="prem"><b>(1)</b> ' + f.p + '<br><b>(2)</b> ' + f.q + '</div>' +
        '<div class="qask">Kesimpulan manakah yang paling sah?</div>',
      opts: r.opts, a: r.a, diff: 3,
      why: f.why + ' Pilihan lain menambahkan informasi yang tidak ada pada premis atau membalik arah implikasi.'
    };
  }

  /* interpretasi data (tabel produksi) */
  function dataInterp(rng) {
    var months = ["Jan", "Feb", "Mar", "Apr"];
    var base = pick(rng, [120, 150, 180, 200, 240]);
    var vals = [];
    for (var i = 0; i < 4; i++) vals.push(base + ri(rng, -30, 60));
    var total = vals.reduce(function (a, b) { return a + b; }, 0);
    var kind = pick(rng, ["total", "tertinggi", "rata2", "selisih"]);
    var rows = months.map(function (m, i2) { return "<tr><td>" + m + "</td><td>" + num(vals[i2]) + "</td></tr>"; }).join("");
    var table = '<table class="dtab"><thead><tr><th>Bulan</th><th>Unit diproduksi</th></tr></thead><tbody>' + rows + "</tbody></table>";
    var maxI = vals.indexOf(Math.max.apply(null, vals)), minI = vals.indexOf(Math.min.apply(null, vals));
    var lead = '<div class="qlead">Tabel berikut menunjukkan jumlah unit yang diproduksi empat bulan pertama.</div>' + table;
    if (kind === "total") {
      var r1 = makeOpts(rng, num(total) + unit("unit"), [num(total / 4) + unit("unit"), num(Math.max.apply(null, vals)) + unit("unit"), num(total * 2) + unit("unit"), num(total - base) + unit("unit")]);
      return {
        q: lead + '<div class="qask">Berapa total unit yang diproduksi selama empat bulan?</div>',
        opts: r1.opts, a: r1.a, diff: 1,
        why: 'Jumlahkan seluruh baris: ' + vals.join(" + ") + ' = <b>' + num(total) + ' unit</b>. Nilai ' + num(total / 4) + ' adalah rata-rata bulanan, bukan total.'
      };
    }
    if (kind === "tertinggi") {
      var r2 = makeOpts(rng, months[maxI], [months[minI], months[(maxI + 1) % 4], months[(maxI + 2) % 4]]);
      return {
        q: lead + '<div class="qask">Bulan manakah dengan produksi tertinggi?</div>',
        opts: r2.opts, a: r2.a, diff: 1,
        why: 'Bandingkan keempat nilai: ' + vals.join(", ") + '. Nilai terbesar ' + num(vals[maxI]) + ' terjadi pada bulan <b>' + months[maxI] + '</b>, sedangkan terendah ' + num(vals[minI]) + ' pada bulan ' + months[minI] + '.'
      };
    }
    if (kind === "rata2") {
      var avg = total / 4;
      var r3 = makeOpts(rng, num(Math.round(avg * 10) / 10) + unit("unit"), [num(total) + unit("unit"), num(Math.round(Math.max.apply(null, vals))) + unit("unit"), num(Math.round(avg * 2 * 10) / 10) + unit("unit"), num(base) + unit("unit")]);
      return {
        q: lead + '<div class="qask">Berapa rata-rata produksi per bulan?</div>',
        opts: r3.opts, a: r3.a, diff: 1,
        why: 'Total = ' + num(total) + ' unit dibagi 4 bulan = <b>' + num(Math.round(avg * 10) / 10) + ' unit/bulan</b>. Nilai ' + num(total) + ' adalah total, bukan rata-rata.'
      };
    }
    var diff = vals[maxI] - vals[minI];
    var r4 = makeOpts(rng, num(diff) + unit("unit"), [num(vals[maxI]) + unit("unit"), num(diff + 10) + unit("unit"), num(total - diff) + unit("unit"), num(Math.round(diff / 2)) + unit("unit")]);
    return {
      q: lead + '<div class="qask">Berapa selisih produksi antara bulan tertinggi dan terendah?</div>',
      opts: r4.opts, a: r4.a, diff: 2,
      why: 'Tertinggi ' + months[maxI] + ' = ' + num(vals[maxI]) + ', terendah ' + months[minI] + ' = ' + num(vals[minI]) + '. Selisih = ' + num(vals[maxI]) + ' &minus; ' + num(vals[minI]) + ' = <b>' + num(diff) + ' unit</b>.'
    };
  }

  /* =========================================================
     build
     ========================================================= */
  function build() {
    var rng = mk(20261121);
    var items = [];
    var seenQ = {};
    var seenO = {};

    function add(n, sec, topic, gen) {
      var done = 0, guard = 0;
      while (done < n) {
        if (++guard > n * 120) throw new Error("bank shortfall " + topic + " " + done + "/" + n);
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

    /* T2 - 250 */
    add(25, "T2", "Mekanik \u2014 transmisi roda gigi", function () { return gear(rng); });
    add(25, "T2", "Mekanik \u2014 tuas dan kesetimbangan", function () { return lever(rng); });
    add(15, "T2", "Mekanik \u2014 katrol dan keuntungan mekanis", function () { return pulley(rng); });
    add(30, "T2", "Mekatronika \u2014 rangkaian listrik", function () { return resistor(rng); });
    add(25, "T2", "Mekatronika \u2014 usaha, daya, efisiensi", function () { return power(rng); });
    add(20, "T2", "Mekanik \u2014 tekanan dan hidrolik", function () { return pressure(rng); });
    add(20, "T2", "Material \u2014 massa jenis", function () { return density(rng); });
    add(20, "T2", "Desain \u2014 toleransi ukuran", function () { return tolerance(rng); });
    add(20, "T2", "Digital manufacturing \u2014 parameter CNC", function () { return cnc(rng); });
    add(20, "T2", "Material \u2014 tegangan dan luas penampang", function () { return stress(rng); });
    add(15, "T2", "Dasar teknik \u2014 konversi satuan", function () { return convert(rng); });
    add(15, "T2", "Produksi \u2014 persentase dan rasio", function () { return production(rng); });

    /* T3 - 250 */
    add(30, "T3", "TPA \u2014 deret bilangan", function () { return series(rng); });
    add(30, "T3", "TPA \u2014 perbandingan", function () { return ratio(rng); });
    add(25, "T3", "TPA \u2014 persentase dan bunga", function () { return percent(rng); });
    add(20, "T3", "TPA \u2014 kerja bersama", function () { return workRate(rng); });
    add(20, "T3", "TPA \u2014 kecepatan dan jarak", function () { return speed(rng); });
    add(25, "T3", "TPA \u2014 peluang dan kombinatorika", function () { return prob(rng); });
    add(25, "T3", "TPA \u2014 statistika", function () { return stat(rng); });
    add(25, "T3", "TPA \u2014 geometri", function () { return geo(rng); });
    add(25, "T3", "TPA \u2014 penalaran logis", function () { return logic(rng); });
    add(25, "T3", "TPA \u2014 interpretasi data", function () { return dataInterp(rng); });

    return items;
  }

  return { build: build, num: num };
})();
if (typeof module !== "undefined" && module.exports) { module.exports = BANK_NUM; }
