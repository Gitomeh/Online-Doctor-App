# Next.js App Router Layouts Guide

## How Layouts Work in Next.js

Next.js App Router uses a file-based routing system where `layout.tsx` files define the UI that wraps around pages. Layouts are a powerful feature that enable you to share UI between multiple pages while preserving state and avoiding unnecessary re-renders.

## Key Concepts

### 1. **Root Layout (`app/layout.tsx`)**

The root layout is the **top-most layout** in your application. It wraps all pages and is required in every Next.js App Router application.

**Key characteristics:**
- Must be defined in `app/layout.tsx`
- Wraps the entire application
- Defines the `<html>` and `<body>` tags
- Cannot be nested inside another layout
- Applies to all routes in the application

**Example:**
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

### 2. **Nested Layouts**

You can create nested layouts by adding `layout.tsx` files in subdirectories. These layouts wrap specific route segments and their children.

**Example structure:**
```
app/
├── layout.tsx              # Root layout
├── page.tsx                # Home page (uses root layout)
├── dashboard/
│   ├── layout.tsx          # Dashboard layout (wraps dashboard pages)
│   ├── page.tsx            # Dashboard home (uses root + dashboard layout)
│   └── appointments/
│       ├── page.tsx        # Appointments (uses root + dashboard layout)
│       └── [id]/
│           └── page.tsx    # Appointment details (uses root + dashboard layout)
```

**How nesting works:**
```
Root Layout
  └─> Dashboard Layout
      └─> Page Content
```

### 3. **Route Groups `(group)`**

Route groups allow you to organize files without affecting the URL structure. They're useful for:
- Grouping related routes together
- Applying layouts to specific route groups
- Organizing large applications

**Example:**
```
app/
├── (auth)/                 # Route group (not part of URL)
│   ├── layout.tsx          # Auth layout
│   ├── login/
│   │   └── page.tsx        # /login (uses auth layout)
│   └── register/
│       └── page.tsx        # /register (uses auth layout)
├── (dashboard)/            # Route group
│   ├── layout.tsx          # Dashboard layout
│   ├── dashboard/
│   │   └── page.tsx        # /dashboard (uses dashboard layout)
│   └── appointments/
│       └── page.tsx        # /appointments (uses dashboard layout)
```

### 4. **Layout Hierarchy**

Layouts follow the file-system hierarchy and are nested based on their location:

```
URL: /dashboard/appointments/123

Layouts applied (from outer to inner):
1. app/layout.tsx (Root)
2. app/(dashboard)/layout.tsx (Dashboard group)
3. app/(dashboard)/appointments/layout.tsx (Appointments - if exists)
4. app/(dashboard)/appointments/[id]/page.tsx (Page)
```

## Layout vs Page

| Feature | Layout | Page |
|---------|--------|------|
| **File name** | `layout.tsx` | `page.tsx` |
| **Purpose** | Shared UI wrapper | Route-specific content |
| **Required** | Root layout required | At least one page required |
| **State** | Preserved across navigation | Re-rendered on navigation |
| **Access to route params** | No | Yes |
| **Can fetch data** | Yes (Server Components) | Yes (Server Components) |
| **Can use hooks** | Only Client Components | Only Client Components |

## State Preservation

One of the most powerful features of layouts is **state preservation**. When navigating between pages that share the same layout, the layout component is **not re-rendered**, and its state is preserved.

**Example:**
```tsx
// app/dashboard/layout.tsx
"use client";

import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        Count: {count}
      </button>
      <nav>
        <Link href="/dashboard">Home</Link>
        <Link href="/dashboard/appointments">Appointments</Link>
      </nav>
      {children}
    </div>
  );
}
```

When navigating between `/dashboard` and `/dashboard/appointments`, the `count` state is preserved because the layout doesn't re-render.

## Server vs Client Components

### Server Components (Default)
- Render on the server
- Can access backend resources directly
- Smaller client bundle size
- Cannot use hooks (useState, useEffect)
- **Best for layouts** that don't need interactivity

### Client Components
- Render on the client
- Can use hooks and browser APIs
- Larger client bundle size
- Mark with `"use client"` directive
- **Use for layouts** that need interactivity (mobile menu, state)

**Example:**
```tsx
// Server Component Layout (default)
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header /> {/* Can be Server Component */}
      {children}
      <Footer />
    </div>
  );
}

// Client Component Layout (with interactivity)
"use client";

import { useState } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      {children}
    </div>
  );
}
```

## Metadata in Layouts

Layouts can export a `metadata` object to set metadata for all pages in that layout segment:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DocBook",
  description: "Book doctor appointments online",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**Nested metadata:** Child layouts can override parent metadata:
```tsx
// app/layout.tsx
export const metadata: Metadata = {
  title: "DocBook", // Default title
};

// app/dashboard/layout.tsx
export const metadata: Metadata = {
  title: "Dashboard", // Overrides for dashboard routes
};
```

## Best Practices

### 1. **Keep Layouts Simple**
Layouts should focus on structure and shared UI, not business logic:
```tsx
// ✅ Good
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}

// ❌ Avoid
export default function Layout({ children }: { children: React.ReactNode }) {
  const data = fetchSomeData(); // Business logic in layout
  return <div>{children}</div>;
}
```

### 2. **Use Route Groups for Organization**
Organize related routes without affecting URLs:
```
app/
├── (marketing)/          # Public pages
│   ├── about/
│   └── contact/
├── (app)/                # App pages
│   ├── dashboard/
│   └── settings/
└── (auth)/               # Auth pages
    ├── login/
    └── register/
```

### 3. **Minimize Client Components in Layouts**
Use Server Components by default for better performance:
```tsx
// ✅ Good - Server Component
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header /> {/* Server Component */}
      {children}
      <Footer /> {/* Server Component */}
    </div>
  );
}

// ❌ Avoid - Unnecessary Client Component
"use client";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
```

### 4. **Extract Interactive Components**
If a layout needs interactivity, extract the interactive part:
```tsx
// app/layout.tsx (Server Component)
import { MobileMenu } from "@/components/mobile-menu"; // Client Component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <MobileMenu /> {/* Client Component for interactivity */}
      {children}
    </div>
  );
}
```

### 5. **Use Loading States**
Add `loading.tsx` files for loading states during navigation:
```
app/
├── dashboard/
│   ├── layout.tsx
│   ├── loading.tsx        # Shown while dashboard pages load
│   └── page.tsx
```

## Common Patterns

### 1. **Authenticated Layout**
```tsx
// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <Sidebar />
      <main>{children}</main>
    </div>
  );
}
```

### 2. **Conditional Layout**
```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConditionalHeader />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### 3. **Theme Provider Layout**
```tsx
// app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

## Current Implementation

In the Doctor Appointment Booking app, we've implemented:

### Root Layout (`app/layout.tsx`)
```tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <Header />           {/* Sticky navigation */}
        <main className="flex-1">{children}</main>
        <Footer />           {/* Footer with links */}
      </body>
    </html>
  );
}
```

**Features:**
- **Header**: Sticky navigation with responsive menu
- **Main**: Content area with `flex-1` to push footer to bottom
- **Footer**: Multi-column footer with links
- **Flex layout**: Ensures footer stays at bottom even with little content

### Header Component (`components/layout/header.tsx`)
- `"use client"` directive for interactivity (mobile menu state)
- Responsive design: desktop navigation + mobile hamburger menu
- Sticky positioning for always-visible navigation
- Links to key pages: Find Doctors, Specialties, About, Login, Register

### Footer Component (`components/layout/footer.tsx`)
- Server Component (no interactivity needed)
- Multi-column layout: Company, For Doctors, For Patients, Legal
- Social media links
- Dynamic copyright year
- Responsive grid layout

## Next Steps

To enhance the layout system:

1. **Add route-specific layouts**:
   - `app/(dashboard)/layout.tsx` - Dashboard with sidebar
   - `app/(auth)/layout.tsx` - Auth pages with centered layout

2. **Add loading states**:
   - `app/loading.tsx` - Global loading state
   - `app/dashboard/loading.tsx` - Dashboard loading state

3. **Add error boundaries**:
   - `app/error.tsx` - Global error boundary
   - `app/dashboard/error.tsx` - Dashboard error boundary

4. **Add not-found pages**:
   - `app/not-found.tsx` - Custom 404 page
   - `app/dashboard/not-found.tsx` - Dashboard 404 page

## Summary

Next.js layouts provide a powerful way to:
- Share UI across multiple pages
- Preserve state during navigation
- Organize application structure
- Implement complex UI patterns

The key is understanding the hierarchy (root → nested → page) and using the right component type (Server vs Client) for performance.
