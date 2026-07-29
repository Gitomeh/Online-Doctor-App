# Next.js App Router - File-Based Routing Guide

## How File-Based Routing Works

Next.js App Router uses a file-system based router where folders are used to define routes. Each folder represents a route segment, and files inside those folders define the UI for that route.

## Basic Routing

### Page Routes

A `page.tsx` file creates a route that is accessible as a URL.

```
app/
├── page.tsx          → / (root URL)
├── about/
│   └── page.tsx      → /about
├── doctors/
│   └── page.tsx      → /doctors
└── contact/
    └── page.tsx      → /contact
```

**Example:**
```tsx
// app/page.tsx
export default function Home() {
  return <h1>Home Page</h1>;
}

// app/about/page.tsx
export default function AboutPage() {
  return <h1>About Page</h1>;
}
```

## Dynamic Routes

Dynamic routes use square brackets `[param]` to match dynamic URL segments.

```
app/
├── doctors/
│   ├── page.tsx          → /doctors
│   └── [id]/
│       └── page.tsx      → /doctors/1, /doctors/2, /doctors/abc
└── booking/
    └── [doctorId]/
        └── page.tsx      → /booking/1, /booking/2
```

**Accessing Route Parameters:**
```tsx
// app/doctors/[id]/page.tsx
export default function DoctorDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <h1>Doctor ID: {params.id}</h1>;
}

// URL: /doctors/123
// Output: Doctor ID: 123
```

## Nested Routes

Routes can be nested to create complex URL structures.

```
app/
├── doctors/
│   ├── page.tsx              → /doctors
│   └── [id]/
│       ├── page.tsx          → /doctors/123
│       └── reviews/
│           └── page.tsx      → /doctors/123/reviews
```

**Example:**
```tsx
// app/doctors/[id]/reviews/page.tsx
export default function DoctorReviewsPage({
  params,
}: {
  params: { id: string };
}) {
  return <h1>Reviews for Doctor {params.id}</h1>;
}

// URL: /doctors/123/reviews
// Output: Reviews for Doctor 123
```

## Route Groups

Route groups are folders wrapped in parentheses `(group)`. They organize files without affecting the URL structure.

```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx      → /login (not /auth/login)
│   ├── register/
│   │   └── page.tsx      → /register (not /auth/register)
│   └── layout.tsx        → Layout for auth routes
├── (dashboard)/
│   ├── dashboard/
│   │   └── page.tsx      → /dashboard (not /dashboard/dashboard)
│   └── appointments/
│       └── page.tsx      → /appointments (not /dashboard/appointments)
└── page.tsx              → /
```

**Why use route groups:**
- Organize related routes together
- Apply layouts to specific route groups
- Keep file structure clean without affecting URLs

## Special Files

### `layout.tsx`

Defines UI that is shared across multiple pages in the same route segment.

```
app/
├── layout.tsx          → Root layout (applies to all pages)
├── (dashboard)/
│   ├── layout.tsx      → Dashboard layout (applies to dashboard routes)
│   └── page.tsx
└── page.tsx
```

### `loading.tsx`

Shows a loading UI while the page or segment is loading.

```
app/
├── doctors/
│   ├── loading.tsx      → Shows while doctors page loads
│   └── page.tsx
```

### `error.tsx`

Error boundary for handling errors in a route segment.

```
app/
├── doctors/
│   ├── error.tsx        → Catches errors in doctors routes
│   └── page.tsx
```

### `not-found.tsx`

Custom 404 page for a route segment.

```
app/
├── doctors/
│   ├── not-found.tsx    → Custom 404 for doctors routes
│   └── page.tsx
└── not-found.tsx        → Global 404 page
```

### `page.tsx`

The actual page component that renders for a route.

### `route.tsx`

API routes for creating backend endpoints.

```
app/
└── api/
    └── doctors/
        └── route.tsx    → /api/doctors
```

## Current Project Structure

```
app/
├── page.tsx                          → / (Home)
├── layout.tsx                        → Root layout
├── globals.css                       → Global styles
├── favicon.ico                       → Favicon
│
├── about/
│   └── page.tsx                      → /about
│
├── doctors/
│   ├── page.tsx                      → /doctors
│   └── [id]/
│       └── page.tsx                  → /doctors/:id
│
├── booking/
│   └── [doctorId]/
│       └── page.tsx                  → /booking/:doctorId
│
├── appointments/
│   └── page.tsx                      → /appointments
│
├── contact/
│   └── page.tsx                      → /contact
│
└── health-check/
    └── page.tsx                      → /health-check
```

## URL Mapping

| File Path | URL | Description |
|-----------|-----|-------------|
| `app/page.tsx` | `/` | Home page |
| `app/about/page.tsx` | `/about` | About page |
| `app/doctors/page.tsx` | `/doctors` | Doctors listing |
| `app/doctors/[id]/page.tsx` | `/doctors/123` | Doctor details |
| `app/booking/[doctorId]/page.tsx` | `/booking/123` | Book appointment |
| `app/appointments/page.tsx` | `/appointments` | My appointments |
| `app/contact/page.tsx` | `/contact` | Contact page |
| `app/health-check/page.tsx` | `/health-check` | Health check |

## Linking Between Pages

Use the `Link` component for navigation (prefetches routes for better performance).

```tsx
import Link from "next/link";

export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/doctors">Find Doctors</Link>
      <Link href="/about">About</Link>
      <Link href={`/doctors/${doctorId}`}>
        View Doctor
      </Link>
    </nav>
  );
}
```

## Programmatic Navigation

Use the `useRouter` hook for programmatic navigation.

```tsx
"use client";

import { useRouter } from "next/navigation";

export default function Button() {
  const router = useRouter();

  return (
    <button onClick={() => router.push("/doctors")}>
      Go to Doctors
    </button>
  );
}
```

## Dynamic Route Parameters

### Single Parameter
```tsx
// app/doctors/[id]/page.tsx
export default function DoctorPage({ params }: { params: { id: string } }) {
  return <div>Doctor ID: {params.id}</div>;
}
```

### Multiple Parameters
```tsx
// app/doctors/[id]/reviews/[reviewId]/page.tsx
export default function ReviewPage({
  params,
}: {
  params: { id: string; reviewId: string };
}) {
  return (
    <div>
      Doctor: {params.id}, Review: {params.reviewId}
    </div>
  );
}
```

### Catch-All Segments
```tsx
// app/docs/[...slug]/page.tsx
export default function DocsPage({
  params,
}: {
  params: { slug: string[] };
}) {
  return <div>Path: {params.slug.join("/")}</div>;
}

// URL: /docs/getting-started/installation
// Output: Path: getting-started/installation
```

## Route Configuration

### Metadata
Each page can export metadata for SEO.

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Doctors - DocBook",
  description: "Find and book appointments with doctors",
};

export default function DoctorsPage() {
  return <div>Doctors Page</div>;
}
```

### Dynamic Metadata
```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const doctor = await getDoctor(params.id);
  return {
    title: `Dr. ${doctor.name} - DocBook`,
    description: doctor.specialty,
  };
}
```

## Static vs Dynamic Rendering

### Static Routes (Default)
```tsx
// app/page.tsx - Built at build time
export default function Home() {
  return <div>Static Content</div>;
}
```

### Dynamic Routes
```tsx
// app/doctors/[id]/page.tsx - Built on demand
export default function DoctorPage({ params }: { params: { id: string } }) {
  return <div>Doctor {params.id}</div>;
}
```

### Force Dynamic
```tsx
// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function DynamicPage() {
  return <div>Always Dynamic</div>;
}
```

## Best Practices

1. **Use folders for route segments** - Each folder represents a URL segment
2. **Use `page.tsx` for route UI** - Only `page.tsx` creates a route
3. **Use `layout.tsx` for shared UI** - Layouts wrap pages in the same segment
4. **Use route groups for organization** - `(group)` folders don't affect URLs
5. **Use dynamic routes for IDs** - `[param]` for dynamic segments
6. **Use Link component for navigation** - Better performance with prefetching
7. **Keep file structure flat** - Avoid unnecessary nesting
8. **Use meaningful folder names** - Reflect the URL structure

## Common Patterns

### Protected Routes
```tsx
// app/(dashboard)/layout.tsx
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  return <div>{children}</div>;
}
```

### Parallel Routes
```tsx
// app/@modal/(.)login/page.tsx
// Renders in parallel with other routes
```

### Intercepting Routes
```tsx
// app/(.)login/page.tsx
// Intercepts the login route to show modal
```

## Summary

Next.js App Router file-based routing:
- **Folders** = Route segments
- **Files** = Route definitions (page, layout, loading, error)
- **[param]** = Dynamic segments
- **(group)** = Organization without URL changes
- **page.tsx** = Creates a route
- **layout.tsx** = Shared UI for routes

The file structure directly maps to URLs, making it intuitive to understand and maintain your application's routing.
