# Quick Start Guide - GeoAccess

## 🚀 Get Started in 3 Steps

### Step 1: Verify Setup
Run the verification script to check your environment:
```bash
verify-setup.bat
```

This will check:
- ✓ Node.js installation
- ✓ npm installation  
- ✓ Database file
- ✓ Dependencies

### Step 2: Start the Application
Double-click or run:
```bash
start-dev.bat
```

This will:
1. Start the backend server on port 4000
2. Start the frontend on port 5173
3. Open two command windows (one for each server)

### Step 3: Open Your Browser
Navigate to: **http://localhost:5173**

---

## 🎯 First Time Using the App?

### View Facilities
1. Look at the **sidebar** on the left
2. Toggle layers to show/hide:
   - 🏥 **Hospitals** (red markers)
   - 🎓 **Schools** (green markers)

### Analyze Catchment Areas
1. Click **"Catchment Areas"** in the sidebar
2. Adjust the **travel time slider** (5-60 minutes)
3. **Click anywhere on the map**
4. See the blue area showing where people can reach within that time

---

## ⚠️ Troubleshooting

### "Port 4000 already in use"
```bash
# Find and kill the process
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

### Backend not connecting
1. Make sure both command windows are running
2. Wait 10-15 seconds for the backend to fully start
3. Check the backend window for "Nest application successfully started"

### Map not loading
1. Check your internet connection (map tiles load from online)
2. Refresh the page (Ctrl + R)
3. Check browser console for errors (F12)

---

## 📊 Understanding the Data

### What am I looking at?
- **Red markers**: Hospital locations
- **Green markers**: School locations  
- **Blue polygon**: Area reachable within selected travel time
- **Blue dot**: Your selected starting point

### How is travel time calculated?
- Uses actual road network data
- Considers road types and speed limits
- Calculates realistic driving times
- Not straight-line distance!

---

## 🛑 Stopping the Application

Press any key in the main command window, or close both server windows.

---

## 📖 Need More Help?

See **SETUP_GUIDE.md** for:
- Detailed feature documentation
- API endpoints
- Project structure
- Development guide
- Advanced troubleshooting

---

## 🎉 You're Ready!

The application is designed to help identify:
- ✓ Underserved communities
- ✓ Service accessibility gaps
- ✓ Areas needing new facilities
- ✓ Equitable service distribution

Start exploring and analyzing accessibility in your region!
