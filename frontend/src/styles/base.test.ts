import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const base = readFileSync(resolve(process.cwd(), 'src/styles/base.css'), 'utf8');
const reducedMotionBlocks = [
  ...base.matchAll(/@media \(prefers-reduced-motion: no-preference\) \{([\s\S]*?)\n\}/g),
].map((match) => match[1]);
const motion = reducedMotionBlocks.join('\n');

describe('public information page motion', () => {
  it('scrolls the document smoothly only while the public page is mounted', () => {
    expect(base).toContain('html:has(.public-info-page)');
    expect(base).toMatch(/html:has\(\.public-info-page\) \{\s*scroll-behavior: smooth;/);
  });

  it('keeps every entrance and reveal rule behind the reduced-motion preference', () => {
    expect(reducedMotionBlocks.length).toBeGreaterThan(0);
    ['.enter-up-1', '.enter-up-5', '.enter-from-right', '.reveal', '.reveal-stagger'].forEach(
      (selector) => {
        expect(motion).toContain(selector);
      },
    );
    expect(base.replace(motion, '')).not.toMatch(/\.reveal\b/);
    expect(base.replace(motion, '')).not.toMatch(/\.enter-up-/);
  });

  it('reveals with the shared easing and a capped stagger', () => {
    expect(motion).toMatch(/\.reveal \{[^}]*opacity: 0;[^}]*translateY\(18px\)/);
    expect(motion).toMatch(/\.reveal\.is-visible \{[^}]*opacity: 1;/);
    expect(motion).toContain('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(motion).toMatch(/\.reveal-stagger\.is-visible > \*:nth-child\(8\) \{[^}]*420ms/);
    expect(motion).toMatch(/\.reveal-stagger\.is-visible > \*:nth-child\(n \+ 9\) \{[^}]*420ms/);
  });
});
