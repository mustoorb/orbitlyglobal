# orbitly: website

Marketing and portfolio site for **orbitly**, an automation-first studio.
*Leading the way, bit by bit.*

Static HTML, CSS and JavaScript with no build step. The motion libraries are vendored in the repo,
so the site doesn't depend on a CDN.

```
index.html                page markup
assets/css/styles.css     design tokens + all styles
assets/js/projects.js     ← your projects and contact details (edit this)
assets/js/main.js         behaviour: scroll, animation, drawer, calculator, form
assets/vendor/            GSAP 3.15 + ScrollTrigger (GSAP standard licence), Lenis 1.3 (MIT)
assets/img/favicon.svg
docs/BRIEF.md             brand brief (source of truth for copy)
```

Run it locally:

```bash
npx serve .      # or: python3 -m http.server
```

## Adding your work

Everything in the Work section is generated from **`assets/js/projects.js`**. Each project has a
`category` (`website`, `automation`, `os`, `personal`), a title, a type, a year, a summary, tags,
an optional live `url` and an optional `image`.

- Put screenshots in `assets/work/` and point `image` at them. Websites look best at 16:10
  (e.g. 1600×1000). OS systems look best as 9:19.5 phone screenshots.
- With no image, a generated mock-up in the orbitly style is shown instead.
- Copy a block to add a project and delete blocks you don't need. The counters at the top of
  the Work section are counted from this file.
- `ORBITLY_CONTACT` at the bottom of the file sets the email, WhatsApp number, booking link and
  calculator currency. Once they're filled in, the contact pills link to them.

## orbitly robotics (coming soon)

The fourth segment appears as a service card and as its own section (`#robotics`) with an animated
robotic arm that moves as you scroll. Its details come from `ORBITLY_ROBOTICS` in
`assets/js/projects.js`. Visitors can pick "Robotics" in the form to be notified at launch; those
submissions arrive in Netlify Forms with `interest = Robotics`.

## Contact form (Netlify Forms)

The audit form posts to Netlify Forms, with a honeypot field for spam. To receive submissions:

1. In Netlify, open the site and go to **Forms → Enable form detection**.
2. Trigger a redeploy (Deploys → Trigger deploy).
3. Optionally, add an email notification under Forms → Form notifications.

The form carries extra context in hidden fields: which button the visitor clicked (`source`) and
their calculator result (`calculator`), when they came from the hours calculator.

## Deploy

`netlify.toml` copies `index.html` and `assets/` into `dist/` and publishes only that folder.
Import the repo in Netlify (Add new project → Import an existing project), pick the branch and
keep the default build settings.

## Design

Inspired by premium product-UI work: smoky studio-grey light, frosted glass, dot-matrix numerals,
round icon buttons and one glowing accent, with a device as the hero. It uses the orbitly palette:
paper `#F4F3EF`, ink `#0D0E10`, night `#0C0D10` and cobalt `#3346FF`.

- **Type:** Urbanist for headlines and body, Doto (dot matrix) for large numbers.
- **Motion:** Lenis smooth scroll and GSAP ScrollTrigger. There's a preloader (once per session),
  a split-text headline reveal, a 3D hero phone with mouse tilt and parallax, and a scroll-lit
  intro statement. The Work section has a pinned horizontal websites gallery, a pinned automation
  flow that fills as you scroll, and OS phones that fan out. The process section is a pinned phone
  whose screen changes with each step. Buttons are magnetic and the ticker reacts to scroll speed.
- **Conversion:** the free-audit CTA appears in the top bar, the floating dock, the hero, every
  service card, every project drawer, the calculator and the FAQ. Each one pre-selects the right
  option in the form.
- **Accessibility:** everything is keyboard reachable, the drawer traps focus and closes on Esc,
  and `prefers-reduced-motion` turns off smooth scroll and pinning. Without JavaScript all
  content is still shown.

## Open placeholders

Everything marked **`[FILL: …]`** shows on the page as a striped yellow tag. Nothing was invented.

| Where | What's needed |
|---|---|
| `projects.js` → websites | Name, type, year, one-liner, URL and screenshot for each site (6 slots) |
| `projects.js` → automation | Project name, summary, tags and the three flow steps (in → system → out) |
| `projects.js` → OS | Brand name, system names, summaries, screenshots (3 slots) |
| `projects.js` → personal | Names, summaries, images (3 slots) |
| `index.html` → OS heading | Your other brand's name (`data-os-brand`) |
| `projects.js` → contact | Email, WhatsApp number, booking link, calculator currency |
| `projects.js` → `ORBITLY_ROBOTICS` | Robotics project name, one-line summary, optional launch window and photo |

The hero phone is labelled "Demo UI" and the process phone shows example screens. Their numbers
are illustrations, not claims about real clients.
