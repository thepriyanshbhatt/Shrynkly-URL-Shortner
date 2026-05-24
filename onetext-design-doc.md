# Design Document
## OneText — Landing Page (home.onetext.com)

**Document Type:** Visual & Interaction Design Reference  
**Source:** Screen recording analysis  
**Date:** May 24, 2026

---

## 1. Overview

OneText is an SMS/ecommerce marketing platform. The landing page is a single-screen hero-first design with a dark, immersive aesthetic. The visual language is bold and technical — a deep navy/black background paired with a vivid 3D kinetic machine as the hero illustration. The layout is clean, confident, and conversion-focused, with a single CTA driving users toward an AI-powered demo input.

---

## 2. Color Palette

| Role | Color | Notes |
|---|---|---|
| Background | `#0a0e1a` / `#05080f` | Near-black deep navy |
| Secondary surface | `#13171f` | Slightly lighter dark, used for the social proof card |
| Primary accent | `#2563EB` (electric blue) | CTA button, logo pill, "Absolutely!" chat bubble |
| Text — primary | `#FFFFFF` | Hero headline, nav items |
| Text — secondary | `rgba(255,255,255,0.55)` | Body copy / subtext |
| Illustration accent 1 | `#EF4444` (red) | 3D machine tubes and spheres |
| Illustration accent 2 | `#F59E0B` (amber/gold) | 3D machine arcs and rings |
| Illustration accent 3 | `#1D4ED8` (deep blue) | 3D machine cylinders |
| Chat bubble — bot | `#FFFFFF` with dark text | Inbound SMS messages |
| Chat bubble — user | `#2563EB` with white text | Outbound / user reply |
| Input field | `#1a1f2e` | Dark input background with subtle border |
| Border/divider | `rgba(255,255,255,0.08)` | Very subtle, used on input and card edges |

---

## 3. Typography

| Element | Weight | Approximate Size | Notes |
|---|---|---|---|
| Hero headline | Black / 900 | ~72–80px | Three-line, left-aligned, white |
| Nav items | Regular / 400 | ~15px | Muted white, evenly spaced |
| Logo text | Bold / 700 | ~16px | White text on blue pill |
| Body copy | Regular / 400 | ~15–16px | ~50% opacity white, max-width ~480px |
| CTA button label | Semibold / 600 | ~15px | White |
| Input placeholder | Regular / 400 | ~14px | Muted |
| Chat bubbles | Semibold / 600 | ~13–14px | Dark text on white; white on blue |
| Social proof quote | Bold / 700 | ~32px | White, large quotation marks |
| Attribution name | Medium / 500 | ~14px | White |
| Attribution role | Regular / 400 | ~13px | Muted |

Font family appears to be **Inter** or a near-identical geometric sans-serif throughout.

---

## 4. Layout & Spacing

### Page Structure
The visible screen is divided into two horizontal bands:

**Band 1 — Hero (full-bleed dark navy, ~75vh)**
- Two-column layout at desktop: left column holds all text/CTA, right column is pure 3D illustration
- Left column: ~45% width, vertically centered in the viewport
- Right column: ~55% width, illustration bleeds to the right edge
- No gutters between columns — the illustration overlaps slightly into the text zone at large sizes

**Band 2 — Social Proof Bar (~25vh)**
- Full-width, slightly lighter dark surface (`#13171f`)
- Large rounded-rectangle card with generous padding (~40px)
- Two-column inside: left = testimonial text + attribution, right = partner logo grid (4 logos in a row)
- Logos are displayed on dark pill/card tiles of equal size

### Spacing System (inferred)
- Base unit: 8px
- Section padding: ~48–64px vertical, ~80px horizontal
- Nav height: ~64px
- Headline line height: ~1.1
- Body copy line height: ~1.6
- Gap between headline and body: ~24px
- Gap between body and input: ~40px

---

## 5. Navigation

- Sticky top nav, full-width, no visible background fill (blends into hero)
- Left: Logo pill — white text "OneText" on a blue (`#2563EB`) rounded rectangle badge, resembling a chat bubble tab
- Center: Nav links — Features, Pricing, Blog, FAQ — plain text, no dividers
- Right: "Login" (ghost/text) + "Get started →" (filled blue button with arrow icon)
- "Get started" button: blue fill, white text, rounded corners (~8px), arrow icon on the right

---

## 6. Hero Section

### Headline
Three lines of massive white text, left-aligned:
> 20% More Revenue  
> Per Campaign.  
> Guaranteed.

Bold claim, period-terminated for confidence. No animation on the text itself.

### Body Copy
Short paragraph below the headline (~2 lines), muted white, explaining the value proposition around SMS + AI-personalized recommendations.

### Input / CTA
A combined input + button row:
- Left portion: dark input field with a small blue "AI²" badge on the left edge and placeholder text "Enter your brand's URL"
- Right portion: solid blue button labeled "Test our AI →" with a circle-arrow icon
- The full row has a unified rounded appearance, with the input and button visually joined
- Width: ~420px

### 3D Illustration (Right Column)
A complex animated machine occupying the full right half of the hero. It features:
- Interconnected mechanical elements: wheels, rails, tubes, cylinders, springs, spheres
- Dominant colors: cobalt blue (structure), red (tubes/balls), amber/gold (arcs), with chrome/metallic finishes
- Strong directional lighting from above-left, creating deep shadows and reflective highlights
- The machine animates across frames — elements move, balls travel along tracks, objects rotate
- Floating SMS chat bubbles appear progressively over the machine, simulating a real text conversation:
  - "Ready to sell more with OneText?" (bot, white bubble)
  - "Absolutely!" (user, blue bubble)
  - "Hi, this is Sarah! Would you like to buy a cookie?" (bot, white bubble)
  - "Yes. How about chocolate chip?" (user, blue bubble)
  - "Order confirmed and on its way" (bot, white bubble)
- Chat bubbles appear and stack in a staggered sequence, reading like a real SMS thread
- The background behind the machine has a subtle radial glow (deep blue) emanating from center

---

## 7. Social Proof Section

- Large opening quotation mark + "Incredible" in oversized bold white text
- Attribution row: circular avatar photo of Moiz Ali + name + role ("Founder of Native Deodorant")
- Right half: four equal-sized logo tiles arranged in a horizontal row — tabs, wonder monday, CADEN LANE, ✳ create
- Logo tiles: dark rounded rectangles with slight border, logos in white/neutral

---

## 8. Motion & Animation

The key differentiator of this design is its animated hero. Key motion observations:

| Element | Animation |
|---|---|
| 3D machine | Continuous idle animation — parts rotate, rails shift, balls travel tracks |
| Chat bubbles | Sequential fade-in / slide-up, one at a time, timed ~2–3s apart |
| Bubble stacking | New bubbles appear above existing ones, conversation grows naturally |
| Background glow | Subtle pulse or static radial gradient behind machine |
| Page entrance | Implied smooth fade-in on load (standard for this design style) |

Animation principles: smooth, physics-aware, never frantic. The machine feels alive but not distracting. Chat bubbles are the narrative device — they tell the product story through motion.

---

## 9. Component Inventory

| Component | Description |
|---|---|
| `LogoPill` | Blue rounded rectangle badge with white text + chat-bubble tab cutout |
| `NavLink` | Plain text nav item, hover state likely subtle underline or opacity shift |
| `PrimaryButton` | Blue fill, white text, rounded, with directional arrow icon |
| `AIInput` | Dark rounded input with AI badge prefix and attached CTA button |
| `HeroHeadline` | Extra-large multi-line bold text block |
| `BodyCopy` | Small muted text block, constrained width |
| `3DHeroIllustration` | Animated 3D render, right-column-spanning |
| `ChatBubble` | Two variants — white (inbound) and blue (outbound), bold text, rounded pill shape |
| `TestimonialBlock` | Quote text + avatar + name + role |
| `LogoTile` | Dark pill card holding a single partner logo |
| `SocialProofBar` | Full-width dark section containing testimonial + logo grid |

---

## 10. Design Principles Observed

**Confidence through scale.** The headline is enormous and unqualified. Period. No hedging.

**Product demo in the hero.** Rather than a screenshot or abstract graphic, the animated chat bubbles show the actual product experience inside the illustration — a show-don't-tell approach.

**Restraint in color.** The palette is almost monochromatic (navy/black/white) with one electric blue accent doing nearly all the work. The 3D illustration provides all the visual richness.

**Depth through 3D.** The machine illustration creates a sense of depth and complexity that signals the product is powerful — without requiring the user to read anything to feel it.

**Single conversion path.** One input, one button, zero distraction. The entire layout funnels toward "Test our AI."

---

## 11. Responsive Considerations (Inferred)

| Breakpoint | Expected Behavior |
|---|---|
| Desktop (1280px+) | Two-column hero as seen; illustration full-height right column |
| Tablet (768–1279px) | Illustration scales down or moves behind text with reduced opacity |
| Mobile (< 768px) | Single column; illustration likely hidden or replaced with static image; input full-width |

---

## 12. Replication Notes

To faithfully recreate this design:

- Use a **WebGL or Lottie** animation for the 3D machine — a static image will lose the core differentiator
- Chat bubble animations should use **CSS keyframes or Framer Motion** with staggered delays (2–3s per bubble)
- The hero background glow is a simple **radial-gradient** from `rgba(30,60,180,0.3)` to transparent, centered on the illustration
- The "AI²" badge inside the input can be achieved with a `position: absolute` left-inset element + left padding on the input
- Font: use **Inter** from Google Fonts at weights 400, 500, 600, 900
- The logo pill for "OneText" uses a unique shape — a rounded rectangle with a small tab protruding from the bottom-left, mimicking a chat bubble — this likely needs a custom SVG or `clip-path`
