# Christ Community of Grace Website — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 7-page static church website for Christ Community of Grace using Bootstrap 5, modeled after gracechurch.org.

**Architecture:** Static HTML/CSS with Bootstrap 5 via CDN. Shared `css/styles.css` for custom styles and `js/main.js` for interactions. Each page is a standalone `.html` file with identical header/footer markup. No build step, no framework.

**Tech Stack:** HTML5, CSS3, Bootstrap 5.3, Bootstrap Icons, Google Fonts (Inter, Playfair Display), Web3Forms, YouTube iframe embeds.

**Spec:** `docs/superpowers/specs/2026-03-16-church-website-design.md`

**Note:** This is a static HTML/CSS project with no test framework. Verification is done by opening files in a browser and checking visual output against the spec.

**Language note:** HTML `lang="en"` on root element. For any Filipino/Tagalog placeholder text, use `lang="tl"` on the containing element.

---

## Chunk 1: Foundation (CSS + Homepage)

### Task 1: Create shared stylesheet (`css/styles.css`)

**Files:**
- Create: `css/styles.css`

This file defines all CSS custom properties, typography, shared component styles (buttons, cards, section spacing, page hero banners), and responsive overrides. Every subsequent page depends on this file.

- [ ] **Step 1: Create `css/styles.css` with CSS custom properties and base styles**

```css
/* ===== CSS Custom Properties ===== */
:root {
  --color-primary: #2E5339;
  --color-accent: #C8785E;
  --color-bg-cream: #F5F1EB;
  --color-text-dark: #2D2D2D;
  --color-text-muted: #6B6B6B;
  --color-white: #FFFFFF;
  --font-heading: 'Playfair Display', serif;
  --font-body: 'Inter', sans-serif;
}

/* ===== Base ===== */
html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--color-text-dark);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
}

/* ===== Navbar ===== */
.navbar {
  border-bottom: 1px solid #e5e5e5;
}

.navbar-brand {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary) !important;
  line-height: 1.2;
}

.nav-link {
  color: var(--color-text-dark) !important;
  position: relative;
  transition: color 0.3s;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--color-accent);
  transition: width 0.3s;
}

.nav-link:hover {
  color: var(--color-accent) !important;
}

.nav-link:hover::after,
.nav-link.active::after {
  width: 70%;
}

/* ===== Buttons ===== */
.btn-accent {
  background-color: var(--color-accent);
  color: var(--color-white);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-accent:hover {
  background-color: #b5694d;
  color: var(--color-white);
}

.btn-primary-custom {
  background-color: var(--color-primary);
  color: var(--color-white);
  border: none;
  border-radius: 25px;
  padding: 0.75rem 2rem;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn-primary-custom:hover {
  background-color: #234228;
  color: var(--color-white);
}

/* ===== Section Spacing ===== */
.section-padding {
  padding: 5rem 0;
}

.bg-cream {
  background-color: var(--color-bg-cream);
}

/* ===== Page Hero Banner ===== */
.page-hero {
  background-color: var(--color-bg-cream);
  padding: 4rem 0;
  text-align: center;
}

.page-hero h1 {
  font-size: 3rem;
  color: var(--color-text-dark);
  margin-bottom: 0;
}

/* ===== Cards ===== */
.card-custom {
  border: none;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.card-custom:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

/* ===== Section Headings ===== */
.section-heading {
  font-size: 2.25rem;
  margin-bottom: 1rem;
}

.section-subtext {
  color: var(--color-text-muted);
  font-size: 1.125rem;
  margin-bottom: 3rem;
}

/* ===== Links ===== */
.link-accent {
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.link-accent:hover {
  color: #b5694d;
  text-decoration: underline;
}

/* ===== Footer ===== */
.site-footer {
  background-color: var(--color-primary);
  color: rgba(255,255,255,0.85);
  padding: 4rem 0 1.5rem;
}

.site-footer h5 {
  color: var(--color-white);
  font-family: var(--font-heading);
  margin-bottom: 1.25rem;
}

.site-footer a {
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  transition: color 0.3s;
}

.site-footer a:hover {
  color: var(--color-white);
}

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.15);
  padding-top: 1.5rem;
  margin-top: 3rem;
  text-align: center;
  font-size: 0.875rem;
  color: rgba(255,255,255,0.5);
}

/* ===== Home Hero ===== */
.home-hero {
  min-height: calc(100vh - 76px);
}

.home-hero-image {
  background-color: #c9d3c0;
  background-size: cover;
  background-position: center;
  min-height: 400px;
}

.home-hero-text {
  background-color: var(--color-bg-cream);
  padding: 4rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.home-hero-text h1 {
  font-size: 3.25rem;
  font-weight: 400;
  line-height: 1.15;
  margin-bottom: 1.5rem;
}

.home-hero-text .service-times {
  font-size: 1.25rem;
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

.service-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-dark);
  text-decoration: none;
  font-size: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #d0c8b8;
  margin-bottom: 2rem;
  transition: color 0.3s;
}

.service-link:hover {
  color: var(--color-accent);
}

.featured-label {
  color: var(--color-accent);
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.featured-links a {
  display: block;
  color: var(--color-text-dark);
  text-decoration: none;
  font-size: 1.25rem;
  line-height: 1.4;
  margin-bottom: 0.75rem;
  transition: color 0.3s;
}

.featured-links a:hover {
  color: var(--color-accent);
}

/* ===== Event Date Badge ===== */
.date-badge {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  text-align: center;
  min-width: 60px;
}

.date-badge .month {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.date-badge .day {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

/* ===== Responsive ===== */
@media (max-width: 991.98px) {
  .home-hero-text {
    padding: 3rem 2rem;
  }

  .home-hero-text h1 {
    font-size: 2.5rem;
  }

  .section-padding {
    padding: 3.5rem 0;
  }

  .page-hero h1 {
    font-size: 2.5rem;
  }
}

@media (max-width: 767.98px) {
  .home-hero-text h1 {
    font-size: 2rem;
  }

  .section-padding {
    padding: 2.5rem 0;
  }

  .page-hero {
    padding: 3rem 0;
  }

  .page-hero h1 {
    font-size: 2rem;
  }
}
```

- [ ] **Step 2: Verify file exists**

Run: `ls -la css/styles.css`
Expected: file listed with non-zero size

- [ ] **Step 3: Commit**

```bash
git add css/styles.css
git commit -m "feat: add shared stylesheet with design system"
```

---

### Task 2: Create `js/main.js`

**Files:**
- Create: `js/main.js`

Minimal JS for active nav link highlighting based on current page.

- [ ] **Step 1: Create `js/main.js`**

```javascript
// Highlight active nav link based on current page
document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach(function (link) {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
});
```

- [ ] **Step 2: Commit**

```bash
git add js/main.js
git commit -m "feat: add main.js with active nav highlighting"
```

---

### Task 3: Create Homepage (`index.html`)

**Files:**
- Create: `index.html`

The homepage includes the full header, hero section, welcome intro, upcoming events preview, recent sermon embed, "New Here?" CTA, and footer. This establishes the shared header/footer markup that all other pages will copy.

- [ ] **Step 1: Create `index.html`**

The HTML structure (abbreviated for plan — full code to be written during implementation):

```
<!DOCTYPE html>
<html lang="en">
<head>
  - charset, viewport meta
  - title: "Christ Community of Grace"
  - meta description
  - Open Graph tags (og:title, og:description, og:type, og:url)
  - Favicon: <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect fill='%232E5339' width='32' height='32' rx='6'/><text x='16' y='22' font-size='18' fill='white' text-anchor='middle' font-family='serif'>C</text></svg>">
  - Google Fonts link (Inter + Playfair Display)
  - Bootstrap 5.3 CSS CDN
  - Bootstrap Icons CDN
  - css/styles.css
</head>
<body>
  <!-- HEADER: Bootstrap navbar, sticky-top -->
  <nav class="navbar navbar-expand-lg sticky-top bg-white">
    <div class="container">
      <a class="navbar-brand" href="index.html">Christ Community<br>of Grace</a>
      <button class="navbar-toggler" ... data-bs-toggle="offcanvas" data-bs-target="#mobileNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" id="mobileNav">
        <div class="offcanvas-header">
          <h5>Christ Community of Grace</h5>
          <button class="btn-close" data-bs-dismiss="offcanvas"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav mx-auto">
            <li><a class="nav-link" href="about.html">About</a></li>
            <li><a class="nav-link" href="ministries.html">Ministries</a></li>
            <li><a class="nav-link" href="sermons.html">Sermons</a></li>
            <li><a class="nav-link" href="events.html">News & Events</a></li>
            <li><a class="nav-link" href="give.html">Give</a></li>
            <li><a class="nav-link" href="contact.html">Contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  </nav>

  <!-- HERO: split grid -->
  <section class="home-hero">
    <div class="row g-0" style="min-height: calc(100vh - 76px)">
      <div class="col-lg-6 home-hero-image">
        <!-- placeholder SVG or bg image -->
      </div>
      <div class="col-lg-6 home-hero-text">
        <h1>Welcome to<br>Christ Community of Grace</h1>
        <div class="service-times">
          1st Sunday: 9:00 AM<br>
          2nd–5th Sunday: 9:30 AM<br>
          Wednesday: 6:00 PM
        </div>
        <a href="https://www.youtube.com/@calambacommunitychurch2024/streams"
           class="btn btn-accent mb-3" target="_blank" rel="noopener">
          <i class="bi bi-broadcast"></i> Livestream
        </a>
        <a href="contact.html" class="service-link">
          Service info <i class="bi bi-arrow-right"></i>
        </a>
        <div class="featured-label">FEATURED</div>
        <div class="featured-links">
          <a href="#">Sunday Worship Gathering</a>
          <a href="#">Midweek Bible Study</a>
          <a href="about.html">New to our church?</a>
        </div>
      </div>
    </div>
  </section>

  <!-- WELCOME INTRO -->
  <section class="section-padding text-center">
    <div class="container" style="max-width: 720px">
      <h2 class="section-heading">Welcome</h2>
      <p class="section-subtext">Christ Community of Grace is a Bible-believing
      church in Calamba, Philippines. We gather to worship God, study His Word,
      and encourage one another in faith. Whether you're a long-time believer or
      exploring the Christian faith, you're welcome here.</p>
      <a href="about.html" class="link-accent">Learn More →</a>
    </div>
  </section>

  <!-- UPCOMING EVENTS -->
  <section class="section-padding bg-cream">
    <div class="container">
      <h2 class="section-heading text-center">Upcoming Events</h2>
      <div class="row g-4">
        <!-- 3 event cards with date badge, title, description -->
      </div>
      <div class="text-center mt-4">
        <a href="events.html" class="link-accent">View All Events →</a>
      </div>
    </div>
  </section>

  <!-- RECENT SERMON -->
  <section class="section-padding">
    <div class="container" style="max-width: 800px">
      <h2 class="section-heading text-center">Recent Sermon</h2>
      <div class="ratio ratio-16x9 mb-3">
        <iframe src="https://www.youtube.com/embed/VIDEO_ID"
                title="Recent Sermon" allowfullscreen></iframe>
      </div>
      <h5>Sermon Title Placeholder</h5>
      <p class="text-muted">Brief description of the sermon...</p>
      <a href="sermons.html" class="link-accent">More Sermons →</a>
    </div>
  </section>

  <!-- NEW HERE? CTA -->
  <section class="section-padding bg-cream text-center">
    <div class="container" style="max-width: 600px">
      <h2 class="section-heading">New Here?</h2>
      <p class="section-subtext">We'd love to meet you! Learn about who we are,
      what we believe, and what to expect on your first visit.</p>
      <a href="about.html" class="btn btn-primary-custom">Plan Your Visit</a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="site-footer">
    <div class="container">
      <div class="row">
        <div class="col-lg-4 mb-4">
          <h5>Christ Community of Grace</h5>
          <p>A Bible-believing church in Calamba, Philippines.</p>
          <p><i class="bi bi-geo-alt"></i> 2nd Floor, MM&Co., Bldg. 8000
          St. Angela Street, Lakeview Phase III, Halang, Calamba, Philippines, 4027</p>
        </div>
        <div class="col-lg-4 mb-4">
          <h5>Quick Links</h5>
          <ul class="list-unstyled">
            <li><a href="about.html">About</a></li>
            <li><a href="ministries.html">Ministries</a></li>
            <li><a href="sermons.html">Sermons</a></li>
            <li><a href="events.html">News & Events</a></li>
            <li><a href="give.html">Give</a></li>
            <li><a href="contact.html">Contact</a></li>
          </ul>
        </div>
        <div class="col-lg-4 mb-4">
          <h5>Service Times</h5>
          <ul class="list-unstyled">
            <li>1st Sunday: 9:00 AM</li>
            <li>2nd–5th Sunday: 9:30 AM</li>
            <li>Wednesday: 6:00 PM</li>
          </ul>
          <a href="https://www.youtube.com/@calambacommunitychurch2024"
             target="_blank" rel="noopener">
            <i class="bi bi-youtube"></i> YouTube Channel
          </a>
        </div>
      </div>
      <div class="footer-bottom">
        &copy; 2026 Christ Community of Grace. All rights reserved.
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" ...></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Open `index.html` in browser and verify**

Check:
- Header renders with logo, nav links, sticky behavior
- Hero section shows split layout (image left, text right)
- All 5 homepage sections are visible and styled
- Footer has 3 columns with correct content
- Mobile: hamburger menu works, hero stacks vertically

- [ ] **Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add homepage with hero, sections, header, and footer"
```

---

## Chunk 2: Inner Pages (About, Ministries, Sermons)

### Task 4: Create About page (`about.html`)

**Files:**
- Create: `about.html`

Copy header/footer from `index.html`. Page-specific content: hero banner, mission statement, statement of faith accordion, leadership cards grid.

- [ ] **Step 1: Create `about.html`**

Structure:
```
- Same <head> as index.html (update title + meta description + OG tags)
- Same header nav
- Page hero: <section class="page-hero"><h1>About Us</h1></section>
- Mission section: centered text block with placeholder mission statement
- Statement of Faith: Bootstrap accordion with 4-5 placeholder doctrinal items
  (e.g., "The Bible", "God", "Salvation", "The Church", "The Return of Christ")
- Leadership: row of 3-4 cards, each with placeholder circle image, name, role
- Same footer
```

- [ ] **Step 2: Verify in browser**

Check: hero banner, accordion expand/collapse works, leadership cards grid, responsive stacking

- [ ] **Step 3: Commit**

```bash
git add about.html
git commit -m "feat: add about page with mission, doctrine, leadership"
```

---

### Task 5: Create Ministries page (`ministries.html`)

**Files:**
- Create: `ministries.html`

- [ ] **Step 1: Create `ministries.html`**

Structure:
```
- Same head/header/footer pattern
- Page hero: "Ministries"
- Ministry cards grid: 3 columns desktop, 2 tablet, 1 mobile
- 6 cards: Small Groups, Youth, Children, Men's Ministry, Women's Ministry, Worship Team
- Each card: placeholder image (SVG), ministry name, 2-3 sentence description, "Learn More" link
- Uses card-custom class for hover lift effect
```

- [ ] **Step 2: Verify in browser**

Check: cards grid responsive, hover effects, consistent styling

- [ ] **Step 3: Commit**

```bash
git add ministries.html
git commit -m "feat: add ministries page with ministry cards"
```

---

### Task 6: Create Sermons page (`sermons.html`)

**Files:**
- Create: `sermons.html`

- [ ] **Step 1: Create `sermons.html`**

Structure:
```
- Same head/header/footer pattern
- Page hero: "Sermons"
- YouTube channel button: prominent btn-accent linking to full channel
- Video grid: 2 columns desktop, 1 mobile
- 4-6 placeholder YouTube embeds using Bootstrap ratio ratio-16x9
- Each embed: iframe with placeholder video ID + title + date below
- Note text at bottom: "Visit our YouTube channel for more sermons"
```

- [ ] **Step 2: Verify in browser**

Check: video embeds load, responsive grid, channel button works

- [ ] **Step 3: Commit**

```bash
git add sermons.html
git commit -m "feat: add sermons page with YouTube video grid"
```

---

## Chunk 3: Remaining Pages (Events, Give, Contact) + Cleanup

### Task 7: Create News & Events page (`events.html`)

**Files:**
- Create: `events.html`

- [ ] **Step 1: Create `events.html`**

Structure:
```
- Same head/header/footer pattern
- Page hero: "News & Events"
- Upcoming Events: list of 4-5 events, each with:
  - Date badge (date-badge class) on left
  - Event title, time, brief description on right
  - Horizontal layout using Bootstrap row
- Announcements section: bg-cream background
  - 2-3 announcement cards with title + description
```

- [ ] **Step 2: Verify in browser**

Check: event list layout, date badges, announcements section, responsive

- [ ] **Step 3: Commit**

```bash
git add events.html
git commit -m "feat: add news and events page"
```

---

### Task 8: Create Give page (`give.html`)

**Files:**
- Create: `give.html`

- [ ] **Step 1: Create `give.html`**

Structure:
```
- Same head/header/footer pattern
- Page hero: "Give"
- Intro section: scripture quote (2 Corinthians 9:7) + brief generosity message
- Giving methods: row of 3 cards
  - GCash: icon + name + placeholder number/instructions
  - Bank Transfer: icon + bank name + placeholder account details
  - In Person: icon + "During Sunday worship service" + brief note
- Each card uses card-custom class
```

- [ ] **Step 2: Verify in browser**

Check: cards layout, content readable, responsive

- [ ] **Step 3: Commit**

```bash
git add give.html
git commit -m "feat: add giving page with payment method cards"
```

---

### Task 9: Create Contact page (`contact.html`)

**Files:**
- Create: `contact.html`

- [ ] **Step 1: Create `contact.html`**

Structure:
```
- Same head/header/footer pattern
- Page hero: "Contact Us"
- Two-column layout (col-lg-6 each):
  Left column — Contact form:
    - <form action="https://api.web3forms.com/submit" method="POST">
    - <input type="hidden" name="access_key" value="YOUR_ACCESS_KEY_HERE">
    - Name input (required)
    - Email input (required, type="email")
    - Message textarea (required)
    - Submit button (btn-primary-custom)
  Right column — Info:
    - Address with bi-geo-alt icon
    - Service schedule with bi-clock icon
    - Google Maps iframe embed (search for the church address)
- Mobile: stacks vertically (form on top, info below)
```

- [ ] **Step 2: Verify in browser**

Check: form layout, map displays, responsive stacking, form fields have proper types/required attributes

- [ ] **Step 3: Commit**

```bash
git add contact.html
git commit -m "feat: add contact page with Web3Forms and Google Maps"
```

---

### Task 10: Clean up old files and update .gitignore

**Files:**
- Delete: `header.html`
- Delete: `sample.html`
- Modify: `.gitignore`

- [ ] **Step 1: Delete prototype files**

```bash
rm header.html sample.html
```

- [ ] **Step 2: Update `.gitignore` for web project**

Replace Java-focused `.gitignore` with:
```
# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Dependencies (if any added later)
node_modules/

# Environment
.env
```

- [ ] **Step 3: Verify site still works**

Open `index.html` in browser. Click through all nav links. Confirm all 7 pages load correctly.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove old prototypes, update .gitignore for web project"
```

---

## Summary

| Task | Page/File | Depends On |
|------|-----------|------------|
| 1 | `css/styles.css` | — |
| 2 | `js/main.js` | — |
| 3 | `index.html` | Tasks 1, 2 |
| 4 | `about.html` | Task 3 (copies header/footer) |
| 5 | `ministries.html` | Task 3 |
| 6 | `sermons.html` | Task 3 |
| 7 | `events.html` | Task 3 |
| 8 | `give.html` | Task 3 |
| 9 | `contact.html` | Task 3 |
| 10 | Cleanup | Tasks 4–9 |

Tasks 4–9 are independent of each other and can be built in parallel.
