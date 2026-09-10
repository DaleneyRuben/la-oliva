# La Oliva theme implementation plan

## Outcome

Add a persistent, accessible visual-theme system to the staff panel. **La Oliva** is the default
theme and follows the approved visual guide; **Clásica** preserves the current production design
as an alternative. The work is visual only: routes, business behavior, Spanish UI copy, and
component layouts do not change, apart from the theme controls and responsive logo treatment.

The canonical vocabulary is in [CONTEXT.md](../CONTEXT.md), under **Visual identity**.

## Confirmed design decisions

- Theme choices are labelled **La Oliva** and **Clásica**. The stable internal value for the
  latter may remain `variant1`.
- The preference is stored per browser, not per staff account or backend record. Missing,
  malformed, or inaccessible storage resolves to La Oliva.
- Theme selection is available in the desktop sidebar footer, inside the mobile navigation menu,
  and on the login screen. It is a two-option, keyboard-accessible segmented radio control.
- La Oliva uses the supplied `Oficial.png` as its full mark on the login and loading screens.
  Clásica keeps the existing `logo.png` assets and use sites unchanged. Neither theme introduces
  an image mark into the sidebar/mobile-header text-lockup layout.
- The favicon follows the active theme: current favicon for Clásica; an official-mark derivative
  for La Oliva.
- La Oliva type roles are Bodoni Moda (display serif), Montserrat (interface and numeric
  sans-serif), and Italianno (wordmark/intentional ornamental copy only). Clásica retains
  Cormorant Garamond, Manrope, and JetBrains Mono.
- La Oliva primary actions and navigation use olive `#706132`; terracotta `#A9511F` is a
  secondary accent. The remaining guide swatches are mapped as supporting olive, sage, gold,
  cream, beige, and plum values.
- Warning, destructive, success, role, and calendar-state colours stay semantically distinct and
  accessible in both themes. The La Oliva palette may supply controlled tints for their surfaces,
  but does not erase their meaning.
- Both themes must meet WCAG AA contrast for normal UI text, controls, selected states, and
  keyboard focus.

## Implementation sequence

1. Establish the theme boundary and prevent first-paint flicker.
   - Add a small, dependency-free theme module (for example,
     `frontend/src/features/theme/theme.ts`) containing the two allowed IDs, the local-storage
     key, validation, default resolution, and a document-root application function.
   - Add a pre-React bootstrap script in [frontend/index.html](../frontend/index.html) that reads
     the validated preference and sets `data-theme="la-oliva"` or `data-theme="classic"` on
     `<html>`. It must default safely to La Oliva if storage is unavailable or corrupt.
   - Add a lightweight provider/hook for live switching after startup. It updates the root
     attribute, persisted preference, and favicon together. This remains frontend-only; no API,
     schema, or auth change is introduced.

2. Turn the existing global tokens into stable semantic aliases with two theme value maps.
   - Refactor [frontend/src/styles/tokens.css](../frontend/src/styles/tokens.css) so Tailwind's
     existing colour/font utility names remain available, but their runtime values are supplied
     by `html[data-theme]` maps. The Clásica map copies every current value exactly.
   - Add the La Oliva map using the guide palette: olive `#706132`, dark olive `#503C1B`, sage
     `#92815B`, terracotta `#A9511F`, gold `#C88634`, warm beige `#B6A07B`, light beige
     `#D2C0A7`, background cream `#EBE0D3`, and plum `#563044`. Define derived light tints only
     where cards, fields, dividers, hover states, disabled controls, and focus rings need them.
   - Preserve semantic tokens (`alert`, `warn`, `danger`, `ok`, role tags, calendars) as semantic
     aliases. Re-evaluate their foreground/background/border combinations under La Oliva for AA
     contrast; do not map destructive UI directly to terracotta.
   - Load both font trios from the existing Google Fonts import in
     [frontend/src/index.css](../frontend/src/index.css). In La Oliva, map `font-serif` to Bodoni
     Moda and map current interface roles—including existing `font-mono` labels—to Montserrat;
     reserve Italianno for an explicit brand-wordmark class. Keep all current Clásica mappings.
   - Replace hard-coded visual CSS in [frontend/src/styles/base.css](../frontend/src/styles/base.css)
     only where it prevents token switching (login glow, brand-mark decoration, gradients, and
     focus/animation-adjacent colour values). Keep dimensions and transitions intact.

3. Add theme-aware brand assets without overwriting the existing ones.
   - Copy the supplied official logo into a new, clearly named frontend asset (for example,
     `frontend/src/assets/la-oliva-logo.png`); leave `logo.png` and the currently unused
     `small_logo.png` untouched for Clásica compatibility.
   - Add a theme-aware logo resolver used by [LoginPage.tsx](../frontend/src/features/auth/LoginPage.tsx)
     and [PageLoader.tsx](../frontend/src/components/ui/PageLoader.tsx). It selects the current
     full image in Clásica and the official image in La Oliva.
   - Add a La Oliva favicon derived from the same supplied official mark in `frontend/public/`.
     Give the existing favicon link a stable ID in `index.html` so bootstrap and live theme changes
     can select the matching icon without a reload.
   - Keep the sidebar/mobile markup from [Layout.tsx](../frontend/src/components/layout/Layout.tsx).
     Style its text lockup with theme tokens; in La Oliva split only the visible brand wordmark as
     needed to apply Bodoni Moda to “La” and Italianno to “Oliva.” Do not introduce a new compact
     logo derivative.

4. Build one reusable theme selector and place it only in the agreed surfaces.
   - Create a small `ThemeSwitcher` component backed by the provider/hook. Use native radio
     semantics inside a labelled group (for example, “Tema visual”), with visible labels “La
     Oliva” and “Clásica,” focus styling, `aria-checked`, and keyboard navigation.
   - Render the compact selector in the signed-in sidebar footer and, therefore, within the mobile
     menu when it opens. Render the matching compact version on the login screen.
   - Theme the control using semantic tokens; selection must be distinguishable without relying
     only on colour. It must remain usable in both themes and at narrow widths.

5. Update the design contract and tests before final visual review.
   - Extend [design/README.md](../design/README.md) with a Visual themes section that identifies
     La Oliva as default, Clásica as the preserved current theme, their type roles, logo policy,
     palette roles, selector locations, persistence rule, and semantic-colour exception.
   - Add unit tests for default/invalid preference resolution, persistence, root attribute updates,
     storage failure handling, and favicon selection.
   - Update [Layout.test.tsx](../frontend/src/components/layout/Layout.test.tsx) and
     [LoginPage.test.tsx](../frontend/src/features/auth/LoginPage.test.tsx) to assert the labelled
     selector, keyboard-operable choices, and theme-aware branding without weakening current role
     and navigation assertions. Add PageLoader coverage for its theme-aware logo.
   - Keep existing token utility expectations valid in Clásica. Add targeted tests for the La
     Oliva font/brand classes only where they are explicit markup, rather than snapshotting CSS
     implementation details.

## Verification and acceptance

1. Run frontend unit tests, lint, typecheck, and production build.
2. Start the app and verify that no-theme-storage, invalid-theme-storage, La Oliva, and Clásica
   cases all select correctly before the first meaningful paint; confirm a switch survives reload,
   logout, and login in the same browser.
3. Use browser automation to review every route in both themes at the established desktop
   baseline. Check the existing page-capture flow and add/update captures only if needed for the
   new selector and theme state.
4. At a mobile viewport, verify login, sidebar/menu opening, theme selection, and the densest
   form workflows. Confirm the text lockup and switch do not crowd controls.
5. Check contrast and visible focus in both themes for primary buttons, secondary actions,
   selected navigation, inputs, validation/error states, warnings, destructive actions, role
   tags, disabled controls, and the theme selector. Confirm full logos and favicons switch
   correctly while the sidebar/mobile text lockup stays layout-compatible.

## Out of scope

- Backend persistence, account preferences, API/database changes, or role-specific themes.
- Changes to routes, domain rules, UI labels, component layouts, or operational workflows.
- Adding foliage, decorative illustrations, or other visual-guide elements not requested by the
  user.
