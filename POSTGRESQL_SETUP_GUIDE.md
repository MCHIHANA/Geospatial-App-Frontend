# PostgreSQL + PostGIS Setup Guide for GeoAccess

## Prerequisites

You mentioned you have:
- ✅ PostgreSQL 18 installed
- ✅ PostGIS extension available
- ✅ Password: 1234
- ✅ New road data in: `C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\roads`

---

## Step 1: Create Database and Enable PostGIS

Open **pgAdmin** or **psql** command line:

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE geoaccess;

-- Connect to the new database
\c geoaccess

-- Enable PostGIS extension
CREATE EXTENSION postgis;

-- Enable pgRouting extension (for advanced routing)
CREATE EXTENSION pgrouting;

-- Verify extensions
SELECT PostGIS_Version();
```

---

## Step 2: Import Road Data Using shp2pgsql

The road shapefile is 176 MB, so we'll use the PostGIS `shp2pgsql` tool:

### Option A: Using Command Line

```bash
# Navigate to the roads folder
cd "C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\roads"

# Convert shapefile to SQL and import
shp2pgsql -I -s 4326 hotosm_mwi_roads_lines_shp.shp public.road | psql -U postgres -d geoaccess

# This will:
# -I: Create spatial index
# -s 4326: Set SRID to WGS84
# public.road: Table name
```

### Option B: Using pgAdmin

1. Right-click on `geoaccess` database
2. Select **PostGIS Shapefile Import/Export Manager**
3. Click **Add File**
4. Browse to: `C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\roads\hotosm_mwi_roads_lines_shp.shp`
5. Set:
   - Schema: `public`
   - Table: `road`
   - SRID: `4326`
   - Create spatial index: ✅ Yes
6. Click **Import**

**Note:** This may take 5-10 minutes due to file size.

---

## Step 3: Create Routing Topology

After importing, create the network topology for routing:

```sql
-- Add source and target columns
ALTER TABLE road ADD COLUMN source INTEGER;
ALTER TABLE road ADD COLUMN target INTEGER;

-- Create topology (this may take 10-20 minutes for large datasets)
SELECT pgr_createTopology('road', 0.00001, 'geometry', 'id');

-- Analyze the topology
SELECT pgr_analyzeGraph('road', 0.00001, 'geometry', 'id');

-- Create indexes for faster routing
CREATE INDEX road_source_idx ON road(source);
CREATE INDEX road_target_idx ON road(target);
CREATE INDEX road_geometry_idx ON road USING GIST(geometry);
```

---

## Step 4: Add Speed and Cost Columns

```sql
-- Add cost columns for routing
ALTER TABLE road ADD COLUMN cost DOUBLE PRECISION;
ALTER TABLE road ADD COLUMN reverse_cost DOUBLE PRECISION;

-- Calculate cost based on length and speed
-- Assuming average speeds based on road type
UPDATE road SET cost = 
    CASE 
        WHEN type LIKE '%motorway%' THEN ST_Length(geometry::geography) / (100000.0/60.0)  -- 100 km/h
        WHEN type LIKE '%trunk%' THEN ST_Length(geometry::geography) / (80000.0/60.0)      -- 80 km/h
        WHEN type LIKE '%primary%' THEN ST_Length(geometry::geography) / (60000.0/60.0)    -- 60 km/h
        WHEN type LIKE '%secondary%' THEN ST_Length(geometry::geography) / (50000.0/60.0)  -- 50 km/h
        WHEN type LIKE '%tertiary%' THEN ST_Length(geometry::geography) / (40000.0/60.0)   -- 40 km/h
        WHEN type LIKE '%residential%' THEN ST_Length(geometry::geography) / (30000.0/60.0) -- 30 km/h
        ELSE ST_Length(geometry::geography) / (30000.0/60.0)  -- Default 30 km/h
    END;

-- Set reverse cost (same as cost for bidirectional roads)
UPDATE road SET reverse_cost = cost;

-- For one-way streets, set reverse_cost to -1 (if you have oneway data)
-- UPDATE road SET reverse_cost = -1 WHERE oneway = 'yes';
```

---

## Step 5: Import Facilities and Population Data

Now import your existing data from SQLite to PostgreSQL:

### Using the Import Script

I'll create a migration script for you. Run:

```bash
cd server
npm run migrate:sqlite-to-postgres
```

---

## Step 6: Update Application Configuration

The `.env` file is already created with:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=geoaccess
```

---

## Step 7: Test the Setup

```sql
-- Check road count
SELECT COUNT(*) FROM road;

-- Check if topology is created
SELECT COUNT(*) FROM road WHERE source IS NOT NULL;

-- Test a simple route query
SELECT * FROM pgr_dijkstra(
    'SELECT id, source, target, cost, reverse_cost FROM road',
    1, 100, directed := false
) LIMIT 10;

-- Check spatial index
SELECT tablename, indexname FROM pg_indexes WHERE tablename = 'road';
```

---

## Step 8: Restart Backend

```bash
cd server
npm run start:dev
```

You should see:
```
✓ Connected to PostgreSQL database: geoaccess
✓ PostGIS version: 3.x
✓ pgRouting enabled
✓ Road network loaded: XXXXX segments
```

---

## Troubleshooting

### "shp2pgsql command not found"

**Solution:** Add PostGIS bin folder to PATH:
```
C:\Program Files\PostgreSQL\18\bin
```

### "Extension postgis does not exist"

**Solution:** Install PostGIS:
1. Download from: https://postgis.net/windows_downloads/
2. Run installer
3. Select PostgreSQL 18
4. Restart PostgreSQL service

### "Permission denied"

**Solution:** Run as administrator or check PostgreSQL user permissions:
```sql
GRANT ALL PRIVILEGES ON DATABASE geoaccess TO postgres;
```

### Import is very slow

**Solution:** This is normal for 176 MB of data. Expected time:
- Import: 5-10 minutes
- Topology creation: 10-20 minutes
- Total: ~30 minutes

### "Out of memory"

**Solution:** Increase PostgreSQL memory settings in `postgresql.conf`:
```
shared_buffers = 256MB
work_mem = 64MB
maintenance_work_mem = 256MB
```

---

## Verification Checklist

After setup, verify:

- [ ] Database `geoaccess` created
- [ ] PostGIS extension enabled
- [ ] pgRouting extension enabled
- [ ] Road table has data (`SELECT COUNT(*) FROM road;`)
- [ ] Topology created (`source` and `target` columns populated)
- [ ] Spatial indexes created
- [ ] Cost columns calculated
- [ ] Backend connects successfully
- [ ] Route calculation works

---

## Expected Results

After successful setup:

**Database Size:** ~500 MB - 1 GB
**Road Segments:** ~400,000 - 500,000
**Topology Nodes:** ~300,000 - 400,000
**Query Performance:** 
- Nearest road: < 10ms
- Route calculation: 100ms - 2s
- Isochrone: 1s - 5s

---

## Next Steps

Once PostgreSQL is set up:

1. ✅ Road data imported
2. ✅ Topology created
3. ✅ Backend configured
4. ✅ Test routing between major cities
5. ✅ Verify catchment area analysis works

---

## Quick Start Commands

```bash
# 1. Create database
psql -U postgres -c "CREATE DATABASE geoaccess;"
psql -U postgres -d geoaccess -c "CREATE EXTENSION postgis; CREATE EXTENSION pgrouting;"

# 2. Import roads
cd "C:\Users\BSC_COM_01_21\Downloads\GEOSPATIAL\Spatial Data\roads"
shp2pgsql -I -s 4326 hotosm_mwi_roads_lines_shp.shp public.road | psql -U postgres -d geoaccess

# 3. Create topology
psql -U postgres -d geoaccess -f create_topology.sql

# 4. Start backend
cd server
npm run start:dev
```

---

**This setup will give you a fully functional routing system with proper road network connectivity!**
