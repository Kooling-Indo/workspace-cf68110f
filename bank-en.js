/* ============================================================
   ATMI ELITE BANK - T4 BAHASA INGGRIS (100 items, curated)
   item = { topic, q, opts:[4], a, why }
   ============================================================ */
(function (root) {
  "use strict";

  var I = [];
  function E(topic, q, opts, a, why) {
    if (!Array.isArray(opts) || opts.length !== 4) throw new Error("bad opts: " + topic);
    if (a < 0 || a > 3) throw new Error("bad key: " + topic);
    var s = {};
    opts.forEach(function (o) { if (s[o]) throw new Error("dup option in " + topic + ": " + o); s[o] = 1; });
    I.push({ topic: topic, q: q, opts: opts, a: a, why: why });
  }

  /* ---------- A. STRUCTURE & GRAMMAR (30) ---------- */
  E("Grammar", "The technician <b>___</b> the machine before the shift started.",
    ["checked", "checks", "is checking", "check"], 0,
    "Penanda waktu 'before the shift started' (past) menuntut simple past: <i>checked</i>.");
  E("Grammar", "If the coolant level <b>___</b> low, stop the machine immediately.",
    ["is", "are", "were", "be"], 0,
    "Kalimat perintah bersyarat tipe 0 memakai present tense; subjek 'the coolant level' tunggal sehingga <i>is</i>.");
  E("Grammar", "Neither the operator nor the supervisor <b>___</b> available this morning.",
    ["was", "were", "have", "are"], 0,
    "Dengan 'neither ... nor', kata kerja mengikuti subjek terdekat ('the supervisor', tunggal) &rarr; <i>was</i>.");
  E("Grammar", "All the parts <b>___</b> inspected before they were packed.",
    ["were", "was", "is", "has"], 0,
    "Subjek jamak 'all the parts' + konteks lampau &rarr; <i>were inspected</i>.");
  E("Grammar", "He has <b>___</b> the drawing for two hours.",
    ["studied", "study", "studies", "studying"], 0,
    "Present perfect 'has' + past participle: <i>has studied</i>.");
  E("Grammar", "The report <b>___</b> by the quality team every Friday.",
    ["is reviewed", "reviews", "reviewing", "review"], 0,
    "Laporan tidak melakukan tindakan; bentuk pasif present: <i>is reviewed</i>.");
  E("Grammar", "Please <b>___</b> the safety guard before cleaning the chuck.",
    ["close", "closing", "closed", "to close"], 0,
    "Setelah 'please' dipakai bare infinitive: <i>close</i>.");
  E("Grammar", "This is the machine <b>___</b> spindle was replaced last week.",
    ["whose", "which", "who", "whom"], 0,
    "'whose' menyatakan kepemilikan (spindle milik mesin).");
  E("Grammar", "The operator, <b>___</b> finished early, cleaned the whole area.",
    ["who", "which", "whom", "what"], 0,
    "Orang sebagai subjek klausa relatif nonrestriktif memakai <i>who</i>.");
  E("Grammar", "We must wear gloves <b>___</b> handling sharp edges.",
    ["when", "during", "while", "at"], 0,
    "'during' diikuti frasa nomina; diikuti gerund 'handling' dipakai <i>when</i> (atau while).");
  E("Grammar", "The measurement is accurate <b>___</b> 0.01 mm.",
    ["to", "at", "in", "on"], 0,
    "Ungkapan baku 'accurate to 0.01 mm' (ketelitian sampai 0,01 mm).");
  E("Grammar", "<b>___</b> the alarm sounded, everyone left the floor at once.",
    ["As soon as", "Although", "Unless", "In spite of"], 0,
    "Hubungan waktu langsung &rarr; <i>As soon as</i>.");
  E("Grammar", "The job is not finished <b>___</b>.",
    ["yet", "already", "still", "ever"], 0,
    "'not ... yet' berarti belum sampai sekarang.");
  E("Grammar", "He is responsible <b>___</b> the final inspection.",
    ["for", "of", "to", "with"], 0,
    "Kolokasi baku: responsible <i>for</i> + nomina/gerund.");
  E("Grammar", "The machine stopped <b>___</b> a broken belt.",
    ["because of", "because", "so", "although"], 0,
    "'because of' diikuti frasa nomina ('a broken belt'); 'because' butuh klausa.");
  E("Grammar", "The tolerance is very tight; <b>___</b>, we need a new tool.",
    ["therefore", "however", "otherwise", "although"], 0,
    "Hubungan sebab&ndash;akibat &rarr; <i>therefore</i>.");
  E("Grammar", "Each worker <b>___</b> a helmet in the welding area.",
    ["wears", "wear", "wearing", "wore"], 0,
    "'Each' selalu tunggal &rarr; <i>wears</i> (present, kebiasaan).");
  E("Grammar", "The team <b>___</b> on the prototype since Monday.",
    ["has been working", "have been working", "is working", "was working"], 0,
    "'The team' sebagai satu kesatuan tunggal &rarr; <i>has been working</i> (present perfect continuous).");
  E("Grammar", "I would rather <b>___</b> the job tomorrow morning.",
    ["do", "to do", "doing", "did"], 0,
    "'would rather' + bare infinitive: <i>do</i>.");
  E("Grammar", "The faster you cut, <b>___</b> the tool wears.",
    ["the more", "more", "the most", "most"], 0,
    "Pola perbandingan sejajar 'the + comparative ..., the + comparative ...'.");
  E("Grammar", "Hardly <b>___</b> started when the power failed.",
    ["had we", "we had", "have we", "we have"], 0,
    "Adverbia negatif di awal kalimat memicu inversi: <i>Hardly had we started</i>.");
  E("Grammar", "Not only <b>___</b> late, but he also forgot the drawing.",
    ["was he", "he was", "he is", "is he"], 0,
    "'Not only' di awal kalimat menuntut inversi: <i>Not only was he late</i>.");
  E("Grammar", "The drawing <b>___</b> all dimensions in millimeters.",
    ["shows", "show", "showing", "shown"], 0,
    "'The drawing' tunggal &rarr; <i>shows</i>.");
  E("Grammar", "If I <b>___</b> you, I would recheck the setup.",
    ["were", "was", "am", "be"], 0,
    "Kondisional tipe 2 memakai <i>were</i> untuk semua subjek.");
  E("Grammar", "The bolts must <b>___</b> tightened in the correct sequence.",
    ["be", "is", "are", "been"], 0,
    "Modal 'must' + pasif: <i>must be tightened</i>.");
  E("Grammar", "She asked me <b>___</b> the report before noon.",
    ["to submit", "submit", "submitting", "submitted"], 0,
    "Pola 'ask somebody to do something' &rarr; <i>to submit</i>.");
  E("Grammar", "It is essential that every part <b>___</b> within tolerance.",
    ["be", "is", "was", "were"], 0,
    "Subjunctive setelah 'it is essential that': <i>be</i>.");
  E("Grammar", "The supervisor made him <b>___</b> the PPE properly.",
    ["wear", "to wear", "wearing", "wore"], 0,
    "'make + object + bare infinitive' &rarr; <i>wear</i>.");
  E("Grammar", "This alloy is <b>___</b> than mild steel.",
    ["harder", "hard", "hardest", "more hard"], 0,
    "Perbandingan dua hal: comparative satu suku kata &rarr; <i>harder</i>.");
  E("Grammar", "<b>___</b> being expensive, the sensor is very reliable.",
    ["Despite", "Although", "Because", "However"], 0,
    "'Despite' + gerund, menyatakan kontras.");

  /* ---------- B. VOCABULARY IN CONTEXT (25) ---------- */
  E("Vocabulary", "The workpiece must be <b>clamped</b> securely before drilling.",
    ["fixed tightly", "painted", "measured", "cooled down"], 0,
    "'Clamped' berarti dijepit/dikencangkan agar tidak bergerak.");
  E("Vocabulary", "The batch was rejected because of <b>porosity</b> in the casting.",
    ["tiny internal voids", "the wrong colour", "excess weight", "rough edges"], 0,
    "Porositas = rongga/gelembung kecil di dalam logam cor.");
  E("Vocabulary", "Always wear the correct <b>PPE</b> in the welding booth.",
    ["personal protective equipment", "production planning estimate", "preventive plant evaluation", "pneumatic pressure element"], 0,
    "PPE = <i>personal protective equipment</i> (alat pelindung diri).");
  E("Vocabulary", "The lathe has been <b>idle</b> since the morning shift ended.",
    ["not operating", "overheating", "newly installed", "badly damaged"], 0,
    "'Idle' = menganggur / tidak beroperasi.");
  E("Vocabulary", "Check for excessive <b>backlash</b> in the lead screw.",
    ["unwanted play in the mechanism", "lubricant leakage", "electrical noise", "surface scratches"], 0,
    "Backlash = celah/gerak balik yang tidak dikehendaki pada ulir.");
  E("Vocabulary", "The operator <b>calibrated</b> the micrometer before measuring.",
    ["adjusted it to a standard", "replaced it", "cleaned it with solvent", "bought a new one"], 0,
    "Kalibrasi = menyetel alat ukur terhadap standar acuan.");
  E("Vocabulary", "All <b>defective</b> units were scrapped at the end of the run.",
    ["faulty", "finished", "expensive", "exported"], 0,
    "'Defective' = cacat/bermasalah.");
  E("Vocabulary", "The machined surface feels <b>rough</b> near the shoulder.",
    ["not smooth", "very hot", "perfectly flat", "slightly oily"], 0,
    "'Rough' = kasar, tidak halus (kebalikan dari smooth).");
  E("Vocabulary", "Keep the <b>aisle</b> clear at all times.",
    ["walkway between work areas", "tool cabinet", "coolant tank", "storage rack"], 0,
    "Aisle = lorong/jalur antar area kerja.");
  E("Vocabulary", "The spindle <b>rotates</b> at 1,200 revolutions per minute.",
    ["turns", "vibrates", "stops", "slides"], 0,
    "'Rotates' = berputar.");
  E("Vocabulary", "<b>Lubricate</b> the bearings every 40 operating hours.",
    ["Apply oil or grease to", "Inspect the colour of", "Replace", "Tighten"], 0,
    "Lubricate = melumasi dengan oli/gemuk.");
  E("Vocabulary", "The <b>fixture</b> holds the part in the correct position.",
    ["holding device", "cutting tool", "measuring gauge", "coolant pump"], 0,
    "Fixture = alat pemegang/pencekam benda kerja.");
  E("Vocabulary", "A sharp <b>burr</b> remained on the edge of the plate.",
    ["raised rough edge", "deep hole", "crack", "paint mark"], 0,
    "Burr = geram/timbulnya sisi tajam pada tepi hasil pemotongan.");
  E("Vocabulary", "The drawing specifies a <b>tolerance</b> of &plusmn;0.05 mm.",
    ["allowed variation from the nominal size", "total weight", "surface colour", "delivery date"], 0,
    "Toleransi = batas penyimpangan yang diizinkan.");
  E("Vocabulary", "He is a skilled <b>machinist</b>.",
    ["person who operates machine tools", "design engineer", "quality clerk", "forklift driver"], 0,
    "Machinist = operator mesin perkakas.");
  E("Vocabulary", "The team managed to meet the <b>deadline</b>.",
    ["latest acceptable time", "maximum budget", "quality standard", "safety rule"], 0,
    "Deadline = batas waktu terakhir.");
  E("Vocabulary", "Please <b>verify</b> the dimensions before the part is released.",
    ["confirm", "ignore", "estimate", "redesign"], 0,
    "Verify = memastikan/memeriksa kebenaran.");
  E("Vocabulary", "The crack was <b>barely</b> visible under normal light.",
    ["hardly", "clearly", "always", "completely"], 0,
    "'Barely' = hampir tidak / nyaris tidak.");
  E("Vocabulary", "The procedure was <b>amended</b> after the audit.",
    ["changed", "translated", "printed", "cancelled"], 0,
    "Amend = mengubah/memperbaiki (dokumen atau prosedur).");
  E("Vocabulary", "Flood coolant <b>prevents</b> the tool from overheating.",
    ["stops something from happening", "makes something faster", "measures something", "cleans something"], 0,
    "Prevent = mencegah.");
  E("Vocabulary", "Annual maintenance is <b>mandatory</b> for this press.",
    ["required", "optional", "expensive", "postponed"], 0,
    "Mandatory = wajib.");
  E("Vocabulary", "The engineers tested a <b>prototype</b> before mass production.",
    ["first working model", "final product", "spare part", "catalog number"], 0,
    "Prototype = model awal untuk uji coba.");
  E("Vocabulary", "Reduce the feed rate <b>gradually</b> when entering the cut.",
    ["step by step", "suddenly", "completely", "twice as fast"], 0,
    "Gradually = berangsur-angsur/bertahap.");
  E("Vocabulary", "The inspector found a minor <b>flaw</b> on the coating.",
    ["defect", "advantage", "instruction", "colour"], 0,
    "Flaw = cacat/retak halus.");
  E("Vocabulary", "Store the measuring tools in a dry, dust-free place.",
    ["keep", "sell", "calibrate", "carry"], 0,
    "Store = menyimpan.");

  /* ---------- C. TECHNICAL INSTRUCTIONS (25) ---------- */
  E("Technical English", "Instruction: &ldquo;Insert the pin until it <b>seats</b> fully.&rdquo; What does the instruction mean?",
    ["Push the pin in until it is completely in position", "Insert the pin halfway", "Seat yourself before inserting the pin", "Measure the pin before inserting it"], 0,
    "'Seat fully' = masuk sampai duduk/rapat pada posisinya.");
  E("Technical English", "&ldquo;Do not exceed 6 bar.&rdquo; What is the maximum allowed pressure?",
    ["6 bar", "60 bar", "0.6 bar", "No limit is given"], 0,
    "'Exceed' = melebihi; jadi batas maksimumnya 6 bar.");
  E("Technical English", "&ldquo;Torque to 25 N&middot;m &plusmn;10%.&rdquo; Which reading is acceptable?",
    ["23 N&middot;m", "21 N&middot;m", "28.5 N&middot;m", "30 N&middot;m"], 0,
    "Rentang yang diterima = 22,5&ndash;27,5 N&middot;m; hanya 23 N&middot;m yang masuk rentang.");
  E("Technical English", "A label reads &ldquo;Rotating parts &mdash; keep hands clear.&rdquo; It warns you to",
    ["keep your hands away from moving parts", "clean the rotating parts", "hold the rotating parts firmly", "lubricate the parts while running"], 0,
    "'Keep hands clear' = jangan mendekatkan tangan ke bagian yang berputar.");
  E("Technical English", "&ldquo;Loosen the lock nut counter-clockwise.&rdquo; You should turn it",
    ["in the direction opposite to the clock hands", "in the same direction as the clock hands", "either direction", "clockwise first, then stop"], 0,
    "Counter-clockwise = berlawanan arah jarum jam (membuka ulir kanan).");
  E("Technical English", "&ldquo;The machine must be properly earthed.&rdquo; This means it must be",
    ["connected to the ground for electrical safety", "placed on a concrete floor", "covered with soil", "operated outdoors"], 0,
    "Earthed (grounded) = dibumikan untuk mencegah sengatan listrik.");
  E("Technical English", "The parts list says &ldquo;2 off M8 x 30 bolts&rdquo;. How many bolts are needed?",
    ["Two", "Eight", "Thirty", "Two hundred"], 0,
    "'2 off' berarti jumlahnya dua buah.");
  E("Technical English", "&ldquo;Fit the O-ring before the cover.&rdquo; This tells you",
    ["the assembly order of the two parts", "the material of the O-ring", "the size of the cover", "the torque value"], 0,
    "Kalimat mengatur urutan pemasangan: O-ring dulu, baru penutup.");
  E("Technical English", "&ldquo;Allow the part to cool before measuring.&rdquo; Why?",
    ["Heat expansion would make the dimensions inaccurate", "The gauge would be damaged", "Cool parts are easier to paint", "Coolant would evaporate"], 0,
    "Benda panas memuai sehingga hasil ukur lebih besar dari ukuran sebenarnya.");
  E("Technical English", "&ldquo;Tighten the bolts diagonally in two stages.&rdquo; The purpose is to",
    ["distribute the clamping force evenly", "save time", "avoid using a torque wrench", "keep the bolts cool"], 0,
    "Pengencangan menyilang bertahap mencegah distorsi dan distribusi gaya tidak merata.");
  E("Technical English", "The title block states &ldquo;Scale 1:2&rdquo;. A line measures 40 mm on the drawing. Its real length is",
    ["80 mm", "20 mm", "40 mm", "42 mm"], 0,
    "Skala 1:2 berarti gambar setengah ukuran asli, jadi 40 mm &times; 2 = 80 mm.");
  E("Technical English", "&ldquo;Material: S45C&rdquo; refers to",
    ["a medium-carbon steel", "a plastic compound", "an aluminium alloy", "a type of paint"], 0,
    "S45C adalah baja karbon sedang (sekitar 0,45% C) sesuai JIS.");
  E("Technical English", "&ldquo;Surface roughness Ra 1.6&rdquo; tells the machinist",
    ["the required smoothness of the surface", "the colour of the surface", "the thickness of the part", "the hardness of the material"], 0,
    "Ra menyatakan kekasaran permukaan rata-rata; 1,6 &micro;m berarti harus cukup halus.");
  E("Technical English", "&ldquo;Deburr all edges after machining.&rdquo; This means",
    ["remove the sharp edges and burrs", "paint all the edges", "measure all the edges", "round the corners with a file only"], 0,
    "Deburr = menghilangkan geram/tajaman pada tepi.");
  E("Technical English", "&ldquo;Holding torque: 8 N&middot;m minimum.&rdquo; This is the",
    ["lowest torque that still holds the joint safely", "maximum torque before breakage", "weight of the tool", "service interval"], 0,
    "'Minimum' = nilai terendah yang masih memenuhi syarat.");
  E("Technical English", "Why should compressed air not be used to clean machine guideways?",
    ["It can blow chips into the sliding surfaces", "It is too expensive", "It damages the paint", "It cools the rails too fast"], 0,
    "Semburan udara mendorong geram masuk ke celah sliding, mempercepat keausan.");
  E("Technical English", "&ldquo;Read the SDS before handling the solvent.&rdquo; SDS gives information about",
    ["hazards, handling and first aid", "the selling price", "the delivery schedule", "the machine setting"], 0,
    "Safety Data Sheet memuat bahaya bahan, penanganan, dan pertolongan pertama.");
  E("Technical English", "&ldquo;Lock out the main switch before servicing.&rdquo; This is done to",
    ["prevent accidental start-up during maintenance", "save electrical energy", "test the emergency stop", "reset the controller"], 0,
    "LOTO (lock out tag out) mencegah mesin menyala tak sengaja saat diperbaiki.");
  E("Technical English", "&ldquo;Trial run at no load for 5 minutes.&rdquo; This means running the machine",
    ["without cutting any workpiece", "with maximum load", "without lubricant", "without the safety guard"], 0,
    "'No load' = tanpa beban potong, hanya untuk memeriksa putaran dan getaran.");
  E("Technical English", "&ldquo;Record the reading in the log sheet.&rdquo; You should",
    ["write the measured value in the record form", "erase the previous data", "tell the customer the value", "recalibrate the gauge"], 0,
    "Log sheet = lembar catatan; instruksi meminta nilai dicatat.");
  E("Technical English", "&ldquo;The unit is supplied with a 12-month warranty.&rdquo; This covers",
    ["repair or replacement within one year under stated conditions", "free spare parts forever", "annual calibration", "operator training"], 0,
    "Garansi 12 bulan = perbaikan/penggantian dalam satu tahun sesuai syarat.");
  E("Technical English", "&ldquo;Spare parts are listed in Appendix B.&rdquo; Where do you look for part numbers?",
    ["In the appendix at the back of the document", "On the machine nameplate", "In the invoice", "In the operator's logbook"], 0,
    "Appendix = lampiran; nomor part ada di lampiran B.");
  E("Technical English", "&ldquo;Report any leakage immediately.&rdquo; The word 'leakage' means",
    ["fluid escaping from where it should be contained", "a loose bolt", "a broken switch", "an unusual noise"], 0,
    "Leakage = kebocoran cairan/gas.");
  E("Technical English", "&ldquo;Verify the alignment using a dial indicator.&rdquo; A dial indicator is used to",
    ["measure small deviations and run-out", "cut keyways", "measure temperature", "polish surfaces"], 0,
    "Dial indicator (dial gauge) mengukur simpangan kecil dan run-out poros.");
  E("Technical English", "A drawing note says &ldquo;Break all sharp edges 0.3&ndash;0.5 mm.&rdquo; This means",
    ["apply a small chamfer or radius of that size", "cut the part into pieces", "increase the edge thickness", "remove 0.3&ndash;0.5 mm from the length"], 0,
    "'Break sharp edges' = mematahkan sisi tajam dengan chamfer/radius kecil.");

  /* ---------- D. READING COMPREHENSION (20) ---------- */
  var pA = '<div class="qlead">Read the notice and answer the question.</div>' +
    '<div class="passage"><b>WORKSHOP NOTICE</b><br>' +
    'Starting next Monday, all machining areas will operate under a clean-floor policy. ' +
    'Operators must remove chips from their machines at the end of every shift, not only at the end of the week. ' +
    'Chips left on the floor cause slips, and wet chips clog the drainage channel. ' +
    'Each workstation is provided with a chip bin. Supervisors will check the floor at 07.00 and 15.00. ' +
    'Areas that fail the check twice in one month will be reported to the production manager.</div>';

  E("Reading", pA + '<div class="qask">What is the main purpose of the notice?</div>',
    ["To introduce a new daily cleaning requirement for machining areas", "To announce a new shift schedule", "To advertise new chip bins for sale", "To warn operators about overtime"], 0,
    "Seluruh isi notice menjelaskan kewajiban membersihkan geram setiap akhir shift.");
  E("Reading", pA + '<div class="qask">According to the notice, when must chips be removed?</div>',
    ["At the end of every shift", "Only on Friday", "Once a month", "At 07.00 only"], 0,
    "Teks: 'at the end of every shift, not only at the end of the week'.");
  E("Reading", pA + '<div class="qask">Why are wet chips a problem?</div>',
    ["They clog the drainage channel", "They are heavier to carry", "They damage the chip bins", "They make the floor slippery and dry"], 0,
    "Teks: 'wet chips clog the drainage channel'.");
  E("Reading", pA + '<div class="qask">What happens to an area that fails the check twice in one month?</div>',
    ["It is reported to the production manager", "The shift is cancelled", "The operators are transferred", "The bins are removed"], 0,
    "Teks: 'will be reported to the production manager'.");
  E("Reading", pA + '<div class="qask">The word &ldquo;clog&rdquo; in the notice is closest in meaning to</div>',
    ["block", "clean", "widen", "paint"], 0,
    "Clog = menyumbat/memblokir aliran.");

  var pB = '<div class="qlead">Read the text and answer the question.</div>' +
    '<div class="passage"><b>WHY FIRST-PIECE INSPECTION MATTERS</b><br>' +
    'Before a production run, the operator machines one part and sends it to the quality room. ' +
    'This first piece is measured against every dimension on the drawing. ' +
    'If it passes, the run continues; if not, the setup is corrected while only one part has been affected. ' +
    'The cost of checking one piece is small compared with scrapping an entire batch. ' +
    'First-piece inspection also confirms that the program, tool offset and fixture position are correct.</div>';

  E("Reading", pB + '<div class="qask">What is the first piece compared with?</div>',
    ["Every dimension on the drawing", "The previous batch", "The raw material certificate", "The machine manual"], 0,
    "Teks: 'measured against every dimension on the drawing'.");
  E("Reading", pB + '<div class="qask">What happens if the first piece fails?</div>',
    ["The setup is corrected before more parts are made", "The whole batch is scrapped", "The drawing is changed", "The operator is replaced"], 0,
    "Teks: 'the setup is corrected while only one part has been affected'.");
  E("Reading", pB + '<div class="qask">Why is first-piece inspection economically sensible?</div>',
    ["Checking one part costs far less than scrapping a whole batch", "It reduces the price of raw material", "It removes the need for any inspection later", "It allows faster spindle speeds"], 0,
    "Teks membandingkan biaya pemeriksaan satu benda dengan kerugian satu batch.");
  E("Reading", pB + '<div class="qask">Which of the following is NOT mentioned as something the first piece confirms?</div>',
    ["The delivery date of the customer", "The program is correct", "The tool offset is correct", "The fixture position is correct"], 0,
    "Tiga hal terakhir disebut di kalimat terakhir; tanggal pengiriman tidak.");
  E("Reading", pB + '<div class="qask">The word &ldquo;affected&rdquo; in the text means</div>',
    ["harmed or influenced", "measured", "delivered", "approved"], 0,
    "'Only one part has been affected' = hanya satu benda yang terkena dampak.");

  var pC = '<div class="qlead">Read the text and answer the question.</div>' +
    '<div class="passage"><b>FROM MANUAL TO CONNECTED MACHINES</b><br>' +
    'For decades, a machinist set the machine by hand and judged the result by sound and feel. ' +
    'Today, sensors on the spindle and the axis motors report vibration, temperature and load every few milliseconds. ' +
    'Software compares these signals with a baseline recorded when the machine was healthy. ' +
    'When the pattern drifts, the system warns the operator before the part goes out of tolerance. ' +
    'Skilled operators remain essential: they decide whether to stop the machine, change a tool, or simply watch the trend.</div>';

  E("Reading", pC + '<div class="qask">What is the text mainly about?</div>',
    ["How sensor data supports, but does not replace, skilled operators", "Why manual machining is better than CNC", "How to record a baseline by hand", "The history of the electric motor"], 0,
    "Paragraf menekankan data sensor sebagai alat bantu, sementara keputusan tetap pada operator.");
  E("Reading", pC + '<div class="qask">What do the sensors measure?</div>',
    ["Vibration, temperature and load", "Colour, weight and hardness", "Pressure, flow and humidity", "Length, width and height"], 0,
    "Teks menyebut vibration, temperature and load.");
  E("Reading", pC + '<div class="qask">What is the baseline used for?</div>',
    ["Comparison with the current signal pattern", "Calibrating the coolant pump", "Setting the delivery schedule", "Training new operators"], 0,
    "Baseline = rekaman kondisi mesin sehat untuk pembanding.");
  E("Reading", pC + '<div class="qask">According to the text, what do skilled operators still do?</div>',
    ["Decide what action to take when the system warns them", "Replace the sensors every week", "Write the software", "Measure every part with a micrometer"], 0,
    "Teks: 'they decide whether to stop the machine, change a tool, or simply watch the trend'.");
  E("Reading", pC + '<div class="qask">The word &ldquo;drifts&rdquo; in the text suggests that the signal</div>',
    ["slowly moves away from its normal pattern", "suddenly disappears", "becomes stronger than the machine", "is printed on paper"], 0,
    "Drift = bergeser perlahan dari pola normal.");

  var pD = '<div class="qlead">Read the text and answer the question.</div>' +
    '<div class="passage"><b>INTERNSHIP AT A PRECISION WORKSHOP</b><br>' +
    'During a six-month internship, students rotate through three stations: manual machining, CNC operation and quality control. ' +
    'Each station has a mentor who signs the student&rsquo;s logbook at the end of the week. ' +
    'Students are expected to keep a personal notebook of measurements and mistakes, because the workshop believes that a written mistake is a lesson, while an unwritten one is usually repeated. ' +
    'At the end of the programme, each student presents one part they produced and explains every decision made on it.</div>';

  E("Reading", pD + '<div class="qask">How long does the internship last?</div>',
    ["Six months", "Six weeks", "Three months", "One year"], 0,
    "Teks: 'During a six-month internship'.");
  E("Reading", pD + '<div class="qask">Who signs the logbook?</div>',
    ["The mentor at each station", "The student&rsquo;s parents", "The production manager", "A visiting inspector"], 0,
    "Teks: 'a mentor who signs the student&rsquo;s logbook'.");
  E("Reading", pD + '<div class="qask">Why does the workshop ask students to write down their mistakes?</div>',
    ["Written mistakes become lessons; unwritten ones tend to be repeated", "To punish students at the end of the programme", "To fill the logbook with pages", "Because the manager collects notebooks"], 0,
    "Alasan dinyatakan langsung: 'a written mistake is a lesson, while an unwritten one is usually repeated'.");
  E("Reading", pD + '<div class="qask">What must each student do at the end of the programme?</div>',
    ["Present one part and explain the decisions made on it", "Design a new machine", "Train a new intern", "Write a book about the workshop"], 0,
    "Teks: 'each student presents one part they produced and explains every decision made on it'.");
  E("Reading", pD + '<div class="qask">Which station is NOT mentioned in the rotation?</div>',
    ["Purchasing and sales", "Manual machining", "CNC operation", "Quality control"], 0,
    "Tiga stasiun yang disebut: manual machining, CNC, quality control.");

  if (I.length !== 100) throw new Error("T4 must have 100 items, got " + I.length);

  root.BANK_EN = {
    build: function () {
      return I.map(function (x, i) {
        return { id: "E" + (i + 1), sec: "T4", topic: x.topic, q: x.q, opts: x.opts, a: x.a, why: x.why, diff: 2 };
      });
    }
  };
})(typeof window !== "undefined" ? window : globalThis);
