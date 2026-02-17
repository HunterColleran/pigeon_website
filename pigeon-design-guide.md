# Pigeon Design System

> Frontend Engineering Reference Document

---

## Brand Mission

**"We build tools that help people step away from screens and return their attention to the world around them."**

Pigeon exists to rewrite our relationship with technology by building tools that respect attention, reduce digital noise, and help people return to the real world.

**Tagline:** LOOK UP.

---

## Color Palette

### Primary Colors

Use these as the foundation of all interfaces.

| Name          | Hex       | RGB              | Usage                                      |
|---------------|-----------|------------------|--------------------------------------------|
| **Char**      | `#2A2E31` | `42, 46, 49`     | Primary dark/background color              |
| **Concrete**  | `#D3D6DA` | `211, 214, 218`  | Light neutral, secondary backgrounds       |
| **Signal Orange** | `#E87A2F` | `232, 122, 47` | Accent color for activation states, CTAs   |

### Secondary Colors

Use sparingly for hierarchy, variation, and subtle emphasis.

| Name               | Hex       | RGB              | Usage                                      |
|--------------------|-----------|------------------|--------------------------------------------|
| **Shadow**         | `#0F1113` | `15, 17, 19`     | Deep black, maximum contrast               |
| **Asphalt**        | `#4E545A` | `78, 84, 90`     | Mid-tone gray, secondary text              |
| **Cloud**          | `#F2F3F4` | `242, 243, 244`  | Light backgrounds, cards                   |
| **Moss**           | `#6A8E7F` | `106, 142, 127`  | Subtle accent (use sparingly)              |
| **Iridescent Purple** | `#7A6A9E` | `122, 106, 158` | Subtle accent (use sparingly)           |

### CSS Variables

```css
:root {
  /* Primary */
  --color-char: #2A2E31;
  --color-concrete: #D3D6DA;
  --color-signal-orange: #E87A2F;

  /* Secondary */
  --color-shadow: #0F1113;
  --color-asphalt: #4E545A;
  --color-cloud: #F2F3F4;
  --color-moss: #6A8E7F;
  --color-iridescent-purple: #7A6A9E;
}
```

---

## Typography

**Primary Typeface:** Helvetica Neue

Selected for clarity, neutrality, and legibility. Inspired by NYC subway signage - designed to be read quickly, at scale, and in motion.

### Font Stack

```css
font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
```

### Guidelines

- Prioritize legibility over expression
- Use clear hierarchy through weight and size, not decorative treatments
- Ensure text remains readable at all viewport sizes
- Avoid condensed or extended variants for body text

---

## Logo Usage

### Design Principles

- Inspired by NYC subway signage and public transit systems
- Modular, contained letterforms
- Prioritizes structure over expression
- Designed to feel functional and environmental

### Contrast Requirements

**The logo must always maintain strong contrast with its background.**

- Color is secondary to clarity
- If contrast is compromised, the logo is being used incorrectly
- The logo is flexible and can appear in various colors, but legibility is non-negotiable

---

## Design Principles

### Core Philosophy

1. **Respect Attention** - Every interaction should feel designed and delightful, but users should spend as little time in the app as possible
2. **Reduce Digital Noise** - Filter out everything except what truly matters
3. **Create Separation** - The solution to screen addiction is separation, not better screen management
4. **Single-Purpose Clarity** - No feeds, no infinite scroll, no pressure to check one more thing

### Visual Language

- **Urban-inspired** - Dense city environments, durability, functionality
- **High-contrast neutrals** - Char and Concrete as foundation
- **Deliberate accent use** - Signal Orange marks presence and activation only
- **Premium but approachable** - Modern hardware aesthetic with retro-futurism influence
- **Materials matter** - Texture, usefulness, and optimism over smooth, featureless design

---

## UI/UX Guidelines

### Interaction Design

- Minimize time spent in app
- Every interaction should feel designed and delightful
- Clear, immediate feedback for user actions
- No infinite scrolling or engagement-maximizing patterns

### States & Feedback

| State      | Treatment                                  |
|------------|--------------------------------------------|
| Default    | Char (`#2A2E31`) or Concrete (`#D3D6DA`)  |
| Active     | Signal Orange (`#E87A2F`)                  |
| Hover      | Subtle lightening/darkening of base color  |
| Disabled   | Asphalt (`#4E545A`) at reduced opacity     |
| Error      | Signal Orange (contextual)                 |

### Component Guidelines

- Buttons should use Signal Orange sparingly for primary CTAs
- Use high contrast for all interactive elements
- Maintain generous whitespace
- Avoid decorative elements that don't serve function

---

## User Context

The app serves users who want to disconnect from constant phone distraction while remaining reachable for important contacts. Design should support:

- **Peace of mind** - Not anxiety about missing something
- **Clarity** - Important messages surface immediately
- **Intentional attention** - Protected focus time
- **Behavior change** - A physical/digital boundary, not another productivity trick

### Key User Needs

| Persona Type       | Core Need                                    |
|--------------------|----------------------------------------------|
| Always On          | Permission to step away while staying reachable |
| The Juggler        | Dedicated channel for family, nothing else   |
| Office Worker      | Visibility into critical messages only       |
| No Self-Control    | Physical separation from social feeds        |
| Lost Hobbies       | Protected space for depth and flow           |
| Tech Enthusiast    | Smarter relationship with technology         |

---

## Quick Reference

```
Primary Dark:    #2A2E31 (Char)
Primary Light:   #D3D6DA (Concrete)
Accent:          #E87A2F (Signal Orange)
Deep Black:      #0F1113 (Shadow)
Mid Gray:        #4E545A (Asphalt)
Off White:       #F2F3F4 (Cloud)
Font:            Helvetica Neue
```

---

*Generated from PigeonGroup Brand Guidelines*
