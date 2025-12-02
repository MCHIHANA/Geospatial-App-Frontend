# GeoAccess - Geospatial Accessibility Analysis Platform

## Overview
GeoAccess is a web application designed to analyze and visualize spatial accessibility to essential public services (hospitals and schools). It helps identify service gaps, underserved areas, and supports equity-based planning decisions.

## Features
- **Interactive Map Visualization**: View hospitals and schools on an interactive map
- **Catchment Area Analysis**: Click on any point to see areas reachable within a specified travel time
- **Layer Control**: Toggle visibility of hospitals, schools, and population data
- **Travel Time Analysis**: Adjust travel time thresholds (5-60 minutes)
- **Real-time Statistics**: View accessibility metrics and underserved areas

## Technology Stack
### Backend
- NestJS (Node.js framework)
- TypeORM with SQLite database
- Geospatial routing with ngraph
- Turf.js for spatial analysis

### Frontend
- React 19
- Leaflet & React-Leaflet for mapping
- Vite for development
- Lucide React for icons

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm

### Quick Start

1. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd server
   npm install
   cd ..
   ```

2. **Start the Application**
   
   **Option A: Using the startup script (Windows)**
   ```bash
   start-dev.bat
   ```
   
   **Option B: Manual start**
   ```bash
   # Terminal 1 - Start Backend
   cd server
   npm run start:dev

   # Terminal 2 - Start Frontend
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Usage Guide

### Viewing Facilities
1. Use the sidebar to toggle layers:
   - **Hospitals** (red markers)
   - **Schools** (green markers)
   - **Population** (coming soon)

### Analyzing Catchment Areas
1. Click "Catchment Areas" in the sidebar
2. Adjust the travel time slider (5-60 minutes)
3. Click anywhere on the map to see the reachable area
4. Blue polygon shows areas accessible within the specified time

### Understanding the Data
- The application uses road network data to calculate realistic travel times
- Travel times consider road types and speed limits
- Isochrone polygons show areas reachable by road within the time threshold

## API Endpoints

### Get All Facilities
```
GET /facilities
Returns: GeoJSON FeatureCollection of all hospitals and schools
```

### Get Isochrone (Catchment Area)
```
GET /accessibility/isochrone?lat={latitude}&lng={longitude}&time={minutes}
Parameters:
  - lat: Latitude of starting point
  - lng: Longitude of starting point
  - time: Travel time in minutes
Returns: GeoJSON polygon of reachable area
```

## Project Structure
```
geospatial-app/
├── server/                 # Backend (NestJS)
│   ├── src/
│   │   ├── accessibility/  # Routing & isochrone analysis
│   │   ├── facilities/     # Facilities API
│   │   ├── entities/       # Database entities
│   │   └── main.ts         # Entry point
│   └── geospatial.db       # SQLite database
├── src/                    # Frontend (React)
│   ├── components/
│   │   ├── Dashboard/      # Statistics panel
│   │   ├── Layout/         # Header & Sidebar
│   │   └── Map/            # Map visualization
│   └── App.jsx             # Main app component
└── start-dev.bat           # Development startup script
```

## Troubleshooting

### Port Already in Use
If you see "EADDRINUSE" error:
```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### PowerShell Script Execution Error
If npm commands fail in PowerShell:
```bash
# Use cmd instead
cmd /c npm install
cmd /c npm run dev
```

### Database Issues
The SQLite database should be pre-populated with data. If you need to reset:
1. Delete `server/geospatial.db`
2. Restart the backend (it will recreate the database)
3. Run data import scripts if available

## Development

### Adding New Features
- Backend routes: Add controllers in `server/src/`
- Frontend components: Add to `src/components/`
- Database entities: Define in `server/src/entities/`

### Building for Production
```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

## Future Enhancements
- Population density visualization
- Accessibility scoring algorithm
- Export analysis results
- Multi-modal transportation (walking, cycling, public transit)
- Service demand vs. supply analysis
- Integration with real-time traffic data

## Support
For issues or questions, please check the troubleshooting section or review the code documentation.
