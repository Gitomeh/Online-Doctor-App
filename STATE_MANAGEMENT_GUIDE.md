# State Management Guide

## Overview

State management in React refers to how components store and update data over time. For the doctor search functionality, we use React's built-in `useState` hook to manage the search query state in a Client Component.

## State Management Implementation

### DoctorList Component

**Location:** `components/doctors/doctor-list.tsx`

```tsx
"use client";

import { useState } from "react";

export function DoctorList({ doctors }: DoctorListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDoctors = doctors.filter((doctor) => {
    const query = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.hospital.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      <Input
        type="text"
        placeholder="Search by name, specialty, or hospital..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      {/* Render filtered doctors */}
    </div>
  );
}
```

## How useState Works

### 1. useState Hook

**Syntax:**
```tsx
const [state, setState] = useState(initialValue);
```

**Parameters:**
- `initialValue` - The starting value of the state

**Returns:**
- `state` - Current state value
- `setState` - Function to update the state

**Example:**
```tsx
const [searchQuery, setSearchQuery] = useState("");
// searchQuery = "" (current value)
// setSearchQuery = function to update searchQuery
```

### 2. State Updates

**Direct Assignment:**
```tsx
setSearchQuery("cardiology");
// searchQuery becomes "cardiology"
```

**Event Handler:**
```tsx
onChange={(e) => setSearchQuery(e.target.value)}
// Updates state when user types
```

**Derived State:**
```tsx
const filteredDoctors = doctors.filter((doctor) => {
  return doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
});
// Recalculated whenever searchQuery changes
```

## Why Client Component?

### "use client" Directive

**Required Because:**
- Uses `useState` hook (client-side only)
- Handles user input (onChange event)
- Needs interactive state management

**Server Components Cannot:**
- Use hooks (useState, useEffect)
- Handle user interactions
- Manage client-side state

**Architecture:**
```
Server Component (doctors/page.tsx)
  ↓ Passes data as props
Client Component (DoctorList)
  ↓ Manages state
UI Updates
```

## State Management Approaches

### 1. Local State (Current Implementation)

**Use Case:** Component-specific state

```tsx
export function DoctorList({ doctors }) {
  const [searchQuery, setSearchQuery] = useState("");
  // State is local to this component
}
```

**When to Use:**
- State only needed in one component
- Simple state (strings, numbers, booleans)
- No complex state logic
- No need to share state across components

**Benefits:**
- Simple and straightforward
- No external dependencies
- Easy to understand
- Minimal boilerplate

**Limitations:**
- Cannot share state with other components
- Props drilling needed for sharing
- Limited to simple use cases

### 2. Props Drilling

**Use Case:** Share state with child components

```tsx
function Parent() {
  const [searchQuery, setSearchQuery] = useState("");
  return <Child searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
}

function Child({ searchQuery, setSearchQuery }) {
  return <GrandChild searchQuery={searchQuery} setSearchQuery={setSearchQuery} />;
}
```

**When to Use:**
- Need to share state with few child components
- Simple component hierarchy
- No complex state management needed

**Benefits:**
- No external libraries
- Explicit data flow
- Easy to trace state changes

**Limitations:**
- Props drilling becomes cumbersome
- Difficult with deep component trees
- Harder to maintain as app grows

### 3. Context API

**Use Case:** Share state across many components

```tsx
const SearchContext = createContext();

function SearchProvider({ children }) {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}

function Child() {
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  // Access state without props
}
```

**When to Use:**
- State needed across many components
- Avoid props drilling
- Global state needed
- Theme, user, language settings

**Benefits:**
- No props drilling
- Access state anywhere in tree
- Built into React

**Limitations:**
- Can lead to unnecessary re-renders
- More complex setup
- Not for complex state logic

### 4. State Management Libraries

**Zustand:**
```tsx
import create from 'zustand';

const useSearchStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));

function Component() {
  const { searchQuery, setSearchQuery } = useSearchStore();
}
```

**Redux:**
```tsx
import { useSelector, useDispatch } from 'react-redux';

function Component() {
  const searchQuery = useSelector(state => state.search.query);
  const dispatch = useDispatch();
  dispatch(setSearchQuery("cardiology"));
}
```

**When to Use:**
- Complex state logic
- Need state persistence
- Time-travel debugging
- Large-scale applications

**Benefits:**
- Powerful state management
- DevTools for debugging
- Middleware support
- Large ecosystem

**Limitations:**
- Overkill for simple use cases
- More boilerplate
- Steeper learning curve
- Larger bundle size

## Current Implementation Analysis

### Local State with useState

**Why This Approach:**
- Search query is component-specific
- No need to share state
- Simple use case
- No complex logic
- Minimal dependencies

**Architecture:**
```
Server Component (doctors/page.tsx)
  - Fetches data (Server Component)
  - Passes doctors as props
  ↓
Client Component (DoctorList)
  - Manages search query (useState)
  - Filters doctors locally
  - Renders filtered results
```

**Benefits:**
- Simple and maintainable
- No external dependencies
- Type-safe with TypeScript
- Performance: filtering happens on client with local data
- Server Component still handles data fetching

**Trade-offs:**
- All doctors loaded initially (fine for 20 doctors)
- Filtering happens on client (acceptable for small datasets)
- State not shared (not needed for this use case)

## State Lifecycle

### 1. Initialization

```tsx
const [searchQuery, setSearchQuery] = useState("");
```

**When:** Component first renders
**Value:** Initial state (empty string)
**Behavior:** Input shows empty placeholder

### 2. User Input

```tsx
onChange={(e) => setSearchQuery(e.target.value)}
```

**When:** User types in input
**Value:** Updated to user input
**Behavior:** State triggers re-render

### 3. Re-render

```tsx
const filteredDoctors = doctors.filter((doctor) => {
  return doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
});
```

**When:** State changes
**Value:** Recalculated based on new state
**Behavior:** UI updates with filtered results

### 4. Unmount

**When:** Component unmounts
**Behavior:** State is discarded

## Performance Considerations

### 1. Re-renders

**Current Implementation:**
```tsx
const filteredDoctors = doctors.filter((doctor) => {
  // Recalculated on every render
});
```

**Optimization with useMemo:**
```tsx
const filteredDoctors = useMemo(() => {
  return doctors.filter((doctor) => {
    return doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
  });
}, [doctors, searchQuery]);
```

**When to Use useMemo:**
- Expensive calculations
- Large datasets
- Frequent re-renders

**Current Case:** Not needed (20 doctors, simple filter)

### 2. Debouncing

**Current Implementation:**
```tsx
onChange={(e) => setSearchQuery(e.target.value)}
// Updates on every keystroke
```

**Optimization with Debounce:**
```tsx
const debouncedSearch = useMemo(
  () => debounce((value) => setSearchQuery(value), 300),
  []
);

onChange={(e) => debouncedSearch(e.target.value)}
// Updates after 300ms of inactivity
```

**When to Use Debounce:**
- API calls on search
- Expensive filtering
- Large datasets

**Current Case:** Not needed (local filtering, small dataset)

## Common Patterns

### 1. Controlled Components

**Pattern:** State controls input value

```tsx
const [value, setValue] = useState("");

<input
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Benefits:**
- Single source of truth
- Easy to validate
- Can programmatically control

### 2. Derived State

**Pattern:** State computed from other state

```tsx
const [searchQuery, setSearchQuery] = useState("");

const filteredDoctors = doctors.filter((doctor) =>
  doctor.name.toLowerCase().includes(searchQuery.toLowerCase())
);
```

**Benefits:**
- Always in sync
- No duplication
- Easy to maintain

### 3. State Initialization

**Pattern:** Initialize with function

```tsx
const [data, setData] = useState(() => {
  // Expensive calculation only runs once
  return expensiveCalculation();
});
```

**Benefits:**
- Performance optimization
- Runs only on mount
- Not on every render

## Best Practices

### 1. Keep State Minimal

**✅ Good:**
```tsx
const [searchQuery, setSearchQuery] = useState("");
// Only store what's needed
```

**❌ Bad:**
```tsx
const [searchQuery, setSearchQuery] = useState("");
const [filteredDoctors, setFilteredDoctors] = useState([]);
// Derived state should be computed, not stored
```

### 2. Use Derived State

**✅ Good:**
```tsx
const filteredDoctors = doctors.filter(/* filter logic */);
// Computed from props and state
```

**❌ Bad:**
```tsx
useEffect(() => {
  setFilteredDoctors(doctors.filter(/* filter logic */));
}, [searchQuery]);
// Unnecessary useEffect
```

### 3. Use Client Components Only When Needed

**✅ Good:**
```tsx
"use client";
// Only when using hooks or interactivity
```

**❌ Bad:**
```tsx
"use client";
// Unnecessary if no hooks used
```

### 4. Type State with TypeScript

**✅ Good:**
```tsx
const [searchQuery, setSearchQuery] = useState<string>("");
// Explicit type annotation
```

**❌ Bad:**
```tsx
const [searchQuery, setSearchQuery] = useState("");
// Relies on inference (less clear)
```

## When to Scale Up State Management

### Signs You Need More Than useState

1. **Props Drilling:** Passing state through many components
2. **Complex State Logic:** Multiple related state variables
3. **State Persistence:** Need to save/restore state
4. **Global State:** State needed across app
5. **Performance Issues:** Too many re-renders

### Upgrade Path

**Local State → Context API → State Library**

```
useState (Current)
  ↓ If props drilling needed
Context API
  ↓ If complex state logic
Zustand/Redux
```

## Summary

**Current State Management:**
- **Hook:** `useState` for search query
- **Component:** Client Component (`"use client"`)
- **Pattern:** Controlled component with derived state
- **Scope:** Local to DoctorList component

**Why This Approach:**
- Simple and maintainable
- No external dependencies
- Appropriate for the use case
- Type-safe with TypeScript
- Performance is acceptable

**When to Consider Alternatives:**
- Need to share state across components → Context API
- Complex state logic → Zustand/Redux
- Large datasets → Debounce + useMemo
- API calls on search → Debounce + loading states

**Best Practices:**
- Keep state minimal
- Use derived state
- Client components only when needed
- Type state with TypeScript
- Scale up when needed
