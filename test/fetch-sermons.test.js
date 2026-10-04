const test = require('node:test');
const assert = require('node:assert/strict');
const { parseFeed } = require('../tools/fetch-sermons.js');

const sample = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Christ’s Community of Grace</title>
 <entry>
  <id>yt:video:AAA111</id><yt:videoId>AAA111</yt:videoId>
  <title>Older &amp; Wiser | Romans 8</title>
  <published>2026-09-20T02:00:00+00:00</published>
  <media:group><media:description>

  Pastor&#39;s message on Romans 8.
  Second line should be ignored.</media:description></media:group>
 </entry>
 <entry>
  <id>yt:video:BBB222</id><yt:videoId>BBB222</yt:videoId>
  <title>Sunday Worship Livestream</title>
  <published>2026-09-27T01:30:00+00:00</published>
  <media:group><media:description></media:description></media:group>
 </entry>
</feed>`;

test('parses entries newest first with decoded titles and first description line', () => {
  const out = parseFeed(sample);
  assert.equal(out.length, 2);
  assert.deepEqual(out[0], { id: 'BBB222', title: 'Sunday Worship Livestream', date: '2026-09-27' });
  assert.deepEqual(out[1], { id: 'AAA111', title: 'Older & Wiser | Romans 8', date: '2026-09-20', description: "Pastor's message on Romans 8." });
});

test('ignores malformed entries and caps the list', () => {
  const many = Array.from({ length: 20 }, (_, i) =>
    `<entry><yt:videoId>V${i}</yt:videoId><title>T${i}</title><published>2026-01-${String(i + 1).padStart(2, '0')}T00:00:00+00:00</published></entry>`).join('');
  const out = parseFeed(`<feed>${many}<entry><title>no id</title></entry></feed>`);
  assert.equal(out.length, 12);
  assert.equal(out[0].id, 'V19');
});
