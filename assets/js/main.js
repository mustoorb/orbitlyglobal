/* orbitly — site behaviour (no dependencies) */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // CONFIG — set once the owner confirms (see README "Open placeholders").
  // CURRENCY: ISO code, e.g. 'USD', 'LKR', 'MYR'. Leave null to show a placeholder.
  // ---------------------------------------------------------------------------
  var CURRENCY = null;
  var WORKING_WEEKS = 48;

  document.documentElement.classList.add('js');

  // Footer year
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Sticky nav border on scroll
  var nav = document.querySelector('.nav');
  var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 820) setMenu(false); });

  // Scroll reveal (staggered within each parent)
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var siblings = Array.prototype.filter.call(el.parentElement.children, function (c) {
          return c.classList.contains('reveal');
        });
        el.style.setProperty('--d', (Math.max(0, siblings.indexOf(el)) * 0.08) + 's');
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // Placeholder links: don't jump to top while contact details are unfilled
  document.querySelectorAll('a[data-fill]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (a.getAttribute('href') === '#') {
        e.preventDefault();
        a.title = 'Placeholder: add ' + a.dataset.fill;
      }
    });
  });

  // ---------------------------------------------------------------------------
  // Hours calculator
  // ---------------------------------------------------------------------------
  var form = document.getElementById('calc');
  if (!form) return;

  var outHours = document.getElementById('out-hours');
  var outCost = document.getElementById('out-cost');
  var currencyLabel = form.querySelector('[data-currency]');
  if (CURRENCY) {
    currencyLabel.textContent = CURRENCY;
  } else {
    currencyLabel.innerHTML = '<span class="fill">[FILL: currency]</span>';
  }

  var nf = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });
  var money = CURRENCY
    ? new Intl.NumberFormat(undefined, { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 })
    : null;

  function paintRange(input) {
    var min = +input.min, max = +input.max;
    input.style.setProperty('--p', ((input.value - min) / (max - min) * 100) + '%');
  }

  function update() {
    var people = +form.people.value;
    var hours = +form.hours.value;
    var share = +form.share.value / 100;
    var rate = parseFloat(form.rate.value);

    form.querySelector('[data-for="people"]').textContent = people;
    form.querySelector('[data-for="hours"]').textContent = hours;
    form.querySelector('[data-for="share"]').textContent = Math.round(share * 100) + '%';

    var saved = people * hours * WORKING_WEEKS * share;
    outHours.textContent = nf.format(saved);

    if (isFinite(rate) && rate > 0) {
      var cost = saved * rate;
      outCost.textContent = money ? money.format(cost) : nf.format(cost);
    } else {
      outCost.textContent = '—';
    }

    form.querySelectorAll('input[type="range"]').forEach(paintRange);
  }

  form.addEventListener('input', update);
  update();
})();
