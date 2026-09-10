import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const tokens = readFileSync(resolve(process.cwd(), 'src/styles/tokens.css'), 'utf8');
const laOlivaTokens = tokens.match(/html\[data-theme='la-oliva'\] \{([\s\S]*?)\n\}/)?.[1] ?? '';

describe('La Oliva color tokens', () => {
  it('maps the primary olive utility to verde oliva principal', () => {
    expect(laOlivaTokens).toContain('--color-olive-600: #7d6d43;');
    expect(laOlivaTokens).toContain('--color-olive-700: #706132;');
    expect(laOlivaTokens).toContain('--color-olive-800: #503c1b;');
  });
});
