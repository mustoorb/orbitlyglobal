# orbitly: website

Marketing site for **orbitly**, an automation-first studio for small and medium businesses.
*Leading the way, bit by bit.*

Plain HTML, CSS and JavaScript. No build step and no dependencies apart from Google Fonts (Geist and Geist Mono).

```
index.html            single-page site
assets/css/styles.css design tokens + all styles
assets/js/main.js     nav, scroll reveal, hours calculator
assets/img/favicon.svg
docs/BRIEF.md         brand brief (source of truth for copy)
```

Run it locally:

```bash
npx serve .      # or: python3 -m http.server
```

Any static host works. For **Netlify**, `netlify.toml` is already set up: it copies `index.html` and
`assets/` into `dist/` and publishes only that, so repo files like `docs/` and `package.json` stay private.
Connect the repo in Netlify (Add new site → Import an existing project), pick the branch and keep the
defaults. The settings are read from `netlify.toml`.

## Design direction

The layout takes its cues from high-end product studios like rondesignlab.com: very large confident
type, generous whitespace, numbered service rows, large case-study cards and a strong "Let's talk" close.
It is light and precise, and avoids the dark neon glassmorphism style the brief rejects.

- **Palette:** warm paper `#F4F3EF`, ink `#0D0E10`, one cobalt accent `#3346FF`. The hardware section and CTA are dark for contrast.
- **Type:** Geist for headlines and body, Geist Mono for small technical labels (`01`, `IN / SYS / OUT`).
- **Futuristic touches:** hand-built orbit visual (tasks and devices circling "your business"),
  a faint engineering grid, a live-status readout and an animated signal flow in the hardware diagram.
  All motion stops under `prefers-reduced-motion`.
- **Brand idea:** the wordmark's dot orbits the "o". Momentum, built bit by bit.

## Page sections

1. Hero: one-liner, positioning, audit CTA, orbit visual, ticker of automations
2. The problem: the drowning-owner day
3. Services: automation (lead service), custom systems & SaaS, websites
4. Hardware: the rare differentiator, with a scan → system → print flow diagram
5. Hours calculator: visitor's own numbers, no invented metrics
6. Selected work: the e-commerce and portfolio projects (placeholders)
7. Process: free audit → plan → build bit by bit → handover
8. Why orbitly: the five differentiators in the brief's order
9. About: brand idea, mission, vision, founder and facts
10. CTA and contact

## Open placeholders

Everything marked **`[FILL: …]`** shows on the page as a striped yellow tag so it can't be missed.
Nothing on this list was invented.

| Where | What's needed |
|---|---|
| About → facts | Founded year |
| About → facts | City, country |
| About → facts | Service area: local / regional / remote |
| About → facts | Team: solo studio or team of N |
| About → founder | Founder name and one-line background |
| Work → card 1 | E-commerce client / store name, URL, one-line description, screenshot |
| Work → card 2 | Portfolio client name, URL, one-line description, screenshot |
| Work | Any other projects you're allowed to show |
| Contact | Email |
| Contact | WhatsApp number (also the "Message on WhatsApp" button `href`, e.g. `https://wa.me/<number>`) |
| Contact | Booking link, e.g. Cal.com (also the "Book a free audit" button `href`) |
| Calculator | Currency: set `CURRENCY` at the top of `assets/js/main.js` (e.g. `'USD'`) |
| Brief §4 | One or two industries to focus on first (optional; would sharpen hero and problem copy) |

The pasted brief ended partway through **section 4**. Sections 5 onward, including section 7
(visual design), never arrived. Add them to `docs/BRIEF.md` and the site can be brought in line
with them.
