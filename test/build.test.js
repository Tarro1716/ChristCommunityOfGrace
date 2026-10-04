// Run: node build.js && node --test test/
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');
const pages = fs.readdirSync(path.join(root, 'src/pages')).filter((f) => f.endsWith('.html'));
const en = JSON.parse(read('lang/en.json'));
const tl = JSON.parse(read('lang/tl.json'));

test('every source page produced an output page', () => {
  for (const p of pages) assert.ok(fs.existsSync(path.join(root, p)), `${p} missing`);
});

test('shared chrome is present on every page', () => {
  for (const p of pages) {
    const html = read(p);
    assert.match(html, /<main id="main"/, `${p}: no <main>`);
    assert.match(html, /class="skip-link"/, `${p}: no skip link`);
    assert.match(html, /<nav class="navbar/, `${p}: no navbar`);
    assert.match(html, /<footer class="site-footer"/, `${p}: no footer`);
    assert.match(html, /id="langToggle"/, `${p}: no language toggle`);
    assert.doesNotMatch(html, /bootstrap-icons/, `${p}: still loads icon font`);
  }
});

test('no unresolved template placeholders or inline styles', () => {
  for (const p of pages) {
    const html = read(p);
    assert.doesNotMatch(html, /\{\{/, `${p}: unresolved {{ }}`);
    assert.doesNotMatch(html, / style="/, `${p}: inline style attribute`);
  }
});

test('internal links and assets resolve to real files', () => {
  for (const p of pages) {
    const html = read(p);
    const refs = [...html.matchAll(/(?:href|src)="([^"#?:]+)(?:[#?][^"]*)?"/g)].map((m) => m[1]);
    for (const r of refs) {
      if (r.startsWith('data:') || r.startsWith('//')) continue;
      assert.ok(fs.existsSync(path.join(root, r)), `${p}: ${r} does not exist`);
    }
  }
});

test('language files have identical key sets', () => {
  assert.deepEqual(Object.keys(en).sort(), Object.keys(tl).sort());
  for (const k of Object.keys(tl)) assert.ok(String(tl[k]).trim(), `tl.${k} is empty`);
});

test('every data-i18n key used in output exists in both language files', () => {
  for (const p of pages) {
    const html = read(p);
    const keys = [
      ...[...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]),
      ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.split(':')[1])),
    ];
    for (const k of keys) {
      assert.ok(k in en, `${p}: key "${k}" missing from en.json`);
      assert.ok(k in tl, `${p}: key "${k}" missing from tl.json`);
    }
  }
});

test('events and sermons from data files are rendered', () => {
  const events = JSON.parse(read('data/events.json'));
  const sermons = JSON.parse(read('data/sermons.json'));
  const ev = read('events.html');
  for (const e of events) assert.ok(ev.includes(`data-date="${e.date}"`), `event ${e.date} missing`);
  const se = read('sermons.html');
  const cfg = JSON.parse(read('site.config.json'));
  const hasPlaylist = Boolean(cfg.youtube.uploadsPlaylist || cfg.youtube.channelId);
  assert.equal((se.match(/class="yt-lite ratio/g) || []).length, sermons.length + (hasPlaylist ? 1 : 0));
  if (hasPlaylist) assert.match(se, /data-list="UU/, 'sermons page should embed the uploads playlist');
  assert.doesNotMatch(se, /<iframe[^>]*youtube\.com\/embed/, 'sermons page should not eager-load YouTube iframes');
  assert.match(read('index.html'), /class="yt-lite/);
});

test('statement of faith renders every section, and the About accordion links to each', () => {
  const sof = JSON.parse(read('data/statement-of-faith.json'));
  const page = read('statement-of-faith.html');
  const about = read('about.html');
  assert.equal(sof.sections.length, 12);
  for (const s of sof.sections) {
    assert.ok(page.includes(`<span class="sof-numeral">${s.numeral}.</span>`), `statement page lacks section ${s.numeral}`);
  }
  assert.equal((about.match(/class="accordion-item"/g) || []).length, 12);
  assert.equal((about.match(/href="statement-of-faith\.html#sof-/g) || []).length, 12);
  assert.match(page, /href="files\/CCG-Statement-of-Faith\.pdf"/);
  assert.ok(fs.existsSync(path.join(root, 'files/CCG-Statement-of-Faith.pdf')));
  // Every accordion item has a summary paragraph
  assert.equal((about.match(/<div class="accordion-body">\s*<p/g) || []).length, 12);
});

test('empty contact channels are hidden, filled ones shown', () => {
  const cfg = JSON.parse(read('site.config.json'));
  const html = read('contact.html');
  if (cfg.contact.facebook) assert.match(html, /facebook\.com/); else assert.doesNotMatch(html, /facebook\.com/);
  if (cfg.contact.messenger) assert.match(html, /m\.me\//); else assert.doesNotMatch(html, /m\.me\//);
  if (!cfg.contact.phone) assert.doesNotMatch(html, /href="tel:/);
});

test('contact form has honeypot, redirect, length limits and captcha', () => {
  const html = read('contact.html');
  const cfg = JSON.parse(read('site.config.json'));
  assert.match(html, /name="botcheck"/);
  assert.match(html, /name="redirect"/);
  assert.match(html, /name="message"[^>]*maxlength=/);
  if (cfg.contactFormCaptcha) {
    assert.match(html, /class="h-captcha" data-captcha="true"/);
    assert.match(html, /web3forms\.com\/client\/script\.js/);
  }
  assert.ok(fs.existsSync(path.join(root, 'thanks.html')));
});

test('third-party assets are integrity-checked and external links are safe', () => {
  for (const p of pages) {
    const html = read(p);
    for (const tag of html.match(/<(?:link|script)[^>]+cdn\.jsdelivr\.net[^>]*\.(?:css|js)"[^>]*>/g) || []) {
      assert.match(tag, /integrity="sha384-/, `${p}: ${tag.slice(0, 80)} lacks integrity`);
      assert.match(tag, /crossorigin="anonymous"/, `${p}: CDN tag lacks crossorigin`);
    }
    for (const tag of html.match(/<a [^>]*target="_blank"[^>]*>/g) || []) {
      assert.match(tag, /rel="noopener noreferrer"/, `${p}: ${tag.slice(0, 80)} lacks rel`);
    }
    assert.match(html, /<meta name="referrer"/, `${p}: no referrer policy`);
  }
});

test('map uses the configured address, directions open Google Maps and Waze', () => {
  const html = read('contact.html');
  assert.match(html, /google\.com\/maps\?q=.*Calamba.*output=embed/);
  assert.match(html, /google\.com\/maps\/dir\/\?api=1/);
  assert.match(html, /waze\.com\/ul/);
});

test('social share image is absolute and exists', () => {
  const html = read('index.html');
  const m = html.match(/property="og:image" content="([^"]+)"/);
  assert.ok(m && /^https?:\/\//.test(m[1]), 'og:image must be absolute');
  assert.ok(fs.existsSync(path.join(root, 'images/og-default.png')));
});

test('English language file matches the text written in the HTML', () => {
  const decode = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  const norm = (s) => decode(s).replace(/\s+/g, ' ').trim();
  for (const p of pages) {
    const html = read(p);
    for (const m of html.matchAll(/<([a-z0-9]+)[^>]*\sdata-i18n="([^"]+)"[^>]*>([^<]*)<\/\1>/g)) {
      const [, , key, text] = m;
      assert.equal(norm(text), norm(en[key]), `${p}: en.json["${key}"] differs from HTML text`);
    }
    for (const m of html.matchAll(/<([a-z0-9]+)[^>]*\sdata-i18n-html="([^"]+)"[^>]*>(.*?)<\/\1>/gs)) {
      const [, , key, text] = m;
      assert.equal(norm(text), norm(en[key]), `${p}: en.json["${key}"] differs from HTML markup`);
    }
  }
});
