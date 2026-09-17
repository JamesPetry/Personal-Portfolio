/* All copy lives here. Swap text and image paths without touching components.
   Items marked PLACEHOLDER are waiting on James. */

export const site = {
  name: 'James Petry',
  fullName: 'James Marlin Petry',
  role: 'Computational Designer',
  mark: 'JMP',
  city: 'Sydney, Australia',
  email: 'hello@jamesmarlin.au',
  phone: '0423 624 863',
  phoneHref: 'tel:+61423624863',
  web: 'jamesmarlin.au',
  webHref: 'https://jamesmarlin.au',
  coords: '33.8688° S, 151.2093° E',
  nav: [
    { label: 'Home', href: '#top' },
    { label: 'Explore', href: '#works' },
    { label: 'Connect', href: '#connect' },
  ],
  tools: [
    'Grasshopper',
    'Rhino',
    'LLM System Orchestration',
    'BIM',
    'Fusion',
    'Python', // PLACEHOLDER
    'React', // PLACEHOLDER
  ],
};

export const hero = {
  /* Drop a render at public/hero.jpg and it is used automatically.
     Until then the generated artwork behind it shows through. */
  image: '/hero.jpg',
  fallback: '/art/hero.svg',
  /* 'light' suits a pale render (white building, bright sky); 'dark' suits a dark image.
     It only sets how strong a scrim sits under the white text. */
  tone: 'light' as 'light' | 'dark',
  /* Portrait images are cropped on wide screens; this picks the part that is kept. */
  focus: '50% 38%',
  statement:
    'I build computational tools inside architectural practice, for the workflows no commercial software quite fits, and make them something a practitioner can trust.',
  meta: [
    { k: 'Featured project', v: 'Vibe-coded tools in AEC practice' },
    { k: 'Year', v: '2026' },
    { k: 'Type', v: 'Research · Agentic tooling' },
  ],
  corner: 'Sydney · Computational design',
};

export const practice = {
  label: 'The practice',
  headline: ['Tools built', 'with practice', 'at heart'],
  image: '/art/studio.svg',
  body: [
    'I work at the seam between architectural practice and code: Grasshopper and Rhino for geometry, BIM for the record, and language models orchestrated into tools that sit inside a practitioner’s own environment.',
    'The question that runs through the work is simple. When a tool is generated rather than written, where does the practitioner check it, and how early can that check move?',
  ],
  stats: [
    { v: '03', k: 'Workflow adapters shipped' },
    { v: '04', k: 'Stage pipeline' },
    { v: '01', k: 'Multidisciplinary AEC firm' },
    { v: 'SYD', k: 'Based' },
  ],
};

export type Stage = { label: string; title: string; text: string; image: string };
export type Project = {
  index: string;
  slug: string;
  title: string;
  short: string;
  year: string;
  type: string;
  cover: string;
  span: 'wide' | 'tall';
  story: Stage[];
};

export const projects: Project[] = [
  {
    index: '01',
    slug: 'vibe-coded-aec',
    title: 'A Framework for Vibe-Coded Tool Implementation in AEC Practice',
    short: 'Vibe-coded tools in AEC practice',
    year: '2026',
    type: 'Research · Agentic tooling',
    cover: '/art/p1.svg',
    span: 'wide',
    story: [
      {
        label: 'Ideation',
        title: 'Every practice runs on workflows no commercial tool quite fits.',
        text:
          'Vibe coding put tool generation within reach of practitioners, but a first prompt treated as a one-shot specification stops where the output diverges. Architecture cannot afford that: work leaves the office signed, against firm conventions and a record. The question became how a practitioner and an agentic system converge on a shared model of a workflow while the tool is being built.',
        image: '/art/p1.svg',
      },
      {
        label: 'Process',
        title: 'Three practitioners, three adapters, build–intervene–evaluate.',
        text:
          'Action design research inside a large multidisciplinary AEC firm. Conceptual façade generation in Grasshopper, tender-to-schedule extraction, and an automated issue-and-archive tool, each run through cycles of build, intervene and evaluate. Across the cycles the point at which practitioners corrected the system moved earlier: from reworking output by hand, to adjusting exposed parameters, to declaring intent before generation.',
        image: '/art/p2.svg',
      },
      {
        label: 'Product',
        title: 'A four-stage pipeline and three mechanisms that make it hold.',
        text:
          'Propose, resolve, check, commit. Framework v1 keeps the pipeline and replaces the constraint set with mechanisms: a resolvable intermediate that exposes translated parameters in the practitioner’s own environment, verification cost treated as a design variable, and intent declared upstream through fixed scope questions before anything is generated.',
        image: '/art/p3.svg',
      },
    ],
  },
  {
    index: '02',
    slug: 'project-two',
    title: 'Project Two', // PLACEHOLDER
    short: 'Project two, to be confirmed',
    year: '2026',
    type: 'Computational design',
    cover: '/art/p2.svg',
    span: 'tall',
    story: [
      { label: 'Ideation', title: 'The brief, and the gap it opened.', text: 'PLACEHOLDER. What was the workflow, who did it belong to, and what did the existing tools miss?', image: '/art/p2.svg' },
      { label: 'Process', title: 'How the work moved from sketch to system.', text: 'PLACEHOLDER. Geometry, data, iterations, the moments the practitioner intervened.', image: '/art/p3.svg' },
      { label: 'Product', title: 'What shipped, and what it changed.', text: 'PLACEHOLDER. The deliverable, in use, and what it made possible.', image: '/art/p1.svg' },
    ],
  },
  {
    index: '03',
    slug: 'project-three',
    title: 'Project Three', // PLACEHOLDER
    short: 'Project three, to be confirmed',
    year: '2025',
    type: 'Parametric geometry',
    cover: '/art/p3.svg',
    span: 'tall',
    story: [
      { label: 'Ideation', title: 'The brief, and the gap it opened.', text: 'PLACEHOLDER.', image: '/art/p3.svg' },
      { label: 'Process', title: 'How the work moved from sketch to system.', text: 'PLACEHOLDER.', image: '/art/p1.svg' },
      { label: 'Product', title: 'What shipped, and what it changed.', text: 'PLACEHOLDER.', image: '/art/p2.svg' },
    ],
  },
];

export const method = {
  label: 'Method',
  image: '/art/method.svg',
  stages: [
    { n: '01', name: 'Propose', text: 'A probabilistic stage produces a candidate from the practitioner’s utterance.' },
    { n: '02', name: 'Resolve', text: 'The practitioner corrects the candidate on an editable intermediate, before anything downstream consumes it.' },
    { n: '03', name: 'Check', text: 'The corrected artefact is validated against the declared schema and against what was asked for.' },
    { n: '04', name: 'Commit', text: 'A deterministic stage converts the checked artefact into the deliverable.' },
  ],
  lead:
    'Every tool I build follows one pipeline. Intent is declared before anything is generated, corrected on an intermediate the practitioner can actually edit, checked against what was asked for, and only then committed.',
  lead2:
    'The framework matters most where practitioner and system begin misaligned. Where they already agree, it gets out of the way.',
};

export const cta = {
  headline: ['Let’s build', 'a tool that', 'fits the work'],
  button: 'Start a conversation',
};

export const footer = {
  acknowledgement:
    'I live and work on the lands of the Gadigal people of the Eora Nation and acknowledge their continuing connection to land, water and community. Sovereignty was never ceded.',
  nav: [
    { label: 'Home', href: '#top' },
    { label: 'Practice', href: '#practice' },
    { label: 'Works', href: '#works' },
    { label: 'Method', href: '#method' },
    { label: 'Connect', href: '#connect' },
  ],
};
