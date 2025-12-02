# GeoAccess - Geospatial Accessibility Analysis Platform

![GeoAccess](https://img.shields.io/badge/GeoAccess-v1.0.0-blue)
![Node](https://img.shields.io/badge/Node.js-v16+-green)
![React](https://img.shields.io/badge/React-19-blue)
![NestJS](https://img.shields.io/badge/NestJS-11-red)

## 📋 Overview

**GeoAccess** is a comprehensive web application designed to analyze and visualize spatial accessibility to essential public services such as hospitals and schools. It addresses the critical challenge of identifying service gaps and underserved communities through data-driven geospatial analysis.

### Problem Statement
Access to essential public services is uneven across communities, leading to significant disparities. Residents in remote or densely populated areas often experience longer travel times to reach hospitals or schools, reducing their ability to obtain timely healthcare or equitable educational opportunities. This project provides planners and policymakers with practical tools to:
- Identify service deserts and accessibility gaps
- Analyze travel-time catchments using realistic road networks
- Support equity-based infrastructure planning decisions
- Visualize underserved areas and prioritize improvements

## ✨ Key Features

- 🗺️ **Interactive Map Visualization** - View facilities on an interactive Leaflet map
- 🏥 **Multi-Layer Support** - Toggle hospitals, schools, and population data
- ⏱️ **Isochrone Analysis** - Calculate and visualize travel-time catchment areas
- 📊 **Real-time Statistics** - View accessibility metrics and underserved areas
- 🛣️ **Network-Based Routing** - Uses actual road networks for realistic travel times
- 🎯 **Click-to-Analyze** - Interactive point selection for catchment analysis

## 🚀 Quick Start

### Prerequisites
Before you begin, ensure you have the following installed:
- Node.js v16 or higher
- npm (comes with Node.js)

### Installation & Running

**Option 1: Automated Setup (Recommended)**
```bash
# 1. Verify your environment
verify-setup.bat

# 2. Start the application
start-dev.bat

# 3. Open browser to http://localhost:5173
```

**Option 2: Manual Setup**
```bash
# Install dependencies
npm install
cd server && npm install && cd ..

# Start backend (Terminal 1)
cd server
npm run start:dev

# Start frontend (Terminal 2)
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4000
- **Health Check**: http://localhost:4000/health

## 📖 Documentation

- **[QUICK_START.md](QUICK_START.md)** - Get started in 3 steps
- **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Comprehensive setup and usage guide

## 🏗️ Technology Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM with SQLite database
- **ngraph** - Graph-based routing engine
- **Turf.js** - Geospatial analysis library

### Frontend
- **React 19** - UI framework
- **Leaflet** - Interactive mapping library
- **React-Leaflet** - React components for Leaflet
- **Vite** - Fast development build tool
- **Lucide React** - Icon library

## 📁 Project Structure

```
geospatial-app/
├── server/                      # Backend (NestJS)
│   ├── src/
│   │   ├── accessibility/       # Routing & isochrone analysis
│   │   ├── facilities/          # Facilities API endpoints
│   │   ├── entities/            # Database entities
│   │   └── main.ts              # Application entry point
│   └── geospatial.db            # SQLite database (306 MB)
├── src/                         # Frontend (React)
│   ├── components/
│   │   ├── Dashboard/           # Statistics panel
│   │   ├── Layout/              # Header & Sidebar
│   │   └── Map/                 # Map visualization
│   ├── App.jsx                  # Main application
│   └── main.jsx                 # React entry point
├── start-dev.bat                # Development startup script
├── verify-setup.bat             # Environment verification
└── vite.config.js               # Vite configuration
```

## 🔌 API Endpoints

### Get All Facilities
```http
GET /facilities
```
Returns GeoJSON FeatureCollection of all hospitals and schools.

### Get Isochrone (Catchment Area)
```http
GET /accessibility/isochrone?lat={latitude}&lng={longitude}&time={minutes}
```
Returns GeoJSON polygon showing area reachable within specified travel time.

### Health Check
```http
GET /health
```
Returns API status and version information.

## 🎯 Usage Examples

### Viewing Facilities
1. Open the application
2. Use sidebar to toggle layers:
   - 🏥 Hospitals (red markers)
   - 🎓 Schools (green markers)

### Analyzing Catchment Areas
1. Click "Catchment Areas" in sidebar
2. Adjust travel time slider (5-60 minutes)
3. Click any point on the map
4. View blue polygon showing reachable area

### Understanding Results
- **Blue polygon**: Area accessible within selected time
- **Blue dot**: Selected starting point
- Travel times based on actual road networks and speed limits

## 🛠️ Development

### Building for Production
```bash
# Build frontend
npm run build

# Build backend
cd server
npm run build
```

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd server
npm test
```

## ⚠️ Troubleshooting

### Port Already in Use
```bash
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

### PowerShell Execution Policy
Use `cmd /c` prefix for npm commands if PowerShell blocks scripts.

### Database Issues
The SQLite database (306 MB) contains pre-loaded road network and facility data. If corrupted, delete and restart the backend to recreate.

## 🔮 Future Enhancements

- [ ] Population density heatmaps
- [ ] Multi-modal transportation (walking, cycling, transit)
- [ ] Accessibility scoring algorithm
- [ ] Export analysis results (PDF, CSV)
- [ ] Real-time traffic integration
- [ ] Service demand vs. supply analysis
- [ ] Mobile-responsive design
- [ ] User authentication and saved analyses

## 📄 License

This project is licensed under the UNLICENSED license.

## 🤝 Contributing

This is an academic/research project. For questions or contributions, please review the code documentation and setup guides.

## 📧 Support

For issues:
1. Check [QUICK_START.md](QUICK_START.md) troubleshooting section
2. Review [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed documentation
3. Check browser console (F12) for frontend errors
4. Check backend terminal for server errors

---

**Built to promote equitable access to essential public services through data-driven spatial analysis.**
