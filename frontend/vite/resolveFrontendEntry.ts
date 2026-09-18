const entries = {
  staff: '/src/main.staff.tsx',
  public: '/src/main.public.tsx',
} as const;

export function resolveFrontendEntry(mode: string) {
  if (mode === 'staff' || mode === 'public') return entries[mode];
  return '/src/main.tsx';
}
