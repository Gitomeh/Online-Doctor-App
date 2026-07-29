# Design Tokens Guide

## What Are Design Tokens?

Design tokens are the atomic elements of your design system. They are named entities that store visual design values such as colors, spacing, typography, and more. Instead of hardcoding values like `#3b82f6` or `16px`, you use semantic names like `primary-500` or `spacing-4`.

## Why Design Tokens Improve Consistency

### 1. **Single Source of Truth**

Design tokens provide a single source of truth for all design values. When you need to change a color or spacing, you update it in one place, and it propagates throughout the entire application.

**Without tokens:**
```tsx
// Inconsistent values scattered throughout
<div className="bg-[#3b82f6] p-4">...</div>
<div className="bg-[#2563eb] p-[16px]">...</div>
<div style={{ backgroundColor: '#3b82f6', padding: '1rem' }}>...</div>
```

**With tokens:**
```tsx
// Consistent, semantic values
<div className="bg-primary-500 p-4">...</div>
<div className="bg-primary-600 p-4">...</div>
<div className="bg-primary-500 p-4">...</div>
```

### 2. **Semantic Naming**

Tokens use semantic names that describe their purpose, not their appearance. This makes the code more readable and maintainable.

**Example:**
```tsx
// ❌ Non-semantic
<div className="bg-[#3b82f6]">Primary action</div>

// ✅ Semantic
<div className="bg-primary-500">Primary action</div>
```

### 3. **Cross-Platform Consistency**

Design tokens can be shared across different platforms (web, mobile, email) ensuring consistent branding everywhere.

### 4. **Easier Updates**

When design requirements change, you update the token value once, and all usages automatically reflect the change.

**Example:**
```css
/* Before: Primary color is blue */
--primary-500: #3b82f6;

/* After: Rebrand to green - update once */
--primary-500: #22c55e;
```

All components using `bg-primary-500` automatically use the new color.

### 5. **Team Collaboration**

Designers and developers speak the same language. Designers define tokens in Figma/Sketch, developers implement them in code.

### 6. **Theming Support**

Tokens make implementing dark mode and other themes straightforward by providing alternative values for the same semantic names.

## Design Token Categories in This Project

### 1. **Colors**

#### Base Colors
- `background` - Page background
- `foreground` - Primary text color

#### Brand Colors (Primary)
- `primary-50` to `primary-900` - 10-step scale from light to dark
- Used for primary actions, links, brand elements

#### Secondary Colors
- `secondary-50` to `secondary-900` - 10-step scale
- Used for secondary actions, success states

#### Accent Colors
- `accent-50` to `accent-900` - 10-step scale
- Used for alerts, errors, destructive actions

#### Neutral Colors
- `neutral-50` to `neutral-900` - 10-step grayscale scale
- Used for borders, backgrounds, text hierarchy

#### Semantic Colors
- `success` - Success states, confirmations
- `warning` - Warning states, cautions
- `error` - Error states, destructive actions
- `info` - Informational states

**Usage Examples:**
```tsx
// Backgrounds
<div className="bg-background">...</div>
<div className="bg-primary-50">...</div>
<div className="bg-neutral-100">...</div>

// Text
<p className="text-foreground">...</p>
<p className="text-primary-600">...</p>
<p className="text-neutral-600">...</p>

// Borders
<div className="border border-neutral-200">...</div>
<div className="border border-primary-300">...</div>

// Interactive elements
<button className="bg-primary-500 text-white">Primary Button</button>
<button className="bg-secondary-500 text-white">Secondary Button</button>
<button className="bg-accent-500 text-white">Destructive Button</button>

// Status indicators
<span className="text-success">Success message</span>
<span className="text-warning">Warning message</span>
<span className="text-error">Error message</span>
```

### 2. **Typography**

#### Font Families
- `font-sans` - Primary sans-serif font (Geist Sans)
- `font-mono` - Monospace font (Geist Mono)

#### Font Sizes
- `xs` - 0.75rem (12px)
- `sm` - 0.875rem (14px)
- `base` - 1rem (16px)
- `lg` - 1.125rem (18px)
- `xl` - 1.25rem (20px)
- `2xl` - 1.5rem (24px)
- `3xl` - 1.875rem (30px)
- `4xl` - 2.25rem (36px)
- `5xl` - 3rem (48px)
- `6xl` - 3.75rem (60px)

#### Line Heights
- `tight` - 1.25
- `snug` - 1.375
- `normal` - 1.5
- `relaxed` - 1.625
- `loose` - 2

#### Letter Spacing
- `tighter` - -0.05em
- `tight` - -0.025em
- `normal` - 0em
- `wide` - 0.025em
- `wider` - 0.05em
- `widest` - 0.1em

**Usage Examples:**
```tsx
// Font sizes
<h1 className="text-6xl">Heading 1</h1>
<h2 className="text-5xl">Heading 2</h2>
<p className="text-base">Body text</p>
<small className="text-sm">Small text</small>

// Line heights
<p className="leading-tight">Tight line height</p>
<p className="leading-normal">Normal line height</p>
<p className="leading-relaxed">Relaxed line height</p>

// Letter spacing
<h1 className="tracking-tight">Tight tracking</h1>
<p className="tracking-wide">Wide tracking</p>

// Combined
<h1 className="text-4xl font-bold leading-tight tracking-tight">
  Page Title
</h1>
<p className="text-base leading-relaxed">
  Body paragraph with comfortable reading experience.
</p>
```

### 3. **Spacing**

#### Scale (0-96)
- `0` - 0
- `px` - 1px
- `0.5` - 0.125rem (2px)
- `1` - 0.25rem (4px)
- `2` - 0.5rem (8px)
- `3` - 0.75rem (12px)
- `4` - 1rem (16px)
- `5` - 1.25rem (20px)
- `6` - 1.5rem (24px)
- `8` - 2rem (32px)
- `10` - 2.5rem (40px)
- `12` - 3rem (48px)
- `16` - 4rem (64px)
- `20` - 5rem (80px)
- `24` - 6rem (96px)
- ... up to `96` - 24rem (384px)

**Usage Examples:**
```tsx
// Padding
<div className="p-4">Padding 1rem</div>
<div className="px-6 py-4">Horizontal 1.5rem, Vertical 1rem</div>
<div className="pt-8 pr-4 pb-8 pl-4">Individual padding</div>

// Margin
<div className="m-4">Margin 1rem</div>
<div className="mx-auto">Horizontal auto (center)</div>
<div className="mt-8 mb-4">Vertical margins</div>

// Gap (flex/grid)
<div className="gap-4">Gap 1rem between items</div>
<div className="gap-x-6 gap-y-4">Different horizontal/vertical gaps</div>

// Spacing patterns
<div className="space-y-4">Vertical space between children</div>
<div className="space-x-2">Horizontal space between children</div>
```

### 4. **Border Radius**

- `none` - 0 (no radius)
- `sm` - 0.125rem (2px)
- `base` - 0.25rem (4px)
- `md` - 0.375rem (6px)
- `lg` - 0.5rem (8px)
- `xl` - 0.75rem (12px)
- `2xl` - 1rem (16px)
- `3xl` - 1.5rem (24px)
- `full` - 9999px (fully rounded)

**Usage Examples:**
```tsx
// Border radius
<div className="rounded-none">Sharp corners</div>
<div className="rounded-md">Medium rounded corners</div>
<div className="rounded-lg">Large rounded corners</div>
<div className="rounded-full">Fully rounded (circle/pill)</div>

// Specific corners
<div className="rounded-t-lg">Top corners only</div>
<div className="rounded-r-xl">Right corners only</div>
<div className="rounded-b-full">Bottom fully rounded</div>

// Common patterns
<button className="rounded-md">Button with medium radius</button>
<div className="rounded-lg shadow-md">Card with large radius</div>
<div className="rounded-full bg-primary-500">Avatar circle</div>
```

### 5. **Shadows**

- `sm` - Small shadow for subtle depth
- `base` - Default shadow
- `md` - Medium shadow
- `lg` - Large shadow for elevated elements
- `xl` - Extra large shadow
- `2xl` - Very large shadow
- `inner` - Inset shadow

**Usage Examples:**
```tsx
// Shadows
<div className="shadow-sm">Subtle elevation</div>
<div className="shadow-md">Medium elevation</div>
<div className="shadow-lg">Large elevation</div>
<div className="shadow-xl">Extra large elevation</div>

// Common patterns
<div className="rounded-lg shadow-md">Card with shadow</div>
<button className="shadow-md hover:shadow-lg transition-shadow">
  Interactive button
</div>
<div className="shadow-inner">Inset shadow effect</div>
```

### 6. **Breakpoints**

- `sm` - 640px (small screens)
- `md` - 768px (medium screens/tablets)
- `lg` - 1024px (large screens/laptops)
- `xl` - 1280px (extra large screens)
- `2xl` - 1536px (extra extra large screens)

**Usage Examples:**
```tsx
// Responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  Responsive grid
</div>

<div className="text-sm md:text-base lg:text-lg">
  Responsive typography
</div>

<div className="p-4 md:p-6 lg:p-8">
  Responsive spacing
</div>

// Hide/show elements
<div className="hidden md:block">Hidden on mobile, visible on desktop</div>
<div className="block md:hidden">Visible on mobile, hidden on desktop</div>
```

## Dark Mode Implementation

The design tokens support dark mode through CSS custom properties that change based on `prefers-color-scheme`.

**How it works:**
```css
:root {
  /* Light mode values */
  --background: #ffffff;
  --foreground: #0a0a0a;
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode values */
    --background: #0a0a0a;
    --foreground: #fafafa;
  }
}
```

**Usage:**
```tsx
// Components automatically adapt to dark mode
<div className="bg-background text-foreground">
  This adapts to light/dark mode
</div>

// Manual dark mode (if using class-based)
<div className="dark:bg-neutral-900 dark:text-white">
  Manual dark mode override
</div>
```

## Best Practices

### 1. **Use Semantic Names**

```tsx
// ❌ Avoid
<div className="bg-[#3b82f6]">...</div>

// ✅ Use
<div className="bg-primary-500">...</div>
```

### 2. **Follow the Scale**

Use the predefined scale values instead of arbitrary values:

```tsx
// ❌ Avoid
<div className="p-[23px] m-[17px]">...</div>

// ✅ Use
<div className="p-6 m-4">...</div>
```

### 3. **Be Consistent**

Use the same token for the same purpose across the application:

```tsx
// ❌ Inconsistent
<div className="p-4">...</div>
<div className="p-[16px]">...</div>
<div style={{ padding: '1rem' }}>...</div>

// ✅ Consistent
<div className="p-4">...</div>
<div className="p-4">...</div>
<div className="p-4">...</div>
```

### 4. **Use Composition**

Combine tokens to create consistent patterns:

```tsx
// Card pattern
<div className="rounded-lg shadow-md bg-background border border-neutral-200">
  Card content
</div>

// Button pattern
<button className="rounded-md px-4 py-2 bg-primary-500 text-white font-medium">
  Button
</button>
```

### 5. **Create Component Patterns**

Extract common token combinations into components:

```tsx
// components/ui/card.tsx
export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg shadow-md bg-background border border-neutral-200">
      {children}
    </div>
  );
}

// Usage
<Card>Card content</Card>
```

## Extending Design Tokens

### Adding New Colors

```css
:root {
  --brand-purple-500: #8b5cf6;
}

@theme inline {
  --color-brand-purple-500: var(--brand-purple-500);
}
```

### Adding New Spacing

```css
@theme inline {
  --spacing-128: 32rem;
}
```

### Adding Custom Tokens

```css
:root {
  --container-max-width: 1280px;
}

@theme inline {
  --max-width-container: var(--container-max-width);
}
```

## Token Naming Convention

Follow this pattern for consistent naming:

```
{category}-{variant}-{scale}

Examples:
- primary-500 (color)
- spacing-4 (spacing)
- radius-lg (border radius)
- shadow-md (shadow)
- text-xl (typography)
```

## Summary

Design tokens provide:
- **Consistency** - Single source of truth for all design values
- **Maintainability** - Easy to update values across the entire app
- **Scalability** - Simple to add new tokens as the design system grows
- **Collaboration** - Common language between designers and developers
- **Theming** - Built-in support for dark mode and other themes
- **Performance** - CSS custom properties are optimized by browsers

By using design tokens consistently, you'll create a more maintainable, scalable, and consistent user interface.
