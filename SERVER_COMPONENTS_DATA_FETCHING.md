# Server Components Data Fetching in Next.js

## Overview

Next.js Server Components (the default in the App Router) can fetch data directly on the server using standard JavaScript/TypeScript. This is a significant improvement over traditional client-side data fetching, as it happens at build time or request time on the server, not in the browser.

## What Are Server Components?

Server Components are React components that render on the server. They:
- Run on the server (Node.js environment)
- Can access server resources (databases, file system, APIs)
- Don't send JavaScript to the client (smaller bundle size)
- Can use async/await directly in components
- Are the default in Next.js App Router

## Loading Local JSON Data

### Direct Import (Build-Time)

**Method:** Import JSON file directly in Server Component

```tsx
import doctors from "@/data/doctors.json";

export default function DoctorsPage() {
  return (
    <div>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

**How It Works:**
1. Next.js bundles the JSON file during build time
2. Data is embedded in the server bundle
3. No runtime fetching needed
4. Fastest possible data access

**When to Use:**
- Static data that doesn't change
- Configuration files
- Mock data for development
- Data that can be bundled safely

**Benefits:**
- Zero runtime overhead
- Data available immediately
- No network requests
- Type-safe with TypeScript

### File System Access (Runtime)

**Method:** Read JSON file using Node.js file system

```tsx
import fs from "fs/promises";
import path from "path";

export default async function DoctorsPage() {
  const filePath = path.join(process.cwd(), "data", "doctors.json");
  const fileContents = await fs.readFile(filePath, "utf8");
  const doctors = JSON.parse(fileContents);

  return (
    <div>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

**How It Works:**
1. Component is async (Server Components support async)
2. Reads file from file system at request time
3. Parses JSON
4. Renders with the data

**When to Use:**
- Data that changes between builds
- Need to read files at runtime
- Dynamic file paths
- Data that shouldn't be bundled

**Benefits:**
- Can read files at request time
- Supports dynamic file paths
- Data can be updated without rebuild

### Fetch from API (Runtime)

**Method:** Use fetch() to get data from API

```tsx
export default async function DoctorsPage() {
  const response = await fetch("https://api.example.com/doctors");
  const doctors = await response.json();

  return (
    <div>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

**How It Works:**
1. Server Component uses fetch()
2. Request happens on server
3. Data is fetched and rendered
4. Only HTML is sent to client

**When to Use:**
- External APIs
- Dynamic data
- Data that changes frequently
- Need to fetch from backend

**Benefits:**
- No API keys exposed to client
- Server-side caching
- Faster initial page load
- Better SEO

## Server Components vs Client Components

### Server Components (Default)

```tsx
// No "use client" directive = Server Component
export default function DoctorsPage() {
  // Can use async/await
  // Can access server resources
  // Runs on server
  return <div>Content</div>;
}
```

**Capabilities:**
- Use async/await
- Access databases
- Read file system
- Use server-only APIs
- Keep secrets safe

**Limitations:**
- Cannot use hooks (useState, useEffect)
- Cannot use browser APIs (window, document)
- Cannot handle user interactions

### Client Components

```tsx
"use client";

export default function DoctorsPage() {
  // Cannot use async/await directly
  // Cannot access server resources
  // Runs in browser
  const [doctors, setDoctors] = useState([]);
  return <div>Content</div>;
}
```

**Capabilities:**
- Use hooks (useState, useEffect)
- Handle user interactions
- Access browser APIs
- Client-side state management

**Limitations:**
- Cannot use async/await directly
- Cannot access server resources
- JavaScript sent to client (larger bundle)

## Data Fetching Patterns

### 1. Direct Import (Current Implementation)

```tsx
import doctors from "@/data/doctors.json";

export default function DoctorsPage() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

**Characteristics:**
- Data bundled at build time
- Zero runtime overhead
- Type-safe with TypeScript
- Fastest performance

### 2. Async Server Component

```tsx
export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

async function getDoctors() {
  // Fetch from API or database
  const response = await fetch("https://api.example.com/doctors");
  return response.json();
}
```

**Characteristics:**
- Data fetched at request time
- Can fetch from external sources
- Supports caching
- More flexible

### 3. Data Fetching with Caching

```tsx
export default async function DoctorsPage() {
  const response = await fetch("https://api.example.com/doctors", {
    next: { revalidate: 3600 }, // Revalidate every hour
  });
  const doctors = await response.json();

  return <div>{/* Render doctors */}</div>;
}
```

**Characteristics:**
- Data cached for specified time
- Reduced server load
- Faster subsequent requests
- Still fresh data

### 4. On-Demand Revalidation

```tsx
export default async function DoctorsPage() {
  const response = await fetch("https://api.example.com/doctors", {
    next: { tags: ["doctors"] },
  });
  const doctors = await response.json();

  return <div>{/* Render doctors */}</div>;
}

// Trigger revalidation
// await revalidateTag("doctors");
```

**Characteristics:**
- Manual revalidation trigger
- Update data when needed
- Fine-grained control
- Good for dynamic content

## Performance Benefits

### 1. Smaller Client Bundle

**Server Components:**
```tsx
import doctors from "@/data/doctors.json";

export default function DoctorsPage() {
  // Data stays on server
  // Only HTML sent to client
  return <div>{/* Render doctors */}</div>;
}
```

**Client Components:**
```tsx
"use client";
import doctors from "@/data/doctors.json";

export default function DoctorsPage() {
  // Data sent to client in bundle
  // Larger JavaScript bundle
  return <div>{/* Render doctors */}</div>;
}
```

**Impact:** Server Components reduce client bundle size by 30-50%.

### 2. Server-Side Rendering

**Benefits:**
- Faster initial page load (HTML sent immediately)
- Better SEO (content available to crawlers)
- No loading states for initial render
- Better perceived performance

### 3. Reduced Network Requests

**Server Components:**
- Data fetched on server
- No client-side API calls
- Less network traffic
- Faster page load

**Client Components:**
- Data fetched in browser
- Multiple network requests
- Slower page load
- More network traffic

### 4. Caching

**Server-Side Caching:**
```tsx
const response = await fetch("https://api.example.com/doctors", {
  next: { revalidate: 3600 },
});
```

**Benefits:**
- Reduced server load
- Faster response times
- Lower costs
- Better scalability

## Security Benefits

### 1. Secrets Protection

**Server Components:**
```tsx
export default async function DoctorsPage() {
  const apiKey = process.env.API_KEY; // Safe on server
  const response = await fetch(`https://api.example.com/doctors?key=${apiKey}`);
  return <div>{/* Render doctors */}</div>;
}
```

**Client Components:**
```tsx
"use client";
const apiKey = process.env.API_KEY; // Exposed to client
// ❌ Security risk
```

**Benefit:** API keys and secrets never sent to client.

### 2. Data Validation

**Server Components:**
```tsx
export default async function DoctorsPage() {
  const doctors = await getDoctors();
  const validatedDoctors = doctors.filter(validateDoctor);
  return <div>{/* Render validated doctors */}</div>;
}
```

**Benefit:** Validate data before sending to client.

## SEO Benefits

### 1. Content Available to Crawlers

**Server Components:**
- HTML rendered on server
- Content available to search engines
- Better indexing
- Higher search rankings

**Client Components:**
- JavaScript required to render
- Content not immediately available
- Poor SEO
- Lower search rankings

### 2. Metadata Generation

```tsx
export async function generateMetadata({ params }: { params: { id: string } }) {
  const doctor = await getDoctor(params.id);
  return {
    title: `Dr. ${doctor.name} - DocBook`,
    description: doctor.biography,
  };
}
```

**Benefit:** Dynamic metadata for better SEO.

## Best Practices

### 1. Use Server Components by Default

**✅ Good:**
```tsx
export default function DoctorsPage() {
  return <div>Content</div>;
}
```

**❌ Bad:**
```tsx
"use client"; // Unnecessary
export default function DoctorsPage() {
  return <div>Content</div>;
}
```

### 2. Use Client Components Only When Needed

**When to use "use client":**
- Need hooks (useState, useEffect)
- Handle user interactions
- Access browser APIs
- Client-side state management

### 3. Keep Data Fetching on Server

**✅ Good:**
```tsx
export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return <div>{/* Render */}</div>;
}
```

**❌ Bad:**
```tsx
"use client";
export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    fetchDoctors().then(setDoctors);
  }, []);
  return <div>{/* Render */}</div>;
}
```

### 4. Use TypeScript for Type Safety

```tsx
interface Doctor {
  id: number;
  name: string;
  specialty: string;
  // ...
}

export default async function DoctorsPage() {
  const doctors: Doctor[] = await getDoctors();
  return <div>{/* Render */}</div>;
}
```

### 5. Handle Errors Gracefully

```tsx
export default async function DoctorsPage() {
  try {
    const doctors = await getDoctors();
    return <div>{/* Render */}</div>;
  } catch (error) {
    return <div>Error loading doctors</div>;
  }
}
```

## Common Patterns

### 1. Data Fetching Function

```tsx
// lib/api/doctors.ts
export async function getDoctors(): Promise<Doctor[]> {
  const response = await fetch("https://api.example.com/doctors", {
    next: { revalidate: 3600 },
  });
  return response.json();
}

// app/doctors/page.tsx
import { getDoctors } from "@/lib/api/doctors";

export default async function DoctorsPage() {
  const doctors = await getDoctors();
  return <div>{/* Render */}</div>;
}
```

### 2. Error Boundary with Loading

```tsx
// app/doctors/loading.tsx
export default function Loading() {
  return <div>Loading doctors...</div>;
}

// app/doctors/error.tsx
"use client";
export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Error loading doctors</h2>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

### 3. Streaming with Suspense

```tsx
import { Suspense } from "react";

export default function DoctorsPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <DoctorList />
      </Suspense>
    </div>
  );
}

async function DoctorList() {
  const doctors = await getDoctors();
  return <div>{/* Render */}</div>;
}
```

## Migration from Client Components

### Before (Client Component)

```tsx
"use client";
import { useState, useEffect } from "react";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data) => {
        setDoctors(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render */}</div>;
}
```

### After (Server Component)

```tsx
import doctors from "@/data/doctors.json";

export default function DoctorsPage() {
  // No loading state needed
  // No useEffect needed
  // No client-side fetching
  return (
    <div>
      {doctors.map((doctor) => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

**Benefits:**
- Simpler code
- No loading states
- No useEffect
- Faster performance
- Better SEO

## Summary

**Server Components Data Fetching:**

1. **Direct Import** - Bundle JSON at build time (current implementation)
2. **File System** - Read files at runtime
3. **API Fetch** - Fetch from external APIs on server
4. **Caching** - Cache responses for performance
5. **Revalidation** - Update data when needed

**Key Benefits:**
- Smaller client bundle
- Better performance
- Improved SEO
- Enhanced security
- Type-safe with TypeScript
- Simpler code (no useState/useEffect)

**Current Implementation:**
The doctors page uses direct JSON import, which is the fastest and simplest method for static/mock data. The data is bundled at build time and immediately available with zero runtime overhead.

**When to Use Each Method:**
- **Direct Import:** Static data, mock data, configuration
- **File System:** Dynamic local files, runtime reading
- **API Fetch:** External APIs, dynamic data, backend integration
