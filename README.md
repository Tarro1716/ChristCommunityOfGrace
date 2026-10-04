# Christ’s Community of Grace — Website

Static website for Christ’s Community of Grace, Calamba, Laguna. Plain HTML, CSS and JavaScript on Bootstrap 5. No frameworks, no dependencies to install. Hosted on GitHub Pages.

## Editing the site

**Never edit the `.html` files in the root folder directly.** They are generated. Edit the sources below, then rebuild.

| What you want to change | Edit this file |
|---|---|
| Church details: address, service times, phone, email, Facebook, Messenger, YouTube, GCash, bank, contact-form key | `site.config.json` |
| Upcoming events | `data/events.json` |
| Sermon videos | `data/sermons.json` — or run `npm run fetch-sermons` to pull the latest from YouTube |
| Statement of Faith text | `data/statement-of-faith.json` (and the PDF in `files/`) |
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

To preview locally: `npm run serve` and open http://localhost:8080 (works on Windows, Mac and Linux; needs only Node). (Opening the files directly from disk also works, except the language toggle, which needs a web server.)

## Things the church still needs to fill in

All in `site.config.json`:

- `contact.phone`, `contact.email`, `contact.facebook`, `contact.messenger` (an `https://m.me/<page>` link). Links are hidden until filled in.
- `youtube.channel` and `youtube.livestream`. The current handle returns a 404 on YouTube, so check the channel URL.
- `youtube.uploadsPlaylist`: the channel's uploads playlist ID. It is the channel ID with the leading `UC` changed to `UU`. Once set, the homepage "Recent Sermon" always shows the newest upload with no edits.
- `giving.gcash.number`, `giving.bank.accountNumber`, and optionally `giving.gcash.qrImage` (for example `images/gcash-qr.png`).
- `contactFormKey`: a free access key from https://web3forms.com. Messages are emailed to the address you register there. In the Web3Forms dashboard, restrict the key to the site's domain so nobody can reuse it from another website.
- `contactFormCaptcha`: `true` shows an hCaptcha check on the form (no keys needed; Web3Forms provides it). Set to `false` to remove it.
- `url`: the site's public address, used for social-share tags and the contact-form redirect.

Also replace the placeholder images in `images/` (hero photo, leader photos, ministry pictures) and the sample video IDs in `data/sermons.json`.

## Sermons from YouTube

The site knows the channel through `youtube.channelId` in `site.config.json`. From that it derives the uploads playlist, so:

- The homepage "Recent Sermon" and the player at the top of the Sermons page always play the newest upload. No edits needed.
- `npm run fetch-sermons` reads the channel's public feed (no API key) and rewrites `data/sermons.json` with the latest 12 videos, titles and dates. Then `npm test` rebuilds.
- The GitHub Action in `.github/workflows/update-sermons.yml` does both every Monday morning and commits the result, so the Sermons page refreshes itself once the repo is on GitHub. Run it manually from the Actions tab any time.

To edit a title or add a description by hand, change `data/sermons.json`; the next weekly run will overwrite it with the feed's version, so make lasting fixes on YouTube itself.

## Statement of Faith

The full statement lives in `data/statement-of-faith.json` and is rendered into `statement-of-faith.html` (full text with a table of contents) and the About page accordion (opening paragraph of each section). The downloadable PDF is `files/CCG-Statement-of-Faith.pdf`.

If the church issues a revised PDF, replace the file and regenerate the data:

```bash
pip install pypdf
python3 tools/pdf-to-statement.py files/CCG-Statement-of-Faith.pdf
npm test
```

Then skim the result. The converter recognises the document's numbered sections, lettered subsections, bullet lists and book lists; an unusual layout may need a hand fix in the JSON. Scripture references in parentheses are styled automatically. Paragraphs beginning "We reject" are set off visually. The statement is church-authored content and is shown in English only.

## Language toggle

English is written in the HTML. Elements with `data-i18n="some.key"` are swapped to the text under that key in `lang/tl.json` when a visitor picks Tagalog. The build fails if a key is missing from either language file, and the tests fail if `lang/en.json` drifts from the HTML. The Tagalog text was drafted by machine and should be reviewed by a native speaker. Events, sermons and giving details are shown exactly as typed in the data files and are not translated.

## Events

Each entry in `data/events.json` has `date` (YYYY-MM-DD), `time`, `title` and `description`. Past events are hidden automatically in the browser, so there is no need to delete them right away. The weekly service schedule comes from `site.config.json` and always shows.

## Logo, favicon and share image

The logo is `images/logo.png` (transparent background), used in the navbar and footer. If the logo changes, run:

```bash
python3 tools/make-icons.py path/to/new-logo.jpg
```

That rewrites `images/logo.png`, the favicons and the iOS/Android icons. Then regenerate the social share image `images/og-default.png` by opening `src/og/og.html` in a browser at 1200×630 and taking a screenshot (or with headless Chrome). The share image is what Facebook and Messenger show when someone posts a link to the site.

## Design notes

- `docs/superpowers/specs/2026-03-16-church-website-design.md`: original design.
- `docs/superpowers/specs/2026-10-03-site-improvements-design.md`: the mobile, i18n and build-step improvements.
