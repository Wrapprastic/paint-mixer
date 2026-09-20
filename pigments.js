/* ============================================================================
 * pigments.js — the built-in pigment reference library
 * ============================================================================
 *
 * This is DESIGN.md "Technical approach > 7. Pigment reference library": a
 * permanent, hidden data set used for exactly two things —
 *
 *   1. pre-filling colour and strength when a paint is added to Inventory, and
 *   2. supplying the "buy" pigments on the Best match recipe card.
 *
 * It is never shown to the user as a browsable list, and nothing here appears
 * in Inventory unless the user adds it (apart from TISCHLER_12 on first launch).
 *
 * Every pigment in this file is deliberately common and easy to buy across
 * mainstream oil ranges, so Best match can draw on any entry without breaking
 * the DESIGN.md rule that it "never suggests rare or specialist pigments".
 * There is no `common` flag because there is nothing here that isn't.
 *
 * Loaded as a classic script (`<script src="pigments.js"></script>`), which
 * puts PIGMENTS and TISCHLER_12 on the global scope. No build step, no module
 * loader, works offline. If we later decide index.html must be genuinely
 * single-file, this file's contents paste in verbatim.
 *
 * ---------------------------------------------------------------------------
 * ON THE `source` FIELD — READ THIS BEFORE TRUSTING ANY NUMBER
 * ---------------------------------------------------------------------------
 *
 * `source` describes the provenance of `referenceRgb` ONLY.
 *
 *   "mixbox"    — the value is Mixbox's own published reference RGB, copied
 *                 verbatim from its README. Not adjusted, not rounded. These
 *                 are the pigments Mixbox's Kubelka-Munk model is actually
 *                 built around, so mixes involving them are the most reliable
 *                 predictions the app can make.
 *
 *   "estimated" — Mixbox does not publish this pigment. No manufacturer or
 *                 pigment database publishes a measured masstone sRGB value
 *                 for it either, in any form I could cite. The value is my
 *                 estimate, reasoned from the pigment's known character and
 *                 pinned to the Mixbox values above so the set stays
 *                 internally consistent. Each one carries a comment saying
 *                 what it was reasoned against. Treat every one of these as
 *                 provisional until calibrated against real paint.
 *
 * `strength` IS ESTIMATED FOR EVERY SINGLE ENTRY, INCLUDING THE "mixbox" ONES.
 * Mixbox publishes colour, not tinting strength. There is no published
 * cross-brand tinting-strength scale for oil paint at all. Do not read
 * source: "mixbox" as meaning the strength figure is sourced — it is not.
 *
 * `opacity` is likewise a conventional description of the pigment, not a
 * measurement. It is advisory text for the user, not solver input.
 *
 * ---------------------------------------------------------------------------
 * THE STRENGTH SCALE
 * ---------------------------------------------------------------------------
 *
 * 1-5, anchored as specified: Yellow Ochre ~2, Phthalo Green 5.
 *
 *   1  very weak     barely shifts a mix (Cobalt Violet)
 *   2  weak          the earths; forgiving, hard to overdo
 *   3  moderate      the cadmiums; roughly "what you add is what you get"
 *   4  strong        needs care
 *   5  overpowering  a knife-tip changes everything (the phthalos, dioxazine)
 *
 * SOLVER NOTE, for session 3 — do not use `strength` as a linear multiplier.
 * DESIGN.md says the strength factor "converts parts into effective
 * proportions before mixing". A linear reading makes Phthalo Green only 2.5x
 * Yellow Ochre, which is nowhere near the truth; in the tube the gap is closer
 * to an order of magnitude. A geometric curve fits real behaviour far better:
 *
 *     effectiveParts = parts * Math.pow(2, strength - 1)
 *
 * which gives Ochre 2 and Phthalo Green 16, an 8:1 ratio. That curve is a
 * proposal, not a decision — it belongs in the recipe solver session, and it
 * needs to be settled and written into DESIGN.md before the solver is built.
 *
 * ---------------------------------------------------------------------------
 * ATTRIBUTION
 * ---------------------------------------------------------------------------
 *
 * The 13 values marked source: "mixbox" are from the Mixbox project by
 * Secret Weapons — https://github.com/scrtwpns/mixbox — used under CC BY-NC
 * 4.0, non-commercial use only. The same licence and attribution must appear
 * in the app UI, per CLAUDE.md.
 * ========================================================================= */

const PIGMENTS = [

  /* --- Whites ------------------------------------------------------------
   * DESIGN.md keeps these as two explicit, separate inventory entries, with
   * no assumptions made under the hood about which white a recipe means.
   */
  {
    // PW6. Reasoned as: near-neutral white, a hair off paper-white, very
    // slightly cool. Strength 4.5 because DESIGN.md flags Titanium as the
    // white that "can overpower mixes" — it is the strongest thing on most
    // palettes and the solver must not treat white as inert filler.
    name: 'Titanium White',
    referenceRgb: [252, 252, 249],
    strength: 4.5,
    opacity: 'opaque',
    source: 'estimated'
  },
  {
    // PW1. Reasoned as Titanium shifted warm and very slightly down in value,
    // matching DESIGN.md's "softer, more luminous transitions". Strength 3
    // to encode that it is the gentler white — the whole reason to reach for
    // it over Titanium.
    name: 'Lead White',
    referenceRgb: [250, 247, 238],
    strength: 3,
    opacity: 'opaque',
    source: 'estimated'
  },

  /* --- Yellows ---------------------------------------------------------- */
  {
    // PY35 lemon shade. Reasoned against Mixbox's Cadmium Yellow below by
    // shifting green and dropping red slightly — lemon is the cooler, greener
    // cadmium. Tischler's "Y" in his CMYK reading of the palette.
    name: 'Cadmium Lemon',
    referenceRgb: [240, 235, 0],
    strength: 3,
    opacity: 'opaque',
    source: 'estimated'
  },
  {
    name: 'Cadmium Yellow',
    referenceRgb: [254, 236, 0],
    strength: 3,
    opacity: 'opaque',
    source: 'mixbox'
  },
  {
    // Arylide. Strength 3.5: hansa yellows tint noticeably harder than the
    // cadmiums despite reading as the quieter pigment on the palette.
    name: 'Hansa Yellow',
    referenceRgb: [252, 211, 0],
    strength: 3.5,
    opacity: 'semi-transparent',
    source: 'mixbox'
  },
  {
    // PY43. The scale anchor at strength 2, given. Colour reasoned against
    // Mixbox's Burnt Sienna [123, 72, 0]: ochre is the same iron-oxide family
    // but lighter, yellower and much less red, so red and green rise together
    // while blue stays near zero in the Mixbox convention.
    name: 'Yellow Ochre',
    referenceRgb: [186, 137, 20],
    strength: 2,
    opacity: 'semi-opaque',
    source: 'estimated'
  },

  /* --- Orange ----------------------------------------------------------- */
  {
    name: 'Cadmium Orange',
    referenceRgb: [255, 105, 0],
    strength: 3,
    opacity: 'opaque',
    source: 'mixbox'
  },

  /* --- Reds ------------------------------------------------------------- */
  {
    // PR108. THIS IS THE WEAKEST ENTRY IN THE FILE — see the note at the end.
    // Mixbox's "Cadmium Red" sits between Cad Red Light and Cad Red Medium,
    // so a separate Light is nudged a little further toward orange. The two
    // may be too close to tell apart in practice.
    name: 'Cadmium Red Light',
    referenceRgb: [252, 60, 10],
    strength: 3,
    opacity: 'opaque',
    source: 'estimated'
  },
  {
    name: 'Cadmium Red',
    referenceRgb: [255, 39, 2],
    strength: 3,
    opacity: 'opaque',
    source: 'mixbox'
  },
  {
    // PR264 / deep PV19. Reasoned against Mixbox's Quinacridone Magenta
    // [128, 2, 46]: crimson is warmer and redder than magenta but still a
    // cool red, so red rises and blue falls. Tischler's cool red.
    name: 'Permanent Crimson',
    referenceRgb: [146, 12, 32],
    strength: 4,
    opacity: 'transparent',
    source: 'estimated'
  },
  {
    // PR83 or a modern hue substitute. Darker and very slightly more violet
    // than Permanent Crimson, which is the practical difference a painter
    // reaching for one over the other is after.
    name: 'Alizarin Crimson',
    referenceRgb: [118, 15, 38],
    strength: 4,
    opacity: 'transparent',
    source: 'estimated'
  },
  {
    // Strength 5: DESIGN.md's recipe rules name this alongside Phthalo Green
    // and Ultramarine as a strong tinter that goes in last and in touches.
    name: 'Quinacridone Magenta',
    referenceRgb: [128, 2, 46],
    strength: 5,
    opacity: 'transparent',
    source: 'mixbox'
  },

  /* --- Violets ---------------------------------------------------------- */
  {
    // Strength 1.5: cobalt violet is the weakest tinter in common use, which
    // is exactly why it is easy to paint with and expensive to rely on.
    name: 'Cobalt Violet',
    referenceRgb: [78, 0, 66],
    strength: 1.5,
    opacity: 'semi-opaque',
    source: 'mixbox'
  },
  {
    // PV23. Reasoned against Mixbox's Cobalt Violet: dioxazine is far darker
    // and bluer. Strength 5 — it behaves like the phthalos, not like cobalt.
    name: 'Dioxazine Purple',
    referenceRgb: [46, 10, 72],
    strength: 5,
    opacity: 'transparent',
    source: 'estimated'
  },

  /* --- Blues ------------------------------------------------------------ */
  {
    // Strength 3.5 is a judgement call against conflicting evidence: most
    // published descriptions call ultramarine a moderate tinter, but
    // DESIGN.md's order-of-addition rule groups it with the strong tinters
    // that go in last. 3.5 splits that difference and is a calibration
    // candidate.
    name: 'Ultramarine Blue',
    referenceRgb: [25, 0, 89],
    strength: 3.5,
    opacity: 'transparent',
    source: 'mixbox'
  },
  {
    name: 'Cobalt Blue',
    referenceRgb: [0, 33, 133],
    strength: 2.5,
    opacity: 'semi-opaque',
    source: 'mixbox'
  },
  {
    name: 'Phthalo Blue',
    referenceRgb: [13, 27, 68],
    strength: 5,
    opacity: 'transparent',
    source: 'mixbox'
  },
  {
    // PG50. Tischler's "C". Reasoned as the one genuinely light, bright,
    // opaque turquoise on the palette — it is much lighter in masstone than
    // any other blue-green here, which is the whole point of it. Strength 2.5
    // because cobalt-family pigments tint gently.
    name: 'Cobalt Teal',
    referenceRgb: [0, 164, 170],
    strength: 2.5,
    opacity: 'opaque',
    source: 'estimated'
  },

  /* --- Greens ----------------------------------------------------------- */
  {
    // The scale anchor at strength 5, given.
    name: 'Phthalo Green',
    referenceRgb: [0, 60, 50],
    strength: 5,
    opacity: 'transparent',
    source: 'mixbox'
  },
  {
    name: 'Permanent Green',
    referenceRgb: [7, 109, 22],
    strength: 3.5,
    opacity: 'semi-opaque',
    source: 'mixbox'
  },
  {
    name: 'Sap Green',
    referenceRgb: [107, 148, 4],
    strength: 3,
    opacity: 'transparent',
    source: 'mixbox'
  },

  /* --- Earths ------------------------------------------------------------
   * DESIGN.md's recipe rules reach for these before black or grey whenever
   * chroma needs knocking down, so the set needs to be well populated.
   */
  {
    name: 'Burnt Sienna',
    referenceRgb: [123, 72, 0],
    strength: 2.5,
    opacity: 'semi-transparent',
    source: 'mixbox'
  },
  {
    // PBr7. Reasoned against Mixbox's Burnt Sienna: umber is markedly darker,
    // less red and less saturated, with blue lifting off zero because it is a
    // browner rather than a redder earth. Half of Tischler's chromatic dark.
    name: 'Burnt Umber',
    referenceRgb: [76, 50, 28],
    strength: 2.5,
    opacity: 'opaque',
    source: 'estimated'
  },
  {
    // PBr7 unroasted. Reasoned as Burnt Umber with the warmth taken out —
    // greener and greyer, which is the only reason to own both.
    name: 'Raw Umber',
    referenceRgb: [72, 58, 32],
    strength: 2,
    opacity: 'semi-opaque',
    source: 'estimated'
  },
  {
    // PR101 transparent grade. Reasoned against Mixbox's Burnt Sienna:
    // deeper, more saturated and distinctly redder — it is the glowing
    // red-brown that sienna is not.
    name: 'Transparent Red Oxide',
    referenceRgb: [110, 42, 12],
    strength: 3,
    opacity: 'transparent',
    source: 'estimated'
  },

  /* --- Black -------------------------------------------------------------
   * DESIGN.md allows black but rations it: chromatic darks first, black only
   * when they cannot reach the target value or when it is clearly closer, and
   * never suggested as a purchase if a chromatic dark already works. That is
   * solver policy, not data — this entry just has to exist and be honest.
   */
  {
    // PBk9. Not a neutral black: ivory black is warm and slightly brown in
    // masstone, which is why it greys down differently from a lamp black.
    name: 'Ivory Black',
    referenceRgb: [28, 26, 24],
    strength: 3.5,
    opacity: 'semi-opaque',
    source: 'estimated'
  }

];

/* ---------------------------------------------------------------------------
 * TISCHLER_12 — the first-launch inventory
 * ---------------------------------------------------------------------------
 * DESIGN.md "Core features > 1. Paint inventory": on first launch Inventory is
 * pre-filled with these 12, all marked on hand, with values taken from the
 * library above. Every one of them stays editable and deletable like any other
 * entry — this list seeds the inventory once and has no authority after that.
 *
 * Names must match `name` in PIGMENTS exactly.
 */
const TISCHLER_12 = [
  'Cadmium Lemon',
  'Quinacridone Magenta',
  'Cobalt Teal',
  'Ultramarine Blue',
  'Burnt Umber',
  'Burnt Sienna',
  'Yellow Ochre',
  'Cadmium Red Light',
  'Permanent Crimson',
  'Phthalo Green',
  'Titanium White',
  'Lead White'
];
