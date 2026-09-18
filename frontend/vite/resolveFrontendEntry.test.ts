import { resolveFrontendEntry } from './resolveFrontendEntry';

describe('resolveFrontendEntry', () => {
  it('uses the combined entry for local development', () => {
    expect(resolveFrontendEntry('development')).toBe('/src/main.tsx');
  });

  it('uses the staff-only entry for staff builds', () => {
    expect(resolveFrontendEntry('staff')).toBe('/src/main.staff.tsx');
  });

  it('uses the public-only entry for public builds', () => {
    expect(resolveFrontendEntry('public')).toBe('/src/main.public.tsx');
  });
});
