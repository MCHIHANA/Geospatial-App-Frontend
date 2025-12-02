# GeoAccess Application Flow

## 🔄 System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                    http://localhost:5173                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    VITE DEV SERVER (Frontend)                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  React Application                                      │ │
│  │  ├── App.jsx (Main Component)                          │ │
│  │  ├── MapView (Leaflet Map)                             │ │
│  │  ├── Sidebar (Layer Controls)                          │ │
│  │  └── StatsPanel (Metrics)                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│                              │ Proxy: /api/* → :4000         │
└──────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 NESTJS SERVER (Backend)                      │
│                   http://localhost:4000                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  API Endpoints                                          │ │
│  │  ├── GET /facilities                                    │ │
│  │  ├── GET /accessibility/isochrone                       │ │
│  │  └── GET /health                                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Services                                               │ │
│  │  ├── RoutingService (ngraph pathfinding)               │ │
│  │  └── FacilitiesService (TypeORM)                       │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
└──────────────────────────────┼───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SQLite Database                           │
│                    geospatial.db (306 MB)                    │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Tables:                                                │ │
│  │  ├── facility (hospitals, schools)                     │ │
│  │  ├── road (road network with speed limits)             │ │
│  │  └── population (population data)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### 1. Loading Facilities

```
User Opens App
     │
     ▼
MapView Component Mounts
     │
     ▼
useEffect() Triggers
     │
     ▼
fetch('/api/facilities')
     │
     ▼
Vite Proxy → http://localhost:4000/facilities
     │
     ▼
FacilitiesController.findAll()
     │
     ▼
TypeORM Query: SELECT * FROM facility
     │
     ▼
Convert to GeoJSON Format
     │
     ▼
Return to Frontend
     │
     ▼
React State Updated: setFacilities(data)
     │
     ▼
Map Renders CircleMarkers
     │
     ▼
User Sees Hospitals (Red) & Schools (Green)
```

### 2. Isochrone Analysis

```
User Clicks "Catchment Areas"
     │
     ▼
showIsochrone State = true
     │
     ▼
User Adjusts Time Slider (e.g., 15 min)
     │
     ▼
User Clicks Point on Map
     │
     ▼
handleMapClick(latlng) Triggered
     │
     ▼
fetch('/api/accessibility/isochrone?lat=X&lng=Y&time=15')
     │
     ▼
AccessibilityController.getIsochrone()
     │
     ▼
RoutingService.findReachableArea()
     │
     ├─► Find Nearest Road Node
     │
     ├─► Dijkstra's Algorithm (BFS)
     │   ├─► Traverse Graph Edges
     │   ├─► Calculate Travel Times
     │   └─► Collect Reachable Nodes
     │
     ▼
Turf.js: Create Convex Hull Polygon
     │
     ▼
Return GeoJSON Polygon
     │
     ▼
React State: setIsochrone(data)
     │
     ▼
Map Renders Blue Polygon
     │
     ▼
User Sees Reachable Area
```

## 🎮 User Interaction Flow

### Scenario 1: Viewing Hospital Locations

```
1. User opens http://localhost:5173
2. Map loads centered on Malawi
3. Sidebar shows "Hospitals" (active by default)
4. Red markers appear on map
5. User clicks a marker
6. Popup shows hospital name and details
```

### Scenario 2: Analyzing School Accessibility

```
1. User clicks "Schools" in sidebar
2. Green markers appear for schools
3. User clicks "Catchment Areas"
4. Time slider appears (default: 15 min)
5. User adjusts to 30 minutes
6. User clicks on a rural area
7. Blue polygon shows 30-min reachable area
8. User identifies underserved regions
```

### Scenario 3: Comparing Multiple Facilities

```
1. User enables both "Hospitals" and "Schools"
2. Map shows red and green markers
3. User clicks "Catchment Areas"
4. User clicks near a hospital (red marker)
5. Blue polygon shows hospital's catchment
6. User notes schools (green) within/outside area
7. User identifies service gaps
```

## 🔧 Component Interaction

```
App.jsx (Root)
  │
  ├─► State Management
  │   ├── sidebarOpen
  │   ├── showHospitals
  │   ├── showSchools
  │   ├── showIsochrone
  │   └── isochroneTime
  │
  ├─► Header
  │   └── toggleSidebar()
  │
  ├─► Sidebar
  │   ├── Layer Toggles
  │   ├── Time Slider
  │   └── Analysis Tools
  │
  └─► MapView
      ├── Leaflet Map
      ├── Facility Markers
      ├── Isochrone Polygon
      └── Click Handler
```

## 🚀 Startup Sequence

### When Running `start-dev.bat`

```
1. Script Starts
   │
   ├─► Terminal 1: Backend
   │   ├── cd server
   │   ├── npm run start:dev
   │   ├── NestJS starts
   │   ├── TypeORM connects to SQLite
   │   ├── RoutingService initializes
   │   ├── Builds graph (708,790 nodes)
   │   └── Server ready on :4000
   │
   └─► Terminal 2: Frontend
       ├── npm run dev
       ├── Vite starts
       ├── React app compiles
       └── Dev server ready on :5173

2. User Opens Browser
   │
   ├─► Loads http://localhost:5173
   ├─► React app initializes
   ├─► Fetches facilities from backend
   └─► Map renders with data
```

## 🔍 Routing Algorithm Details

### Graph Structure
```
Node: "lng,lat" (e.g., "34.3015,-13.2543")
  │
  ├─► Properties: { x: lng, y: lat }
  │
  └─► Links (Edges)
      ├─► Target Node
      └─► Weight (travel time in minutes)
          └─► Calculated: (distance_km / speed_kmh) * 60
```

### Pathfinding Process
```
1. User clicks point (lat, lng)
2. Find nearest graph node (naive search)
3. Initialize queue with start node
4. While queue not empty:
   ├─► Pop node with minimum time
   ├─► If time > maxTime: skip
   ├─► Mark as visited
   ├─► Add to reachable points
   └─► Add neighbors to queue
5. Create convex hull around points
6. Return polygon
```

## 📈 Performance Considerations

### Backend
- **Graph Size**: 708,790 nodes, 893,934 links
- **Initialization**: ~9 seconds on startup
- **Query Time**: Varies by travel time and network density
- **Memory**: ~306 MB for database + graph in memory

### Frontend
- **Initial Load**: Fetches all facilities (~1-2 seconds)
- **Map Rendering**: Leaflet handles efficiently
- **Isochrone Calculation**: 1-5 seconds depending on area
- **State Updates**: React re-renders only affected components

## 🎯 Key Integration Points

1. **Vite Proxy**: Seamless API calls without CORS issues
2. **TypeORM**: Automatic entity-to-database mapping
3. **ngraph**: Efficient graph-based routing
4. **Turf.js**: Geospatial calculations (convex hull)
5. **React-Leaflet**: Declarative map components
6. **Leaflet**: Interactive map rendering

## 🔐 Error Handling Flow

```
API Call Fails
     │
     ▼
Catch Block Triggered
     │
     ▼
Console Error Logged
     │
     ▼
State Updated: setError(message)
     │
     ▼
Error UI Rendered
     │
     ├─► User-friendly message
     ├─► Retry button
     └─► Troubleshooting hints
```

This architecture ensures a robust, scalable, and user-friendly geospatial analysis platform!
