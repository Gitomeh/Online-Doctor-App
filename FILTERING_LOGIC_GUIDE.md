# Filtering Logic Guide

## Overview

The doctor filtering system combines search functionality with specialty filter buttons to provide a flexible and intuitive way for users to find doctors. The filtering logic uses multiple state variables and combines them with logical AND operations to produce the final filtered results.

## Implementation

### Component: DoctorList

**Location:** `components/doctors/doctor-list.tsx`

### State Management

```tsx
const [searchQuery, setSearchQuery] = useState("");
const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
```

**State Variables:**
1. **searchQuery** - String for text search (name, specialty, hospital)
2. **selectedSpecialty** - String for selected specialty filter

### Specialty Extraction

```tsx
const specialties = ["All", ...Array.from(new Set(doctors.map((doctor) => doctor.specialty)))];
```

**How It Works:**
1. Extract all specialties from doctors array
2. Use `Set` to remove duplicates
3. Convert back to array with `Array.from()`
4. Prepend "All" option
5. Result: `["All", "Cardiology", "Neurology", "Pediatrics", ...]`

**Example:**
```tsx
// Input doctors
[
  { specialty: "Cardiology" },
  { specialty: "Neurology" },
  { specialty: "Cardiology" }, // Duplicate
  { specialty: "Pediatrics" }
]

// Output specialties
["All", "Cardiology", "Neurology", "Pediatrics"]
```

### Filtering Logic

```tsx
const filteredDoctors = doctors.filter((doctor) => {
  // Filter by specialty
  const matchesSpecialty =
    selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;

  // Filter by search query
  const query = searchQuery.toLowerCase();
  const matchesSearch =
    doctor.name.toLowerCase().includes(query) ||
    doctor.specialty.toLowerCase().includes(query) ||
    doctor.hospital.toLowerCase().includes(query);

  return matchesSpecialty && matchesSearch;
});
```

**Logic Breakdown:**

**Step 1: Specialty Filter**
```tsx
const matchesSpecialty =
  selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
```

- If `selectedSpecialty` is "All", returns `true` (no specialty filter)
- Otherwise, checks if doctor's specialty selected
- Result: Boolean (true/false)

**Step 2: Search Filter**
```tsx
const query = searchQuery.toLowerCase();
const matchesSearch =
  doctor.name.toLowerCase().includes(query) ||
  doctor.specialty.toLowerCase().includes(query) ||
  doctor.hospital.toLowerCase().includes(query);
```

- Converts search query to lowercase for case-insensitive matching
- Checks if query matches:
  - Doctor's name
  - Doctor's specialty
  - Doctor's hospital
- Uses OR logic (matches any field)
- Result: Boolean (true/false)

**Step 3: Combine Filters**
```tsx
return matchesSpecialty && matchesSearch;
```

- Uses AND logic to combine both filters
- Doctor must match BOTH specialty AND search criteria
- Result: Boolean (true/false)

## Filtering Scenarios

### Scenario 1: No Filters Applied

**State:**
```tsx
searchQuery = ""
selectedSpecialty = "All"
```

**Logic:**
```tsx
matchesSpecialty = true // "All" selected
matchesSearch = true // Empty string matches everything
return true && true = true
```

**Result:** All 20 doctors displayed

### Scenario 2: Only Specialty Filter

**State:**
```tsx
searchQuery = ""
selectedSpecialty = "Cardiology"
```

**Logic:**
```tsx
matchesSpecialty = doctor.specialty === "Cardiology"
matchesSearch = true // Empty string matches everything
return (doctor.specialty === "Cardiology") && true
```

**Result:** Only cardiologists displayed

### Scenario 3: Only Search Filter

**State:**
```tsx
searchQuery = "Sarah"
selectedSpecialty = "All"
```

**Logic:**
```tsx
matchesSpecialty = true // "All" selected
matchesSearch = doctor.name.includes("sarah") || ...
return true && matchesSearch
```

**Result:** Doctors matching "Sarah" in name, specialty, or hospital

### Scenario 4: Both Filters Applied

**State:**
```tsx
searchQuery = "Dr."
selectedSpecialty = "Cardiology"
```

**Logic:**
```tsx
matchesSpecialty = doctor.specialty === "Cardiology"
matchesSearch = doctor.name.includes("dr.") || ...
return (doctor.specialty === "Cardiology") && matchesSearch
```

**Result:** Cardiologists matching "Dr." in any field

### Scenario 5: No Matches

**State:**
```tsx
searchQuery = "xyz"
selectedSpecialty = "Neurology"
```

**Logic:**
```tsx
matchesSpecialty = doctor.specialty === "Neurology"
matchesSearch = false // No doctor has "xyz"
return (doctor.specialty === "Neurology") && false = false
```

**Result:** No doctors displayed, shows "No doctors found" message

## Visual Feedback

### Active Filter Button

```tsx
<Button
  variant={selectedSpecialty === specialty ? "primary" : "outline"}
  size="sm"
  onClick={() => setSelectedSpecialty(specialty)}
>
  {specialty}
</Button>
```

**Behavior:**
- Selected specialty: `variant="primary"` (filled button)
- Unselected specialty: `variant="outline"` (outlined button)
- Clicking updates `selectedSpecialty` state

### Results Count

```tsx
{(searchQuery || selectedSpecialty !== "All") && (
  <div className="mb-6">
    {filteredDoctors.length === 0 ? (
      <p className="text-neutral-600 dark:text-neutral-400">
        No doctors found matching your criteria
      </p>
    ) : (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        Showing {filteredDoctors.length} of {doctors.length} doctors
        {selectedSpecialty !== "All" && ` in ${selectedSpecialty}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
    )}
  </div>
)}
```

**Display Logic:**
- Only shows when filters are applied
- Shows count of filtered results
- Indicates active filters
- Shows "No doctors found" if empty results

**Example Messages:**
- "Showing 3 of 20 doctors in Cardiology"
- "Showing 2 of 20 doctors matching 'Sarah'"
- "Showing 1 of 20 doctors in Cardiology matching 'Dr.'"
- "No doctors found matching your criteria"

## Performance Considerations

### Current Implementation

**Pros:**
- Simple and straightforward
- No external dependencies
- Fast for small datasets (20 doctors)
- Recalculated on every state change

**Cons:**
- Recalculates on every render
- Not optimized for large datasets
- No memoization

### Optimization Opportunities

**1. useMemo for Filtered Doctors**

```tsx
const filteredDoctors = useMemo(() => {
  return doctors.filter((doctor) => {
    const matchesSpecialty =
      selectedSpecialty === "All" || doctor.specialty === selectedSpecialty;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.hospital.toLowerCase().includes(query);
    return matchesSpecialty && matchesSearch;
  });
}, [doctors, searchQuery, selectedSpecialty]);
```

**When to Use:**
- Large datasets (100+ items)
- Expensive filtering logic
- Frequent re-renders

**Current Case:** Not needed (20 doctors, simple filter)

**2. Debounce Search Input**

```tsx
const debouncedSearch = useMemo(
  () => debounce((value: string) => setSearchQuery(value), 300),
  []
);

onChange={(e) => debouncedSearch(e.target.value)}
```

**When to Use:**
- API calls on search
- Expensive filtering
- Large datasets

**Current Case:** Not needed (local filtering, small dataset)

**3. Virtual Scrolling**

```tsx
import { useVirtualizer } from '@tanstack/react-virtual';

const virtualizer = useVirtualizer({
  count: filteredDoctors.length,
  getScrollElement: () => parentRef.current,
  estimateSize: () => 350,
});
```

**When to Use:**
- Very large datasets (1000+ items)
- Performance issues with rendering
- Need to maintain scroll position

**Current Case:** Not needed (20 doctors)

## Common Filtering Patterns

### 1. Single Filter

```tsx
const filtered = items.filter(item => item.category === selectedCategory);
```

**Use Case:** One filter criterion

### 2. Multiple Filters (AND)

```tsx
const filtered = items.filter(item =>
  item.category === selectedCategory &&
  item.price <= maxPrice &&
  item.inStock
);
```

**Use Case:** Multiple independent filters

### 3. Multiple Filters (OR)

```tsx
const filtered = items.filter(item =>
  item.category === selectedCategory ||
  item.category === "All"
);
```

**Use Case:** Alternative filter options

### 4. Combined AND/OR (Current Implementation)

```tsx
const filtered = items.filter(item => {
  const matchesFilter1 = item.category === selectedCategory;
  const matchesFilter2 = item.name.includes(query) || item.description.includes(query);
  return matchesFilter1 && matchesFilter2;
});
```

**Use Case:** Complex filtering with multiple criteria

### 5. Dynamic Filters

```tsx
const filters = {
  category: selectedCategory,
  price: maxPrice,
  inStock: onlyInStock,
};

const filtered = items.filter(item =>
  Object.entries(filters).every(([key, value]) => {
    if (value === null || value === undefined) return true;
    return item[key] === value;
  })
);
```

**Use Case:** Dynamic number of filters

## Best Practices

### 1. Case-Insensitive Search

**✅ Good:**
```tsx
const query = searchQuery.toLowerCase();
return doctor.name.toLowerCase().includes(query);
```

**❌ Bad:**
```tsx
return doctor.name.includes(searchQuery);
// Case-sensitive, poor UX
```

### 2. Handle Empty States

**✅ Good:**
```tsx
{filteredDoctors.length === 0 && (
  <p>No doctors found</p>
)}
```

**❌ Bad:**
```tsx
// No empty state handling
```

### 3. Provide Visual Feedback

**✅ Good:**
```tsx
<Button variant={selected ? "primary" : "outline"}>
  {label}
</Button>
```

**❌ Bad:**
```tsx
<Button variant="outline">
  {label}
</Button>
// No indication of selected state
```

### 4. Show Result Count

**✅ Good:**
```tsx
<p>Showing {filtered.length} of {total.length} results</p>
```

**❌ Bad:**
```tsx
// No count, user doesn't know how many results
```

### 5. Clear Filters Option

**✅ Good:**
```tsx
<Button onClick={() => {
  setSearchQuery("");
  setSelectedSpecialty("All");
}}>
  Clear Filters
</Button>
```

**❌ Bad:**
```tsx
// No way to clear filters
```

## Advanced Filtering Concepts

### 1. Fuzzy Search

```tsx
function fuzzyMatch(text: string, query: string): boolean {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  let queryIndex = 0;
  
  for (let i = 0; i < textLower.length && queryIndex < queryLower.length; i++) {
    if (textLower[i] === queryLower[queryIndex]) {
      queryIndex++;
    }
  }
  
  return queryIndex === queryLower.length;
}

// Usage
const matchesSearch = fuzzyMatch(doctor.name, searchQuery);
```

**Benefit:** Matches partial strings (e.g., "dr sm" matches "Dr. Smith")

### 2. Weighted Search

```tsx
const weights = {
  name: 3,
  specialty: 2,
  hospital: 1,
};

const score = weights.name * (nameMatch ? 1 : 0) +
              weights.specialty * (specialtyMatch ? 1 : 0) +
              weights.hospital * (hospitalMatch ? 1 : 0);

const filtered = doctors
  .map(doctor => ({ doctor, score }))
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score)
  .map(item => item.doctor);
```

**Benefit:** Prioritizes more relevant results

### 3. Faceted Search

```tsx
const facets = {
  specialty: new Set(),
  hospital: new Set(),
  availability: new Set(),
};

// Build facets from results
filteredDoctors.forEach(doctor => {
  facets.specialty.add(doctor.specialty);
  facets.hospital.add(doctor.hospital);
});

// Render facet filters
{Array.from(facets.specialty).map(specialty => (
  <Checkbox onChange={() => toggleFacet('specialty', specialty)}>
    {specialty} ({countBySpecialty[specialty]})
  </Checkbox>
))}
```

**Benefit:** Dynamic filters based on available data

## Summary

**Current Filtering Logic:**

1. **Two State Variables:**
   - `searchQuery` - Text search
   - `selectedSpecialty` - Specialty filter

2. **Specialty Extraction:**
   - Dynamically extracts unique specialties from data
   - Uses Set to remove duplicates
   - Prepends "All" option

3. **Filtering Logic:**
   - Specialty filter: Exact match OR "All"
   - Search filter: Case-insensitive match in name, specialty, or hospital
   - Combined: AND logic (must match both)

4. **Visual Feedback:**
   - Active filter button styling
   - Results count display
   - Empty state message

5. **Performance:**
   - Simple and fast for 20 doctors
   - No optimization needed currently
   - Can scale with useMemo, debounce, virtual scrolling if needed

**Key Benefits:**
- Intuitive user interface
- Flexible filtering options
- Clear visual feedback
- Responsive to user input
- Easy to extend with additional filters
