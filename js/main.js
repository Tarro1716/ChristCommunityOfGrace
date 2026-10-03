/* Christ Community of Grace — site behaviour
   1. Active nav link       2. Language toggle (lang/*.json)
   3. Click-to-load YouTube 4. Copy buttons
   5. Upcoming events filter 6. Footer year
*/
(function () {
  'use strict';

  // ---------- 1. Active nav link ----------
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    if (link.getAttribute('href') === current) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });

  // ---------- 2. Language toggle ----------
  var LANG_NAMES = { en: 'English', tl: 'Tagalog' };
  var STORAGE_KEY = 'ccg-lang';
  var toggle = document.getElementById('langToggle');
  var dicts = { en: null, tl: null };
  var currentLang = 'en';

  function rememberOriginals() {
    document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-attr], [data-tl]').forEach(function (el) {
      if (el.hasAttribute('data-i18n') && !el.hasAttribute('data-orig')) el.setAttribute('data-orig', el.textContent);
      if (el.hasAttribute('data-i18n-html') && !el.hasAttribute('data-orig-html')) el.setAttribute('data-orig-html', el.innerHTML);
      if (el.hasAttribute('data-tl') && !el.hasAttribute('data-orig')) el.setAttribute('data-orig', el.textContent);
      if (el.hasAttribute('data-i18n-attr')) {
        el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
          var attr = pair.split(':')[0].trim();
          if (!el.hasAttribute('data-orig-' + attr)) el.setAttribute('data-orig-' + attr, el.getAttribute(attr) || '');
        });
      }
    });
  }

  function applyLang(lang) {
    var dict = dicts[lang];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      el.textContent = (dict && dict[key] != null) ? dict[key] : el.getAttribute('data-orig');
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      el.innerHTML = (dict && dict[key] != null) ? dict[key] : el.getAttribute('data-orig-html');
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(',').forEach(function (pair) {
        var parts = pair.split(':');
        var attr = parts[0].trim(), key = parts[1].trim();
        el.setAttribute(attr, (dict && dict[key] != null) ? dict[key] : el.getAttribute('data-orig-' + attr));
      });
    });
    document.querySelectorAll('[data-tl]').forEach(function (el) {
      el.textContent = lang === 'tl' ? el.getAttribute('data-tl') : el.getAttribute('data-orig');
    });
    document.documentElement.setAttribute('lang', lang);
    currentLang = lang;
    if (toggle) {
      var other = lang === 'en' ? 'tl' : 'en';
      toggle.querySelector('[data-lang-label]').textContent = LANG_NAMES[other];
      var code = toggle.querySelector('[data-lang-code]');
      if (code) code.textContent = other.toUpperCase();
      toggle.setAttribute('lang', other);
    }
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function loadDict(lang) {
    if (lang === 'en') return Promise.resolve(null);
    if (dicts[lang]) return Promise.resolve(dicts[lang]);
    return fetch('lang/' + lang + '.json').then(function (r) {
      if (!r.ok) throw new Error('lang file');
      return r.json();
    }).then(function (d) { dicts[lang] = d; return d; });
  }

  function setLang(lang) {
    return loadDict(lang).then(function () { applyLang(lang); }).catch(function () {
      // Could not load the translation (e.g. opened from file://). Stay in English and hide the toggle.
      if (toggle) toggle.hidden = true;
    });
  }

  if (toggle) {
    rememberOriginals();
    var params = new URLSearchParams(window.location.search);
    var saved = null;
    try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    var initial = params.get('lang') || saved || 'en';
    if (!LANG_NAMES[initial]) initial = 'en';
    if (initial !== 'en') setLang(initial);
    toggle.addEventListener('click', function () {
      setLang(currentLang === 'en' ? 'tl' : 'en');
    });
  }

  // ---------- 3. Click-to-load YouTube ----------
  document.querySelectorAll('.yt-lite').forEach(function (box) {
    var play = function () {
      var id = box.getAttribute('data-id');
      var list = box.getAttribute('data-list');
      var title = box.getAttribute('data-title') || 'YouTube video';
      var src = list
        ? 'https://www.youtube-nocookie.com/embed/videoseries?list=' + encodeURIComponent(list) + '&autoplay=1&rel=0'
        : 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(id) + '?autoplay=1&rel=0';
      var iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = title;
      iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      box.innerHTML = '';
      box.appendChild(iframe);
      box.classList.add('is-playing');
    };
    box.addEventListener('click', play, { once: true });
  });

  // ---------- 4. Copy buttons ----------
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var target = document.querySelector(btn.getAttribute('data-copy'));
      if (!target) return;
      var text = target.textContent.trim();
      var done = function () {
        var label = btn.querySelector('[data-i18n]');
        var dict = dicts[currentLang];
        var copied = (dict && dict['common.copied']) || 'Copied!';
        var original = label ? label.textContent : '';
        if (label) label.textContent = copied;
        btn.classList.add('is-copied');
        setTimeout(function () {
          if (label) label.textContent = original;
          btn.classList.remove('is-copied');
        }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text); done();
      }
    });
  });
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'absolute'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); } catch (e) { /* ignore */ }
    document.body.removeChild(ta);
  }

  // ---------- 5. Upcoming events: hide past dates, limit count ----------
  var now = new Date();
  var today = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
  document.querySelectorAll('[data-events]').forEach(function (list) {
    var limit = parseInt(list.getAttribute('data-limit'), 10) || Infinity;
    var shown = 0;
    var nextLabel = (dicts[currentLang] && dicts[currentLang]['events.next']) || 'Next';
    list.querySelectorAll('[data-date]').forEach(function (item) {
      var isPast = item.getAttribute('data-date') < today;
      if (isPast || shown >= limit) { item.classList.add('is-past'); return; }
      if (shown === 0) {
        item.classList.add('is-next');
        var badge = item.querySelector('.date-badge');
        if (badge) badge.setAttribute('data-next-label', nextLabel);
      }
      shown++;
    });
    var empty = list.parentElement.querySelector('[data-events-empty]');
    if (empty) empty.classList.toggle('d-none', shown > 0);
  });

  // ---------- 6. Scroll reveal ----------
  var revealTargets = document.querySelectorAll('main section > .container, .home-hero-text');
  revealTargets.forEach(function (el) { el.classList.add('reveal'); });
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // ---------- 7. Footer year ----------
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
