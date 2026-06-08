/* =====================================================================
   estudio.js — motor compartido del sitio de estudio (offline, sin CDN)
   Da: pestañas · flashcards con recuerdo activo + repetición espaciada
   (Leitner) · auto-explicación persistente · progreso/dominio.
   Todo el estado se guarda en localStorage (clave raíz "psa.*").
   ===================================================================== */
(function () {
  "use strict";
  var DAY = 86400000;
  var BOX_DAYS = [1, 3, 7, 16, 35];          // intervalo (días) por caja 1..5 (Leitner)
  var LS_SRS = "psa.srs";                     // { "c01-f01": {box,due,last} }
  var LS_DECKS = "psa.decks";                 // { "c01": 12 }  nº de tarjetas por clase
  var LS_EXPL = "psa.expl";                   // { "c01-1": "texto..." }

  /* ---------- helpers de almacenamiento ---------- */
  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function save(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {} }
  function now() { return Date.now(); }
  function prefixOf(id) { return (id || "").split("-")[0]; }

  /* ---------- repetición espaciada (Leitner) ---------- */
  function getState(id) {
    var srs = load(LS_SRS);
    return srs[id] || { box: 0, due: 0, last: 0 }; // box 0 = nueva
  }
  function rate(id, grade) {           // grade: 'no' | 'casi' | 'si'
    var srs = load(LS_SRS);
    var s = srs[id] || { box: 0, due: 0, last: 0 };
    if (grade === "no") s.box = 1;
    else if (grade === "casi") s.box = Math.max(1, s.box);
    else s.box = Math.min(5, (s.box || 0) + 1);
    s.last = now();
    s.due = s.last + BOX_DAYS[s.box - 1] * DAY;
    srs[id] = s;
    save(LS_SRS, srs);
  }
  function isDue(id) {
    var s = getState(id);
    return s.box === 0 || s.due <= now();   // nueva o vencida
  }

  /* ---------- estadísticas por clase ---------- */
  function registerDeck(prefix, count) {
    var d = load(LS_DECKS); d[prefix] = count; save(LS_DECKS, d);
  }
  function mastery(prefix) {            // 0..100 según cajas alcanzadas
    var decks = load(LS_DECKS), srs = load(LS_SRS);
    var total = decks[prefix] || 0; if (!total) return 0;
    var sum = 0;
    Object.keys(srs).forEach(function (k) {
      if (prefixOf(k) === prefix) sum += Math.min(srs[k].box, 5) / 5;
    });
    return Math.round((sum / total) * 100);
  }
  function dueCount(prefix) {
    var decks = load(LS_DECKS), srs = load(LS_SRS);
    var total = decks[prefix] || 0, seen = 0, due = 0;
    Object.keys(srs).forEach(function (k) {
      if (prefixOf(k) === prefix) { seen++; if (isDue(k)) due++; }
    });
    due += (total - seen);              // las nunca vistas también están "pendientes"
    return Math.max(0, due);
  }

  /* ---------- pestañas ---------- */
  function initTabs() {
    var btns = document.querySelectorAll("nav.tabs button");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (b) { b.classList.remove("active"); });
        document.querySelectorAll("section.tab").forEach(function (s) { s.classList.remove("active"); });
        btn.classList.add("active");
        var el = document.getElementById(btn.dataset.tab);
        if (el) el.classList.add("active");
      });
    });
  }

  /* ---------- flashcards con recuerdo activo + SRS ----------
     HTML esperado:
       <div class="card" data-id="c01-f01">
         <div class="q">pregunta</div><div class="a">respuesta</div>
       </div>
     onlyDue: si true, oculta las que no están vencidas (modo repaso). */
  function initFlashcards(onlyDue) {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".card[data-id]"));
    if (!cards.length) return;
    var prefix = prefixOf(cards[0].dataset.id);
    registerDeck(prefix, cards.length);

    cards.forEach(function (card) {
      var id = card.dataset.id;
      var ans = card.querySelector(".a");
      if (onlyDue && !isDue(id)) { card.style.display = "none"; return; }
      card.style.display = "";
      // estado visual segun caja
      var st = getState(id);
      card.setAttribute("data-box", st.box);

      if (card.dataset.wired) { ans.style.display = "none"; resetControls(card); return; }
      card.dataset.wired = "1";
      ans.style.display = "none";

      var ctrl = document.createElement("div");
      ctrl.className = "card-ctrl";
      var reveal = document.createElement("button");
      reveal.className = "btn-reveal"; reveal.textContent = "Mostrar respuesta";
      ctrl.appendChild(reveal);
      card.appendChild(ctrl);

      reveal.addEventListener("click", function () {
        ans.style.display = "block";
        ctrl.innerHTML = "";
        [["no", "No lo sé", "g-no"], ["casi", "Casi", "g-casi"], ["si", "Lo sé", "g-si"]]
          .forEach(function (g) {
            var b = document.createElement("button");
            b.className = "btn-grade " + g[2]; b.textContent = g[1];
            b.addEventListener("click", function () {
              rate(id, g[0]);
              card.setAttribute("data-box", getState(id).box);
              ans.style.display = "none";
              resetControls(card);
              updateBadges(prefix);
            });
            ctrl.appendChild(b);
          });
      });
    });

    function resetControls(card) {
      var ctrl = card.querySelector(".card-ctrl");
      var ans = card.querySelector(".a");
      ans.style.display = "none";
      ctrl.innerHTML = "";
      var reveal = document.createElement("button");
      reveal.className = "btn-reveal"; reveal.textContent = "Mostrar respuesta";
      reveal.addEventListener("click", function () {
        ans.style.display = "block"; ctrl.innerHTML = "";
        [["no", "No lo sé", "g-no"], ["casi", "Casi", "g-casi"], ["si", "Lo sé", "g-si"]]
          .forEach(function (g) {
            var b = document.createElement("button");
            b.className = "btn-grade " + g[2]; b.textContent = g[1];
            b.addEventListener("click", function () {
              rate(card.dataset.id, g[0]);
              card.setAttribute("data-box", getState(card.dataset.id).box);
              resetControls(card); updateBadges(prefix);
            });
            ctrl.appendChild(b);
          });
      });
      ctrl.appendChild(reveal);
    }

    updateBadges(prefix);
  }

  function updateBadges(prefix) {
    document.querySelectorAll("[data-badge='mastery']").forEach(function (el) {
      el.textContent = mastery(prefix) + "%";
    });
    document.querySelectorAll("[data-badge='due']").forEach(function (el) {
      el.textContent = dueCount(prefix);
    });
    document.querySelectorAll(".mastery-bar [data-fill]").forEach(function (el) {
      el.style.width = mastery(prefix) + "%";
    });
  }

  /* ---------- botón "repasar solo pendientes" ---------- */
  function initDueToggle() {
    var t = document.getElementById("toggle-due");
    if (!t) return;
    t.addEventListener("change", function () { initFlashcards(t.checked); });
  }

  /* ---------- auto-explicación persistente ----------
     <textarea class="selfexpl" data-id="c01-1"></textarea> */
  function initSelfExpl() {
    var expl = load(LS_EXPL);
    document.querySelectorAll("textarea.selfexpl[data-id]").forEach(function (ta) {
      var id = ta.dataset.id;
      if (expl[id]) ta.value = expl[id];
      ta.addEventListener("input", function () {
        var e = load(LS_EXPL); e[id] = ta.value; save(LS_EXPL, e);
      });
    });
  }

  /* ---------- tablero de progreso (progreso.html) ---------- */
  var CLASES = [
    ["c01", "1 · Epistemología · escuelas", "clases/clase-01.html"],
    ["c02", "2 · ICC: sueño y deseo", "clases/clase-02.html"],
    ["c03", "3 · Represión y leyes del ICC", "clases/clase-03.html"],
    ["c04", "4 · Significante · deseo (Lacan)", "clases/clase-04.html"],
    ["c05", "5 · Complejo de Edipo", "clases/clase-05.html"],
    ["c06", "6 · Teoría sexual · pulsión", "clases/clase-06.html"],
    ["c07", "7 · Edipo · pulsión (Lacan)", "clases/clase-07.html"],
    ["c08", "8 · Principios del placer", "clases/clase-08.html"],
    ["c09", "9 · Narcisismo y el yo", "clases/clase-09.html"],
    ["c10", "10 · Primera y segunda tópica", "clases/clase-10.html"],
    ["c11", "11 · Teoría del yo (Lacan)", "clases/clase-11.html"],
    ["psi", "Transversal · Psicosis", "psicosis.html"]
  ];
  function renderDashboard(containerId) {
    var c = document.getElementById(containerId); if (!c) return;
    var decks = load(LS_DECKS);
    var html = "";
    CLASES.forEach(function (cl) {
      var p = cl[0], hasDeck = decks[p];
      var m = mastery(p), due = dueCount(p);
      html += '<a class="dash-row" href="' + cl[2] + '">' +
        '<div class="dash-name">' + cl[1] + (hasDeck ? "" : ' <span class="meta">(en preparación)</span>') + '</div>' +
        '<div class="mastery-bar"><span style="width:' + m + '%"></span></div>' +
        '<div class="dash-num">' + m + '% · <b>' + (hasDeck ? due : "—") + '</b> pend.</div></a>';
    });
    c.innerHTML = html;
  }

  /* ---------- práctica intercalada (practica.html) ----------
     Usa window.BANCO (cargado por js/banco.js): array de
     { clase:"c01", q:"...", a:"...", tags:[...] } */
  function renderPractice(containerId, filterClases) {
    var c = document.getElementById(containerId); if (!c) return;
    var bank = (window.BANCO || []).slice();
    if (filterClases && filterClases.length)
      bank = bank.filter(function (x) { return filterClases.indexOf(x.clase) >= 0; });
    // baraja (Fisher-Yates con Math.random — válido en el navegador)
    for (var i = bank.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = bank[i]; bank[i] = bank[j]; bank[j] = t;
    }
    if (!bank.length) { c.innerHTML = '<p class="meta">Todavía no hay preguntas cargadas.</p>'; return; }
    var html = "";
    bank.forEach(function (item, idx) {
      html += '<div class="q"><div class="ask"><span class="chip">' +
        item.clase.toUpperCase() + "</span> " +
        (idx + 1) + ". " + item.q + "</div>" +
        "<details><summary>Ver respuesta</summary>" + item.a + "</details></div>";
    });
    c.innerHTML = html;
  }

  /* ---------- simulador de examen (examen.html) ----------
     Mezcla nShort preguntas cortas del banco + 1 consigna de desarrollo. */
  function renderExam(containerId, nShort) {
    var c = document.getElementById(containerId); if (!c) return;
    var bank = (window.BANCO || []).slice();
    for (var i = bank.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = bank[i]; bank[i] = bank[j]; bank[j] = t;
    }
    var short = bank.slice(0, nShort || 12);
    var html = "";
    short.forEach(function (item, idx) {
      html += '<div class="q"><div class="ask"><span class="chip">' + item.clase.toUpperCase() +
        "</span> " + (idx + 1) + ". " + item.q + "</div>" +
        "<details><summary>Ver respuesta</summary>" + item.a + "</details></div>";
    });
    var dev = (window.DESARROLLO || []);
    if (dev.length) {
      var d = dev[Math.floor(Math.random() * dev.length)];
      html += '<div class="q" style="border-left:4px solid var(--accent)"><div class="ask">⭐ ' +
        (short.length + 1) + ". (Desarrollo · " + d.clase.toUpperCase() + ") " + d.q + "</div>" +
        '<details><summary>¿Dónde está la respuesta modelo?</summary>En la pestaña <b>Autoevaluación</b> ' +
        '(pregunta 8) de <a href="' + d.ref + '">' + d.clase.toUpperCase() + "</a>.</details></div>";
    }
    c.innerHTML = html;
  }

  /* ---------- arranque ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
    initFlashcards(false);
    initDueToggle();
    initSelfExpl();
  });

  /* API pública para páginas especiales */
  window.PSA = {
    renderDashboard: renderDashboard,
    renderPractice: renderPractice,
    renderExam: renderExam,
    mastery: mastery, dueCount: dueCount
  };
})();
