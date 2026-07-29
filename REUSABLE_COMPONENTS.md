# Reusable Components and Maintainability

## What Are Reusable Components?

Reusable components are self-contained, modular UI elements that can be used throughout an application multiple times with different props or configurations. They encapsulate both structure and behavior, promoting code reuse and consistency.

## Current Footer Component

The footer component (`components/layout/footer.tsx`) is already a reusable component with:

**Features:**
- Multi-column layout (Company, For Doctors, For Patients, Legal)
- Social media links (Twitter, Facebook, LinkedIn)
- Dynamic copyright year
- Responsive grid layout
- Consistent styling using design tokens

**Usage:**
```tsx
import { Footer } from "@/components/layout/footer";

// In root layout
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

## Why Reusable Components Improve Maintainability

### 1. **DRY Principle (Don't Repeat Yourself)**

**Without Reusable Components:**
```tsx
// Home page
<footer>
  <div className="grid grid-cols-4 gap-8">
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/careers">Careers</a></li>
      </ul>
    </div>
    {/* ... more columns ... */}
  </div>
  <p>© 2026 DocBook</p>
</footer>

// About page
<footer>
  <div className="grid grid-cols-4 gap-8">
    <div>
      <h3>Company</h3>
      <ul>
        <li><a href="/about">About</a></li>
        <li><a href="/careers">Careers</a></li>
      </ul>
    </div>
    {/* ... same code repeated ... */}
  </div>
  <p>© 2026 DocBook</p>
</footer>
```

**With Reusable Components:**
```tsx
// Single footer component
export function Footer() {
  return (
    <footer>
      <div className="grid grid-cols-4 gap-8">
        {/* Footer content */}
      </div>
      <p>© {new Date().getFullYear()} DocBook</p>
    </footer>
  );
}

// Used everywhere
<Footer />
```

**Benefit:** Changes only need to be made in one place.

### 2. **Consistent UI**

Reusable components ensure the same UI pattern is used everywhere, creating a consistent user experience.

**Example:**
```tsx
// Button component ensures consistent styling
export function Button({ variant, size, children }) {
  return (
    <button className={cn(baseStyles, variantStyles[variant], sizeStyles[size])}>
      {children}
    </button>
  );
}

// All buttons look the same
<Button variant="primary">Submit</Button>
<Button variant="primary">Cancel</Button>
```

### 3. **Easier Updates and Refactoring**

When you need to update a component, you only change it in one place.

**Example:**
```tsx
// Before: Footer has 4 columns
<div className="grid grid-cols-4 gap-8">

// After: Change to 3 columns (one file change)
<div className="grid grid-cols-3 gap-8">

// All pages using <Footer /> automatically get the update
```

### 4. **Better Testing**

Reusable components can be tested independently, making testing easier and more reliable.

**Example:**
```tsx
// Test footer component
describe("Footer", () => {
  it("renders current year", () => {
    render(<Footer />);
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });

  it("renders all social links", () => {
    render(<Footer />);
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Facebook")).toBeInTheDocument();
  });
});
```

### 5. **Improved Developer Experience**

Developers can focus on building features rather than recreating common UI elements.

**Example:**
```tsx
// Instead of building a card from scratch every time
<div className="rounded-lg shadow-md p-6 bg-white">
  <h3>Title</h3>
  <p>Content</p>
</div>

// Use a reusable card component
<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

### 6. **Type Safety**

Reusable components with TypeScript provide type safety, preventing errors at compile time.

**Example:**
```tsx
interface ButtonProps {
  variant: "primary" | "secondary" | "outline";
  size: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export function Button({ variant, size, children }: ButtonProps) {
  // TypeScript ensures only valid variants are used
}

// Error: "danger" is not a valid variant
<Button variant="danger">Click</Button> // TypeScript error
```

### 7. **Performance Optimization**

Reusable components can be optimized once, and benefits apply everywhere.

**Example:**
```tsx
// Memoized component
export const Footer = memo(function Footer() {
  return <div>{/* Footer content */}</div>;
});

// Only re-renders when props change
```

### 8. **Scalability**

As the application grows, reusable components make it easier to add new features.

**Example:**
```tsx
// Adding a new page with footer
export default function NewPage() {
  return (
    <div>
      <h1>New Page</h1>
      <p>Content</p>
      <Footer /> {/* Footer already exists, just use it */}
    </div>
  );
}
```

## Types of Reusable Components

### 1. **UI Components (Atoms)**
Small, indivisible components like buttons, inputs, badges.

```tsx
// components/ui/button.tsx
export function Button({ variant, size, children }) {
  return <button className={/* styles */}>{children}</button>;
}

// components/ui/input.tsx
export function Input({ type, placeholder, value, onChange }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} />;
}
```

### 2. **Layout Components**
Components that structure the page layout.

```tsx
// components/layout/header.tsx
export function Header() {
  return <header>{/* Navigation */}</header>;
}

// components/layout/footer.tsx
export function Footer() {
  return <footer>{/* Footer content */}</footer>;
}

// components/layout/container.tsx
export function Container({ children }) {
  return <div className="max-w-7xl mx-auto px-4">{children}</div>;
}
```

### 3. **Feature Components**
Components specific to business features.

```tsx
// components/doctors/doctor-card.tsx
export function DoctorCard({ doctor }) {
  return (
    <Card>
      <DoctorAvatar src={doctor.avatar} />
      <DoctorName name={doctor.name} />
      <DoctorSpecialty specialty={doctor.specialty} />
    </Card>
  );
}
```

### 4. **Composite Components**
Components that combine other components.

```tsx
// components/ui/card.tsx
export function Card({ children }) {
  return <div className="rounded-lg shadow-md">{children}</div>;
}

// components/ui/card-header.tsx
export function CardHeader({ children }) {
  return <div className="p-6 border-b">{children}</div>;
}

// components/ui/card-body.tsx
export function CardBody({ children }) {
  return <div className="p-6">{children}</div>;
}

// Usage
<Card>
  <CardHeader><h3>Title</h3></CardHeader>
  <CardBody><p>Content</p></CardBody>
</Card>
```

## Best Practices for Reusable Components

### 1. **Single Responsibility**
Each component should have one clear purpose.

```tsx
// ✅ Good
export function Button({ children }) {
  return <button>{children}</button>;
}

// ❌ Bad - Button does too much
export function Button({ children, fetchUserData, showNotification }) {
  const handleClick = () => {
    fetchUserData();
    showNotification();
  };
  return <button onClick={handleClick}>{children}</button>;
}
```

### 2. **Props Interface**
Define clear props with TypeScript.

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}
```

### 3. **Default Props**
Provide sensible defaults.

```tsx
export function Button({ 
  variant = "primary", 
  size = "md", 
  disabled = false,
  children 
}: ButtonProps) {
  return <button disabled={disabled}>{children}</button>;
}
```

### 4. **Composition Over Configuration**
Prefer composition over complex props.

```tsx
// ✅ Good - Composition
<Card>
  <CardHeader><h3>Title</h3></CardHeader>
  <CardBody><p>Content</p></CardBody>
</Card>

// ❌ Bad - Configuration
<Card 
  header={<h3>Title</h3>}
  body={<p>Content</p>}
/>
```

### 5. **Flexible Styling**
Allow style customization via className prop.

```tsx
export function Card({ children, className }) {
  return (
    <div className={cn("rounded-lg shadow-md", className)}>
      {children}
    </div>
  );
}

// Usage with custom styles
<Card className="bg-primary-50">Custom styled card</Card>
```

### 6. **Accessibility**
Ensure components are accessible.

```tsx
export function Button({ children, ...props }) {
  return (
    <button 
      type="button"
      className="..."
      {...props}
    >
      {children}
    </button>
  );
}
```

### 7. **Documentation**
Document component usage and props.

```tsx
/**
 * Button component for primary and secondary actions.
 * 
 * @param variant - Button style variant
 * @param size - Button size
 * @param disabled - Whether button is disabled
 * @param children - Button content
 * 
 * @example
 * <Button variant="primary" size="lg">
 *   Submit
 * </Button>
 */
export function Button({ variant, size, disabled, children }) {
  // ...
}
```

## Component Organization

### Folder Structure
```
components/
├── ui/                    # Base UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── index.ts
├── layout/                # Layout components
│   ├── header.tsx
│   ├── footer.tsx
│   └── index.ts
├── doctors/               # Feature-specific components
│   ├── doctor-card.tsx
│   ├── doctor-search.tsx
│   └── index.ts
└── shared/                # Shared/generic components
    ├── section-header.tsx
    ├── empty-state.tsx
    └── index.ts
```

### Index Files
Export components from index files for cleaner imports.

```tsx
// components/ui/index.ts
export { Button } from "./button";
export { Input } from "./input";
export { Card } from "./card";

// Usage
import { Button, Input, Card } from "@/components/ui";
```

## Current Project Reusable Components

### UI Components
- **Button** (`components/ui/button.tsx`) - Reusable button with variants and sizes
- **Card** (to be created) - Container component with consistent styling

### Layout Components
- **Header** (`components/layout/header.tsx`) - Navigation with responsive menu
- **Footer** (`components/layout/footer.tsx`) - Multi-column footer with links

### Utility Components
- **cn** (`lib/utils.ts`) - Utility function for merging Tailwind classes

## Summary

Reusable components improve maintainability by:

1. **Reducing Code Duplication** - Write once, use everywhere
2. **Ensuring Consistency** - Same UI patterns across the app
3. **Simplifying Updates** - Change once, update everywhere
4. **Improving Testability** - Test components independently
5. **Enhancing Developer Experience** - Focus on features, not UI
6. **Providing Type Safety** - Catch errors at compile time
7. **Enabling Performance Optimization** - Optimize once, benefit everywhere
8. **Supporting Scalability** - Easy to add new features

The footer component is a perfect example of a reusable component that encapsulates complex UI (multi-column layout, social links, dynamic year) into a single, maintainable component used throughout the application.
