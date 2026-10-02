# Christ Community of Grace — Website Design Spec

## Overview

A static HTML/CSS church website for Christ Community of Grace, modeled after gracechurch.org. Built with Bootstrap 5, no build step required. 7 pages with shared header/footer, responsive design, and YouTube integration.

## Church Details

- **Name:** Christ Community of Grace (text logo, no image)
- **Address:** 2nd Floor, MM&Co., Bldg. 8000 St. Angela Street, Lakeview Phase III, Halang, Calamba, Philippines, 4027
- **Service times:**
  - 1st Sunday: 9:00 AM
  - 2nd–5th Sunday: 9:30 AM
  - Wednesday: 6:00 PM
- **YouTube:** https://www.youtube.com/@calambacommunitychurch2024

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Primary | Deep forest green | `#2E5339` |
| Accent | Warm terracotta | `#C8785E` |
| Light background | Warm cream | `#F5F1EB` |
| Dark text | Near black | `#2D2D2D` |
| Muted text | Gray | `#6B6B6B` |
| White | White | `#FFFFFF` |

## Typography

- **Headings:** Playfair Display (Google Fonts) — serif, elegant
- **Body:** Inter (Google Fonts) — clean, readable sans-serif

## File Structure

```
/
├── index.html          — Homepage
├── about.html          — About, mission, leadership
├── ministries.html     — Ministry cards
├── sermons.html        — YouTube video grid
├── events.html         — News & upcoming events
├── give.html           — Giving information
├── contact.html        — Contact form, map, address
├── css/
│   └── styles.css      — Shared custom styles
├── js/
│   └── main.js         — Mobile menu, scroll effects
└── images/
    └── (placeholders)
```

## Dependencies (CDN only)

- Bootstrap 5.3 CSS + JS
- Bootstrap Icons
- Google Fonts: Inter, Playfair Display

No build step. No framework. Plain HTML files that work when opened directly.

## Language

Content will be a mix of English and Filipino/Tagalog. HTML `lang` attribute set to `en` with individual elements using `lang="tl"` where needed.

## Contact Form

Uses [Web3Forms](https://web3forms.com) for form submission (free tier, 250 submissions/mo, no branding). The form `action` points to `https://api.web3forms.com/submit` with an access key hidden input. No backend required. Access key to be provided by site owner.

## Meta & SEO

- Favicon: placeholder (to be replaced with church logo later)
- Open Graph meta tags on each page (title, description, image) for social sharing (important for Facebook/Messenger usage in the Philippines)
- Meta description per page
- Semantic HTML5 elements for accessibility

## Deployment

Target: GitHub Pages (free, works with static HTML). Can be migrated to Netlify or shared hosting later. Relative paths used throughout — no base URL dependency.

## Existing Files

`header.html` and `sample.html` are early prototypes and will be superseded by the new implementation. They can be deleted once the new pages are in place.

## Pages

### Shared Components

**Header (all pages):**
- Sticky top, white background, subtle bottom border
- Text logo "Christ Community of Grace" on the left
- Centered nav links: About | Ministries | Sermons | News & Events | Give | Contact
- Hover state: terracotta underline animation
- Mobile (<992px): hamburger icon triggers Bootstrap offcanvas sidebar with nav links

**Footer (all pages):**
- Dark green (`#2E5339`) background, white/light text
- Three columns:
  1. Church name + brief tagline + address
  2. Quick links (all nav pages)
  3. Service times + YouTube channel link
- Copyright row at bottom

### Homepage (`index.html`)

**Section 1 — Hero:**
- Split grid layout (gracechurch.org style): image left (50%), text right (50%)
- Image: placeholder SVG (to be replaced with church photo)
- Text side: warm cream background (`#F5F1EB`)
  - Large heading: "Welcome to Christ Community of Grace"
  - Service times listed
  - Terracotta "Livestream" button → links to YouTube channel streams page
  - "Service info →" link → links to Contact page
- Mobile: stacks vertically (image on top, text below)

**Section 2 — Welcome intro:**
- White background
- Centered text block with brief church welcome paragraph
- "Learn More" link to About page

**Section 3 — Upcoming Events:**
- Cream background
- Section heading: "Upcoming Events"
- 3 event cards in a row (placeholder content)
- Each card: date badge, event title, short description
- "View All Events →" link to events.html

**Section 4 — Recent Sermon:**
- White background
- Section heading: "Recent Sermon"
- Embedded YouTube iframe (latest video)
- Sermon title + description placeholder
- "More Sermons →" link to sermons.html

**Section 5 — New Here?**
- Cream background
- Centered call-to-action: heading, brief welcoming text
- Green button: "Plan Your Visit" → links to about.html

### About (`about.html`)

- **Hero banner:** Full-width cream background with page title "About Us"
- **Mission section:** Church mission statement (placeholder text)
- **Statement of Faith:** Expandable accordion sections for doctrinal beliefs (placeholder)
- **Leadership:** Grid of cards with placeholder photos, names, and roles

### Ministries (`ministries.html`)

- **Hero banner:** Page title "Ministries"
- **Ministry cards grid:** 2-3 columns on desktop, 1 on mobile
  - Each card: placeholder image, ministry name, brief description, "Learn More" link
  - Placeholder ministries: Small Groups, Youth, Children, Men's Ministry, Women's Ministry, Worship Team

### Sermons (`sermons.html`)

- **Hero banner:** Page title "Sermons"
- **YouTube channel link:** Prominent link/button to full channel
- **Video grid:** 2-3 columns of embedded YouTube iframes using Bootstrap `ratio ratio-16x9` responsive wrapper (placeholder embeds, manually updated)
- **Pagination or "Load More" note:** For future expansion

### News & Events (`events.html`)

- **Hero banner:** Page title "News & Events"
- **Upcoming events list:** Each event has date, time, title, description
- **Announcements section:** General church announcements (placeholder content)

### Give (`give.html`)

- **Hero banner:** Page title "Give"
- **Giving intro:** Scripture reference + brief message about generosity
- **Giving methods:** Cards for each method (placeholder — e.g., GCash, bank transfer, in-person)
- Each card: method name, instructions/details

### Contact (`contact.html`)

- **Hero banner:** Page title "Contact Us"
- **Two-column layout:**
  - Left: Contact form (name, email, message, submit button) — submits via Web3Forms
  - Right: Address, service schedule, Google Maps iframe embed (pinned to church address)
- Mobile: stacks vertically

## Responsive Breakpoints

| Breakpoint | Behavior |
|------------|----------|
| >992px | Full desktop layout, horizontal nav, multi-column grids |
| 768-992px | Hamburger menu, 2-column grids where applicable |
| <768px | Hamburger menu, single-column everything, stacked hero |

## Interactions

- Sticky header on scroll
- Smooth scroll for any anchor links
- Hover effects: terracotta color on nav links, subtle card lift on hover
- Bootstrap offcanvas for mobile navigation
- Accordion expand/collapse on About page for doctrine sections

## Placeholder Content

All text content (mission statements, event descriptions, sermon descriptions, ministry details, giving instructions) will use realistic placeholder text that the church can replace with actual content. Images will use SVG placeholders with descriptive labels.
