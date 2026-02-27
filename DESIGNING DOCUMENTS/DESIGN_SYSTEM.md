# 🎨 VisionAid Design System & Style Guide

Complete design system documentation for the modernized VisionAid website.

---

## 📐 Design Principles

### 1. **Dark-First Design**
- Start with dark backgrounds
- Use subtle gradients for depth
- High contrast text for readability
- Glassmorphism for depth layers

### 2. **Smooth Interactions**
- Every interaction should have animation
- Animations should be purposeful, not gratuitous
- 0.3s default transition duration
- Cubic-bezier easing for natural feel

### 3. **Mobile-First Development**
- Design for mobile first
- Scale up for larger screens
- Touch-friendly interactions (44x44px minimum)
- Responsive typography

### 4. **Accessibility Always**
- WCAG AA+ compliance minimum
- Sufficient color contrast (7:1 target)
- Keyboard navigation support
- Screen reader friendly

### 5. **Performance Focused**
- Optimize animations for 60fps
- Use GPU-accelerated properties (transform, opacity)
- Code splitting for faster loads
- Lazy loading for images

---

## 🎨 COLOR SYSTEM

### Primary Colors

#### Dark Backgrounds
```
Slate-950 (#0f172a) - Primary background
  Used for: Main background, darkest surfaces
  Contrast: Perfect for all text
  Usage: Hero sections, full-page backgrounds

Slate-900 (#1e293b) - Secondary background
  Used for: Cards, modals, panels
  Contrast: Good for text, subtle difference from primary
  Usage: Component backgrounds

Slate-700 (#334155) - Tertiary background
  Used for: Borders, subtle elements
  Contrast: Slightly lighter for visual separation
  Usage: Border colors, disabled states
```

#### Accent Colors

```
Blue Gradient
  Light: #3b82f6 (sky-500) - Primary action color
  Dark:  #1e40af (blue-900) - Hover state
  Usage: Primary buttons, links, focus states
  Psychology: Trust, professionalism

Purple Gradient
  Light: #8b5cf6 (violet-500) - Creative accent
  Dark:  #6d28d9 (violet-700) - Hover state
  Usage: Secondary actions, highlights
  Psychology: Innovation, creativity

Pink Gradient
  Light: #ec4899 (pink-500) - Energy
  Dark:  #be185d (pink-700) - Hover state
  Usage: Features, CTAs
  Psychology: Energy, passion

Green (Success)
  Light: #10b981 (emerald-500) - Success state
  Dark:  #059669 (emerald-600) - Confirmed
  Usage: Success messages, positive actions
  Psychology: Growth, positive

Red (Danger)
  Light: #ef4444 (red-500) - Danger state
  Dark:  #dc2626 (red-600) - Confirmed
  Usage: Delete, error, warning
  Psychology: Caution, importance
```

#### Text Colors

```
White (#ffffff)
  Used for: Primary text on dark backgrounds
  Contrast: 21:1 ratio
  Usage: Headings, important text

Light Gray (#e2e8f0)
  Used for: Secondary text, subheadings
  Contrast: 15:1 ratio
  Usage: Description text, secondary info

Medium Gray (#94a3b8)
  Used for: Tertiary text, hints
  Contrast: 8:1 ratio
  Usage: Placeholder text, labels

Dark Gray (#64748b)
  Used for: Disabled text, muted content
  Contrast: 5:1 ratio
  Usage: Disabled states, archived content
```

### Color Usage Guidelines

```
Button Colors:
├─ Primary: Blue → Purple gradient
├─ Secondary: Transparent with border
├─ Danger: Red background
└─ Disabled: Gray-600 with reduced opacity

Link Colors:
├─ Default: #3b82f6 (sky-500)
├─ Hover: #1e40af (blue-900)
├─ Visited: #7c3aed (violet-600)
└─ Active: #ec4899 (pink-500)

Background Colors:
├─ Primary: #0f172a (slate-950)
├─ Secondary: #1e293b (slate-900)
├─ Tertiary: #334155 (slate-700)
└─ Hover: rgba with alpha increase

Border Colors:
├─ Default: #475569 (slate-600) with alpha
├─ Focus: #3b82f6 (blue-500)
├─ Error: #ef4444 (red-500)
└─ Success: #10b981 (emerald-500)

Shadow Colors:
├─ Soft: rgba(0, 0, 0, 0.07)
├─ Medium: rgba(0, 0, 0, 0.1)
├─ Glow: rgba(59, 130, 246, 0.3)
└─ Strong: rgba(59, 130, 246, 0.4)
```

---

## 🔤 TYPOGRAPHY SYSTEM

### Font Stack
```
Display & Headings:
  Font Family: Inter
  Weight: 600-900
  
Body Text:
  Font Family: Inter
  Weight: 400-500

Code/Technical:
  Font Family: Space Mono
  Weight: 400-700
```

### Type Scale

```
Display (Hero Heading)
  Mobile:  48px / 2.25rem
  Tablet:  56px / 3.5rem
  Desktop: 64-72px / 4-4.5rem
  Weight: 900 (bold)
  Line Height: 1.1
  Letter Spacing: -1px

Heading 1
  Mobile:  36px / 2.25rem
  Tablet:  40px / 2.5rem
  Desktop: 48px / 3rem
  Weight: 800 (extra bold)
  Line Height: 1.2
  Letter Spacing: -0.5px

Heading 2
  Mobile:  28px / 1.75rem
  Tablet:  32px / 2rem
  Desktop: 36px / 2.25rem
  Weight: 700 (bold)
  Line Height: 1.3
  Letter Spacing: 0

Heading 3
  Mobile:  24px / 1.5rem
  Tablet:  28px / 1.75rem
  Desktop: 32px / 2rem
  Weight: 600 (semi-bold)
  Line Height: 1.4
  Letter Spacing: 0

Body Large
  Mobile:  16px / 1rem
  Desktop: 18px / 1.125rem
  Weight: 400 (regular)
  Line Height: 1.6
  Letter Spacing: 0.5px

Body
  Mobile:  16px / 1rem
  Desktop: 16px / 1rem
  Weight: 400 (regular)
  Line Height: 1.6
  Letter Spacing: 0.5px

Body Small
  Mobile:  14px / 0.875rem
  Desktop: 14px / 0.875rem
  Weight: 400 (regular)
  Line Height: 1.5
  Letter Spacing: 0.3px

Caption
  Mobile:  12px / 0.75rem
  Desktop: 12px / 0.75rem
  Weight: 500 (medium)
  Line Height: 1.4
  Letter Spacing: 0.3px

Code
  Mobile:  14px / 0.875rem
  Desktop: 14px / 0.875rem
  Font: Space Mono
  Weight: 400 (regular)
  Line Height: 1.5
  Letter Spacing: 0
```

---

## 🎯 SPACING SYSTEM

### Spacing Scale
```
xs:    4px   (0.25rem)
sm:    8px   (0.5rem)
md:   12px   (0.75rem)
lg:   16px   (1rem)
xl:   24px   (1.5rem)
2xl:  32px   (2rem)
3xl:  48px   (3rem)
4xl:  64px   (4rem)
5xl:  80px   (5rem)
6xl:  96px   (6rem)
```

### Spacing Guidelines
```
Padding:
  Cards:        24-32px (xl-2xl)
  Buttons:      12px vertical, 24-32px horizontal
  Inputs:       12px vertical, 16px horizontal
  Sections:     48-96px vertical, 16-32px horizontal

Gaps:
  Grid items:   16-24px (lg-xl)
  List items:   12-16px (md-lg)
  Button group: 8-12px (sm-md)

Margins:
  Between sections: 48-96px
  Between components: 24-32px
  Top margins: Generally 0 (use padding instead)
```

---

## 🎬 ANIMATION SYSTEM

### Animation Durations

```
Micro (Instant feedback)
  Duration: 0.15-0.2s
  Usage: Button clicks, state changes

Short (Subtle)
  Duration: 0.3-0.5s
  Usage: Hover effects, small transitions

Medium (Standard)
  Duration: 0.8-1s
  Usage: Page transitions, modal opens

Long (Dramatic)
  Duration: 2-3s
  Usage: Background animations, continuous loops

XL (Background)
  Duration: 5-7s
  Usage: Blob animations, background effects
```

### Easing Functions

```
@keyframes smooth-in-out {
  cubic-bezier(0.4, 0, 0.2, 1)  - Standard (most used)
  cubic-bezier(0.25, 0.46, 0.45, 0.94)  - Out (natural feel)
  cubic-bezier(0.42, 0, 1, 1)  - Out Quart (snappy)
  linear  - For continuous loops
}
```

### Animation Library

```
CSS Keyframes:
  ├─ blob: 7s infinite (background)
  ├─ float: 3s ease-in-out infinite (bobbing)
  ├─ glow: 2s ease-in-out infinite (pulsing)
  ├─ shimmer: 2s linear infinite (loading)
  ├─ fadeIn: 0.5s ease-in-out (entrance)
  ├─ slideUp: 0.5s ease-out (slide)
  └─ slideDown: 0.5s ease-out (slide)

Framer Motion:
  ├─ Page transitions: opacity + y offset
  ├─ Staggered children: 0.2s delay between items
  ├─ Hover effects: scale 1.05, shadow expansion
  ├─ Tap effects: scale 0.95
  ├─ Scroll triggers: whileInView animations
  └─ Gesture animations: smooth curves
```

---

## 🎨 COMPONENT STYLES

### Buttons

```
Primary Button
  Background: linear-gradient(135deg, #3b82f6, #8b5cf6)
  Text Color: #ffffff
  Padding: 12px 32px
  Border Radius: 8px
  Font Weight: 600
  Border: none
  Box Shadow: 0 0 20px rgba(59, 130, 246, 0.3)
  Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  
  Hover:
    Background: linear-gradient(135deg, #8b5cf6, #ec4899)
    Box Shadow: 0 0 40px rgba(139, 92, 246, 0.5)
    Transform: translateY(-2px)
  
  Active:
    Transform: translateY(0)
    Box Shadow: 0 0 20px rgba(139, 92, 246, 0.3)

Secondary Button
  Background: transparent
  Text Color: #3b82f6
  Padding: 12px 32px
  Border Radius: 8px
  Border: 2px solid #3b82f6
  Font Weight: 600
  Transition: all 0.3s
  
  Hover:
    Background: rgba(59, 130, 246, 0.1)
    Border Color: #8b5cf6
    Color: #8b5cf6

Ghost Button
  Background: transparent
  Text Color: #e2e8f0
  Padding: 8px 16px
  Border Radius: 6px
  Border: none
  Font Weight: 500
  Transition: all 0.2s
  
  Hover:
    Background: rgba(59, 130, 246, 0.1)
    Color: #3b82f6
```

### Cards

```
Standard Card
  Background: rgba(30, 41, 59, 0.7)
  Backdrop Filter: blur(10px)
  Border: 1px solid rgba(148, 163, 184, 0.2)
  Border Radius: 16px
  Padding: 24px-32px
  Box Shadow: 0 20px 50px rgba(0, 0, 0, 0.15)
  Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)
  
  Hover:
    Border Color: rgba(59, 130, 246, 0.5)
    Box Shadow: 0 20px 50px rgba(59, 130, 246, 0.2)
    Transform: translateY(-4px) scale(1.02)

Interactive Card
  Background: gradient (light to darker)
  Border: 1px solid rgba(59, 130, 246, 0.3)
  Cursor: pointer
  
  Hover:
    Border Color: rgba(59, 130, 246, 0.8)
    Background: Lighter gradient
    Box Shadow: 0 0 30px rgba(59, 130, 246, 0.4)
```

### Forms

```
Input Field
  Background: #334155 (slate-700)
  Border: 1px solid #475569 (slate-600)
  Color: #ffffff
  Padding: 12px 16px
  Border Radius: 8px
  Font Size: 16px
  Transition: all 0.3s
  
  Focus:
    Outline: none
    Border Color: #3b82f6
    Box Shadow: 0 0 0 3px rgba(59, 130, 246, 0.1)
  
  Error:
    Border Color: #ef4444
    Box Shadow: 0 0 0 3px rgba(239, 68, 68, 0.1)
  
  Disabled:
    Background: #1e293b
    Color: #64748b
    Cursor: not-allowed
    Opacity: 0.5

Placeholder Text
  Color: #94a3b8 (slate-400)
  Font Style: normal
```

### Navigation

```
Nav Link
  Padding: 8px 12px
  Font Weight: 500
  Color: #94a3b8
  Border Radius: 6px
  Transition: all 0.2s
  
  Hover:
    Background: rgba(59, 130, 246, 0.1)
    Color: #ffffff
  
  Active:
    Background: rgba(59, 130, 246, 0.2)
    Color: #3b82f6
    Border Bottom: 2px solid #3b82f6
```

---

## 📐 LAYOUT GRID

### Container Sizes
```
xs:   100% (up to 640px)
sm:   640px
md:   768px
lg:   1024px
xl:   1280px
2xl:  1536px
```

### Common Layouts
```
Full Width: width: 100%, max-width: none

Contained: max-width: 80rem (1280px), margin: 0 auto

Two Column:
  Desktop: 50% / 50%
  Tablet: 40% / 60% or 100% stacked
  Mobile: 100% stacked

Three Column:
  Desktop: 33.33% each
  Tablet: 50% / 50% or 100% stacked
  Mobile: 100% stacked

Four Column:
  Desktop: 25% each
  Tablet: 50% / 50%
  Mobile: 100% stacked
```

---

## ♿ ACCESSIBILITY

### Color Contrast Ratios

```
AAA Level (Best - 7:1)
  White (#ffffff) on Dark Blue (#1e40af) ✓
  White (#ffffff) on Dark Purple (#6d28d9) ✓
  Light Gray (#e2e8f0) on Primary (#0f172a) ✓

AA Level (Good - 4.5:1)
  Medium Gray (#94a3b8) on Dark (#1e293b) ✓
  All primary text on dark backgrounds ✓

Avoid:
  Medium Gray text on light gray background
  Light text on light background
  Pink text on white background
```

### Focus States
```
All Interactive Elements Must Have:
  - Visible focus ring (2-3px border)
  - Color change (usually blue outline)
  - Outline: 2px solid #3b82f6;
  - Outline-offset: 2px;
```

### Keyboard Navigation
```
Tab:        Navigate forward
Shift+Tab:  Navigate backward
Enter:      Activate button
Space:      Activate button/toggle
Escape:     Close modal/menu
Arrow Keys: Navigate within menus
```

---

## 🚀 USAGE EXAMPLES

### Hero Section
```jsx
<section className="min-h-screen bg-gradient-to-br 
                   from-gray-900 via-gray-800 to-gray-900">
  <div className="relative">
    {/* Animated blobs */}
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 3 }}
      className="text-white text-6xl font-bold"
    >
      Title
    </motion.div>
  </div>
</section>
```

### Card Component
```jsx
<motion.div
  whileHover={{ scale: 1.02, y: -4 }}
  className="bg-gray-800/70 backdrop-blur-xl 
             border border-gray-700 rounded-2xl
             p-8 hover:border-blue-500/50 
             transition-all duration-300"
>
  Content
</motion.div>
```

### Button Component
```jsx
<button className="px-8 py-3 
                   bg-gradient-to-r from-blue-500 to-purple-600
                   hover:from-purple-600 hover:to-pink-600
                   text-white rounded-lg font-semibold
                   transition-all duration-200
                   hover:shadow-lg hover:shadow-blue-500/30">
  Click Me
</button>
```

---

## 📊 DESIGN TOKENS SUMMARY

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | #3b82f6 | Buttons, links |
| Secondary Color | #8b5cf6 | Accents, hover |
| Background | #0f172a | Page background |
| Text Primary | #ffffff | Body text |
| Text Secondary | #e2e8f0 | Secondary text |
| Border | #334155 | Borders, dividers |
| Shadow | 0 20px 50px rgba(0,0,0,0.15) | Depth |
| Radius | 8px-16px | Border radius |
| Padding | 16px-32px | Component spacing |
| Duration | 0.3s | Animation timing |

---

## 📝 NOTES

- Always maintain 7:1 contrast ratio for accessibility
- Animations should enhance, not distract
- Mobile-first approach for responsive design
- Test on actual devices, not just browser dev tools
- Use Lighthouse regularly to monitor performance

---

**Last Updated**: February 2026  
**Version**: 2.0.0  
**Status**: Production Ready
