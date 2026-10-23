# Paint Mixer

An oil-paint colour mixing assistant for iPhone, used standing at an easel mid-painting.

## Before changing anything

Read DESIGN.md. It is the complete spec and the decisions log explains why things
are the way they are. If a change would contradict DESIGN.md, say so and ask
rather than quietly deviating.

## Build target

- A single self-contained `index.html`: inline CSS and JavaScript, no build step,
  no framework, no bundler.
- Plus `manifest.webmanifest`, `sw.js` and the `icon-*.png` files for offline
  Home Screen install.
- Plus `pigments.js`, the reference library, loaded as a classic script.
- Plus `mixbox.js`, used as-is. Keep its CC BY-NC attribution in the page, and
  keep `LICENSE` in the repo, since the public repo is a distribution.
- Must work offline once installed. No network calls at runtime, ever.
- Data lives in IndexedDB on the device. Nothing is uploaded anywhere.

## Hard rules

- No features that are not in DESIGN.md. Scope creep is the main risk here.
- The whole interface is neutral mid-grey. No coloured buttons, accents or
  backgrounds near a colour swatch.
- Large touch targets, one-handed use, no flow-breaking prompts or dialogs.
- Recipes are solved and stored in parts, never grams. Parts is the default
  display, with a toggle on the recipe screen to show percentages instead.
- Never invent pigment data. Values come from `pigments.js`, and anything
  unverified is marked as such in a comment.

## Releasing

- Any commit that changes a shipped file (`index.html`, `pigments.js`,
  `mixbox.js`, the manifest or an icon) must also bump `CACHE_VERSION` in
  `sw.js`. The service worker is cache-first, so without the bump every
  installed copy keeps running the old app indefinitely.
- A new shipped file must be added to `APP_FILES` in `sw.js`, or it will be
  missing offline.
- Use relative paths only. The app is served from `/paint-mixer/` on GitHub
  Pages, not from the site root.

## When the spec changes

Update DESIGN.md in the same commit as the code. The spec must never drift
from what the app does.

## Commits

Small and frequent, one feature or fix each.
