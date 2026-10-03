import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const assets = fileURLToPath(new URL('../assets/', import.meta.url));
mkdirSync(assets, { recursive: true });

const themes = {
  light: { text: '#1f2328', muted: '#59636e', surface: '#f6f8fa', line: '#d8dee4', accent: '#207565' },
  dark: { text: '#e6edf3', muted: '#9aa7b4', surface: '#161b22', line: '#30363d', accent: '#85cbbb' },
};
const areas = [
  { label: 'MODERNIZATION', title: 'Backend engines', lines: ['Reveal implicit rules.', 'Reshape the structure.', 'Migrate incrementally.'] },
  { label: 'ARCHITECTURE', title: 'Domain & boundaries', lines: ['Model core concepts.', 'Clarify ownership.', 'Define interfaces.'] },
  { label: 'OPERATIONS', title: 'Infra & DevOps', lines: ['Connect design to ops.', 'Improve deployment.', 'Keep systems maintainable.'] },
];
const steps = [
  { title: 'Understand', detail: 'The problem & its constraints' },
  { title: 'Model', detail: 'The domain & its boundaries' },
  { title: 'Evolve', detail: 'The system, incrementally' },
];
const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');

function visual(theme, mobile) {
  const c = themes[theme];
  const width = mobile ? 360 : 900;
  const height = mobile ? 684 : 380;
  const parts = [`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" role="img" aria-labelledby="title desc">`,
    '<title id="title">Areas of work and approach</title>',
    '<desc id="desc">Backend engine modernization: reveal implicit rules, reshape the structure, and migrate incrementally. Domain architecture: model concepts, clarify ownership, and define interfaces. Infrastructure and DevOps: connect design to operations, improve deployment, and keep systems maintainable. Approach: understand the problem, model the domain, and evolve the system.</desc>',
    '<g font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">'];
  const text = (x, y, value, size = 18, color = c.text, weight = 400, extra = '') =>
    parts.push(`<text x="${x}" y="${y}" fill="${color}" font-size="${size}" font-weight="${weight}" ${extra}>${escape(value)}</text>`);
  const eyebrow = (x, y, value) => text(x, y, value, 11, c.muted, 600, 'letter-spacing="1.6"');

  eyebrow(1, 14, 'AREAS OF WORK');
  areas.forEach((area, i) => {
    const x = mobile ? 0 : i * 306;
    const y = mobile ? 32 + i * 148 : 32;
    const w = mobile ? 360 : 288;
    const h = mobile ? 136 : 208;
    parts.push(`<rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="10" fill="${c.surface}" stroke="${c.line}"/>`);
    if (mobile) {
      text(18, y + 29, `0${i + 1}`, 12, c.accent, 600);
      text(51, y + 31, area.title, 22, c.text, 600, 'letter-spacing="-0.5"');
      area.lines.forEach((line, j) => text(51, y + 60 + j * 25, line, 17));
    } else {
      text(x + 20, y + 30, `0${i + 1}`, 12, c.accent, 600);
      text(x + 49, y + 30, area.label, 10, c.muted, 500, 'letter-spacing="1.1"');
      text(x + 20, y + 72, area.title, 23, c.text, 600, 'letter-spacing="-0.6"');
      area.lines.forEach((line, j) => text(x + 20, y + 113 + j * 28, line, 18));
    }
  });

  const dividerY = mobile ? 490 : 266;
  parts.push(`<path d="M0 ${dividerY}H${width}" stroke="${c.line}"/>`);
  eyebrow(1, dividerY + 29, 'FROM PROBLEM TO SYSTEM');
  if (mobile) {
    parts.push(`<path d="M10 546V643" stroke="${c.line}" stroke-width="1.5"/>`);
    steps.forEach((step, i) => {
      const y = 548 + i * 49;
      parts.push(`<circle cx="10" cy="${y - 5}" r="5" fill="${c.accent}"/>`);
      text(30, y, step.title, 18, c.text, 600);
      text(30, y + 20, step.detail, 14, c.muted);
    });
  } else {
    steps.forEach((step, i) => {
      const x = i * 306;
      parts.push(`<circle cx="${x + 6}" cy="328" r="5" fill="${c.accent}"/>`);
      text(x + 22, 334, step.title, 19, c.text, 600);
      text(x + 22, 359, step.detail, 14, c.muted);
      if (i < 2) parts.push(`<path d="M${x + 166} 328H${x + 274}M${x + 268} 324L${x + 274} 328L${x + 268} 332" stroke="${c.line}" stroke-width="1.5"/>`);
    });
  }
  parts.push('</g>', '</svg>', '');
  return parts.join('\n');
}

for (const theme of Object.keys(themes)) {
  for (const mobile of [false, true]) {
    writeFileSync(`${assets}focus-${mobile ? 'mobile-' : ''}${theme}.svg`, visual(theme, mobile));
  }
}
