# Paint Mixer

An oil-paint colour mixing assistant for iPhone, used standing at an easel mid-painting.

## Before changing anything

Read DESIGN.md. It is the complete spec and the decisions log explains why things
are the way they are. If a change would contradict DESIGN.md, say so and ask
rather than quietly deviating.

## Build target

- A single self-contained `index.html`: inline CSS and JavaScript, no build step,
  no framework, no bundler.
- Plus `manifest.webmanifest` and `sw.js` for offline Home Screen install.
- Plus `mixbox.js`, used as-is. Keep its CC BY-NC attribution in the page.
- Must work offline once installed. No network calls at runtime, ever.
- Data lives in IndexedDB on the device. Nothing is uploaded anywhere.

## Hard rules

- No features that are not in DESIGN.md. Scope creep is the main risk here.
- The whole interface is neutral mid-grey. No coloured buttons, accents or
  backgrounds near a colour swatch.
- Large touch targets, one-handed use, no flow-breaking prompts or dialogs.
- Recipes are in parts, never percentages or grams.
- Never invent pigment data. Values come from `pigments.js`, and anything
  unverified is marked as such in a comment.

## When the spec changes

Update DESIGN.md in the same commit as the code. The spec must never drift
from what the app does.

## Commits

Small and frequent, one feature or fix each.
