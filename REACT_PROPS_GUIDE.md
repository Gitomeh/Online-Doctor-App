# React Props Guide

## Overview

Props (short for "properties") are a mechanism in React for passing data from parent components to child components. They enable components to be reusable and dynamic by allowing them to accept different data and behave differently based on that data.

## What Are Props?

Props are read-only data passed to React components. They are similar to function arguments in JavaScript - just as functions accept parameters, React components accept props.

### Basic Props Example

```tsx
// Component that accepts props
function Greeting({ name }: { name: string }) {
  return <h1>Hello, {name}!</h1>;
}

// Parent component passes props
function App() {
  return <Greeting name="World" />;
}
```

## DoctorCard Component Props

The `DoctorCard` component demonstrates props usage:

```tsx
interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
    email: string;
    biography: string;
  };
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  return (
    <Card>
      {/* Uses doctor props to display data */}
      <Image src={doctor.image} alt={doctor.name} />
      <h3>{doctor.name}</h3>
      <p>{doctor.specialty}</p>
      <Link href={`/doctors/${doctor.id}`}>View Profile</Link>
    </Card>
  );
}
```

## How Props Work

### 1. Defining Props Interface

**TypeScript Interface:**
```tsx
interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    hospital: string;
    image: string;
    email: string;
    biography: string;
  };
}
```

**Purpose:**
- Defines the shape of data the component expects
- Provides type safety
- Documents the component's API
- Prevents runtime errors

### 2. Receiving Props in Component

**Destructuring:**
```tsx
export function DoctorCard({ doctor }: DoctorCardProps) {
  // doctor is now available in the component
  return <div>{doctor.name}</div>;
}
```

**Without Destructuring:**
```tsx
export function DoctorCard(props: DoctorCardProps) {
  // Access via props.doctor
  return <div>{props.doctor.name}</div>;
}
```

### 3. Passing Props from Parent

**Direct Object:**
```tsx
<DoctorCard 
  doctor={{
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiology",
    hospital: "City Medical Center",
    image: "https://...",
    email: "sarah.johnson@citymedical.com",
    biography: "Dr. Sarah Johnson is..."
  }}
/>
```

**From Mock Data:**
```tsx
import doctors from "@/data/doctors.json";

{doctors.map((doctor) => (
  <DoctorCard key={doctor.id} doctor={doctor} />
))}
```

## Types of Props

### 1. Primitive Props

**String:**
```tsx
interface ButtonProps {
  label: string;
}

function Button({ label }: ButtonProps) {
  return <button>{label}</button>;
}

<Button label="Click me" />
```

**Number:**
```tsx
interface RatingProps {
  score: number;
}

function Rating({ score }: RatingProps) {
  return <div>Rating: {score}/5</div>;
}

<Rating score={4.5} />
```

**Boolean:**
```tsx
interface ToggleProps {
  isActive: boolean;
}

function Toggle({ isActive }: ToggleProps) {
  return <div>{isActive ? "On" : "Off"}</div>;
}

<Toggle isActive={true} />
```

### 2. Object Props

**Complex Object:**
```tsx
interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
    specialty: string;
    // ...
  };
}

<DoctorCard doctor={doctorData} />
```

### 3. Array Props

**Array of Strings:**
```tsx
interface TagsProps {
  tags: string[];
}

function Tags({ tags }: TagsProps) {
  return (
    <div>
      {tags.map((tag) => <span key={tag}>{tag}</span>)}
    </div>
  );
}

<Tags tags={["Cardiology", "Surgery", "Emergency"]} />
```

**Array of Objects:**
```tsx
interface ListProps {
  items: { id: number; name: string }[];
}

function List({ items }: ListProps) {
  return (
    <ul>
      {items.map((item) => <li key={item.id}>{item.name}</li>)}
    </ul>
  );
}

<List items={[{ id: 1, name: "Item 1" }, { id: 2, name: "Item 2" }]} />
```

### 4. Function Props (Callbacks)

**Event Handlers:**
```tsx
interface ButtonProps {
  onClick: () => void;
}

function Button({ onClick }: ButtonProps) {
  return <button onClick={onClick}>Click me</button>;
}

<Button onClick={() => console.log("Clicked!")} />
```

**With Parameters:**
```tsx
interface DoctorCardProps {
  onBook: (doctorId: number) => void;
}

function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <button onClick={() => onBook(doctor.id)}>
      Book Appointment
    </button>
  );
}

<DoctorCard doctor={doctor} onBook={(id) => console.log("Booking:", id)} />
```

### 5. Optional Props

**With Default Values:**
```tsx
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
}

function Button({ variant = "primary", size = "md" }: ButtonProps) {
  return <button className={`${variant} ${size}`}>Click</button>;
}

<Button /> {/* Uses defaults: primary, md */}
<Button variant="secondary" size="lg" />
```

### 6. Children Props

**Special `children` Prop:**
```tsx
interface CardProps {
  children: React.ReactNode;
}

function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}

<Card>
  <h3>Title</h3>
  <p>Content</p>
</Card>
```

## Props Best Practices

### 1. Use TypeScript for Type Safety

**✅ Good:**
```tsx
interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
  };
}
```

**❌ Bad:**
```tsx
function DoctorCard({ doctor }: any) {
  // No type safety
}
```

### 2. Provide Default Values

**✅ Good:**
```tsx
interface ButtonProps {
  variant?: "primary" | "secondary";
}

function Button({ variant = "primary" }: ButtonProps) {
  // ...
}
```

**❌ Bad:**
```tsx
function Button({ variant }: ButtonProps) {
  // variant might be undefined
}
```

### 3. Destructure Props

**✅ Good:**
```tsx
function DoctorCard({ doctor }: DoctorCardProps) {
  return <div>{doctor.name}</div>;
}
```

**❌ Bad:**
```tsx
function DoctorCard(props: DoctorCardProps) {
  return <div>{props.doctor.name}</div>;
}
```

### 4. Use Meaningful Prop Names

**✅ Good:**
```tsx
interface DoctorCardProps {
  doctor: Doctor;
  onBook: (id: number) => void;
}
```

**❌ Bad:**
```tsx
interface DoctorCardProps {
  data: any;
  callback: Function;
}
```

### 5. Keep Props Minimal

**✅ Good:**
```tsx
interface DoctorCardProps {
  doctor: Doctor;
}
```

**❌ Bad:**
```tsx
interface DoctorCardProps {
  doctorId: number;
  doctorName: string;
  doctorSpecialty: string;
  doctorHospital: string;
  doctorImage: string;
  // Too many individual props
}
```

## Props Immutability

**Props are Read-Only:**
```tsx
function DoctorCard({ doctor }: DoctorCardProps) {
  // ❌ Bad - Cannot modify props
  doctor.name = "New Name";

  // ✅ Good - Create local copy if needed
  const localDoctor = { ...doctor, name: "New Name" };
}
```

**Why Props are Immutable:**
- Prevents unexpected side effects
- Makes data flow predictable
- Easier to debug
- Follows React's unidirectional data flow

## Props vs State

| Aspect | Props | State |
|--------|-------|-------|
| Source | Passed from parent | Managed within component |
| Mutability | Read-only | Mutable with setState |
| Purpose | Data flow | Component state |
| Changes | Re-renders when parent passes new props | Re-renders when setState is called |

**Example:**
```tsx
function DoctorCard({ doctor }: DoctorCardProps) {
  // Props - passed from parent
  const [isExpanded, setIsExpanded] = useState(false); // State - managed locally

  return (
    <div>
      <h3>{doctor.name}</h3> {/* Uses props */}
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? "Collapse" : "Expand"} {/* Uses state */}
      </button>
    </div>
  );
}
```

## Prop Drilling

**Problem:** Passing props through multiple levels

```tsx
function App() {
  const doctor = { id: 1, name: "Dr. Smith" };
  return <Layout doctor={doctor} />;
}

function Layout({ doctor }) {
  return <Page doctor={doctor} />;
}

function Page({ doctor }) {
  return <DoctorCard doctor={doctor} />;
}

function DoctorCard({ doctor }) {
  return <div>{doctor.name}</div>;
}
```

**Solution:** Context API or state management

```tsx
// Using Context
const DoctorContext = createContext<Doctor | null>(null);

function App() {
  const doctor = { id: 1, name: "Dr. Smith" };
  return (
    <DoctorContext.Provider value={doctor}>
      <Layout />
    </DoctorContext.Provider>
  );
}

function DoctorCard() {
  const doctor = useContext(DoctorContext);
  return <div>{doctor?.name}</div>;
}
```

## Default Props

**TypeScript Default Values:**
```tsx
interface ButtonProps {
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

function Button({ 
  variant = "primary", 
  size = "md", 
  disabled = false 
}: ButtonProps) {
  return <button disabled={disabled}>Click</button>;
}
```

**React Default Props (Legacy):**
```tsx
// Not recommended with TypeScript
Button.defaultProps = {
  variant: "primary",
  size: "md",
  disabled: false,
};
```

## Prop Validation

**TypeScript Validation:**
```tsx
interface DoctorCardProps {
  doctor: {
    id: number;
    name: string;
  };
}

// TypeScript catches errors at compile time
<DoctorCard doctor={{ id: "1", name: "Dr. Smith" }} /> 
// Error: Type 'string' is not assignable to type 'number'
```

**PropTypes (Runtime Validation - Legacy):**
```tsx
import PropTypes from 'prop-types';

DoctorCard.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
```

## Performance Considerations

### 1. Object Props and Re-renders

**Problem:** New object reference on every render

```tsx
function Parent() {
  return (
    <DoctorCard 
      doctor={{ id: 1, name: "Dr. Smith" }} 
    />
  );
}
```

**Solution:** Memoize or lift state up

```tsx
function Parent() {
  const doctor = useMemo(() => ({ id: 1, name: "Dr. Smith" }), []);
  return <DoctorCard doctor={doctor} />;
}
```

### 2. Function Props and Re-renders

**Problem:** New function on every render

```tsx
function Parent() {
  return (
    <DoctorCard 
      onBook={() => console.log("Booking")} 
    />
  );
}
```

**Solution:** useCallback

```tsx
function Parent() {
  const handleBook = useCallback(() => console.log("Booking"), []);
  return <DoctorCard onBook={handleBook} />;
}
```

### 3. React.memo for Props Comparison

```tsx
export const DoctorCard = React.memo(function DoctorCard({ doctor }: DoctorCardProps) {
  return <div>{doctor.name}</div>;
});
```

## Common Props Patterns

### 1. Spread Operator

```tsx
interface DoctorCardProps {
  id: number;
  name: string;
  specialty: string;
  // ... many props
}

function DoctorCard(props: DoctorCardProps) {
  return <div {...props}>Content</div>;
}
```

### 2. Rest and Spread

```tsx
interface CardProps {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}

function Card({ className, children, ...rest }: CardProps) {
  return <div className={className} {...rest}>{children}</div>;
}
```

### 3. Conditional Props

```tsx
interface ButtonProps {
  variant?: "primary" | "secondary";
  loading?: boolean;
}

function Button({ variant = "primary", loading }: ButtonProps) {
  return (
    <button disabled={loading} className={variant}>
      {loading ? "Loading..." : "Click"}
    </button>
  );
}
```

## Summary

**Props Key Concepts:**

1. **Read-Only** - Props cannot be modified by the receiving component
2. **Unidirectional** - Data flows from parent to child
3. **Type Safety** - TypeScript interfaces define prop shapes
4. **Reusability** - Components accept different data via props
5. **Composition** - Components are composed by passing props

**DoctorCard Component Props:**
- Accepts a single `doctor` object with all doctor information
- Uses TypeScript interface for type safety
- Displays doctor data (image, name, specialty, hospital, biography)
- Includes navigation links using doctor ID
- Responsive design with Tailwind CSS

**Benefits of Props:**
- Component reusability
- Type safety with TypeScript
- Clear component API
- Predictable data flow
- Easier testing
- Better documentation
