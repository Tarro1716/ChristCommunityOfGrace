#!/usr/bin/env python3
"""Generate the site logo, favicons and app icons from a logo image.

Usage:  python3 tools/make-icons.py path/to/logo.jpg
Needs:  Pillow  (pip install pillow)

The source should be the logo on a flat, light background. The background is
removed, the logo is cropped to its edges, and these files are written:
  images/logo.png            transparent, used in the navbar and footer
  images/favicon.ico / favicon-32.png / favicon-16.png
  images/apple-touch-icon.png (180px, cream background)
  images/icon-512.png        (512px, cream background)
Afterwards regenerate images/og-default.png from src/og/og.html (see README).
"""
import sys, os
from PIL import Image, ImageDraw, ImageFilter

if len(sys.argv) < 2:
    sys.exit(__doc__)
ROOT = os.path.join(os.path.dirname(__file__), '..')
OUT = os.path.join(ROOT, 'images')
CREAM = (245, 241, 235, 255)

src = Image.open(sys.argv[1]).convert('RGB')
W, H = src.size
bg = src.getpixel((5, 5))

# Flood-fill the outer background from the edges with a sentinel colour, then make it transparent.
work = src.copy()
sentinel = (255, 0, 255)
for pt in [(2, 2), (W - 3, 2), (2, H - 3), (W - 3, H - 3), (W // 2, 2), (W // 2, H - 3), (2, H // 2), (W - 3, H // 2)]:
    ImageDraw.floodfill(work, pt, sentinel, thresh=48)
rgba = src.convert('RGBA')
px, wp = rgba.load(), work.load()
for y in range(H):
    for x in range(W):
        if wp[x, y] == sentinel:
            px[x, y] = (bg[0], bg[1], bg[2], 0)
rgba.putalpha(rgba.getchannel('A').filter(ImageFilter.GaussianBlur(0.8)))

bbox = rgba.getchannel('A').getbbox()
pad = int(0.04 * max(bbox[2] - bbox[0], bbox[3] - bbox[1]))
crop = rgba.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(W, bbox[2] + pad), min(H, bbox[3] + pad)))

def fit(size, scale=1.0, background=(0, 0, 0, 0)):
    canvas = Image.new('RGBA', (size, size), background)
    l = crop.copy()
    l.thumbnail((int(size * scale), int(size * scale)), Image.LANCZOS)
    canvas.alpha_composite(l, ((size - l.width) // 2, (size - l.height) // 2))
    return canvas

logo = crop.copy()
logo.thumbnail((320, 320), Image.LANCZOS)
logo.save(os.path.join(OUT, 'logo.png'), optimize=True)
fit(180, 0.82, CREAM).convert('RGB').save(os.path.join(OUT, 'apple-touch-icon.png'), optimize=True)
fit(512, 0.84, CREAM).save(os.path.join(OUT, 'icon-512.png'), optimize=True)
fit(32).save(os.path.join(OUT, 'favicon-32.png'), optimize=True)
fit(16).save(os.path.join(OUT, 'favicon-16.png'), optimize=True)
fit(64).save(os.path.join(OUT, 'favicon.ico'), sizes=[(16, 16), (32, 32), (48, 48)])
print('Icons written to images/. Now regenerate images/og-default.png from src/og/og.html.')
