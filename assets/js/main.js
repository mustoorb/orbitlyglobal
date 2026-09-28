/* orbitly — site behaviour
   Uses GSAP + ScrollTrigger + Lenis (vendored in assets/vendor). */
(function () {
  'use strict';

  var root = document.documentElement;
  var PROJECTS = window.ORBITLY_PROJECTS || [];
  var CONTACT = window.ORBITLY_CONTACT || {};
  var WORKING_WEEKS = 48;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;
  var hasGsap = !!(window.gsap && window.ScrollTrigger);

  // Without GSAP, fall back to a static page (CSS keys reveal states off .js)
  if (!hasGsap) root.classList.remove('js');

  // ---------------------------------------------------------------- helpers
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  // Escape, then turn [FILL: …] into visible placeholder tags
  function fillify(s) {
    return esc(s).replace(/\[FILL:[^\]]*\]/g, function (m) { return '<span class="fill">' + m + '</span>'; });
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function store(key, val) {
    try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; }
  }

  var ICON = function (id) { return '<svg><use href="#' + id + '"/></svg>'; };
  var byCat = function (c) { return PROJECTS.map(function (p, i) { return { p: p, i: i }; }).filter(function (x) { return x.p.category === c; }); };

  // ---------------------------------------------------------------- render work
  var websites = byCat('website');
  var automation = byCat('automation');
  var oses = byCat('os');
  var personal = byCat('personal');

  // counts (derived from projects.js, so they are always true)
  var countsEl = $('[data-counts]');
  if (countsEl) {
    countsEl.innerHTML = [
      ['Websites', websites.length, '#work-websites', ''],
      ['Automation', automation.length, '#work-automation', ' count--accent'],
      ['OS systems', oses.length, '#work-os', ''],
      ['Personal', personal.length, '#work-personal', '']
    ].filter(function (c) { return c[1] > 0; }).map(function (c) {
      return '<a class="count' + c[3] + '" href="' + c[2] + '"><span class="dots" data-count-to="' + c[1] + '">' + pad(c[1]) + '</span>' + c[0] + '</a>';
    }).join('');
  }

  function mockSite(v) {
    return '<span class="mock mock--' + (v % 6) + '">' +
      '<span class="mock__nav"><i class="mock__logo"></i><span class="mock__links"><i></i><i></i><i></i></span><i class="mock__btn"></i></span>' +
      '<span class="mock__hero"><span class="mock__h"><i></i><i></i><i></i></span><i class="mock__img"></i></span>' +
      '<span class="mock__row"><i></i><i></i><i></i></span></span>';
  }

  var websitesEl = $('[data-websites]');
  if (websitesEl) {
    websitesEl.innerHTML = websites.map(function (x, n) {
      var p = x.p;
      var url = p.url ? esc(p.url.replace(/^https?:\/\//, '')) : '<span class="fill">[FILL: URL]</span>';
      var screen = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + ' website" loading="lazy">' : mockSite(n);
      return '<button class="site" type="button" data-open="' + x.i + '" aria-label="Open project details">' +
        '<span class="site__num dots">' + pad(n + 1) + '</span>' +
        '<span class="site__frame glass"><span class="site__bar"><i></i><i></i><i></i><span class="site__url">' + url + '</span></span>' +
        '<span class="site__screen" data-visual>' + screen + '</span></span>' +
        '<span class="site__meta"><span><small>' + fillify(p.kind) + ' · ' + fillify(p.year) + '</small><b>' + fillify(p.title) + '</b></span><span class="site__go">' + ICON('i-arrow-ne') + '</span></span>' +
        '</button>';
    }).join('');
  }

  var autoEl = $('[data-automation]');
  if (autoEl) {
    if (!automation.length) {
      $('#work-automation').remove();
    } else {
      var a = automation[0], ap = a.p;
      var flow = (ap.flow || []).slice(0, 3);
      var icons = ['i-chat', 'i-cpu', 'i-check'];
      autoEl.innerHTML =
        '<div class="case-auto__copy on-dark">' +
          '<p class="case-auto__badge"><span class="dots">01</span><span class="tag tag--light" style="margin:0">Featured automation</span></p>' +
          '<h3>' + fillify(ap.title) + '</h3>' +
          '<p class="case-auto__summary">' + fillify(ap.summary) + '</p>' +
          '<ul class="case-auto__tags">' + (ap.tags || []).map(function (t) { return '<li>' + fillify(t) + '</li>'; }).join('') + '</ul>' +
          '<div class="case-auto__actions">' +
            '<button class="btn btn--accent magnetic" type="button" data-interest="Automation" data-source="automation-case"><span>Automate yours</span><span class="btn__ico">' + ICON('i-arrow') + '</span></button>' +
            '<button class="btn btn--glass" type="button" data-open="' + a.i + '"><span>Case details</span><span class="btn__ico">' + ICON('i-plus') + '</span></button>' +
          '</div>' +
        '</div>' +
        '<div class="flow on-dark" data-visual><span class="flow__line"><i></i></span>' +
          flow.map(function (f, k) {
            return '<div class="flow__step"><span class="round-ico ' + (k === 1 ? 'round-ico--accent' : 'round-ico--dark') + '">' + ICON(icons[k]) + '</span>' +
              '<span class="flow__io dots">' + esc(f.io) + '</span><span><b>' + fillify(f.title) + '</b><small>' + fillify(f.note) + '</small></span></div>';
          }).join('') +
        '</div>';
    }
  }

  function osHome(n) {
    var grid = '';
    for (var k = 0; k < 12; k++) grid += '<i class="' + (k === (n * 3 + 1) % 12 ? 'a' : k === (n * 5 + 6) % 12 ? 'w' : '') + '"></i>';
    return '<div class="os-home"><div class="os-home__time dots" data-clock>--:--</div><div class="os-home__date" data-date></div>' +
      '<div class="os-home__brand">OS · ' + pad(n + 1) + '</div>' +
      '<div class="os-home__grid">' + grid + '</div><div class="os-home__dock"><i></i><i></i><i></i><i></i></div></div>';
  }
  var osEl = $('[data-os]');
  if (osEl) {
    if (!oses.length) $('#work-os').remove();
    osEl.innerHTML = oses.map(function (x, n) {
      var p = x.p;
      var screen = p.image ? '<img class="os-shot" src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">' : osHome(n);
      return '<button class="os-dev" type="button" data-open="' + x.i + '" aria-label="Open project details">' +
        '<span class="phone" data-visual><span class="phone__frame"><span class="phone__screen"><span class="phone__glow"></span><span class="phone__island"></span>' + screen + '</span></span></span>' +
        '<span class="os-dev__label on-dark"><small>' + fillify(p.kind) + '</small><b>' + fillify(p.title) + '</b></span></button>';
    }).join('');
  }

  var arts = ['<span class="art art--dots"></span>', '<span class="art art--orbit"><span></span><span></span><span></span></span>', '<span class="art art--grid"></span>'];
  var personalEl = $('[data-personal]');
  if (personalEl) {
    if (!personal.length) $('#work-personal').remove();
    personalEl.innerHTML = personal.map(function (x, n) {
      var p = x.p;
      var art = p.image ? '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">' : arts[n % 3] + '<span class="art__num dots">' + pad(n + 1) + '</span>';
      return '<button class="fun" type="button" data-open="' + x.i + '" aria-label="Open project details">' +
        '<span class="fun__art" data-visual>' + art + '</span>' +
        '<span class="fun__meta"><span><small>' + fillify(p.kind) + ' · ' + fillify(p.year) + '</small><b>' + fillify(p.title) + '</b></span><span class="site__go">' + ICON('i-arrow-ne') + '</span></span></button>';
    }).join('');
  }

  // ---------------------------------------------------------------- contact details
  var contactHref = {
    email: CONTACT.email ? 'mailto:' + CONTACT.email : '',
    whatsapp: CONTACT.whatsapp ? 'https://wa.me/' + String(CONTACT.whatsapp).replace(/\D/g, '') : '',
    booking: CONTACT.booking || ''
  };
  var contactText = { email: CONTACT.email, whatsapp: CONTACT.whatsapp ? '+' + String(CONTACT.whatsapp).replace(/\D/g, '') : '', booking: CONTACT.booking ? 'Book a call' : '' };
  $$('[data-contact]').forEach(function (a) {
    var k = a.dataset.contact;
    if (contactHref[k]) {
      a.href = contactHref[k];
      if (k !== 'email') { a.target = '_blank'; a.rel = 'noopener'; }
      $('[data-contact-label="' + k + '"]', a).textContent = contactText[k];
    } else {
      a.addEventListener('click', function (e) { e.preventDefault(); goTo($('[data-form]')); });
    }
  });

  // ---------------------------------------------------------------- live bits
  function tickClock() {
    var d = new Date();
    var t = pad(d.getHours()) + ':' + pad(d.getMinutes());
    $$('[data-clock]').forEach(function (el) { el.textContent = t; });
    var ds = d.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' });
    $$('[data-date]').forEach(function (el) { el.textContent = ds; });
  }
  tickClock();
  setInterval(tickClock, 15000);

  $$('[data-tick]').forEach(function (el) {
    var n = +el.dataset.tick;
    setInterval(function () { n += 1 + Math.round(Math.random()); el.textContent = n; }, +el.dataset.tickRate || 3000);
  });

  var yr = $('[data-year]');
  if (yr) yr.textContent = new Date().getFullYear();

  // ---------------------------------------------------------------- smooth scroll
  var lenis = null;
  function goTo(target, offset) {
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { offset: offset == null ? -12 : offset, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }

  // ---------------------------------------------------------------- form + CTAs
  var form = $('[data-form]');
  function prefill(interest, source, calcSummary) {
    if (!form) return;
    if (interest) {
      var radio = $('input[name="interest"][value="' + interest + '"]', form);
      if (radio) radio.checked = true;
    }
    if (source) form.elements.source.value = source;
    if (calcSummary) form.elements.calculator.value = calcSummary;
  }
  function toForm(interest, source, calcSummary) {
    prefill(interest, source, calcSummary);
    goTo($('#contact'));
    setTimeout(function () { var n = form && form.elements.name; if (n && !n.value) n.focus({ preventScroll: true }); }, 1300);
  }

  document.addEventListener('click', function (e) {
    var interestBtn = e.target.closest('[data-interest]');
    if (interestBtn) { e.preventDefault(); closeDrawer(); toForm(interestBtn.dataset.interest, interestBtn.dataset.source || interestBtn.dataset.interest.toLowerCase()); return; }

    var openBtn = e.target.closest('[data-open]');
    if (openBtn) { e.preventDefault(); openDrawer(+openBtn.dataset.open, openBtn); return; }

    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (id === '#' || id.length < 2) return;
    var t = document.getElementById(id.slice(1));
    if (!t) return;
    e.preventDefault();
    if (a.dataset.cta) prefill(null, a.dataset.cta);
    if (a.hasAttribute('data-drawer-cta')) closeDrawer();
    goTo(t, id === '#top' ? 0 : -12);
  });

  if (form) {
    var done = $('.form__done', form);
    var label = $('[data-submit-label]', form);
    var labelText = label ? label.textContent : '';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      form.classList.add('is-sending');
      if (label) label.textContent = 'Sending…';
      var body = new URLSearchParams(new FormData(form)).toString();
      fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
        .then(function (r) {
          if (!r.ok) throw new Error(r.status);
          done.hidden = false;
          if (hasGsap && !reduce) gsap.from(done.children, { y: 20, opacity: 0, stagger: .08, duration: .8, ease: 'expo.out' });
        })
        .catch(function () {
          if (label) label.textContent = "Couldn't send, please try again";
          setTimeout(function () { if (label) label.textContent = labelText; }, 4000);
        })
        .then(function () { form.classList.remove('is-sending'); });
    });
  }

  // ---------------------------------------------------------------- calculator
  var calc = $('#calc');
  if (calc) {
    var outHours = $('#out-hours');
    var outCost = $('#out-cost');
    var cur = CONTACT.currency;
    var curLabel = $('[data-currency]', calc);
    curLabel.innerHTML = cur ? esc(cur) : '<span class="fill fill--dark">[FILL: currency]</span>';
    var nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
    var money = null;
    try { if (cur) money = new Intl.NumberFormat(undefined, { style: 'currency', currency: cur, maximumFractionDigits: 0 }); } catch (err) { money = null; }
    var last = { hours: 0, cost: null };

    var update = function () {
      var people = +calc.people.value, hours = +calc.hours.value, share = +calc.share.value / 100;
      var rate = parseFloat(calc.rate.value);
      $('[data-for="people"]', calc).textContent = people;
      $('[data-for="hours"]', calc).textContent = hours;
      $('[data-for="share"]', calc).textContent = Math.round(share * 100) + '%';
      var saved = people * hours * WORKING_WEEKS * share;
      outHours.textContent = nf.format(saved);
      var cost = isFinite(rate) && rate > 0 ? saved * rate : null;
      outCost.textContent = cost == null ? '—' : money ? money.format(cost) : nf.format(cost);
      last = { people: people, hours: hours, share: share, saved: saved, cost: cost };
      $$('input[type="range"]', calc).forEach(function (r) {
        r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
      });
    };
    calc.addEventListener('input', update);
    update();

    $('[data-calc-cta]').addEventListener('click', function () {
      var s = last.people + ' people × ' + last.hours + ' h/week × ' + Math.round(last.share * 100) + '% = ~' + nf.format(last.saved) + ' h/year' +
        (last.cost != null ? ' (~' + (money ? money.format(last.cost) : nf.format(last.cost)) + ')' : '');
      toForm('Automation', 'calculator', s);
    });
  }

  // ---------------------------------------------------------------- drawer
  var drawer = $('[data-drawer]');
  var lastFocus = null;
  function openDrawer(i, trigger) {
    var p = PROJECTS[i];
    if (!p || !drawer) return;
    lastFocus = trigger || document.activeElement;
    var media = $('[data-drawer-media]', drawer);
    media.innerHTML = '';
    var vis = p.category === 'automation' ? $('#work-automation [data-visual]') : trigger && trigger.querySelector('[data-visual]');
    if (vis) {
      var clone = vis.cloneNode(true);
      $$('.flow__step', clone).forEach(function (s) { s.classList.add('is-on'); });
      var line = $('.flow__line i', clone); if (line) line.style.transform = 'none';
      media.appendChild(clone);
    }
    $('[data-drawer-kind]', drawer).innerHTML = fillify(p.kind + ' · ' + p.year);
    $('[data-drawer-title]', drawer).innerHTML = fillify(p.title);
    $('[data-drawer-summary]', drawer).innerHTML = fillify(p.summary);
    $('[data-drawer-tags]', drawer).innerHTML = (p.tags || []).map(function (t) { return '<li>' + fillify(t) + '</li>'; }).join('');
    var link = $('[data-drawer-link]', drawer);
    if (p.url) { link.href = p.url; link.hidden = false; } else { link.hidden = true; }
    var cta = $('[data-drawer-cta]', drawer);
    var interest = { website: 'Website', automation: 'Automation', os: 'Custom system', personal: 'Not sure yet' }[p.category] || 'Not sure yet';
    cta.dataset.interest = interest;
    cta.dataset.source = 'project: ' + p.category;
    drawer.hidden = false;
    requestAnimationFrame(function () { drawer.classList.add('is-open'); });
    document.body.classList.add('is-locked');
    if (lenis) lenis.stop();
    setTimeout(function () { $('.drawer__close', drawer).focus(); }, 50);
  }
  function closeDrawer() {
    if (!drawer || drawer.hidden) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (lenis) lenis.start();
    setTimeout(function () { drawer.hidden = true; }, 500);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  if (drawer) {
    drawer.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeDrawer(); });
    document.addEventListener('keydown', function (e) {
      if (drawer.hidden) return;
      if (e.key === 'Escape') closeDrawer();
      if (e.key === 'Tab') {
        var f = $$('button, a[href]:not([hidden])', drawer).filter(function (el) { return !el.hidden && el.offsetParent !== null; });
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  // ---------------------------------------------------------------- story steps (shared)
  var storyItems = $$('.story__list li');
  var storyScreens = $$('.scr--story');
  var storyDots = $$('.scr__dots i');
  var storyIndex = -1;
  function setStep(i) {
    if (i === storyIndex) return;
    storyIndex = i;
    storyItems.forEach(function (li, k) { li.classList.toggle('is-active', k === i); });
    storyScreens.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
    storyDots.forEach(function (d, k) { d.classList.toggle('is-on', k === i); });
  }
  setStep(0);

  // ---------------------------------------------------------------- no-GSAP / reduced-motion path
  if (!hasGsap) {
    var ld = $('.loader'); if (ld) ld.classList.add('is-done');
    $$('.flow__step').forEach(function (s) { s.classList.add('is-on'); });
    storyItems.forEach(function (li, k) { li.addEventListener('click', function () { setStep(k); }); });
    var hs = $('.hscroll'); if (hs) hs.classList.add('no-pin');
    var dk = $('.dock'); if (dk) dk.classList.add('is-shown');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  if (!reduce) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.4 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // ---------------------------------------------------------------- split text
  function splitWords(el, cls) {
    var out = [];
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            if (cls) {
              var w = document.createElement('span'); w.className = cls; w.textContent = part; frag.appendChild(w); out.push(w);
            } else {
              var o = document.createElement('span'); o.className = 'split-line';
              var inner = document.createElement('span'); inner.textContent = part;
              o.appendChild(inner); frag.appendChild(o); out.push(inner);
            }
          });
          n.parentNode.replaceChild(frag, n);
        } else if (n.nodeType === 1 && n.tagName !== 'BR' && !n.classList.contains('fill')) {
          walk(n);
        }
      });
    })(el);
    return out;
  }

  var heroTitle = $('.hero__title');
  var heroWords = heroTitle ? splitWords(heroTitle) : [];
  if (heroTitle) heroTitle.classList.add('is-split');

  $$('[data-split]').forEach(function (el) {
    if (el === heroTitle) return;
    var words = splitWords(el);
    el.classList.add('is-split');
    if (reduce) return;
    gsap.set(words, { yPercent: 115, rotate: 5 });
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: function () { gsap.to(words, { yPercent: 0, rotate: 0, duration: 1.1, ease: 'expo.out', stagger: 0.035 }); }
    });
  });

  // intro: words light up as you scroll
  $$('[data-words]').forEach(function (el) {
    var words = splitWords(el, 'w');
    if (reduce) { words.forEach(function (w) { w.classList.add('is-lit'); }); return; }
    ScrollTrigger.create({
      trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: function (s) {
        var lit = Math.round(s.progress * words.length);
        words.forEach(function (w, k) { w.classList.toggle('is-lit', k < lit); });
      }
    });
  });

  // generic reveals
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 90%', once: true,
    onEnter: function (els) { gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }); }
  });
  if (reduce) gsap.set('[data-reveal]', { opacity: 1, y: 0 });

  // counters
  $$('[data-count-to]').forEach(function (el) {
    var to = +el.dataset.countTo;
    var o = { v: 0 };
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () {
      gsap.to(o, { v: to, duration: reduce ? 0 : 1.2, ease: 'power2.out', onUpdate: function () { el.textContent = pad(Math.round(o.v)); } });
    } });
  });

  // ---------------------------------------------------------------- loader → hero
  var loader = $('.loader');
  var heroPhone = $('[data-hero-phone]');
  var floats = $$('.float');
  gsap.set(heroPhone, { rotationZ: -9, rotationY: -14, rotationX: 6 });
  gsap.set(floats, { z: 140 });
  gsap.set(heroWords, { yPercent: 115, rotate: 6 });
  if (!reduce) {
    gsap.set(heroPhone, { y: 160, opacity: 0, rotationX: 40 });
    gsap.set(floats, { opacity: 0, scale: .6, y: 30 });
  }

  function heroIn() {
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to(heroWords, { yPercent: 0, rotate: 0, duration: reduce ? 0 : 1.3, stagger: 0.045 }, 0)
      .to('[data-hero-in]', { opacity: 1, y: 0, duration: reduce ? 0 : 1.1, stagger: 0.09 }, 0.15);
    if (!reduce) {
      tl.to(heroPhone, { y: 0, opacity: 1, rotationX: 6, duration: 1.8 }, 0.1)
        .to(floats, { opacity: 1, scale: 1, y: 0, duration: 1, stagger: 0.12, ease: 'back.out(1.7)' }, 0.8);
    }
    return tl;
  }

  var seen = store('orbitly-loaded');
  if (reduce || seen) {
    loader.classList.add('is-done');
    heroIn();
  } else {
    var cnt = $('[data-loader-count]');
    var bar = $('.loader__bar i');
    var lo = { v: 0 };
    if (lenis) lenis.stop();
    gsap.timeline()
      .to(lo, { v: 100, duration: 1.3, ease: 'power2.inOut', onUpdate: function () {
        cnt.textContent = pad(Math.round(lo.v)).slice(-3);
        bar.style.width = lo.v + '%';
      } })
      .to('.loader__inner', { y: -40, opacity: 0, duration: .5, ease: 'power2.in' }, '+=.1')
      .to(loader, { yPercent: -100, duration: .9, ease: 'expo.inOut', onComplete: function () {
        loader.classList.add('is-done');
        if (lenis) lenis.start();
        store('orbitly-loaded', '1');
      } }, '-=.15')
      .add(heroIn(), '-=.55');
  }

  // ---------------------------------------------------------------- chrome: top bar + dock
  var top = $('.top'), dock = $('.dock');
  var showChrome = function (show) { if (dock) dock.classList.toggle('is-shown', show); };
  ScrollTrigger.create({
    trigger: '.hero', start: 'bottom 60%', end: 'max',
    onToggle: function (s) { showChrome(s.isActive); }
  });
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate: function (s) { top.classList.toggle('is-hidden', s.direction === 1 && s.scroll() > 400); }
  });
  ['work', 'services', 'process', 'calculator', 'faq', 'contact'].forEach(function (id) {
    var sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 55%',
      onToggle: function (s) {
        $$('.top__links a[href="#' + id + '"], .dock__btn[href="#' + id + '"]').forEach(function (a) { a.classList.toggle('is-active', s.isActive); });
      }
    });
  });

  // ---------------------------------------------------------------- ticker (speeds up with scroll)
  var track = $('[data-ticker]');
  if (track) {
    track.innerHTML += track.innerHTML.replace(/<span>/g, '<span aria-hidden="true">');
    var loop = gsap.to(track, { xPercent: -50, ease: 'none', duration: 38, repeat: -1 });
    if (reduce) loop.pause();
    else if (lenis) {
      lenis.on('scroll', function (l) {
        var v = Math.min(4, 1 + Math.abs(l.velocity) / 12);
        gsap.to(loop, { timeScale: l.velocity < 0 ? -v : v, duration: .3, overwrite: true });
      });
    }
  }

  var mm = gsap.matchMedia();

  // ---------------------------------------------------------------- hero parallax + tilt
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    gsap.to('.hero__word', { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to(heroPhone, { y: -140, rotationZ: 0, rotationY: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    floats.forEach(function (f) {
      gsap.to(f, { y: +f.dataset.float * 2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    });
    gsap.to('.hero__copy', { y: -80, opacity: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center center', end: 'bottom top', scrub: true } });
  });

  var stage = $('[data-tilt]');
  if (stage && finePointer && !reduce) {
    var rx = gsap.quickTo(stage, 'rotationX', { duration: .8, ease: 'power3' });
    var ry = gsap.quickTo(stage, 'rotationY', { duration: .8, ease: 'power3' });
    gsap.set(stage, { transformStyle: 'preserve-3d' });
    $('.hero').addEventListener('pointermove', function (e) {
      var px = e.clientX / window.innerWidth - 0.5, py = e.clientY / window.innerHeight - 0.5;
      ry(px * 16); rx(-py * 12);
    });
    $('.hero').addEventListener('pointerleave', function () { rx(0); ry(0); });
  }

  // ---------------------------------------------------------------- websites: pinned horizontal scroll
  var hs = $('.hscroll');
  var hTrack = $('.hscroll__track');
  var hProg = $('[data-hprogress]');
  mm.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', function () {
    var dist = function () { return Math.max(0, hTrack.scrollWidth - window.innerWidth); };
    var tw = gsap.to(hTrack, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: {
        trigger: '.hscroll__pin', pin: true, start: 'top top', end: function () { return '+=' + dist(); },
        scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
        onUpdate: function (s) { if (hProg) hProg.style.transform = 'scaleX(' + s.progress + ')'; }
      }
    });
    $$('.site', hTrack).forEach(function (card) {
      gsap.fromTo(card, { rotationY: -18, y: 40, opacity: .4 }, {
        rotationY: 0, y: 0, opacity: 1, ease: 'none',
        scrollTrigger: { trigger: card, containerAnimation: tw, start: 'left 100%', end: 'left 55%', scrub: true }
      });
    });
    return function () { gsap.set(hTrack, { clearProps: 'all' }); };
  });
  mm.add('(max-width: 720px), (prefers-reduced-motion: reduce)', function () {
    if (reduce && hs) hs.classList.add('no-pin');
    if (reduce) return;
    $$('.site', hTrack).forEach(function (card) {
      gsap.from(card, { y: 60, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 90%', once: true } });
    });
  });

  // ---------------------------------------------------------------- automation: pinned flow
  var flowSteps = $$('#work-automation .flow__step');
  var flowLine = $('#work-automation .flow__line i');
  function paintFlow(p) {
    if (flowLine) flowLine.style.transform = 'scaleY(' + p + ')';
    flowSteps.forEach(function (s, k) { s.classList.toggle('is-on', p >= k * 0.4 + 0.02); });
  }
  if (flowSteps.length) {
    mm.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', function () {
      ScrollTrigger.create({
        trigger: '.case-auto__pin', pin: true, start: 'top top', end: '+=140%', scrub: true,
        onUpdate: function (s) { paintFlow(s.progress); }
      });
      gsap.from('.case-auto__copy > *', { y: 40, opacity: 0, stagger: .08, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.case-auto', start: 'top 60%', once: true } });
    });
    mm.add('(max-width: 720px)', function () {
      ScrollTrigger.create({ trigger: '#work-automation .flow', start: 'top 80%', end: 'bottom 50%', scrub: true, onUpdate: function (s) { paintFlow(s.progress); } });
    });
    if (reduce) paintFlow(1);
  }

  // ---------------------------------------------------------------- OS: phones fan out
  var devs = $$('.os-dev');
  if (devs.length) {
    mm.add('(min-width: 721px) and (prefers-reduced-motion: no-preference)', function () {
      var mid = (devs.length - 1) / 2;
      var tl = gsap.timeline({ scrollTrigger: { trigger: '.os__stage', start: 'top 95%', end: 'center 55%', scrub: 1 } });
      devs.forEach(function (d, k) {
        var o = k - mid;
        tl.fromTo(d, { xPercent: -o * 96, y: 160, rotationY: 0, rotationZ: 0, scale: .86 },
          { xPercent: 0, y: Math.abs(o) * 40, rotationY: -o * 22, rotationZ: o * 5, scale: o === 0 ? 1.06 : 1, ease: 'power2.out' }, 0);
      });
    });
    mm.add('(max-width: 720px) and (prefers-reduced-motion: no-preference)', function () {
      devs.forEach(function (d) { gsap.from(d, { y: 80, opacity: 0, rotationX: 20, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: d, start: 'top 88%', once: true } }); });
    });
  }

  // ---------------------------------------------------------------- personal: tilt
  if (finePointer && !reduce) {
    $$('.fun').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        card.style.transform = 'rotateX(' + (-py * 10) + 'deg) rotateY(' + (px * 12) + 'deg) translateZ(0)';
      });
      card.addEventListener('pointerleave', function () { card.style.transform = ''; });
    });
  }
  if (!reduce) {
    ScrollTrigger.batch('.fun', { start: 'top 90%', once: true, onEnter: function (els) {
      gsap.from(els, { y: 80, opacity: 0, rotationX: -14, duration: 1.1, ease: 'expo.out', stagger: .1 });
    } });
  }

  // ---------------------------------------------------------------- story: pinned phone
  var storyST = null;
  mm.add('(min-width: 1101px) and (prefers-reduced-motion: no-preference)', function () {
    storyST = ScrollTrigger.create({
      trigger: '.story__pin', pin: true, start: 'top top', end: '+=300%', scrub: true,
      onUpdate: function (s) { setStep(Math.min(storyItems.length - 1, Math.floor(s.progress * storyItems.length))); }
    });
    gsap.fromTo('.phone--story', { rotationY: -18, rotationZ: -4 }, { rotationY: 12, rotationZ: 3, ease: 'none', scrollTrigger: { trigger: '.story__pin', start: 'top top', end: '+=300%', scrub: true } });
    return function () { storyST = null; };
  });
  // smaller screens: cycle while in view
  var cycle = null;
  mm.add('(max-width: 1100px), (prefers-reduced-motion: reduce)', function () {
    var st = ScrollTrigger.create({
      trigger: '.story', start: 'top 70%', end: 'bottom 30%',
      onToggle: function (s) {
        clearInterval(cycle);
        if (s.isActive && !reduce) cycle = setInterval(function () { setStep((storyIndex + 1) % storyItems.length); }, 2600);
      }
    });
    return function () { clearInterval(cycle); st.kill(); };
  });
  storyItems.forEach(function (li, k) {
    li.style.cursor = 'pointer';
    li.addEventListener('click', function () {
      if (storyST && lenis) {
        lenis.scrollTo(storyST.start + (storyST.end - storyST.start) * ((k + .5) / storyItems.length), { duration: 1.2 });
      } else {
        clearInterval(cycle); setStep(k);
      }
    });
  });

  // ---------------------------------------------------------------- hardware wire + scribble
  var scribble = $('.scribble');
  if (scribble) ScrollTrigger.create({ trigger: scribble, start: 'top 85%', once: true, onEnter: function () { scribble.classList.add('is-drawn'); } });

  // contact title parallax glow
  mm.add('(prefers-reduced-motion: no-preference)', function () {
    gsap.fromTo('.contact__bg', { yPercent: -10 }, { yPercent: 10, ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.footer__word', { yPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'top 40%', scrub: true } });
  });

  // ---------------------------------------------------------------- magnetic buttons + cursor
  if (finePointer && !reduce) {
    $$('.magnetic').forEach(function (el) {
      var xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'power3' });
      var yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * .25);
        yTo((e.clientY - (r.top + r.height / 2)) * .35);
      });
      el.addEventListener('pointerleave', function () { xTo(0); yTo(0); });
    });

    var cursor = $('.cursor');
    var cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3' });
    var cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('pointermove', function (e) {
      cursor.classList.add('is-on');
      cx(e.clientX); cy(e.clientY);
      cursor.classList.toggle('is-hover', !!e.target.closest('a, button, label, summary, input, [data-open]'));
    }, { passive: true });
    document.addEventListener('pointerleave', function () { cursor.classList.remove('is-on'); });
  }

  // ---------------------------------------------------------------- refresh once fonts/images settle
  var refresh = function () { ScrollTrigger.refresh(); };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
  window.addEventListener('load', refresh);
})();
