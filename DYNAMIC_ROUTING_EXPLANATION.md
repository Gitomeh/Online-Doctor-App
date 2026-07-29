# Next.js Dynamic Routing Explained

## What is Dynamic Routing?

Dynamic routing in Next.js allows you to create pages with dynamic segments in the URL path. Instead of creating a separate page for each doctor (`/doctors/1`, `/doctors/2`, etc.), you create a single dynamic route that can handle all doctor IDs.

## How It Works

### 1. Dynamic Route Structure

In Next.js, dynamic routes are created by wrapping a folder name in square brackets `[parameterName]`. 

**File Structure:**
```
app/
├── doctors/
│   ├── page.tsx           # Static route: /doctors
│   └── [id]/              # Dynamic route: /doctors/1, /doctors/2, etc.
│       └── page.tsx       # Handles all doctor IDs
```

### 2. Accessing Route Parameters

In Next.js 16, route parameters are provided as a Promise in the `params` prop. You need to `await` this Promise to access the parameters.

```typescript
interface DoctorDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const { id } = await params;  // Await the Promise to get the ID
  const doctorId = parseInt(id); // Convert string to number
  // ... rest of the component
}
```

### 3. Navigation to Dynamic Routes

You can navigate to dynamic routes using the Next.js `Link` component:

```typescript
import Link from "next/link";

// In the doctors list
<Link href={`/doctors/${doctor.id}`}>
  <div>Doctor Card</div>
</Link>
```

This creates links like:
- `/doctors/1` for Dr. Sarah Johnson
- `/doctors/2` for Dr. Michael Chen
- `/doctors/3` for Dr. Emily Rodriguez
- etc.

### 4. Benefits of Dynamic Routing

**Single File for Multiple Pages:**
- Instead of creating 30 separate files for 30 doctors, you use one dynamic route
- All doctor pages share the same layout and functionality
- Easier to maintain and update

**Dynamic Data Loading:**
- Each doctor page loads data specific to that doctor ID
- You can fetch data based on the route parameter
- Server-side rendering with the specific doctor data

**Clean URLs:**
- URLs are user-friendly and descriptive
- Better for SEO than query parameters
- Example: `/doctors/1` vs `/doctors?id=1`

### 5. Example Implementation

**Our Doctor Details Page:**

```typescript
// app/doctors/[id]/page.tsx
export default async function DoctorDetailsPage({ params }: DoctorDetailsPageProps) {
  const { id } = await params;
  const doctorId = parseInt(id);
  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) {
    return <div>Doctor Not Found</div>;
  }

  return <DoctorDetailsContent doctor={doctor} />;
}
```

**Our Doctors List Navigation:**

```typescript
// app/doctors/page.tsx
{doctors.map((doctor) => (
  <Link key={doctor.id} href={`/doctors/${doctor.id}`}>
    <div>Doctor Card</div>
  </Link>
))}
```

### 6. Advanced Dynamic Routing

**Multiple Dynamic Segments:**
```
app/doctors/[id]/reviews/[reviewId]/page.tsx
// Handles: /doctors/1/reviews/123
```

**Catch-all Segments:**
```
app/doctors/[...slug]/page.tsx
// Handles: /doctors/1, /doctors/1/reviews, /doctors/1/reviews/123
```

### 7. Server-Side Benefits

Dynamic routes work perfectly with server-side rendering:
- Pages are pre-rendered with the specific data
- Better SEO with complete HTML
- Faster initial page load
- Hydration for client-side interactivity

## Summary

Dynamic routing in Next.js allows you to:
1. Create flexible URL patterns with `[parameter]` syntax
2. Access route parameters via `await params`
3. Navigate dynamically using `Link` components
4. Load data based on route parameters
5. Maintain clean, user-friendly URLs
6. Reduce code duplication with a single dynamic page

This approach is perfect for our doctor booking system where we have 30 doctors but only need one dynamic page to handle all of them.