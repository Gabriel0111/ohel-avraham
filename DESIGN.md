---
name: Ohel Avraham
description: A warm, trustworthy, dignified platform connecting Shabbat hosts and guests in Israel.
colors:
  candlelight-amber: "oklch(0.541 0.175 46)"
  candlelight-amber-hover: "oklch(0.606 0.165 46)"
  on-amber: "oklch(0.985 0.008 75)"
  ring-amber: "oklch(0.702 0.13 46)"
  threshold-white: "oklch(0.985 0.003 72)"
  card-white: "oklch(1 0 0)"
  ink: "oklch(0.145 0.008 50)"
  surface-muted: "oklch(0.96 0.008 72)"
  on-surface-muted: "oklch(0.21 0.018 55)"
  muted-ink: "oklch(0.50 0.022 60)"
  hairline: "oklch(0.915 0.008 70)"
  destructive: "oklch(0.577 0.245 27.325)"
  night-bg: "oklch(0.141 0.008 50)"
  night-card: "oklch(0.21 0.012 50)"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "normal"
  mono:
    fontFamily: "Geist Mono, ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  xl: "14px"
  2xl: "18px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.candlelight-amber}"
    textColor: "{colors.on-amber}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
    height: "36px"
  button-primary-hover:
    backgroundColor: "{colors.candlelight-amber-hover}"
    textColor: "{colors.on-amber}"
  button-secondary:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "{colors.surface-muted}"
    textColor: "{colors.on-surface-muted}"
    rounded: "{rounded.lg}"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px"
  input:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
---

# Design System: Ohel Avraham

## 1. Overview

**Creative North Star: "The Open Door"**

Ohel Avraham is a threshold you cross, not a panel you operate. The whole system answers
to the moment of arrival — *you are expected; you are safe here.* Surfaces are warm and
open: generous spacing, clear entry points, a near-white field touched by a breath of warmth,
and one amber that signals "this way in" — the color of candlelight, of an open door at dusk.
The product carries the quiet dignity of hospitality (*hachnasat orchim*) without performing piety.
Warmth is a functional requirement, not decoration — it lives strongest in the empty states,
the first profile a user sees, and the onboarding path.

This is a **product** register: design serves the task. Hosts publish a profile and want to
feel they're welcoming the right guests safely; guests arrive in an unfamiliar city, often
on mobile before candle-lighting, and need a compatible table in minutes. So the interface
is familiar, legible, and predictable — standard affordances done impeccably — with warmth
carried by typography, space, and soft surfaces rather than novelty. The system is
bilingual and **bidirectional by design**: every layout must survive Hebrew (RTL) mirroring.

It explicitly rejects four things. It is **not a generic SaaS dashboard** — no indigo-gradient
hero-metric layouts, no endless identical icon-heading-text card grids, no faceless
enterprise chrome. It is **not a dating app** — this matches on hospitality compatibility, never
attraction; no swipe mechanics, no hot-or-not stacks. It carries **no religious kitsch** —
no gold-on-navy "holy" clichés, no clip-art Judaica, no heavy-handed Stars of David. And it is
never **corporate or sterile** — cold, gray, impersonal chrome works against the entire premise.

**Key Characteristics:**
- Open, warm layouts with generous spacing — the feeling of being welcomed in
- One candlelight amber as the only accent; everything else is a warm neutral
- Soft, ambient depth — gentle shadows, never dramatic
- Plus Jakarta Sans throughout; warmth from a single humanist sans, not display pairing
- RTL-first: logical properties only, no hard-coded left/right
- Trust cues (verification, identity) legible without turning the UI into a checkpoint

## 2. Colors

A near-white warm field carrying a single amber accent, with a warm-neutral support layer
for panels and sidebars. Restrained by default — color is meaning, not decoration.

### Primary
- **Candlelight Amber** (`oklch(0.541 0.175 46)`): The warm glow of candlelight through a tent
  doorway. The system's one accent — primary actions, the current selection, active nav, focus,
  and trust/verification cues. On dark surfaces it lifts to `oklch(0.606 0.165 46)` for
  contrast. Never used as a decorative fill across panels.
- **On Amber** (`oklch(0.985 0.008 75)`): Near-white text/icons that sit on Candlelight Amber.

### Neutral
- **Threshold White** (`oklch(0.985 0.003 72)`): The body background — a near-white field with
  an imperceptible breath of warmth. Never cream or sand.
- **Card White** (`oklch(1 0 0)`): Pure white for cards and inputs, lifting one step above the
  Threshold field.
- **Ink** (`oklch(0.145 0.008 50)`): Near-black body and heading text, warm-tinted. The default reading color.
- **Surface Muted** (`oklch(0.96 0.008 72)`): The warm support layer — secondary buttons, ghost
  hovers, sidebars, toolbars, chips at rest.
- **On Surface Muted** (`oklch(0.21 0.018 55)`): Text on the muted support layer.
- **Muted Ink** (`oklch(0.50 0.022 60)`): Secondary/supporting text and placeholders. **Contrast-gated**
  — see the rule below.
- **Hairline** (`oklch(0.915 0.008 70)`): Borders, dividers, input strokes. A whisper, not a line.

### Tertiary
- **Destructive** (`oklch(0.577 0.245 27.325)`): Warm red for destructive actions and errors only.
  Never decorative.

### Dark theme
The dark theme inverts onto **Night BG** (`oklch(0.141 0.008 50)`) with **Night Card**
(`oklch(0.21 0.012 50)`) surfaces and the lifted amber primary. Same roles, same restraint.

### Named Rules
**The One Welcome Rule.** Candlelight Amber appears on ≤10% of any screen. It marks the way in —
the primary action, the active item, the verified badge — and nowhere else. Its rarity is what
makes it read as a welcome rather than chrome.

**The Contrast Floor Rule.** Body text runs on Ink (≥4.5:1, always). Muted Ink is for secondary
text and placeholders only, and must still clear **4.5:1** against the surface it sits on. Never
drop body copy to Muted Ink "for elegance" — the most common way this UI would start to feel hard
to read.

**The No-Cream Rule.** The background is near-achromatic Threshold White (C ≈ 0.003). Warmth
comes from the amber accent, the type, and the copy — the body field must never read as beige.

## 3. Typography

**Display / Body / Label Font:** Plus Jakarta Sans (with `system-ui, sans-serif` fallback)
**Mono Font:** Geist Mono (with `ui-monospace, monospace`) — for codes, technical values, and tabular data

**Character:** One humanist geometric sans carries the entire interface — display, headings,
buttons, labels, body. Plus Jakarta Sans is friendly without being soft and legible at small
sizes on mobile, which fits a warm-but-trustworthy product surface. No display/body pairing:
in a product register, one well-tuned family is the right answer, and warmth comes from weight
and spacing rather than a second typeface.

### Hierarchy
- **Display** (700, 1.875rem / 30px, line-height 1.1, tracking -0.02em): Page-level titles and
  the largest in-app headings. Fixed rem, not fluid — product UI is viewed at consistent DPI.
- **Headline** (600, 1.25rem / 20px, line-height 1.2): Card titles and section headings.
- **Title** (600, 1rem / 16px, line-height 1.4): Sub-section and group labels.
- **Body** (400, 0.875rem / 14px, line-height 1.6): Default reading text. Cap prose at 65–75ch.
- **Label** (500, 0.875rem / 14px): Buttons, form labels, nav items. Sentence case.
- **Mono** (400, 0.875rem / 14px): Geist Mono for codes and tabular figures only.

### Named Rules
**The Sentence-Case Rule.** Labels, buttons, and nav are sentence case — never ALL-CAPS tracked
eyebrows. A welcome speaks plainly; it doesn't shout in small caps.

**The Tight-But-Open Rule.** Display tracking floors at -0.02em and never goes below -0.04em.
Headings get `text-wrap: balance`; long prose gets `text-wrap: pretty`. Letters never touch.

## 4. Elevation

Soft and subtle. Depth is **ambient**, not structural — surfaces rest nearly flat and lift just
enough to separate a card or input from the field behind it. Shadows are a quiet whisper of
material, never a drop-shadow announcement. Depth is reinforced by tonal layering (Card White
above Threshold White, the Surface Muted support layer) and Hairline borders as much as by shadow.

### Shadow Vocabulary
- **Whisper** (`box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05)` — Tailwind `shadow-xs`): Inputs and
  outline buttons. Barely-there separation from the field.
- **Lift** (`box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)` — `shadow-sm`):
  Cards and resting panels. The default surface elevation.

### Named Rules
**The Ambient-Only Rule.** Shadows describe ambient lift, never drama. Blur stays small, opacity
stays low. If a shadow announces itself, it's wrong — deepen tonal contrast or add a Hairline instead.

## 5. Components

The component family is **warm and reassuring**: softly-rounded, gently-filled, friendly in its
states, with standard affordances done cleanly. Every interactive element ships with default,
hover, focus-visible, active, disabled, and (where it loads) loading and error states.

### Buttons
- **Shape:** Gently curved (`rounded-lg`, 10px); small/large variants ease to `rounded-md` (8px).
- **Primary:** Candlelight Amber fill with On-Amber text; default height 36px (`h-9`), padding 8px 16px.
- **Hover / Focus:** Hover deepens the fill (`primary/90`); focus-visible shows a 3px amber ring
  (`ring-ring/50`) plus border shift. Transitions ~150–200ms.
- **Secondary:** Surface Muted fill, On-Surface-Muted text, hover to `secondary/80`.
- **Outline / Ghost:** Outline is a Hairline border on the background with a Whisper shadow; Ghost is
  transparent, filling to Surface Muted on hover. Link variant is violet text with an underline on hover.

### Cards / Containers
- **Corner Style:** `rounded-xl` (14px) — soft and welcoming, never over-rounded.
- **Background:** Card White, lifting one step above the Threshold field.
- **Shadow Strategy:** The **Lift** shadow (`shadow-sm`) — see Elevation.
- **Border:** A single Hairline border all around. Never a colored side-stripe.
- **Internal Padding:** 24px (`py-6` / `px-6`), with a 24px gap between stacked regions.

### Inputs / Fields
- **Style:** Card White (transparent over light surfaces) with a Hairline border, `rounded-md` (8px),
  36px tall (`h-9`), padding 4px 12px, plus a Whisper shadow.
- **Focus:** Border shifts to amber (`ring`) with a 3px amber ring (`ring-ring/50`). Calm, not glowy.
- **Error / Disabled:** Error shows a destructive border + ring (`aria-invalid`). Disabled drops to 50%
  opacity with `cursor-not-allowed`. Placeholders use Muted Ink and must clear the contrast floor.

### Navigation
- **Style:** Plain sentence-case labels at Label weight. Active item carries Havdalah Violet (text or a
  subtle fill); hover fills to Surface Muted. Default state is calm Ink/Muted Ink.
- **Mobile / RTL:** Collapses structurally (sidebar → sheet), never via fluid type. Mirrors fully under
  RTL — directional icons and motion flip with the layout.

### Verification Cue (signature)
Trust is visible but never a checkpoint. A verified host/guest carries a small Candlelight Amber badge or
check beside their name — quiet, legible, reassuring. It reads as a welcome credential, not a security gate.

## 6. Do's and Don'ts

### Do:
- **Do** keep Candlelight Amber to ≤10% of any screen — primary action, active item, focus, verification.
- **Do** run body text on Ink and verify every text/placeholder color clears **4.5:1** (large text 3:1).
- **Do** use logical properties (`margin-inline`, `padding-inline`, `start`/`end`) everywhere — Hebrew
  RTL is a hard requirement, not an afterthought. Test every layout mirrored.
- **Do** give empty states, onboarding, and the first profile a user sees genuine warmth — that's where
  hospitality lives hardest.
- **Do** keep cards at `rounded-xl` (14px), buttons at `rounded-lg` (10px), inputs at `rounded-md` (8px).
- **Do** ship every interactive component with focus-visible, disabled, and loading/error states.
- **Do** provide a `prefers-reduced-motion` fallback (crossfade or instant) for every animation.

### Don't:
- **Don't** build a generic SaaS dashboard: no indigo-gradient hero-metric blocks, no endless identical
  icon-heading-text card grids, no faceless enterprise chrome.
- **Don't** borrow dating-app aesthetics: no swipe mechanics, no hot-or-not card stacks, no flirty visuals.
  Matching here is hospitality compatibility, never attraction.
- **Don't** use religious kitsch: no gold-on-navy "holy" clichés, no clip-art Judaica, no heavy-handed
  Stars of David or menorah ornament. Heritage shows through warmth and restraint.
- **Don't** go cold, gray, or sterile — impersonal chrome works against the entire premise.
- **Don't** set the body background to warm cream, sand, or parchment. Threshold White is faintly cool.
- **Don't** drop body copy to Muted Ink "for elegance"; it fails the contrast floor.
- **Don't** use a colored `border-left`/`border-right` stripe on cards or alerts. Full Hairline borders only.
- **Don't** over-round (24px+ on cards) or pair a 1px border with a wide soft drop shadow on the same element.
- **Don't** put an ALL-CAPS tracked eyebrow above sections, or display fonts in UI labels, buttons, or data.
