# Doctor Appointment Booking App - Folder Structure

## Scalable Folder Structure

```
nextjs15-app/
├── app/                              # Next.js App Router (file-based routing)
│   ├── (auth)/                       # Route group for authentication pages
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── register/
│   │   │   └── page.tsx             # Registration page
│   │   └── layout.tsx               # Auth layout (shared auth page structure)
│   │
│   ├── (dashboard)/                  # Route group for dashboard pages (requires auth)
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # Dashboard home
│   │   │   ├── appointments/
│   │   │   │   ├── page.tsx         # Appointments list
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Appointment details
│   │   │   ├── profile/
│   │   │   │   └── page.tsx         # Patient profile
│   │   │   └── layout.tsx           # Dashboard layout with sidebar/nav
│   │
│   ├── doctors/                      # Doctor-related pages
│   │   ├── page.tsx                 # Doctor search/listing
│   │   ├── [id]/
│   │   │   ├── page.tsx             # Doctor profile/details
│   │   │   └── reviews/
│   │   │       └── page.tsx         # Doctor reviews
│   │   └── specialties/
│   │       └── [slug]/
│   │           └── page.tsx         # Doctors by specialty
│   │
│   ├── booking/                      # Booking flow pages
│   │   ├── [doctorId]/
│   │   │   ├── step-1-select-time/
│   │   │   │   └── page.tsx         # Select appointment time
│   │   │   ├── step-2-patient-info/
│   │   │   │   └── page.tsx         # Patient information form
│   │   │   ├── step-3-confirmation/
│   │   │   │   └── page.tsx         # Booking confirmation
│   │   │   └── success/
│   │   │       └── page.tsx         # Booking success page
│   │
│   ├── layout.tsx                    # Root layout
│   ├── page.tsx                      # Home page
│   ├── globals.css                   # Global styles
│   └── loading.tsx                  # Global loading state
│
├── components/                       # Reusable React components
│   ├── ui/                          # Base UI components (design system)
│   │   ├── button.tsx              # Button component
│   │   ├── input.tsx               # Input component
│   │   ├── card.tsx                # Card component
│   │   ├── modal.tsx               # Modal/dialog component
│   │   ├── select.tsx              # Select/dropdown component
│   │   ├── calendar.tsx            # Calendar component
│   │   ├── badge.tsx               # Badge/tag component
│   │   ├── avatar.tsx              # Avatar component
│   │   └── index.ts                # Export all UI components
│   │
│   ├── layout/                      # Layout components
│   │   ├── header.tsx              # Site header/navigation
│   │   ├── footer.tsx              # Site footer
│   │   ├── sidebar.tsx             # Dashboard sidebar
│   │   ├── mobile-nav.tsx          # Mobile navigation
│   │   └── index.ts
│   │
│   ├── doctors/                     # Doctor-specific components
│   │   ├── doctor-card.tsx         # Doctor listing card
│   │   ├── doctor-profile.tsx      # Doctor profile display
│   │   ├── doctor-search.tsx       # Doctor search/filter
│   │   ├── availability-badge.tsx  # Availability indicator
│   │   └── index.ts
│   │
│   ├── appointments/                # Appointment-related components
│   │   ├── appointment-card.tsx    # Appointment card
│   │   ├── appointment-list.tsx    # List of appointments
│   │   ├── time-slot-picker.tsx    # Time selection component
│   │   ├── booking-summary.tsx     # Booking summary display
│   │   └── index.ts
│   │
│   ├── forms/                       # Form components
│   │   ├── patient-form.tsx        # Patient information form
│   │   ├── booking-form.tsx        # Booking form
│   │   ├── search-form.tsx         # Search form
│   │   └── index.ts
│   │
│   ├── feedback/                    # User feedback components
│   │   ├── toast.tsx               # Toast notifications
│   │   ├── loading-spinner.tsx     # Loading spinner
│   │   ├── error-boundary.tsx      # Error boundary
│   │   └── index.ts
│   │
│   └── shared/                      # Shared/generic components
│       ├── section-header.tsx      # Reusable section header
│       ├── empty-state.tsx         # Empty state display
│       ├── page-header.tsx         # Page header with breadcrumbs
│       └── index.ts
│
├── features/                        # Feature-based modules (business logic)
│   ├── doctors/                     # Doctor feature module
│   │   ├── hooks/
│   │   │   ├── use-doctors.ts      # Fetch doctors data
│   │   │   ├── use-doctor.ts       # Fetch single doctor
│   │   │   └── use-search-doctors.ts # Doctor search hook
│   │   ├── services/
│   │   │   ├── doctor-api.ts       # Doctor API calls
│   │   │   └── doctor-mock.ts      # Mock data for development
│   │   ├── types/
│   │   │   ├── doctor.types.ts     # Doctor type definitions
│   │   │   └── specialty.types.ts  # Specialty type definitions
│   │   ├── constants/
│   │   │   └── specialties.ts      # Specialty constants
│   │   └── index.ts
│   │
│   ├── appointments/                # Appointment feature module
│   │   ├── hooks/
│   │   │   ├── use-appointments.ts # Fetch appointments
│   │   │   ├── use-create-appointment.ts # Create appointment
│   │   │   ├── use-cancel-appointment.ts # Cancel appointment
│   │   │   └── use-availability.ts # Check availability
│   │   ├── services/
│   │   │   ├── appointment-api.ts   # Appointment API calls
│   │   │   └── appointment-mock.ts # Mock data
│   │   ├── types/
│   │   │   ├── appointment.types.ts # Appointment types
│   │   │   └── time-slot.types.ts  # Time slot types
│   │   ├── utils/
│   │   │   ├── date-utils.ts       # Date formatting utilities
│   │   │   └── validation.ts       # Appointment validation
│   │   └── index.ts
│   │
│   ├── auth/                        # Authentication feature module
│   │   ├── hooks/
│   │   │   ├── use-auth.ts         # Authentication state
│   │   │   ├── use-login.ts        # Login hook
│   │   │   └── use-register.ts     # Registration hook
│   │   ├── services/
│   │   │   ├── auth-api.ts         # Auth API calls
│   │   │   └── auth-mock.ts        # Mock auth
│   │   ├── types/
│   │   │   └── auth.types.ts       # Auth types
│   │   ├── context/
│   │   │   └── auth-context.tsx    # Auth context provider
│   │   └── index.ts
│   │
│   ├── patients/                    # Patient feature module
│   │   ├── hooks/
│   │   │   ├── use-patient.ts      # Fetch patient data
│   │   │   └── use-update-patient.ts # Update patient
│   │   ├── services/
│   │   │   ├── patient-api.ts      # Patient API calls
│   │   │   └── patient-mock.ts     # Mock data
│   │   ├── types/
│   │   │   └── patient.types.ts    # Patient types
│   │   └── index.ts
│   │
│   └── reviews/                     # Reviews feature module
│       ├── hooks/
│       │   ├── use-reviews.ts      # Fetch reviews
│       │   └── use-submit-review.ts # Submit review
│       ├── services/
│       │   ├── review-api.ts       # Review API calls
│       │   └── review-mock.ts      # Mock data
│       ├── types/
│       │   └── review.types.ts     # Review types
│       └── index.ts
│
├── lib/                             # Utility libraries
│   ├── api/                         # API configuration
│   │   ├── client.ts               # API client (axios/fetch wrapper)
│   │   ├── endpoints.ts            # API endpoint definitions
│   │   └── interceptors.ts         # Request/response interceptors
│   │
│   ├── hooks/                       # Global custom hooks
│   │   ├── use-debounce.ts         # Debounce hook
│   │   ├── use-local-storage.ts    # Local storage hook
│   │   └── use-media-query.ts      # Media query hook
│   │
│   ├── utils/                       # Utility functions
│   │   ├── cn.ts                   # Class name merger
│   │   ├── date.ts                 # Date utilities
│   │   ├── format.ts               # Formatting utilities
│   │   ├── validation.ts           # Validation helpers
│   │   └── constants.ts            # App-wide constants
│   │
│   ├── config/                      # Configuration files
│   │   ├── app.config.ts           # App configuration
│   │   └── env.ts                  # Environment variables
│   │
│   └── validators/                  # Validation schemas
│       ├── appointment.validator.ts # Appointment validation
│       ├── patient.validator.ts    # Patient validation
│       └── index.ts
│
├── types/                           # Shared TypeScript types
│   ├── api.types.ts                 # API response types
│   ├── common.types.ts              # Common/shared types
│   └── index.ts
│
├── stores/                          # State management (Zustand/Context)
│   ├── auth.store.ts                # Auth state
│   ├── appointment.store.ts         # Appointment state
│   ├── ui.store.ts                  # UI state (modals, toasts)
│   └── index.ts
│
├── public/                          # Static assets
│   ├── images/                      # Images
│   │   ├── doctors/                # Doctor photos
│   │   ├── icons/                  # Icon images
│   │   └── placeholders/           # Placeholder images
│   ├── icons/                       # SVG icons
│   └── fonts/                       # Custom fonts
│
├── styles/                          # Additional styles (if needed)
│   └── animations.css               # Custom animations
│
└── __tests__/                       # Test files (mirrors src structure)
    ├── components/
    ├── features/
    ├── lib/
    └── utils/
```

## Folder Purpose & Maintainability Explanation

### 1. **`app/` - App Router (Next.js 15)**

**Purpose:** File-based routing system that defines the application's URL structure and page hierarchy.

**Maintainability Benefits:**
- **Clear routing:** URL structure directly mirrors folder structure, making it easy to locate pages
- **Route groups `(auth)`, `(dashboard)`:** Organize related pages without affecting URL structure
- **Co-located layouts:** Each route group can have its own layout for consistent UI
- **Server components by default:** Optimizes performance while maintaining clear separation

**Why this structure:**
- Authentication pages grouped together for shared auth layout
- Dashboard pages grouped for protected routes with shared sidebar/navigation
- Doctor pages follow RESTful pattern with nested routes for reviews
- Booking flow uses step-based routing for clear user journey

### 2. **`components/` - Reusable Components**

**Purpose:** Contains all React components organized by type and feature.

**Maintainability Benefits:**
- **Type-based subfolders:** Easy to find components by their purpose (ui, layout, forms)
- **Feature-based components:** Doctor and appointment components are co-located with their business logic
- **Index files:** Clean imports (`import { Button } from '@/components/ui'`)
- **Single responsibility:** Each component has one clear purpose

**Subfolder breakdown:**
- **`ui/`:** Base design system components (buttons, inputs, cards) - reusable across app
- **`layout/`:** Structural components (header, footer, sidebar) - app-wide layout
- **`doctors/`, `appointments/`:** Feature-specific components - business logic encapsulation
- **`forms/`:** Form components - reusable form patterns
- **`feedback/`:** User feedback components - consistent UX patterns
- **`shared/`:** Generic components used across multiple features

### 3. **`features/` - Feature Modules**

**Purpose:** Organizes business logic by feature (doctors, appointments, auth, etc.) following the "feature-based" architecture pattern.

**Maintainability Benefits:**
- **High cohesion:** All code for a feature is in one place
- **Low coupling:** Features are independent and can be modified without affecting others
- **Easy onboarding:** New developers can focus on one feature at a time
- **Testable:** Each feature can be tested independently
- **Scalable:** Easy to add new features without restructuring existing code

**Feature module structure:**
Each feature has:
- **`hooks/`:** Custom React hooks for feature-specific state and logic
- **`services/`:** API calls and data fetching (separated from hooks for reusability)
- **`types/`:** TypeScript types specific to the feature
- **`utils/` or `constants/`:** Feature-specific helpers and constants
- **`index.ts`:** Clean public API for the feature

**Why feature-based over type-based:**
- Type-based (components, hooks, services) scatters related code across folders
- Feature-based keeps related code together, making it easier to understand and modify
- Supports team collaboration where different teams own different features
- Easier to delete or extract features as modules

### 4. **`lib/` - Utilities & Infrastructure**

**Purpose:** Contains cross-cutting concerns and utility functions used across the application.

**Maintainability Benefits:**
- **Centralized configuration:** API client, endpoints, and app config in one place
- **Reusable utilities:** Common functions (date formatting, validation) are DRY
- **Global hooks:** Hooks used across features (debounce, local storage)
- **Easy testing:** Pure functions are easy to unit test

**Subfolder breakdown:**
- **`api/`:** API infrastructure - single source of truth for API configuration
- **`hooks/`:** Global hooks - reusable across features
- **`utils/`:** Pure utility functions - no side effects, easy to test
- **`config/`:** Configuration - environment variables and app settings
- **`validators/`:** Validation schemas - consistent validation across forms

### 5. **`types/` - Shared Types**

**Purpose:** Contains TypeScript types used across multiple features.

**Maintainability Benefits:**
- **Type safety:** Ensures consistency across the application
- **Single source of truth:** Shared types prevent duplication
- **Easy refactoring:** Change a type once, update everywhere

**When to use:**
- API response types used by multiple features
- Common domain types (User, Address, etc.)
- Avoid feature-specific types (keep those in `features/*/types/`)

### 6. **`stores/` - State Management**

**Purpose:** Global application state that doesn't fit in React context or component state.

**Maintainability Benefits:**
- **Centralized state:** Easy to track and debug global state
- **Clear separation:** Different stores for different concerns (auth, appointments, UI)
- **Type-safe:** Full TypeScript support with Zustand or similar

**What goes here:**
- Authentication state (user session, tokens)
- UI state (modals, toasts, theme)
- Complex state shared across features (shopping cart, multi-step forms)

### 7. **`public/` - Static Assets**

**Purpose:** Static files served directly by the web server.

**Maintainability Benefits:**
- **Organized by type:** Images, icons, fonts separated
- **Feature-specific folders:** Doctor images in their own folder
- **Easy to find:** Clear structure for asset management

### 8. **`__tests__/` - Test Files**

**Purpose:** Mirrors the source structure for easy test location.

**Maintainability Benefits:**
- **Co-located tests:** Tests are next to the code they test
- **Easy to find:** Same folder structure as source
- **Encourages testing:** Low friction to add tests

## Key Architectural Principles

### 1. **Separation of Concerns**
- UI components are separate from business logic
- API calls are separate from hooks
- Types are separate from implementation

### 2. **Feature-Based Organization**
- Code is organized by business feature, not technical layer
- Easier to understand the domain
- Supports team collaboration

### 3. **Single Responsibility**
- Each file/module has one clear purpose
- Easy to test and maintain
- Reduces cognitive load

### 4. **Dependency Direction**
- Features can depend on `lib/` and `types/`
- Components can depend on features
- Features should not depend on each other (use shared types/lib instead)

### 5. **Scalability**
- Easy to add new features (create new folder in `features/`)
- Easy to add new pages (create new folder in `app/`)
- Easy to add new components (create in appropriate `components/` subfolder)

## Migration Path

Start with the core structure:
1. `app/` - for routing
2. `components/ui/` - base components
3. `lib/utils/` - utilities
4. `types/` - shared types

Add feature modules as needed:
1. Start with one feature (e.g., `features/doctors/`)
2. Add more features following the same pattern
3. Refactor as the application grows

This structure supports applications from small to large-scale enterprise applications.
