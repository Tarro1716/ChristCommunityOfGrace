# Christ Community of Grace — Website

Static website for Christ Community of Grace, Calamba, Laguna. Plain HTML, CSS and JavaScript on Bootstrap 5. No frameworks, no dependencies to install. Hosted on GitHub Pages.

## Editing the site

**Never edit the `.html` files in the root folder directly.** They are generated. Edit the sources below, then rebuild.

| What you want to change | Edit this file |
|---|---|
| Church details: address, service times, phone, email, Facebook, Messenger, YouTube, GCash, bank, contact-form key | `site.config.json` |
| Upcoming events | `data/events.json` |
| Sermon videos | `data/sermons.json` |
| Page wording (English) | `src/pages/<page>.html` **and** the same key in `lang/en.json` |
| Tagalog translation | `lang/tl.json` |
| Header, footer, `<head>` | `src/layout.html` |
| Styles | `css/styles.css` |
| Behaviour (language toggle, video loading, copy buttons, event filtering) | `js/main.js` |

Then run:

```bash
npm test        # builds all pages into the root folder and runs the checks
```

or just `node build.js` to build without the checks. Commit the regenerated `.html` files together with your source change.

To preview locally: `npm run serve` and open http://localhost:8080. (Opening the files directly from disk also works, except the language toggle, which needs a web server.)

## Things the church still needs to fill in

All in `site.config.json`:

- `contact.phone`, `contact.email`, `contact.facebook`, `contact.messenger` (an `https://m.me/<page>` link). Links are hidden until filled in.
- `youtube.channel` and `youtube.livestream`. The current handle returns a 404 on YouTube, so check the channel URL.
- `youtube.uploadsPlaylist`: the channel's uploads playlist ID. It is the channel ID with the leading `UC` changed to `UU`. Once set, the homepage "Recent Sermon" always shows the newest upload with no edits.
- `giving.gcash.number`, `giving.bank.accountNumber`, and optionally `giving.gcash.qrImage` (for example `images/gcash-qr.png`).
- `contactFormKey`: a free access key from https://web3forms.com. Messages are emailed to the address you register there.
- `url`: the site's public address, used for social-share tags and the contact-form redirect.

Also replace the placeholder images in `images/` (hero photo, leader photos, ministry pictures) and the sample video IDs in `data/sermons.json`.

## Language toggle

English is written in the HTML. Elements with `data-i18n="some.key"` are swapped to the text under that key in `lang/tl.json` when a visitor picks Tagalog. The build fails if a key is missing from either language file, and the tests fail if `lang/en.json` drifts from the HTML. The Tagalog text was drafted by machine and should be reviewed by a native speaker. Events, sermons and giving details are shown exactly as typed in the data files and are not translated.

## Events

Each entry in `data/events.json` has `date` (YYYY-MM-DD), `time`, `title` and `description`. Past events are hidden automatically in the browser, so there is no need to delete them right away. The weekly service schedule comes from `site.config.json` and always shows.

## Social share image and icons

`images/og-default.png`, `images/apple-touch-icon.png` and `images/favicon-32.png` are rendered from `src/og/og.html` and `src/og/icon.html`. To regenerate after changing them, screenshot each file at 1200×630 and 180×180 with any browser, or use headless Chrome.

## Design notes

- `docs/superpowers/specs/2026-03-16-church-website-design.md`: original design.
- `docs/superpowers/specs/2026-10-03-site-improvements-design.md`: the mobile, i18n and build-step improvements.
