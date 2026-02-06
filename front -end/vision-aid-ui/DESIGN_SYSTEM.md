# VisionAid - Harmonized Dual-Theme Design System

## 🎨 Design Philosophy

A professional, cohesive design system that maintains brand identity across both light and dark modes. Both themes feel like the same product under different lighting conditions.

---

## 🌈 Color Palette

### Brand Colors (Shared)
```css
Primary Blue:    #3B82F6  (Hover: #2563EB)
Secondary Purple: #8B5CF6  (Hover: #7C3AED)
```

### Status Colors (Shared)
```css
Success: #10B981  (Green)
Warning: #F59E0B  (Amber)
Error:   #EF4444  (Red)
```

---

## 🌓 Surface Hierarchy

### Dark Mode (Default)
```
Layer 1 - App Background:     #0A0E1A  (Deepest navy)
Layer 2 - Section Background: #0F1419  (Dark slate)
Layer 3 - Card Surface:       #161B26  (Medium slate)
Layer 4 - Elevated Panels:    #1C2333  (Lighter slate)
Layer 5 - Input Controls:     #1F2937  (Input gray)
```

### Light Mode
```
Layer 1 - App Background:     #F8FAFC  (Soft gray)
Layer 2 - Section Background: #FFFFFF  (Pure white)
Layer 3 - Card Surface:       #FFFFFF  (Pure white)
Layer 4 - Elevated Panels:    #FFFFFF  (Pure white)
Layer 5 - Input Controls:     #F1F5F9  (Light gray)
```

**Key Principle**: Dark mode uses layered depth; light mode uses subtle shadows for elevation.

---

## 📝 Typography

### Text Colors - Dark Mode
```
Primary (Headings):   #F1F5F9  (Near white)
Secondary (Body):     #CBD5E1  (Light gray)
Muted (Captions):     #94A3B8  (Medium gray)
Disabled:             #64748B  (Dark gray)
```

### Text Colors - Light Mode
```
Primary (Headings):   #0F172A  (Near black)
Secondary (Body):     #475569  (Dark gray)
Muted (Captions):     #64748B  (Medium gray)
Disabled:             #94A3B8  (Light gray)
```

### Font Sizes
```
xs:   0.75rem   (12px)
sm:   0.875rem  (14px)
base: 1rem      (16px)
lg:   1.125rem  (18px)
xl:   1.25rem   (20px)
2xl:  1.5rem    (24px)
3xl:  1.875rem  (30px)
4xl:  2.25rem   (36px)
5xl:  3rem      (48px)
```

---

## 🎯 Border System

### Dark Mode Borders
```
Subtle:  rgba(148, 163, 184, 0.08)  - Dividers within same surface
Default: rgba(148, 163, 184, 0.12)  - Card borders, input borders
Strong:  rgba(148, 163, 184, 0.18)  - Active/selected states
Hover:   rgba(59, 130, 246, 0.25)   - Interactive hover states
```

### Light Mode Borders
```
Subtle:  rgba(15, 23, 42, 0.05)
Default: rgba(15, 23, 42, 0.10)
Strong:  rgba(15, 23, 42, 0.15)
Hover:   rgba(59, 130, 246, 0.30)
```

---

## 🔘 Button Hierarchy

### 1. Primary CTA (Main Actions)
```css
Background: linear-gradient(135deg, #3B82F6, #8B5CF6)
Text: White
Use for: Sign up, Get started, Submit, Save
```

### 2. Secondary (Supporting Actions)
```css
Background: Transparent
Border: 1.5px solid var(--color-border-default)
Text: var(--color-text-primary)
Hover: Blue border + subtle blue background
Use for: Cancel, Learn more, View details
```

### 3. Ghost (Minimal Actions)
```css
Background: Transparent
Text: var(--color-text-secondary)
Hover: Subtle background fill
Use for: Navigation, tertiary actions
```

### 4. Destructive (Dangerous Actions)
```css
Background: #EF4444 (Red)
Text: White
Use for: Delete, Remove, Stop (only)
```

---

## ✨ Interactive States

### Hover Effects
- **Glow on hover only** (no always-on neon)
- Subtle elevation change (translateY(-1px))
- Border color transition to brand blue

### Focus States (WCAG Compliant)
```css
outline: 2px solid #3B82F6
outline-offset: 2px
```

### Disabled States
- 50% opacity
- Cursor: not-allowed
- No hover effects

---

## 🎭 Shadows

### Dark Mode
```css
sm:  0 1px 2px 0 rgba(0, 0, 0, 0.4)
md:  0 4px 6px -1px rgba(0, 0, 0, 0.5)
lg:  0 10px 15px -3px rgba(0, 0, 0, 0.6)
xl:  0 20px 25px -5px rgba(0, 0, 0, 0.7)
```

### Light Mode
```css
sm:  0 1px 2px 0 rgba(0, 0, 0, 0.05)
md:  0 4px 6px -1px rgba(0, 0, 0, 0.08)
lg:  0 10px 15px -3px rgba(0, 0, 0, 0.10)
xl:  0 20px 25px -5px rgba(0, 0, 0, 0.12)
```

---

## ♿ Accessibility Standards

### WCAG AA Compliance
- **Minimum contrast ratio**: 4.5:1 for normal text
- **Large text**: 3:1 for 18px+ or 14px+ bold
- All color combinations tested and verified

### Interactive Elements
- **Minimum touch target**: 44x44px
- **Focus indicators**: Always visible
- **Color independence**: Never use color alone to convey meaning

### Keyboard Navigation
- All interactive elements focusable
- Logical tab order
- Skip links for screen readers

---

## 📐 Spacing Scale

```
xs:   0.25rem  (4px)
sm:   0.5rem   (8px)
md:   1rem     (16px)
lg:   1.5rem   (24px)
xl:   2rem     (32px)
2xl:  3rem     (48px)
3xl:  4rem     (64px)
```

**Usage**:
- xs/sm: Icon spacing, tight layouts
- md: Default spacing between elements
- lg/xl: Section padding, card spacing
- 2xl/3xl: Page sections, hero areas

---

## 🎨 Usage Examples

### Card Component
```css
background: var(--color-bg-card);
border: 1px solid var(--color-border-default);
border-radius: var(--radius-xl);
box-shadow: var(--shadow-md);
```

### Input Component
```css
background: var(--color-bg-input);
border: 2px solid var(--color-border-default);
color: var(--color-text-primary);
```

```css
/* On Focus */
border-color: var(--color-primary);
box-shadow: var(--glow-primary);
```

### Section Layout
```css
background: var(--color-bg-section);
padding: var(--spacing-2xl) var(--spacing-lg);
```

---

## 🚀 Implementation

### CSS Variables
All tokens are available as CSS custom properties:
```css
var(--color-bg-card)
var(--color-text-primary)
var(--color-border-default)
var(--shadow-md)
var(--radius-xl)
```

### Theme Toggle
Add `light-mode` class to `<html>` or `<body>`:
```javascript
document.documentElement.classList.toggle('light-mode');
```

---

## 🎯 Design Principles

1. **Consistency**: Same components look harmonious in both themes
2. **Hierarchy**: Clear visual layers through color and elevation
3. **Accessibility**: WCAG AA compliant, keyboard navigable
4. **Performance**: Smooth transitions, optimized rendering
5. **Scalability**: Systematic approach, easy to extend

---

## 📊 Color Blending Tips

### Dark Mode
- Use subtle opacity changes for depth
- Avoid pure white (#FFFFFF) - use #F1F5F9 instead
- Layer surfaces don't jump in brightness

### Light Mode
- Use shadows for elevation, not color changes
- Keep backgrounds minimal and clean
- Avoid harsh borders - use subtle grays

### Both Modes
- Brand colors (blue/purple) remain consistent
- Status colors maintain same hue
- Interactive states use same logic

---

## ✅ Checklist for New Components

- [ ] Uses semantic color tokens (not hardcoded hex)
- [ ] Tested in both light and dark modes
- [ ] Meets WCAG AA contrast requirements
- [ ] Has clear focus states
- [ ] Follows spacing scale
- [ ] Uses appropriate shadow level
- [ ] Hover states use glow effects (not always-on)
- [ ] Buttons follow hierarchy rules

---

**Version**: 1.0  
**Last Updated**: January 2026  
**Design System**: VisionAid Premium
