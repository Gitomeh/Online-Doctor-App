# Next.js vs React Router Navigation Comparison

## Overview

Both Next.js App Router and React Router are popular routing solutions for React applications, but they have fundamentally different approaches to routing and navigation.

## Key Differences

### 1. Routing Architecture

**Next.js App Router (File-Based)**
- File-system based routing
- Routes are defined by folder structure
- No manual route configuration needed
- Built-in code splitting and optimization

**React Router (Configuration-Based)**
- Route configuration in code
- Routes defined using `<Route>` components or config objects
- Manual route setup required
- Code splitting requires manual configuration

### 2. Route Definition

**Next.js App Router**
```tsx
// File structure defines routes
app/
├── page.tsx              → /
├── about/
│   └── page.tsx          → /about
├── doctors/
│   ├── page.tsx          → /doctors
│   └── [id]/
│       └── page.tsx      → /doctors/:id
```

**React Router**
```tsx
// Routes defined in code
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3. Link Components

**Next.js Link**
```tsx
import Link from "next/link";

// Automatic prefetching for better performance
<Link href="/doctors">Find Doctors</Link>

// Dynamic routes
<Link href={`/doctors/${doctorId}`}>View Doctor</Link>

// With query parameters
<Link href="/doctors?specialty=cardiology">Cardiologists</Link>
```

**React Router Link**
```tsx
import { Link } from "react-router-dom";

// No automatic prefetching
<Link to="/doctors">Find Doctors</Link>

// Dynamic routes
<Link to={`/doctors/${doctorId}`}>View Doctor</Link>

// With query parameters (requires manual handling)
<Link to="/doctors?specialty=cardiology">Cardiologists</Link>
```

### 4. Active Route Detection

**Next.js App Router**
```tsx
"use client";
import { usePathname } from "next/navigation";

function Navigation() {
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };
  
  return (
    <nav>
      <Link 
        href="/doctors"
        className={isActive("/doctors") ? "text-primary-600" : ""}
      >
        Doctors
      </Link>
    </nav>
  );
}
```

**React Router**
```tsx
import { NavLink, useLocation } from "react-router-dom";

function Navigation() {
  const location = useLocation();
  
  return (
    <nav>
      {/* NavLink provides active state automatically */}
      <NavLink 
        to="/doctors"
        className={({ isActive }) => isActive ? "text-primary-600" : ""}
      >
        Doctors
      </NavLink>
    </nav>
  );
}
```

### 5. Programmatic Navigation

**Next.js App Router**
```tsx
"use client";
import { useRouter } from "next/navigation";

function Component() {
  const router = useRouter();
  
  const handleClick = () => {
    router.push("/doctors");           // Navigate
    router.replace("/doctors");         // Replace history
    router.back();                      // Go back
    router.forward();                   // Go forward
    router.refresh();                  // Refresh current route
  };
  
  return <button onClick={handleClick}>Go to Doctors</button>;
}
```

**React Router**
```tsx
import { useNavigate } from "react-router-dom";

function Component() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("/doctors");               // Navigate
    navigate("/doctors", { replace: true }); // Replace history
    navigate(-1);                       // Go back
    navigate(1);                        // Go forward
  };
  
  return <button onClick={handleClick}>Go to Doctors</button>;
}
```

### 6. Route Parameters

**Next.js App Router**
```tsx
// app/doctors/[id]/page.tsx
export default function DoctorPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <div>Doctor ID: {params.id}</div>;
}

// Multiple parameters
// app/doctors/[id]/reviews/[reviewId]/page.tsx
export default function ReviewPage({ 
  params 
}: { 
  params: { id: string; reviewId: string } 
}) {
  return (
    <div>
      Doctor: {params.id}, Review: {params.reviewId}
    </div>
  );
}
```

**React Router**
```tsx
import { useParams } from "react-router-dom";

function DoctorPage() {
  const { id } = useParams<{ id: string }>();
  return <div>Doctor ID: {id}</div>;
}

// Multiple parameters
function ReviewPage() {
  const { id, reviewId } = useParams<{ 
    id: string; 
    reviewId: string 
  }>();
  return (
    <div>
      Doctor: {id}, Review: {reviewId}
    </div>
  );
}
```

### 7. Query Parameters

**Next.js App Router**
```tsx
"use client";
import { useSearchParams } from "next/navigation";

function SearchPage() {
  const searchParams = useSearchParams();
  const specialty = searchParams.get("specialty");
  const location = searchParams.get("location");
  
  return (
    <div>
      Specialty: {specialty}
      Location: {location}
    </div>
  );
}

// Setting query parameters
import { useRouter, usePathname } from "next/navigation";

function Component() {
  const router = useRouter();
  const pathname = usePathname();
  
  const setParams = () => {
    router.push(`${pathname}?specialty=cardiology&location=nyc`);
  };
}
```

**React Router**
```tsx
import { useSearchParams } from "react-router-dom";

function SearchPage() {
  const [searchParams] = useSearchParams();
  const specialty = searchParams.get("specialty");
  const location = searchParams.get("location");
  
  return (
    <div>
      Specialty: {specialty}
      Location: {location}
    </div>
  );
}

// Setting query parameters
import { useNavigate, useLocation } from "react-router-dom";

function Component() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const setParams = () => {
    navigate(`${location.pathname}?specialty=cardiology&location=nyc`);
  };
}
```

### 8. Nested Routes

**Next.js App Router**
```tsx
// app/doctors/layout.tsx
export default function DoctorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <DoctorsSidebar />
      {children}
    </div>
  );
}

// app/doctors/page.tsx
export default function DoctorsPage() {
  return <div>Doctors List</div>;
}

// app/doctors/[id]/page.tsx
export default function DoctorDetailsPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  return <div>Doctor {params.id}</div>;
}
```

**React Router**
```tsx
import { Outlet } from "react-router-dom";

function DoctorsLayout() {
  return (
    <div>
      <DoctorsSidebar />
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/doctors" element={<DoctorsLayout />}>
        <Route index element={<DoctorsPage />} />
        <Route path=":id" element={<DoctorDetailsPage />} />
      </Route>
    </Routes>
  );
}
```

### 9. Loading States

**Next.js App Router**
```tsx
// app/doctors/loading.tsx
export default function Loading() {
  return <div>Loading doctors...</div>;
}

// Automatic loading state during data fetching
```

**React Router**
```tsx
import { Suspense } from "react";

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/doctors" element={<DoctorsPage />} />
      </Routes>
    </Suspense>
  );
}
```

### 10. Error Handling

**Next.js App Router**
```tsx
// app/doctors/error.tsx
"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  );
}
```

**React Router**
```tsx
import { ErrorBoundary } from "react-error-boundary";

function App() {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <Routes>
        <Route path="/doctors" element={<DoctorsPage />} />
      </Routes>
    </ErrorBoundary>
  );
}
```

### 11. 404 Pages

**Next.js App Router**
```tsx
// app/not-found.tsx
export default function NotFound() {
  return <div>Page not found</div>;
}

// app/doctors/not-found.tsx
export default function DoctorsNotFound() {
  return <div>Doctor not found</div>;
}
```

**React Router**
```tsx
function App() {
  return (
    <Routes>
      <Route path="/doctors" element={<DoctorsPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
```

### 12. Server-Side Rendering

**Next.js App Router**
```tsx
// Server Components by default
export default async function DoctorsPage() {
  const doctors = await fetchDoctors(); // Server-side
  return <div>{/* Render doctors */}</div>;
}

// Client Components with "use client"
"use client";
export default function InteractiveComponent() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

**React Router**
```tsx
// All components are client-side
import { useEffect, useState } from "react";

function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  
  useEffect(() => {
    fetchDoctors().then(setDoctors);
  }, []);
  
  return <div>{/* Render doctors */}</div>;
}
```

### 13. Performance

**Next.js App Router**
- Automatic code splitting by route
- Prefetching of linked routes
- Server Components reduce client bundle
- Optimized image loading
- Built-in caching

**React Router**
- Manual code splitting required
- No automatic prefetching
- All code runs on client
- Manual optimization needed
- No built-in caching

### 14. SEO

**Next.js App Router**
- Server-side rendering by default
- Metadata API for SEO
- Static generation support
- Built-in sitemap generation

**React Router**
- Client-side rendering (poor SEO)
- Requires SSR setup (Next.js, Remix)
- Manual SEO optimization
- No built-in sitemap

### 15. Development Experience

**Next.js App Router**
- File-based routing (intuitive)
- No route configuration
- Hot module replacement
- Fast refresh
- TypeScript support built-in

**React Router**
- Code-based routing (flexible)
- Manual configuration
- Hot module replacement
- Fast refresh
- TypeScript support available

## When to Use Each

### Use Next.js App Router When:
- Building a content-heavy website (blog, e-commerce)
- Need SEO optimization
- Want server-side rendering
- Prefer file-based routing
- Building a full-stack application
- Need automatic code splitting

### Use React Router When:
- Building a single-page application (SPA)
- Don't need SEO
- Want complete control over routing
- Building a dashboard/admin panel
- Migrating from existing React app
- Need complex client-side routing logic

## Migration Considerations

### React Router to Next.js
- Convert route config to file structure
- Replace `<Link>` with Next.js `<Link>`
- Replace `useNavigate` with `useRouter`
- Convert client components to Server Components where possible
- Update data fetching patterns

### Next.js to React Router
- Convert file structure to route config
- Replace Next.js `<Link>` with React Router `<Link>`
- Replace `useRouter` with `useNavigate`
- Convert Server Components to client components
- Update data fetching to client-side

## Summary

| Feature | Next.js App Router | React Router |
|---------|-------------------|--------------|
| Routing | File-based | Configuration-based |
| SSR | Built-in | Requires setup |
| SEO | Excellent | Poor (without SSR) |
| Performance | Optimized | Manual optimization |
| Code Splitting | Automatic | Manual |
| Learning Curve | Lower | Higher |
| Flexibility | Moderate | High |
| Best For | Full-stack apps | SPAs |

## Current Implementation

The DocBook application uses **Next.js App Router** with:
- File-based routing in `app/` directory
- `usePathname` for active route detection
- `Link` components for navigation
- Server Components for better performance
- Automatic code splitting and prefetching

The navigation component (`components/layout/header.tsx`) demonstrates:
- Active state highlighting using `usePathname`
- Responsive design (desktop/mobile)
- Conditional styling based on current route
- Mobile menu with state management
