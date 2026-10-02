#!/usr/bin/env node
/**
 * Static site build for Christ Community of Grace.
 * Zero dependencies. Usage: node build.js
 *
 * Reads site.config.json, data/*.json, lang/*.json, src/layout.html and
 * src/pages/*.html, and writes one HTML file per page into the repo root.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const readJSON = (p) => JSON.parse(read(p));

const site = readJSON('site.config.json');
const events = readJSON('data/events.json');
const sermons = readJSON('data/sermons.json');
const en = readJSON('lang/en.json');
const tl = readJSON('lang/tl.json');
const layout = read('src/layout.html');

// ---------- helpers ----------
const esc = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const lookup = (ctx, dotted) => dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), ctx);

/** Bilingual value from config: string, or {en, tl}. Emits a span the language toggle can swap. */
const bi = (v) => (v && typeof v === 'object')
  ? `<span data-tl="${esc(v.tl || v.en)}">${esc(v.en)}</span>`
  : esc(v);

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const parseDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return { y, m, d }; };
const longDate = (iso) => { const { y, m, d } = parseDate(iso); return `${MONTHS_LONG[m - 1]} ${d}, ${y}`; };

const icon = (name, cls = 'icon') => `<svg class="${cls}" aria-hidden="true"><use href="#i-${name}"/></svg>`;

// ---------- computed values ----------
const mapQuery = encodeURIComponent(site.address.mapQuery);
const computed = {
  year: String(new Date().getFullYear()),
  directionsUrl: `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`,
  wazeUrl: `https://waze.com/ul?q=${mapQuery}&navigate=yes`,
  mapEmbedUrl: `https://www.google.com/maps?q=${mapQuery}&output=embed`,
  phoneHref: (site.contact.phone || '').replace(/[^+\d]/g, ''),
};

// ---------- HTML fragments ----------
function iconSprite() {
  const dir = path.join(ROOT, 'src/icons');
  const symbols = fs.readdirSync(dir).filter((f) => f.endsWith('.svg')).sort().map((f) => {
    const svg = fs.readFileSync(path.join(dir, f), 'utf8');
    const viewBox = (svg.match(/viewBox="([^"]+)"/) || [, '0 0 16 16'])[1];
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').trim();
    return `<symbol id="i-${f.replace(/\.svg$/, '')}" viewBox="${viewBox}">${inner}</symbol>`;
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" class="icon-sprite" aria-hidden="true" focusable="false">${symbols.join('')}</svg>`;
}

function serviceTimesList() {
  const items = site.serviceTimes.map((s) =>
    `<li><span class="svc-label">${bi(s.label)}</span><span class="svc-time">${esc(s.time)}</span></li>`);
  return `<ul class="service-times service-times-stacked">${items.join('')}</ul>`;
}

function serviceTimesInline() {
  const items = site.serviceTimes.map((s) =>
    `<li><span class="svc-label">${bi(s.label)}</span> <span class="svc-time">${esc(s.time)}</span></li>`);
  return `<ul class="service-times service-times-hero">${items.join('')}</ul>`;
}

const sortedEvents = [...events].sort((a, b) => a.date.localeCompare(b.date));

function dateBadge(iso) {
  const { m, d } = parseDate(iso);
  return `<div class="date-badge" aria-hidden="true"><span class="month">${MONTHS[m - 1]}</span><span class="day">${d}</span></div>`;
}

function eventsHome() {
  return sortedEvents.map((e) => `
        <div class="col-md-4" data-date="${esc(e.date)}">
          <article class="card card-custom h-100">
            <div class="card-body d-flex gap-3 align-items-start">
              ${dateBadge(e.date)}
              <div>
                <h3 class="card-title h5 mb-1">${esc(e.title)}</h3>
                <p class="event-meta mb-1"><time datetime="${esc(e.date)}">${longDate(e.date)}</time> · ${esc(e.time)}</p>
                <p class="card-text text-muted mb-0 small-text">${esc(e.description || '')}</p>
              </div>
            </div>
          </article>
        </div>`).join('\n');
}

function eventsList() {
  return sortedEvents.map((e) => `
            <article class="event-item" data-date="${esc(e.date)}">
              ${dateBadge(e.date)}
              <div>
                <h3 class="event-title h5 mb-1">${esc(e.title)}</h3>
                <p class="event-meta mb-1"><time datetime="${esc(e.date)}">${longDate(e.date)}</time> · ${esc(e.time)}</p>
                <p class="mb-0">${esc(e.description || '')}</p>
              </div>
            </article>`).join('\n');
}

function ytLite({ id, list, title, poster }) {
  const src = poster || `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`;
  const data = list ? `data-list="${esc(list)}"` : `data-id="${esc(id)}"`;
  return `<div class="yt-lite ratio ratio-16x9" ${data} data-title="${esc(title)}">
  <img src="${src}" alt="" loading="lazy" width="480" height="360">
  <button type="button" class="yt-lite-play" aria-label="Play video: ${esc(title)}">${icon('play-circle', 'icon icon-play')}</button>
</div>`;
}

function sermonsGrid() {
  return sermons.map((s) => `
        <div class="col-md-6 col-lg-4">
          <article class="sermon-card">
            ${ytLite({ id: s.id, title: s.title })}
            <h2 class="h5 mt-3 mb-1">${esc(s.title)}</h2>
            <p class="text-muted mb-0"><time datetime="${esc(s.date)}">${longDate(s.date)}</time></p>
          </article>
        </div>`).join('\n');
}

function recentSermon() {
  if (site.youtube.uploadsPlaylist) {
    return `        ${ytLite({ list: site.youtube.uploadsPlaylist, title: 'Latest sermon', poster: 'images/sermon-poster.svg' })}
        <p class="text-muted mt-3" data-i18n="home.sermon.auto">Our newest upload plays here automatically.</p>`;
  }
  const s = sermons[0];
  return `        ${ytLite({ id: s.id, title: s.title })}
        <h3 class="h4 mt-4">${esc(s.title)}</h3>
        <p class="text-muted"><time datetime="${esc(s.date)}">${longDate(s.date)}</time></p>
        ${s.description ? `<p class="small-text">${esc(s.description)}</p>` : ''}`;
}

const fragments = {
  iconSprite: iconSprite(),
  serviceTimesList: serviceTimesList(),
  serviceTimesInline: serviceTimesInline(),
  eventsHome: eventsHome(),
  eventsList: eventsList(),
  sermonsGrid: sermonsGrid(),
  recentSermon: recentSermon(),
};
const RAW = new Set([...Object.keys(fragments), 'content', 'robotsMeta']);

// ---------- templating ----------
function parseFrontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('Page is missing front matter');
  const vars = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) vars[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { vars, body: m[2] };
}

function render(template, ctx, file) {
  let out = template.replace(/\{\{#if ([\w.]+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (_, key, block) =>
    lookup(ctx, key) ? block : '');
  out = out.replace(/\{\{([\w.]+)\}\}/g, (_, key) => {
    const v = lookup(ctx, key);
    if (v === undefined || v === null) throw new Error(`${file}: unresolved placeholder {{${key}}}`);
    return RAW.has(key) ? String(v) : esc(v);
  });
  return out;
}

function checkI18n(html, file) {
  const keys = [
    ...[...html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)].map((m) => m[1]),
    ...[...html.matchAll(/data-i18n-attr="([^"]+)"/g)].flatMap((m) => m[1].split(',').map((s) => s.split(':')[1])),
  ];
  for (const k of keys) {
    if (!(k in en)) throw new Error(`${file}: i18n key "${k}" missing from lang/en.json`);
    if (!(k in tl)) throw new Error(`${file}: i18n key "${k}" missing from lang/tl.json`);
  }
}

// ---------- build ----------
const pagesDir = path.join(ROOT, 'src/pages');
const pages = fs.readdirSync(pagesDir).filter((f) => f.endsWith('.html')).sort();
for (const file of pages) {
  const { vars, body } = parseFrontMatter(fs.readFileSync(path.join(pagesDir, file), 'utf8'));
  const ctx = {
    site,
    ...computed,
    ...fragments,
    slug: file,
    pageTitle: vars.title || site.name,
    description: vars.description || site.tagline,
    bodyClass: vars.bodyClass || '',
    robotsMeta: vars.noindex === 'true' ? '<meta name="robots" content="noindex">' : '',
  };
  ctx.content = render(body, ctx, file);
  const html = `<!-- Generated by build.js from src/pages/${file}. Edit the source, then run: node build.js -->\n` + render(layout, ctx, file);
  checkI18n(html, file);
  fs.writeFileSync(path.join(ROOT, file), html);
  console.log(`built ${file}`);
}
console.log(`\n${pages.length} pages built.`);
