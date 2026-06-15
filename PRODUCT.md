# Product

## Register

product

> Dual-surface project: a marketing landing (`app/(shared-layout)/`) and a core app
> (`app/dashboard/`, auth, profiles, search) carry roughly equal design weight. The bare
> register defaults to **product** because the app — matching, browsing, profiles, forms —
> is the largest sustained design surface. When the task targets the landing, hero, or any
> acquisition page, treat it as **brand** for that task. Confirm per task when ambiguous.

## Users

Two roles meeting around the same Shabbat table:

- **Hosts** — observant families and individuals in Israel offering a place at their Shabbat
  table. They publish a profile (region, kashrout level, sector, ethnicity, accessibility,
  seats) and want to feel they're welcoming the right guests safely.
- **Guests** — travelers, olim, students, and locals without a place for Shabbat. Often
  arriving in an unfamiliar city, sometimes anxious, looking for a meal and a welcome that
  matches their observance and background.

Context of use: planning ahead of Shabbat, frequently on mobile, sometimes in a hurry before
candle-lighting. Audience is currently French/English speaking with Israel as the locale;
Hebrew (RTL) is a first-class requirement, not an afterthought. The emotional stakes are real
— people are inviting or visiting strangers, so trust and warmth must coexist.

## Product Purpose

Ohel Avraham ("Tent of Abraham") connects Shabbat hosts and guests in Israel. It exists to
make hachnasat orchim — the mitzvah of welcoming guests — frictionless and safe in a modern,
mobile world. Users register as host or guest, complete a profile keyed to the things that
actually determine a good match (region, sector, ethnicity, kashrout, accessibility), and
browse compatible people on a list and a map.

Success looks like: a guest lands in an unfamiliar city and finds a warm, compatible table for
Shabbat in minutes; a host fills their seats with guests they're glad to welcome; both parties
trust that the other is who they say they are.

## Brand Personality

Warm, welcoming, human — the digital equivalent of an open front door and a set table. Three
words: **warm, trustworthy, dignified.** The voice is hospitable and plainspoken, never
salesy or clinical. It carries the quiet dignity of a tradition without performing piety.
Emotionally it should evoke belonging and reassurance: *you have somewhere to go; you are
expected; you are safe here.*

## Anti-references

- **Generic SaaS dashboard.** No templated indigo-gradient hero-metric layouts, no endless
  identical icon-heading-text card grids, no faceless enterprise chrome. The product surface
  must feel personal and human, not like an admin panel.
- **Dating-app aesthetics.** This is a matching product but emphatically *not* romantic.
  No swipe mechanics, no hot-or-not card stacks, no flirty visual language. Matching here
  means hospitality compatibility, not attraction.
- **Religious kitsch.** No gold-on-navy "holy" clichés, no clip-art Judaica, no heavy-handed
  Stars of David or menorah ornamentation. Heritage shows through warmth, typography, and
  restraint — never costume.
- **Corporate / sterile.** Cold, gray, impersonal interfaces work against the entire premise.

## Design Principles

1. **Hospitality is the interface.** Every screen should feel like being welcomed in, not
   processed. Warmth is a functional requirement, not decoration — especially in empty states,
   onboarding, and the first guest/host a user sees.
2. **Trust is visible.** Strangers share a table here. Verification, identity, and safety cues
   must be legible and reassuring without turning the UI into a security checkpoint.
3. **Match on what matters.** Surface the dimensions that make a Shabbat work — observance,
   kashrout, region, accessibility — clearly and without judgment. Difference is information,
   never a ranking.
4. **Heritage through restraint.** The tradition is honored by dignity, warmth, and good
   typography, not by religious ornamentation. When in doubt, quieter and warmer.
5. **Bilingual and bidirectional by design.** FR/EN today, Hebrew/RTL as a first-class path.
   Layouts, components, and motion must survive mirroring and longer/shorter strings.

## Accessibility & Inclusion

- Target **WCAG 2.1 AA**: body text ≥ 4.5:1 contrast, large text ≥ 3:1, visible focus states,
  full keyboard operability across forms, search, and the map.
- **RTL is a hard requirement.** Hebrew layouts must mirror correctly — logical properties over
  physical, no hard-coded left/right, directionally-aware icons and motion.
- **Reduced motion** honored everywhere — the landing leans on motion, so every animation needs
  a `prefers-reduced-motion` fallback (crossfade or instant).
- Mobile-first, including pre-Shabbat one-handed use under time pressure.
- Inclusive across observance levels, ethnicities, and sectors — the matching dimensions are
  descriptive, never evaluative.
