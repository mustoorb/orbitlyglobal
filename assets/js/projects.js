/* ==========================================================================
   orbitly — work data
   --------------------------------------------------------------------------
   This is the only file you need to edit to show your projects.

   Each project:
     category  'website' | 'automation' | 'os' | 'personal'
     title     project / client name
     kind      short type line, e.g. 'E-commerce', 'Portfolio', 'Brand site'
     year      e.g. '2026'
     summary   one or two sentences, plain language
     tags      short labels
     url       live link (optional, '' to hide the button)
     image     screenshot path, e.g. 'assets/work/store.jpg' (optional).
               Websites: 16:10 desktop screenshot. OS: 9:19 phone screenshot.
               Leave '' and a generated mock-up is shown instead.

   Anything wrapped in [FILL: …] renders as a visible placeholder tag.
   Delete slots you don't need, or copy one to add more.
   ========================================================================== */

window.ORBITLY_PROJECTS = [
  /* ---------- Websites ---------- */
  {
    category: 'website',
    title: '[FILL: e-commerce store name]',
    kind: 'E-commerce',
    year: '[FILL: year]',
    summary: '[FILL: one line on what was built, e.g. storefront + order flow]',
    tags: ['Storefront', 'Checkout', 'Order flow'],
    url: '',
    image: ''
  },
  {
    category: 'website',
    title: '[FILL: portfolio client name]',
    kind: 'Portfolio',
    year: '[FILL: year]',
    summary: '[FILL: one line on what was built]',
    tags: ['Portfolio', 'CMS'],
    url: '',
    image: ''
  },
  {
    category: 'website',
    title: '[FILL: website name]',
    kind: '[FILL: type]',
    year: '[FILL: year]',
    summary: '[FILL: one line on what was built]',
    tags: ['Website'],
    url: '',
    image: ''
  },
  {
    category: 'website',
    title: '[FILL: website name]',
    kind: '[FILL: type]',
    year: '[FILL: year]',
    summary: '[FILL: one line on what was built]',
    tags: ['Website'],
    url: '',
    image: ''
  },
  {
    category: 'website',
    title: '[FILL: website name]',
    kind: '[FILL: type]',
    year: '[FILL: year]',
    summary: '[FILL: one line on what was built]',
    tags: ['Website'],
    url: '',
    image: ''
  },
  {
    category: 'website',
    title: '[FILL: website name]',
    kind: '[FILL: type]',
    year: '[FILL: year]',
    summary: '[FILL: one line on what was built]',
    tags: ['Website'],
    url: '',
    image: ''
  },

  /* ---------- Automation (the featured case study) ---------- */
  {
    category: 'automation',
    title: '[FILL: automation project name]',
    kind: 'Business automation',
    year: '[FILL: year]',
    summary: '[FILL: what was repetitive before, and what runs on its own now]',
    tags: ['[FILL: e.g. WhatsApp orders]', '[FILL: e.g. invoicing]', '[FILL: e.g. barcode scanner]'],
    // The three steps shown in the animated flow: input → system → output
    flow: [
      { io: 'IN', title: '[FILL: trigger, e.g. order arrives]', note: '[FILL: where]' },
      { io: 'SYS', title: '[FILL: what the system does]', note: '[FILL: detail]' },
      { io: 'OUT', title: '[FILL: result, e.g. invoice sent]', note: '[FILL: detail]' }
    ],
    url: '',
    image: ''
  },

  /* ---------- OS systems (for your other brand) ---------- */
  {
    category: 'os',
    title: '[FILL: OS system name]',
    kind: '[FILL: brand name] OS',
    year: '[FILL: year]',
    summary: '[FILL: what this system runs]',
    tags: ['Operating system'],
    url: '',
    image: ''
  },
  {
    category: 'os',
    title: '[FILL: OS system name]',
    kind: '[FILL: brand name] OS',
    year: '[FILL: year]',
    summary: '[FILL: what this system runs]',
    tags: ['Operating system'],
    url: '',
    image: ''
  },
  {
    category: 'os',
    title: '[FILL: OS system name]',
    kind: '[FILL: brand name] OS',
    year: '[FILL: year]',
    summary: '[FILL: what this system runs]',
    tags: ['Operating system'],
    url: '',
    image: ''
  },

  /* ---------- Personal / fun ---------- */
  {
    category: 'personal',
    title: '[FILL: personal project name]',
    kind: 'Personal project',
    year: '[FILL: year]',
    summary: '[FILL: what it is and why you made it]',
    tags: ['Experiment'],
    url: '',
    image: ''
  },
  {
    category: 'personal',
    title: '[FILL: personal project name]',
    kind: 'Personal project',
    year: '[FILL: year]',
    summary: '[FILL: what it is and why you made it]',
    tags: ['Experiment'],
    url: '',
    image: ''
  },
  {
    category: 'personal',
    title: '[FILL: personal project name]',
    kind: 'Personal project',
    year: '[FILL: year]',
    summary: '[FILL: what it is and why you made it]',
    tags: ['Experiment'],
    url: '',
    image: ''
  }
];

/* orbitly robotics: the coming-soon project shown in the Robotics section.
   Leave `launch` empty until you have a date you're happy to publish. */
window.ORBITLY_ROBOTICS = {
  name: '[FILL: robotics project name]',
  summary: '[FILL: one or two lines on what it does and who it is for]',
  status: 'In development',
  launch: '',          // e.g. 'Early 2027'
  tags: ['Mechatronics', 'Robotics', 'Built in-house'],
  image: ''            // optional photo of the build, e.g. 'assets/work/robot.jpg'
};

/* Contact details used across the site. */
window.ORBITLY_CONTACT = {
  email: '',        // e.g. 'hello@orbitly.co'
  whatsapp: '',     // international format, digits only, e.g. '60123456789'
  booking: '',      // e.g. 'https://cal.com/orbitly/audit'
  currency: ''      // ISO code for the calculator, e.g. 'USD'
};
