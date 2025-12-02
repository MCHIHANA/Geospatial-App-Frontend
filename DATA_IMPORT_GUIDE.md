# Data Import Guide for GeoAccess

## Current Data Status

You have the following data files:
- ✅ **Health Facilities** - `hotosm_mwi_health_facilities_points_shp`
- ✅ **Populated Places** - `hotosm_mwi_populated_places_polygons_shp`
- ✅ **Roads** - `hotosm_mwi_roads_lines_shp`
- ✅ **Administrative Boundaries** - `geoBoundaries-MWI-ADM2-all`
- ❓ **Schools** - Need to check or download

## Step 1: Check for Schools in Existing Data

Run this command to see if schools are already in your data:

```bash
cd server
npm run check:schools
```

This will search through your existing shapefiles for any school-related data.

## Step 2: Import Schools

### Option A: If Schools Found in Existing Data
```bash
cd server
npm run import:schools
```

### Option B: Download Schools Data

If no schools found, download from one of these sources:

#### **HOT Export Tool (Recommended)**
1. Go to: https://export.hotosm.org/
2. Click "Start Exporting"
3. Search for "Malawi" in the search box
4. Draw a box around Malawi or select the country boundary
5. In "Select File Formats", choose **Shapefile (.shp)**
6. In "Tag Tree", expand and select:
   - `amenity = school`
   - `amenity = kindergarten`
   - `amenity = college`
   - `amenity = university`
7. Click "Create Export"
8. Wait for processing (may take a few minutes)
9. Download the ZIP file
10. Extract to: `C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\`
11. Rename folder to: `hotosm_mwi_schools_points_shp`
12. Run: `npm run import:schools`

#### **Humanitarian Data Exchange (HDX)**
1. Go to: https://data.humdata.org/
2. Search: "Malawi education facilities" or "Malawi schools"
3. Download the shapefile
4. Extract to the Spatial Data folder
5. Run: `npm run import:schools`

#### **Geofabrik (Advanced)**
1. Go to: https://download.geofabrik.de/africa/malawi.html
2. Download "malawi-latest-free.shp.zip"
3. Extract and use QGIS to filter schools:
   ```sql
   "amenity" = 'school' OR "amenity" = 'kindergarten' OR "amenity" = 'college'
   ```
4. Export filtered layer as new shapefile
5. Place in Spatial Data folder
6. Run: `npm run import:schools`

## Step 3: Import All Data

Once you have all the data files, run the complete import:

```bash
cd server
npm run import:data
```

This will import:
1. Health facilities (hospitals, clinics, pharmacies)
2. Schools (if available)
3. Populated places (for population data)
4. Roads (for routing network)

**Note**: This may take 10-30 minutes depending on data size.

## Step 4: Verify Import

After import completes, you'll see a summary:
```
Database Summary:
- Health Facilities: XXX
- Roads: XXX
- Populated Places: XXX
```

## Step 5: Restart Backend

After importing data, restart your backend server:

```bash
cd server
npm run start:dev
```

Wait for:
```
Graph built with 708790 nodes and 893934 links.
[Nest] ... LOG [NestApplication] Nest application successfully started
```

## Step 6: View in Application

1. Open http://localhost:5173
2. Toggle layers in sidebar:
   - 🏥 Hospitals (red markers)
   - 🎓 Schools (green markers)
   - 👥 Population (blue circles)
3. Click markers to see details

## Troubleshooting

### "Shapefile not found"
- Check the file path in the error message
- Verify files are in: `C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\`
- Make sure folder names match exactly

### "No schools found"
- Schools might be in the health facilities file
- Try running `npm run check:schools` first
- Download dedicated schools data from HOT Export Tool

### Import takes too long
- Roads import can take 10-20 minutes (normal)
- Don't interrupt the process
- Check console for progress messages

### Database errors
- Delete `geospatial.db` and try again
- Make sure no other process is using the database
- Check disk space (need ~500 MB free)

## Data Sources Reference

### Current Data Location
```
C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\
├── hotosm_mwi_health_facilities_points_shp/
├── hotosm_mwi_populated_places_polygons_shp/
├── hotosm_mwi_roads_lines_shp/
├── geoBoundaries-MWI-ADM2-all/
└── [schools data - to be added]
```

### Recommended Data Sources
- **HOT OSM**: https://export.hotosm.org/ (Best for facilities)
- **HDX**: https://data.humdata.org/ (Curated datasets)
- **Geofabrik**: https://download.geofabrik.de/ (Complete OSM data)
- **geoBoundaries**: https://www.geoboundaries.org/ (Administrative boundaries)

## Quick Commands Reference

```bash
# Check for schools in existing data
npm run check:schools

# Import only schools
npm run import:schools

# Import all data
npm run import:data

# Start backend after import
npm run start:dev
```

## Expected Results

After successful import, you should have:
- **500-2000** health facilities (hospitals, clinics, pharmacies)
- **1000-5000** schools (primary, secondary, universities)
- **10,000-30,000** populated places
- **50,000-200,000** road segments

The exact numbers depend on the data coverage and quality for Malawi.

## Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Verify file paths and names
3. Ensure you have enough disk space
4. Try importing one dataset at a time
5. Check the backend logs for detailed errors
