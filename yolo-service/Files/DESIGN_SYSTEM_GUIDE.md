# VisionAid Design System - Quick Reference

## 🎨 Using the Design System

### Buttons

```jsx
// Primary Button (Gradient with shadow)
<button className="btn btn-primary">
  Click Me
</button>

// Secondary Button (Outlined)
<button className="btn btn-secondary">
  Learn More
</button>

// Ghost Button (Transparent)
<button className="btn btn-ghost">
  Cancel
</button>

// Button Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Default</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Cards

```jsx
// Basic Card
<div className="card p-6">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>

// Hoverable Card
<div className="card card-hover p-6">
  <h3>Interactive Card</h3>
</div>

// Glass Card
<div className="glass rounded-2xl p-6">
  <h3>Glassmorphism Effect</h3>
</div>
```

### Form Inputs

```jsx
<input 
  type="text" 
  className="input" 
  placeholder="Enter text..."
/>

<textarea 
  className="input" 
  rows="4"
  placeholder="Enter description..."
/>
```

### Badges

```jsx
<span className="badge badge-primary">New</span>
<span className="badge badge-success">Active</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-error">Error</span>
```

### Sections

```jsx
// Light Section
<section className="section">
  <div className="container-custom">
    {/* Content */}
  </div>
</section>

// Dark Section
<section className="section section-dark">
  <div className="container-custom">
    {/* Content */}
  </div>
</section>
```

### Typography

```jsx
// Gradient Text
<h1 className="text-4xl font-bold">
  <span className="gradient-text">Gradient Heading</span>
</h1>

// Headings
<h1 className="text-5xl font-bold text-gray-900 dark:text-white">
  Main Heading
</h1>

<h2 className="text-4xl font-bold text-gray-900 dark:text-white">
  Section Heading
</h2>

<h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
  Subsection
</h3>

// Body Text
<p className="text-lg text-gray-600 dark:text-gray-400">
  Body text with proper contrast
</p>
```

### Animations

```jsx
// Framer Motion Animations
import { motion } from 'framer-motion';

// Fade In
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>

// Slide Up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// Hover Scale
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Hover Me
</motion.button>

// Viewport Trigger
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.6 }}
>
  Appears on scroll
</motion.div>
```

### Dark Mode

```jsx
// Using Theme Context
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      {isDark ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
}

// Dark Mode Classes
<div className="bg-white dark:bg-gray-900">
  <h1 className="text-gray-900 dark:text-white">
    Adapts to theme
  </h1>
  <p className="text-gray-600 dark:text-gray-400">
    Secondary text
  </p>
</div>
```

### Gradients

```jsx
// Background Gradients
<div className="bg-gradient-to-r from-primary-600 to-accent-600">
  Gradient Background
</div>

<div className="bg-gradient-to-br from-primary-500/20 to-accent-500/20">
  Subtle Gradient
</div>

// Border Gradients
<div className="border-2 border-primary-500/50">
  Gradient Border
</div>
```

### Shadows

```jsx
// Soft Shadow
<div className="shadow-soft">Content</div>

// Medium Shadow
<div className="shadow-medium">Content</div>

// Large Shadow
<div className="shadow-large">Content</div>

// Glow Effect
<div className="shadow-glow">Glowing Content</div>
```

### Spacing

```jsx
// Padding
<div className="p-4">Padding 1rem</div>
<div className="p-6">Padding 1.5rem</div>
<div className="p-8">Padding 2rem</div>

// Margin
<div className="mb-4">Margin Bottom 1rem</div>
<div className="mb-6">Margin Bottom 1.5rem</div>
<div className="mb-8">Margin Bottom 2rem</div>

// Gap (Flexbox/Grid)
<div className="flex gap-4">Items with gap</div>
<div className="grid gap-6">Grid with gap</div>
```

### Responsive Design

```jsx
// Mobile First Approach
<div className="text-sm sm:text-base md:text-lg lg:text-xl">
  Responsive Text
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  Responsive Grid
</div>

// Hide/Show at Breakpoints
<div className="hidden lg:block">Desktop Only</div>
<div className="block lg:hidden">Mobile Only</div>
```

### Icons (SVG)

```jsx
// Icon with Proper Sizing
<svg 
  className="w-6 h-6 text-primary-600" 
  fill="none" 
  stroke="currentColor" 
  viewBox="0 0 24 24"
>
  <path 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth={2} 
    d="M5 13l4 4L19 7" 
  />
</svg>

// Animated Icon
<motion.svg
  whileHover={{ rotate: 180 }}
  className="w-6 h-6"
>
  {/* SVG paths */}
</motion.svg>
```

### Accessibility

```jsx
// Skip Link
<a href="#main-content" className="skip-link">
  Skip to main content
</a>

// ARIA Labels
<button aria-label="Close menu">
  <svg>...</svg>
</button>

// Focus States (Automatic)
// All interactive elements have focus-visible styles

// Screen Reader Only Text
<span className="sr-only">
  Hidden from visual users
</span>
```

## 🎨 Color Reference

### Using Colors

```jsx
// Text Colors
<p className="text-primary-600 dark:text-primary-400">Primary</p>
<p className="text-accent-600 dark:text-accent-400">Accent</p>
<p className="text-gray-900 dark:text-white">Heading</p>
<p className="text-gray-600 dark:text-gray-400">Body</p>

// Background Colors
<div className="bg-primary-50 dark:bg-primary-950">Light/Dark</div>
<div className="bg-gray-100 dark:bg-gray-800">Surface</div>

// Border Colors
<div className="border border-gray-200 dark:border-gray-800">
  Bordered
</div>
```

## 🚀 Best Practices

1. **Always use dark mode variants**: `bg-white dark:bg-gray-900`
2. **Use semantic spacing**: Stick to 4, 6, 8, 12, 16, 20 scale
3. **Leverage Tailwind utilities**: Avoid custom CSS when possible
4. **Add transitions**: `transition-all duration-300` for smooth changes
5. **Use motion.div for animations**: Better performance than CSS
6. **Test in both themes**: Ensure contrast in light and dark modes
7. **Mobile-first responsive**: Start with mobile, add breakpoints up
8. **Accessibility first**: Always include ARIA labels and focus states

## 📱 Common Patterns

### Hero Section
```jsx
<section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-primary-50/30 dark:from-gray-950 dark:to-primary-950/20">
  <div className="container-custom px-4">
    <h1 className="text-6xl font-bold text-center">
      <span className="gradient-text">Your Heading</span>
    </h1>
  </div>
</section>
```

### Feature Card
```jsx
<div className="card card-hover p-6">
  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/10 to-accent-500/10 flex items-center justify-center mb-4">
    {/* Icon */}
  </div>
  <h3 className="text-xl font-bold mb-2">Feature Title</h3>
  <p className="text-gray-600 dark:text-gray-400">Description</p>
</div>
```

### Modal/Dialog
```jsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
>
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="glass rounded-2xl p-8 max-w-md w-full"
  >
    {/* Modal content */}
  </motion.div>
</motion.div>
```

---

**Need help?** Check the full documentation in `PREMIUM_DESIGN_IMPLEMENTATION.md`
