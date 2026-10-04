# Christ Community of Grace — Site Improvements Design

Date: 2026-10-03. Follows the 2026-03-16 design spec; this spec changes how the site is built and adds features. The visual identity (forest green, terracotta, cream, Playfair + Inter, Bootstrap 5) stays.

## Goals

1. Mobile-first homepage: the welcome, service times and livestream button are visible on the first phone screen.
2. Fix what is broken: map, social share image, contact form wiring, dead links.
3. Add what a Philippine church needs: Facebook/Messenger, tap-to-call, tap-to-copy giving details, a "New Here" page.
4. Keep content fresh with minimal editing: events and sermons live in data files; the latest sermon can auto-update from YouTube.
5. English/Tagalog toggle driven by a language file.
6. Edit shared parts (header, footer, church details) in one place.

## Architecture

Static output, no runtime framework. A zero-dependency Node script assembles pages from templates and data, and the built HTML is committed so GitHub Pages serves it unchanged.

```
site.config.json        church details: name, address, phone, email, facebook, messenger,
                        youtube, giving methods, contact form key, service times
data/events.json        one-off events (date, time, title, description)
data/sermons.json       sermon videos (youtube id, title, date)
lang/en.json            UI strings, flat keys ("home.hero.title")
lang/tl.json            Tagalog strings, same keys
src/layout.html         <head>, skip link, nav, footer, icon sprite, scripts
src/pages/*.html        one file per page: front matter + body
src/icons/*.svg         Bootstrap Icons (MIT) inlined into a sprite at build time
build.js                node build.js → writes *.html to repo root
test/build.test.js      node --test; validates output
css/styles.css          all custom styles; no inline style attributes in pages
js/main.js              language toggle, click-to-load YouTube, copy buttons,
                        event date filtering, footer year, active nav
images/                 og-default.png, apple-touch-icon.png, favicon, gcash-qr (optional)
```

### Templating

`{{path.to.value}}` substitutes from page front matter, `site.*` (config) and computed values. `{{#if path}}…{{/if}}` includes a block only when the value is truthy (no nesting). `{{eventsList}}`, `{{sermonsGrid}}`, `{{recentSermon}}`, `{{iconSprite}}` are HTML fragments built by `build.js` from the data files. The build fails on any unresolved placeholder.

### Internationalisation

English is written in the HTML, so the page is complete without JavaScript and for search engines. Elements that have a translation carry `data-i18n="key"` (text), `data-i18n-html="key"` (markup allowed) or `data-i18n-attr="attr:key"`. `js/main.js` loads `lang/<code>.json`, swaps strings, sets `<html lang>`, and remembers the choice in `localStorage`. A toggle in the navbar shows the other language's name. Data-driven content (events, sermons, giving details) is shown as authored and is not translated. The build verifies that every `data-i18n*` key exists in both language files and that the two files have identical key sets.

### Events and sermons

All events in `data/events.json` are rendered into `events.html` and the homepage with a `data-date` attribute. `js/main.js` hides past events and limits the homepage to three, showing a "no upcoming events" line if none remain. The recurring service schedule comes from `site.config.json` and is always shown.

Sermons render as click-to-load cards: a thumbnail from YouTube's image CDN with a play button; the iframe is created only on tap. If `site.youtube.uploadsPlaylist` is set, the homepage "Recent Sermon" embeds that playlist (always the latest upload); otherwise it uses the first entry in `data/sermons.json`.

### Contact and location

Map: Google Maps address embed (`maps.google.com/maps?q=<address>&output=embed`), no API key, plus "Google Maps" and "Waze" direction links. Contact channels (phone, email, Facebook, Messenger) render only when set in config. Contact form: Web3Forms with honeypot field and redirect to `thanks.html`.

### Mobile layout

Hero: on screens under 992px the image is capped at about 38% of the viewport height and the text block follows with no forced height. Service times render as a list that is inline on desktop and stacked on mobile. Brand is one line. Nav gains a "New Here" button and the language toggle; the toggle sits outside the off-canvas so it is reachable on phones.

### Accessibility and performance

Accent colour for text links darkens to `#9E5238` (5.0:1 on cream); buttons use `#A85A40` (5.0:1 with white text). `<main>` landmark, skip link, `prefers-reduced-motion` respected. Bootstrap Icons font replaced by an inline SVG sprite of the ~19 icons used. Preconnect hints for Google Fonts and the CDN. Iframes lazy-load.

### Other

`new-here.html` (what to expect, times, directions, kids, FAQ, say hello), `thanks.html`, `404.html`. Footer year set by script. Open Graph image is an absolute URL built from `site.url`.

## Palette (updated 2026-10-04)

Colours now come from the church logo so the brand is consistent across the site, Facebook and print.

| Role | Hex | Source / check |
|---|---|---|
| Primary | `#244564` | logo navy; 9.9:1 with white text |
| Deep band | `#182C42` | darker navy |
| Accent (buttons) | `#93693A` | bronze; 4.9:1 with white text |
| Accent (text links) | `#8A6236` | bronze; 5.0:1 on cream |
| Accent (decorative) | `#C8A983` | logo bronze |
| Cream background | `#F9F4F1` | logo background |
| Sand | `#C6C0A6` / `#EEEAE0` | logo rays; tiles and band tint |
| Headings | `#1E3147` | navy-tinted near-black |

## Out of scope

CMS, server-side code, translating church-authored data content, Tagalog review by a native speaker (flagged in README).

## Testing

`node --test test/` runs after `node build.js`: pages exist, shared chrome present, no unresolved placeholders, internal links resolve, i18n keys consistent, data rendered. Visual check via headless Chromium screenshots at 390px and 1366px.
