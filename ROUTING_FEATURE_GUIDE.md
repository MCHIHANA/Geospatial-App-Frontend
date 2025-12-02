# 🗺️ Route Planner & Accessibility Analysis Feature

## Overview

The Route Planner feature transforms GeoAccess into a comprehensive accessibility analysis platform, allowing users to calculate travel times, identify underserved areas, and support equity-based decision-making.

---

## ✨ Key Features

### 1. **Origin-Destination Route Planning**
- Enter starting point and destination coordinates
- Use GPS to get current location automatically
- Calculate realistic travel times using road network
- Support for multiple travel modes

### 2. **Travel Mode Selection**
- 🚗 **Driving Mode**: Uses road speed limits and network
- 🚶 **Walking Mode**: Calculates pedestrian travel times (~5 km/h)
- Automatic adjustment of travel time based on mode

### 3. **Real-Time Route Calculation**
- Network-based routing using A* pathfinding algorithm
- Considers actual road conditions and speed limits
- Provides distance and time estimates
- Accessibility status indicator

### 4. **Interactive UI Components**
- Floating action button for quick access
- Collapsible routing panel
- GPS location button
- Visual feedback during calculation

---

## 🎯 How to Use

### Opening the Route Planner

**Method 1: Sidebar Button**
1. Open sidebar
2. Click the blue "Route Planner" button at top of Analysis Tools

**Method 2: Floating Action Button**
1. Look for blue circular button at bottom-left of map
2. Click to open routing panel

### Calculating a Route

**Step 1: Enter Starting Point**
- Type coordinates: `latitude, longitude` (e.g., `-13.9833, 33.7833`)
- OR click "GPS" button to use current location
- OR click on map to get coordinates

**Step 2: Enter Destination**
- Type destination coordinates
- OR click on a facility marker to use as destination
- Format: `latitude, longitude`

**Step 3: Select Travel Mode**
- Click "Driving" for vehicle travel
- Click "Walking" for pedestrian travel

**Step 4: Calculate**
- Click "Calculate Route" button
- Wait for calculation (usually 1-3 seconds)
- View results in panel

### Understanding Results

**Travel Time Display:**
- Shows estimated time in minutes or hours
- Example: "25 min" or "1h 15min"

**Distance:**
- Displays route distance in kilometers
- Example: "12.5 km"

**Accessibility Status:**
- ✓ Route accessible (< 2 hours)
- ⚠ Limited accessibility (> 2 hours)

---

## 🔧 Technical Implementation

### Backend API Endpoints

#### 1. Route Calculation
```
GET /api/accessibility/route
Parameters:
  - originLat: Starting latitude
  - originLng: Starting longitude
  - destLat: Destination latitude
  - destLng: Destination longitude
  - mode: 'driving' or 'walking'

Response:
{
  "success": true,
  "travelTime": 25.5,
  "distance": 12500,
  "accessible": true,
  "mode": "driving",
  "pathNodes": 45
}
```

#### 2. Underserved Areas (Future)
```
GET /api/accessibility/underserved
Parameters:
  - facilityType: 'hospital' or 'school'
  - maxTime: Maximum acceptable travel time (minutes)

Response:
{
  "facilityType": "hospital",
  "threshold": 30,
  "underservedRegions": [...]
}
```

### Frontend Components

**RoutingPanel.jsx**
- Input fields for origin/destination
- GPS location button
- Travel mode selector
- Calculate button
- Results display

**Integration in App.jsx**
- State management for routing
- Floating action button
- Panel visibility control

---

## 🎨 UI/UX Features

### Visual Design
- **Blue gradient** theme matching brand
- **Glassmorphism** effect for modern look
- **Smooth animations** on interactions
- **Clear iconography** (car, walking, navigation)

### User Feedback
- Loading state during calculation
- Error messages for invalid input
- Success indicators for completed routes
- Helpful tips and instructions

### Accessibility
- Clear labels and instructions
- Keyboard navigation support
- High contrast colors
- Descriptive error messages

---

## 📊 Use Cases

### 1. **Individual Travel Planning**
**Scenario:** Resident needs to visit nearest hospital

**Steps:**
1. Use GPS to get current location
2. Click on hospital marker for destination
3. Select "Driving" or "Walking"
4. Calculate route
5. See if accessible within reasonable time

**Outcome:** Informed decision about which facility to visit

### 2. **Emergency Response Planning**
**Scenario:** Planner assessing ambulance response times

**Steps:**
1. Enter hospital location as origin
2. Enter remote community as destination
3. Select "Driving" mode
4. Calculate multiple routes to different areas
5. Identify areas with >30 min response time

**Outcome:** Prioritize new ambulance stations or hospitals

### 3. **School Accessibility Analysis**
**Scenario:** Education planner evaluating school access

**Steps:**
1. Enter village center as origin
2. Enter school location as destination
3. Select "Walking" mode (for children)
4. Calculate travel time
5. Assess if within acceptable range (e.g., <45 min)

**Outcome:** Identify need for new schools or transport

### 4. **Equity Assessment**
**Scenario:** Policymaker comparing urban vs rural access

**Steps:**
1. Calculate routes from urban area to hospital
2. Calculate routes from rural area to hospital
3. Compare travel times
4. Document disparities
5. Support funding proposals

**Outcome:** Evidence-based policy decisions

---

## 🚀 Advanced Features (Implemented)

### 1. GPS Integration
- Automatic location detection
- Browser geolocation API
- Fallback to manual entry
- Error handling for denied permissions

### 2. Network-Based Routing
- Uses actual road network (700,000+ segments)
- A* pathfinding algorithm
- Speed limit consideration
- Realistic travel time estimates

### 3. Multi-Modal Support
- Driving mode (vehicle speeds)
- Walking mode (pedestrian speeds)
- Easy mode switching
- Automatic time recalculation

### 4. Accessibility Scoring
- Routes classified as accessible/limited
- 2-hour threshold for accessibility
- Visual indicators (green/red)
- Supports equity analysis

---

## 🔮 Future Enhancements

### Phase 2 Features

**1. Visual Route Display**
- Draw route line on map
- Highlight path taken
- Show waypoints
- Turn-by-turn directions

**2. Multiple Routes**
- Calculate alternative routes
- Compare travel times
- Show fastest/shortest options
- Avoid certain areas

**3. Batch Analysis**
- Calculate routes to all facilities
- Find nearest facility automatically
- Generate accessibility matrix
- Export results as CSV

**4. Underserved Area Mapping**
- Automatic detection of service deserts
- Red overlay on map
- Population-weighted analysis
- Priority ranking for interventions

**5. Public Transport Mode**
- Bus/minibus routes
- Combined walking + transit
- Schedule consideration
- Realistic multi-modal times

**6. Time-of-Day Analysis**
- Traffic pattern consideration
- Peak vs off-peak times
- Seasonal variations
- Emergency vs routine access

---

## 📈 Impact on Problem-Solving

### Before Route Planner
- ❌ Simple distance measurements
- ❌ No travel time estimates
- ❌ Manual calculations required
- ❌ Limited analysis capabilities

### After Route Planner
- ✅ Realistic travel time calculations
- ✅ Network-based routing
- ✅ Multi-modal support
- ✅ Interactive analysis tools
- ✅ Evidence for decision-making

### Key Benefits

**For Planners:**
- Quick accessibility assessments
- Data-driven site selection
- Infrastructure prioritization
- Resource allocation support

**For Policymakers:**
- Evidence-based decisions
- Equity gap identification
- Funding justification
- Progress monitoring

**For Communities:**
- Understanding service access
- Advocacy with data
- Identifying barriers
- Requesting improvements

**For Researchers:**
- Spatial analysis capabilities
- Comparative studies
- Longitudinal tracking
- Publication-ready data

---

## 🎓 Best Practices

### For Accurate Results

1. **Use Precise Coordinates**
   - Get coordinates from map clicks
   - Use GPS for current location
   - Verify coordinates before calculating

2. **Choose Appropriate Mode**
   - Driving for vehicle access
   - Walking for pedestrian analysis
   - Consider target population

3. **Interpret Results Contextually**
   - Consider terrain and weather
   - Account for road conditions
   - Factor in time of day

4. **Document Findings**
   - Screenshot results
   - Record coordinates used
   - Note date and conditions
   - Save for reports

### For Analysis Projects

1. **Systematic Approach**
   - Define study area
   - Select representative points
   - Use consistent methodology
   - Document all calculations

2. **Multiple Scenarios**
   - Test different origins
   - Compare facility types
   - Analyze various times
   - Consider alternatives

3. **Validation**
   - Cross-check with local knowledge
   - Verify against field observations
   - Compare with other tools
   - Adjust for local conditions

---

## 🐛 Troubleshooting

### "Could not find route"
**Cause:** Points too far from road network
**Solution:** 
- Move points closer to roads
- Check coordinates are correct
- Verify points are in Malawi

### "Unable to get your location"
**Cause:** GPS permission denied or unavailable
**Solution:**
- Allow location access in browser
- Enter coordinates manually
- Use map click to get coordinates

### Calculation takes too long
**Cause:** Complex route or distant points
**Solution:**
- Wait up to 10 seconds
- Check backend is running
- Verify network connection
- Try shorter distances

### Unrealistic travel times
**Cause:** Road data or speed limits
**Solution:**
- Verify mode selection (driving/walking)
- Check if route uses appropriate roads
- Consider local conditions
- Report issues for data improvement

---

## 📋 Quick Reference

### Coordinate Format
```
Latitude, Longitude
Example: -13.9833, 33.7833
```

### Travel Modes
- **Driving**: ~40 km/h average
- **Walking**: ~5 km/h average

### Accessibility Threshold
- **Accessible**: < 2 hours
- **Limited**: > 2 hours

### Keyboard Shortcuts
- **Enter**: Calculate route (when in input field)
- **Esc**: Close routing panel

---

## 🎉 Summary

The Route Planner feature transforms GeoAccess from a simple mapping tool into a **comprehensive accessibility analysis platform**. It directly addresses the core problem of spatial inequity by providing:

✅ **Realistic travel time calculations**
✅ **Multi-modal analysis**
✅ **Interactive planning tools**
✅ **Evidence-based decision support**
✅ **Equity-focused insights**

**This feature is essential for identifying underserved areas, prioritizing infrastructure improvements, and promoting fairer distribution of public services across Malawi.**

---

*Ready to analyze accessibility and promote equitable access to essential services!*
