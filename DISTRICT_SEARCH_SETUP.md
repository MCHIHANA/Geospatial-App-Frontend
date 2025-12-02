# District Search Feature - Setup Instructions

## ✅ What Has Been Implemented

### Backend Components
1. **District Entity** (`server/src/entities/district.entity.ts`)
   - Stores district boundaries with PostGIS geometry
   - Fields: id, shapeName, shapeGroup, geometry, area

2. **Districts Module** (`server/src/districts/`)
   - Controller: Handles API requests
   - Service: Business logic for district queries
   - Module: Integrates with NestJS

3. **Import Script** (`server/src/scripts/import-districts.ts`)
   - Reads geoBoundaries GeoJSON file
   - Imports 28 Malawi districts into PostgreSQL

4. **API Endpoints**
   - `GET /api/districts` - List all districts
   - `GET /api/districts/search?name=Lilongwe` - Get district details
   - `GET /api/districts/facilities?name=Lilongwe` - Get facilities in district

### Frontend Components
1. **Enhanced Header** (`src/components/Layout/Header.jsx`)
   - Search bar with autocomplete
   - Real-time district filtering
   - Loading states

2. **Updated MapView** (`src/components/Map/MapView.jsx`)
   - District boundary rendering (blue polygon)
   - Auto-zoom to selected district
   - District info panel with statistics
   - Filtered facility display

3. **App Integration** (`src/App.jsx`)
   - State management for district selection
   - Auto-enable facility layers on district select

## 🚀 How to Run

### Step 1: Import Districts
**Run this batch file:**
```
4-import-districts.bat
```

This will import all 28 districts from:
`C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\geoBoundaries-MWI-ADM2-all\geoBoundaries-MWI-ADM2_simplified.geojson`

### Step 2: Start the Application
```
start-dev.bat
```

## 📖 How to Use

1. **Open the application** in your browser (http://localhost:5173)

2. **Search for a district:**
   - Look at the top center of the page
   - You'll see a search bar with placeholder "Search district (e.g., Lilongwe, Blantyre)..."
   - Start typing a district name
   - Select from the dropdown

3. **View results:**
   - District boundary appears in blue
   - Info panel shows on top-right with:
     - 🏥 Health Facilities count
     - 🏫 Schools count
     - 📍 Total facilities
   - All facilities within the district are displayed on the map

4. **Clear search:**
   - Click the X button in the search bar
   - Returns to full map view

## 🎯 Features

### Smart Search
- Autocomplete dropdown
- Case-insensitive matching
- Shows district name and region

### Visual Display
- District boundary highlighted in blue
- Automatic map zoom to fit district
- Facility markers color-coded:
  - 🔴 Red: Health facilities
  - 🟢 Green: Schools

### Statistics Panel
- Real-time facility counts
- Separated by type (schools vs health)
- Total count

### Spatial Query
Uses PostGIS to find facilities within district boundaries:
```sql
ST_Within(
    ST_SetSRID(ST_MakePoint(lng, lat), 4326),
    district_geometry
)
```

## 📊 Example Districts

Try searching for:
- Lilongwe (Capital district)
- Blantyre (Commercial hub)
- Mzuzu (Northern region)
- Zomba (Former capital)
- Mangochi (Lake district)
- Kasungu (Central region)
- Salima (Lakeshore)
- Nkhata Bay (Tourism)

## 🔧 Technical Details

### Database Schema
```sql
CREATE TABLE districts (
    id SERIAL PRIMARY KEY,
    shapeName VARCHAR NOT NULL,
    shapeGroup VARCHAR,
    shapeType VARCHAR,
    geometry GEOMETRY(Polygon, 4326),
    area FLOAT
);
```

### Data Flow
1. User types in search bar
2. Frontend filters district list
3. User selects district
4. API call: `/api/districts/facilities?name=DistrictName`
5. Backend queries PostGIS for facilities within boundary
6. Returns GeoJSON with facilities + district geometry + summary
7. Frontend displays on map with info panel

## 🐛 Troubleshooting

### Search bar not showing
- Check that Header component is receiving `onDistrictSelect` prop
- Verify browser console for errors

### No districts in dropdown
- Run `4-import-districts.bat` first
- Check PostgreSQL is running
- Verify backend is running on port 4000

### No facilities showing
- Ensure facilities were imported (`3-migrate-data.bat`)
- Check that layers are enabled in sidebar
- Verify district name spelling

### Map not zooming
- Check browser console for Leaflet errors
- Ensure district geometry is valid
- Try refreshing the page

## 📁 Files Modified/Created

### Backend
- ✅ `server/src/entities/district.entity.ts` (NEW)
- ✅ `server/src/districts/districts.controller.ts` (NEW)
- ✅ `server/src/districts/districts.service.ts` (NEW)
- ✅ `server/src/districts/districts.module.ts` (NEW)
- ✅ `server/src/scripts/import-districts.ts` (NEW)
- ✅ `server/src/app.module.ts` (UPDATED - added DistrictsModule)
- ✅ `server/package.json` (UPDATED - added import:districts script)

### Frontend
- ✅ `src/components/Layout/Header.jsx` (UPDATED - added search bar)
- ✅ `src/components/Map/MapView.jsx` (UPDATED - district display)
- ✅ `src/App.jsx` (UPDATED - district state management)

### Scripts & Docs
- ✅ `4-import-districts.bat` (NEW)
- ✅ `DISTRICT_SEARCH_GUIDE.md` (NEW)
- ✅ `DISTRICT_SEARCH_SETUP.md` (NEW - this file)

## ✨ Next Steps

After running the setup:
1. Test the search functionality
2. Try different districts
3. Verify facility counts are accurate
4. Check map zoom behavior
5. Test clearing the search

Enjoy exploring Malawi's districts! 🇲🇼
