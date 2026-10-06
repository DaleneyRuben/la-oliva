import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const tokens = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
const laOlivaTokens = tokens.match(/html\[data-theme='la-oliva'\] \{([\s\S]*?)\n\}/)?.[1] ?? '';
const sharedTokens = tokens.match(/@theme \{([\s\S]*?)\n\}/)?.[1] ?? '';

describe('La Oliva color tokens', () => {
  it('maps the primary olive utility to verde oliva principal', () => {
    expect(laOlivaTokens).toContain('--color-olive-600: #7d6d43;');
    expect(laOlivaTokens).toContain('--color-olive-700: #706132;');
    expect(laOlivaTokens).toContain('--color-olive-800: #503c1b;');
  });
});

describe('public information page tokens', () => {
  it('keeps the slide palette and fonts theme-independent', () => {
    [
      '--color-public-cream: #f7f2e8;',
      '--color-public-paper: #fffdf8;',
      '--color-public-cream-2: #f1e8d8;',
      '--color-public-ink: #1f2a3a;',
      '--color-public-body: #3b4452;',
      '--color-public-muted: #6e7480;',
      '--color-public-rule: #e6decf;',
      '--color-public-terracotta: #b5442a;',
      '--color-public-terracotta-deep: #9e4a2e;',
      '--color-public-olive: #4f5b30;',
      '--color-public-olive-text: #d9c98a;',
      '--color-public-olive-soft: #e4dec9;',
      '--color-public-orange: #c98a3a;',
      '--color-public-plum: #6d3f58;',
      '--color-public-price: #d9342b;',
      '--color-public-tan: #a58d6a;',
      "--font-public-display: 'Bodoni Moda', Georgia, serif;",
      "--font-public-body: 'Montserrat', system-ui, sans-serif;",
      "--font-public-script: 'Italianno', cursive;",
    ].forEach((declaration) => {
      expect(sharedTokens).toContain(declaration);
    });
    expect(laOlivaTokens).not.toContain('--color-public-');
  });
});
