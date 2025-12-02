# District Search Feature Guide

## Overview
The district search feature allows users to search for any district in Malawi and view all schools and health facilities within that district boundary.

## Features
- 🔍 **Smart Search**: Autocomplete search bar in the header
- 🗺️ **District Boundaries**: Visual display of selected district with blue boundary
- 📊 **Facility Summary**: Real-time count of schools and health facilities
- 🎯 **Auto-Zoom**: Map automatically zooms to selected district
- 📍 **Facility Markers**: All facilities within district are highlighted

## Setup Instructions

### Step 1: Import District Boundaries
Run the batch script to import geoBoundaries data:
```bash
4-import-districts.bat
```

This will:
- Import all 28 districts from geoBoundaries-MWI-ADM2
- Store district polygons in SQLite database
- Calculate bounding boxes for efficient spatial queries

### Step 2: Start the Application
```bash
start-dev.bat
```

## How to Use

### 1. Search for a District
- Click on the search bar at the top center of the page
- Type a district name (e.g., "Lilongwe", "Blantyre", "Mzuzu")
- Select from the dropdown suggestions

### 2. View District Data
Once selected, you'll see:
- **District boundary** highlighted in blue on the map
- **Info panel** on the top-right showing:
  - 🏥 Number of health facilities
  - 🏫 Number of schools
  - 📍 Total facilities
- **Facility markers** for all schools and health facilities in that district

### 3. Clear Search
- Click the X button in the search bar to clear and return to full map view

## API Endpoints

### Get All Districts
```
GET /api/districts
```
Returns list of all districts with names and IDs.

### Search District
```
GET /api/districts/search?name=Lilongwe
```
Returns district geometry and properties.

### Get Facilities in District
```
GET /api/districts/facilities?name=Lilongwe
```
Returns:
- All facilities within the district boundary
- District geometry
- Summary statistics (schools, health facilities, total)

## Technical Details

### Database Schema
```sql
CREATE TABLE districts (
    id INTEGER PRIMARY KEY,
    shapeName VARCHAR NOT NULL,
    shapeGroup VARCHAR,
    shapeType VARCHAR,
    geometry TEXT, -- GeoJSON string
    area FLOAT,
    minLat FLOAT,
    maxLat FLOAT,
    minLng FLOAT,
    maxLng FLOAT
);
```

### Spatial Query
The feature uses a two-step approach for SQLite:
1. **Bounding box filter**: Quick filter using min/max lat/lng
2. **Point-in-polygon**: Accurate ray-casting algorithm for final filtering

### Frontend Components
- **Header.jsx**: Search bar with autocomplete
- **MapView.jsx**: District boundary rendering and facility display
- **App.jsx**: State management for district selection

## Data Source
- **geoBoundaries-MWI-ADM2**: Administrative level 2 boundaries for Malawi
- **Source**: geoBoundaries.org
- **Format**: GeoJSON (simplified version for better performance)

## Example Districts
- Lilongwe
- Blantyre
- Mzuzu
- Zomba
- Mangochi
- Kasungu
- Salima
- Nkhata Bay
- And 20 more...

## Troubleshooting

### Districts not appearing in search
1. Make sure you ran `4-import-districts.bat`
2. Check that `geospatial.db` exists in the server folder
3. Verify the geoBoundaries file path in `import-districts.ts`

### No facilities showing
1. Ensure facilities were imported (`3-migrate-data.bat`)
2. Check that both schools and health facilities layers are enabled
3. Verify the district name is spelled correctly

### Map not zooming to district
1. Check browser console for errors
2. Ensure Leaflet is properly loaded
3. Verify district geometry is valid GeoJSON

## Future Enhancements
- [ ] Add population data per district
- [ ] Calculate accessibility metrics per district
- [ ] Export district reports
- [ ] Compare multiple districts
- [ ] Add district-level statistics dashboard
