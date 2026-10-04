#!/usr/bin/env node
/**
 * Refresh data/sermons.json from the channel's public YouTube feed (no API key needed).
 *
 * Usage:  node tools/fetch-sermons.js            (uses youtube.channelId from site.config.json)
 *         node tools/fetch-sermons.js --dry-run  (print what would be written)
 *
 * The feed lists the channel's latest 15 uploads. Entries are written newest first.
 * If the feed cannot be fetched, the existing data file is left untouched and the
 * script exits with code 2 so a scheduled job can notice without breaking the build.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const MAX_ITEMS = 12;

/** Decode the handful of XML entities YouTube's feed uses. */
function decode(s) {
  return String(s)
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}

/** Parse the Atom feed into sermon entries. Exported for tests. */
function parseFeed(xml) {
  const entries = [];
  const re = /<entry>([\s\S]*?)<\/entry>/g;
  let m;
  while ((m = re.exec(xml))) {
    const e = m[1];
    const id = (e.match(/<yt:videoId>([^<]+)<\/yt:videoId>/) || [])[1];
    const title = (e.match(/<title>([^<]*)<\/title>/) || [])[1];
    const published = (e.match(/<published>([^<]+)<\/published>/) || [])[1];
    const desc = (e.match(/<media:description>([\s\S]*?)<\/media:description>/) || [])[1] || '';
    if (!id || !title || !published) continue;
    const entry = { id, title: decode(title).trim(), date: published.slice(0, 10) };
    const firstLine = decode(desc).split('\n').map((l) => l.trim()).find(Boolean);
    if (firstLine) entry.description = firstLine.slice(0, 200);
    entries.push(entry);
  }
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return entries.slice(0, MAX_ITEMS);
}

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const site = JSON.parse(fs.readFileSync(path.join(ROOT, 'site.config.json'), 'utf8'));
  const channelId = site.youtube && site.youtube.channelId;
  if (!channelId) {
    console.error('youtube.channelId is not set in site.config.json; nothing to fetch.');
    process.exit(2);
  }
  const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
  let xml;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'ccg-site-build' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    xml = await res.text();
  } catch (err) {
    console.error(`Could not fetch the YouTube feed (${err.message}). Keeping existing data/sermons.json.`);
    process.exit(2);
  }
  const sermons = parseFeed(xml);
  if (sermons.length === 0) {
    console.error('Feed parsed but contained no videos. Keeping existing data/sermons.json.');
    process.exit(2);
  }
  const out = JSON.stringify(sermons, null, 2) + '\n';
  if (dryRun) { process.stdout.write(out); return; }
  const target = path.join(ROOT, 'data/sermons.json');
  const before = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (before === out) { console.log('data/sermons.json already up to date.'); return; }
  fs.writeFileSync(target, out);
  console.log(`Wrote ${sermons.length} sermons to data/sermons.json (newest: ${sermons[0].date} ${sermons[0].title}).`);
}

module.exports = { parseFeed, decode };
if (require.main === module) main();
