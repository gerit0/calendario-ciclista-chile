---
name: Athletic Performance System
colors:
  surface: '#f8f9f9'
  surface-dim: '#d9dada'
  surface-bright: '#f8f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f4'
  surface-container: '#edeeee'
  surface-container-high: '#e7e8e8'
  surface-container-highest: '#e1e3e3'
  on-surface: '#191c1c'
  on-surface-variant: '#444748'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5e5e5e'
  primary: '#181919'
  on-primary: '#ffffff'
  primary-container: '#2d2e2e'
  on-primary-container: '#959595'
  inverse-primary: '#c7c6c6'
  secondary: '#a73918'
  on-secondary: '#ffffff'
  secondary-container: '#fe7952'
  on-secondary-container: '#6c1900'
  tertiary: '#171b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#2b3100'
  on-tertiary-container: '#8e9e00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e3e2e2'
  primary-fixed-dim: '#c7c6c6'
  on-primary-fixed: '#1b1c1c'
  on-primary-fixed-variant: '#464747'
  secondary-fixed: '#ffdbd1'
  secondary-fixed-dim: '#ffb5a0'
  on-secondary-fixed: '#3b0900'
  on-secondary-fixed-variant: '#862201'
  tertiary-fixed: '#d8ef00'
  tertiary-fixed-dim: '#bdd200'
  on-tertiary-fixed: '#1a1e00'
  on-tertiary-fixed-variant: '#434b00'
  background: '#f8f9f9'
  on-background: '#191c1c'
  surface-variant: '#e1e3e3'
typography:
  display-lg:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system is engineered for the high-performance world of competitive cycling. It balances the raw, grit-driven energy of the sport with the precision of professional timing and logistics. The visual language is rooted in **Modern Minimalism** with **High-Contrast** accents, evoking the feeling of a premium cycling computer or a factory-tuned racing machine.

The target audience consists of athletes, organizers, and enthusiasts who require rapid data ingestion. Consequently, the UI prioritizes clarity, momentum, and a sense of "engineered reliability." Every element is designed to feel functional, durable, and fast.

## Colors
The palette is inspired by the environments where cycling lives: the dark asphalt of the mountain pass and the terracotta clay of the trail.

- **Asphalt (Primary):** A deep, technical charcoal used for primary text, navigation, and Road-discipline accents.
- **Terracotta (Secondary):** A grounded, earthy orange-red used specifically for Mountain Bike (MTB) categorization and dirt-track events.
- **Safety Yellow (Highlight):** A high-visibility, neon-adjacent yellow reserved strictly for Call-to-Action (CTA) elements, critical alerts, and interactive states. It ensures that even in bright outdoor conditions, the primary path remains unmistakable.
- **Surface Tones:** A range of cool neutrals provide a clean, "laboratory" feel to the background, ensuring the data remains the focus.

## Typography
Typography is the primary driver of the "athletic" feel. By pairing a heavy, geometric sans-serif for headings with a systematic, utilitarian sans-serif for data, the design system achieves both impact and legibility.

- **Headings:** Use **Montserrat** in Bold or Extra Bold weights. The tight letter spacing and high x-height mimic the bold typography found on racing jerseys and frame decals.
- **Body & Data:** Use **Inter**. Its neutral, tall apertures are optimized for reading race dates, locations, and technical specs at a glance.
- **Labels:** Small labels and metadata should use Inter Semi-Bold with a slight increase in letter spacing and uppercase styling to differentiate them from body content.

## Layout & Spacing
The layout follows a **Rigid Grid** philosophy to reflect the precision of race timing. A strict 8px baseline grid governs all vertical rhythm.

- **Grid:** A 12-column layout on desktop, shrinking to 4 columns on mobile. 
- **Scanning:** Information density is kept moderately high. Event cards are stacked vertically in a "feed" format for easy scrolling, while calendar views utilize a fluid grid that maintains square aspect ratios for day cells.
- **Margins:** Wider horizontal margins on desktop (40px) create a focused central column for the calendar, mimicking the "lane" of a race track.

## Elevation & Depth
This design system avoids heavy, realistic shadows in favor of **Tonal Layering** and **Low-Contrast Outlines**. Depth is used to indicate interactivity rather than decoration.

- **Flat Base:** The primary background is the lowest level.
- **Surface Cards:** Event cards use a 1px solid border (`#E2E4E4`) to define their boundaries without adding visual weight.
- **Active Elevation:** When a user interacts with a card or a filter, a subtle, sharp shadow (4px blur, 10% opacity Asphalt) is applied to "lift" the element, suggesting it is now in the foreground.
- **Glassmorphism:** Use a subtle backdrop blur (12px) for sticky navigation bars to maintain context of the scroll position while ensuring text remains legible.

## Shapes
The shape language is **Soft (Level 1)**. Elements feature a 0.25rem (4px) corner radius. This slight rounding suggests professional industrial design—like the edge of a carbon fiber rim—while remaining sharp enough to feel aggressive and serious. 

- **Buttons:** 4px corners for standard buttons; larger components like modal containers may use 8px (`rounded-lg`) to soften the impact of large surface areas.
- **Icons:** Use linear icons with a 2px stroke weight. Avoid filled icons unless indicating an "active" state to maintain the clean, airy aesthetic.

## Components
- **Buttons:** Primary CTAs use the `Safety Yellow` background with `Asphalt` text. This high-contrast pairing is the loudest element on the screen. Secondary buttons use an `Asphalt` outline.
- **Filter Chips:** Used for toggling disciplines. "Road" chips turn `Asphalt` when active; "MTB" chips turn `Terracotta` when active. This color-coding allows users to subconsciously filter the calendar while scanning.
- **Event Cards:** The core component. Date and Month are placed in a high-contrast box on the left. The event title uses `Headline-MD`. Metadata (Distance, Elevation, Location) uses `Label-MD` with associated icons.
- **Calendar Widget:** A compact grid where "Race Days" are marked with a small, 4px dot in the color of the discipline (Road/MTB).
- **Inputs:** Text fields use a 1px `Asphalt` border that thickens to 2px on focus, ensuring the active state is physically prominent.