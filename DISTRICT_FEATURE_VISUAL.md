# District Search Feature - Visual Guide

## 🖼️ User Interface Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ☰  GeoAccess Malawi    🔍 [Search district...]  [X]    ● Live Data │ ← HEADER
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────┐                                    ┌─────────────────┐│
│  │          │                                    │  Lilongwe       ││ ← INFO PANEL
│  │ SIDEBAR  │                                    ├─────────────────┤│
│  │          │                                    │ 🏥 Health: 45   ││
│  │ Layers:  │         MAP VIEW                   │ 🏫 Schools: 123 ││
│  │ ☑ Health │                                    │ 📍 Total: 168   ││
│  │ ☑ Schools│      [District Boundary]          └─────────────────┘│
│  │ ☐ Pop.   │                                                       │
│  │          │         🔴 🟢 🔴                                       │
│  │ Analysis │       🟢 🔴 🟢 🔴                                      │
│  │          │         🔴 🟢                                          │
│  │          │                                                       │
│  └──────────┘                                                       │
│                                                                       │
│                                                                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

## 🎬 User Flow

### Step 1: Initial State
```
User opens app → Full Malawi map displayed → All facilities visible
```

### Step 2: Search
```
User clicks search bar → Types "Lil" → Dropdown shows:
  ┌─────────────────┐
  │ Lilongwe        │
  │ Central Region  │
  └─────────────────┘
```

### Step 3: Selection
```
User clicks "Lilongwe" → API call → Data loaded → Map updates
```

### Step 4: Display
```
✓ District boundary appears (blue polygon)
✓ Map zooms to fit district
✓ Info panel shows statistics
✓ Only facilities in district are highlighted
```

## 🎨 Color Scheme

### District Boundary
- **Fill**: Light blue (#3b82f6 at 10% opacity)
- **Border**: Solid blue (#3b82f6, 3px width)

### Facility Markers
- **Health**: Red circle (#ef4444)
- **Schools**: Green circle (#10b981)
- **Size**: 5px radius

### Info Panel
- **Background**: White
- **Border**: Blue (#3b82f6, 2px)
- **Shadow**: Soft shadow for depth

## 📊 Data Display Examples

### Example 1: Lilongwe District
```
District: Lilongwe
Region: Central
─────────────────────
🏥 Health Facilities: 45
   - Hospitals: 12
   - Clinics: 28
   - Pharmacies: 5

🏫 Schools: 123
   - Primary: 98
   - Secondary: 20
   - Universities: 5

📍 Total: 168 facilities
```

### Example 2: Blantyre District
```
District: Blantyre
Region: Southern
─────────────────────
🏥 Health Facilities: 67
🏫 Schools: 156
📍 Total: 223 facilities
```

## 🔄 State Transitions

```
[No District Selected]
         ↓
    User searches
         ↓
[District Selected]
         ↓
    - Boundary shown
    - Facilities filtered
    - Stats displayed
    - Map zoomed
         ↓
    User clicks X
         ↓
[No District Selected]
```

## 🗺️ Map Interactions

### Before District Selection
```
┌─────────────────────┐
│                     │
│   🔴 🟢 🔴 🟢      │  ← All facilities
│  🟢 🔴 🟢 🔴 🟢    │     across Malawi
│   🔴 🟢 🔴 🟢      │
│  🟢 🔴 🟢 🔴       │
│                     │
└─────────────────────┘
```

### After District Selection
```
┌─────────────────────┐
│                     │
│    ┌──────────┐     │
│    │ 🔴 🟢    │     │  ← Only facilities
│    │  🟢 🔴   │     │     in selected
│    │ 🔴 🟢 🔴 │     │     district
│    └──────────┘     │
│                     │
└─────────────────────┘
```

## 📱 Responsive Behavior

### Desktop (>1024px)
- Search bar: 600px max width, centered
- Info panel: Top-right corner
- Sidebar: 320px width

### Tablet (768-1024px)
- Search bar: 80% width
- Info panel: Smaller, top-right
- Sidebar: Collapsible

### Mobile (<768px)
- Search bar: Full width
- Info panel: Bottom overlay
- Sidebar: Hidden by default

## 🎯 Key Features Visualization

### 1. Autocomplete Search
```
Input: "Lil"
         ↓
Filter: districts.filter(d => d.name.includes("Lil"))
         ↓
Display: 
  ┌─────────────────┐
  │ Lilongwe        │
  │ Lilongwe City   │
  └─────────────────┘
```

### 2. Spatial Query
```
District Polygon
      ↓
ST_Within(facility_point, district_polygon)
      ↓
Filtered Facilities
```

### 3. Statistics Calculation
```
All Facilities in District
         ↓
    Group by Type
         ↓
┌─────────────────────┐
│ Health: count(type  │
│   LIKE '%hospital%')│
│ Schools: count(type │
│   LIKE '%school%')  │
└─────────────────────┘
```

## 🎨 CSS Styling

### Search Bar
```css
background: var(--bg-surface-hover)
border-radius: 12px
padding: 10px 16px
border: 2px solid var(--border-color)
box-shadow: 0 4px 12px rgba(0,0,0,0.1) (when active)
```

### Info Panel
```css
background: white
padding: 16px 20px
border-radius: 12px
box-shadow: 0 4px 20px rgba(0,0,0,0.15)
border: 2px solid #3b82f6
min-width: 250px
```

### District Boundary
```css
fillColor: #3b82f6
fillOpacity: 0.1
color: #3b82f6
weight: 3
```

## 🚀 Performance

### Optimization Strategies
1. **Simplified GeoJSON**: Using simplified boundaries (808KB vs 5.6MB)
2. **Indexed Queries**: PostGIS spatial indexes on geometry columns
3. **Lazy Loading**: Districts loaded once, cached in state
4. **Debounced Search**: 300ms delay on search input

### Expected Load Times
- District list: <100ms
- District search: <200ms
- Facility query: <500ms
- Map render: <1s

## 📈 Data Statistics

### Malawi Districts (28 total)
- **Northern Region**: 6 districts
- **Central Region**: 9 districts
- **Southern Region**: 13 districts

### Typical Facility Counts per District
- **Small**: 50-100 facilities
- **Medium**: 100-200 facilities
- **Large**: 200+ facilities (Lilongwe, Blantyre)

This visual guide helps understand the complete user experience! 🎨
