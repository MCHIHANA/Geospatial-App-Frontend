-- Admin Features Database Setup
-- Run this script to add support for Admin Dashboard and Disaster Areas features

-- 1. Add new columns to facilities table for enhanced information
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS capacity INTEGER;
ALTER TABLE facilities ADD COLUMN IF NOT EXISTS contact TEXT;

-- 2. Create disaster_zones table
CREATE TABLE IF NOT EXISTS disaster_zones (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('flood', 'cyclone', 'earthquake', 'drought')),
    risk_level VARCHAR(20) NOT NULL CHECK (risk_level IN ('high', 'medium', 'low')),
    geometry GEOMETRY(POLYGON, 4326),
    population INTEGER,
    last_incident DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create spatial index for disaster zones
CREATE INDEX IF NOT EXISTS idx_disaster_zones_geometry ON disaster_zones USING GIST(geometry);
CREATE INDEX IF NOT EXISTS idx_disaster_zones_type ON disaster_zones(type);
CREATE INDEX IF NOT EXISTS idx_disaster_zones_risk ON disaster_zones(risk_level);

-- 4. Insert sample disaster zones data for Malawi
INSERT INTO disaster_zones (name, type, risk_level, geometry, population, last_incident, description)
VALUES 
    (
        'Lower Shire Valley',
        'flood',
        'high',
        ST_GeomFromText('POLYGON((35.0 -16.8, 35.3 -16.8, 35.3 -17.0, 35.0 -17.0, 35.0 -16.8))', 4326),
        150000,
        '2023-03-15',
        'Prone to severe flooding during rainy season due to Shire River overflow'
    ),
    (
        'Karonga District',
        'earthquake',
        'medium',
        ST_GeomFromText('POLYGON((33.9 -9.9, 34.1 -9.9, 34.1 -10.1, 33.9 -10.1, 33.9 -9.9))', 4326),
        95000,
        '2020-09-10',
        'Located in the East African Rift Valley, experiences seismic activity'
    ),
    (
        'Southern Region Coastal',
        'cyclone',
        'high',
        ST_GeomFromText('POLYGON((35.0 -15.5, 35.5 -15.5, 35.5 -16.0, 35.0 -16.0, 35.0 -15.5))', 4326),
        200000,
        '2022-01-24',
        'Vulnerable to tropical cyclones from the Indian Ocean'
    ),
    (
        'Central Plains',
        'drought',
        'medium',
        ST_GeomFromText('POLYGON((33.5 -13.5, 34.0 -13.5, 34.0 -14.0, 33.5 -14.0, 33.5 -13.5))', 4326),
        120000,
        '2021-11-05',
        'Agricultural area susceptible to drought conditions'
    ),
    (
        'Phalombe District',
        'flood',
        'high',
        ST_GeomFromText('POLYGON((35.6 -15.7, 35.9 -15.7, 35.9 -16.0, 35.6 -16.0, 35.6 -15.7))', 4326),
        85000,
        '2023-02-20',
        'Flash floods common during heavy rainfall'
    ),
    (
        'Nsanje District',
        'flood',
        'high',
        ST_GeomFromText('POLYGON((35.1 -16.8, 35.4 -16.8, 35.4 -17.1, 35.1 -17.1, 35.1 -16.8))', 4326),
        110000,
        '2023-03-18',
        'Confluence of rivers makes this area highly flood-prone'
    ),
    (
        'Zomba Plateau',
        'earthquake',
        'low',
        ST_GeomFromText('POLYGON((35.3 -15.3, 35.4 -15.3, 35.4 -15.4, 35.3 -15.4, 35.3 -15.3))', 4326),
        45000,
        '2019-05-12',
        'Minor seismic activity occasionally recorded'
    ),
    (
        'Dedza Highlands',
        'drought',
        'medium',
        ST_GeomFromText('POLYGON((34.2 -14.2, 34.5 -14.2, 34.5 -14.5, 34.2 -14.5, 34.2 -14.2))', 4326),
        75000,
        '2022-08-30',
        'Highland area with irregular rainfall patterns'
    )
ON CONFLICT DO NOTHING;

-- 5. Create function to find facilities in disaster zones
CREATE OR REPLACE FUNCTION get_facilities_in_disaster_zone(zone_id INTEGER)
RETURNS TABLE (
    facility_id INTEGER,
    facility_name VARCHAR,
    facility_type VARCHAR,
    distance_km NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id,
        f.name,
        f.type,
        ROUND(
            ST_Distance(
                ST_Transform(ST_SetSRID(ST_MakePoint(f.longitude, f.latitude), 4326), 3857),
                ST_Transform(dz.geometry, 3857)
            )::NUMERIC / 1000, 2
        ) as distance_km
    FROM facilities f
    CROSS JOIN disaster_zones dz
    WHERE dz.id = zone_id
    AND ST_DWithin(
        ST_Transform(ST_SetSRID(ST_MakePoint(f.longitude, f.latitude), 4326), 3857),
        ST_Transform(dz.geometry, 3857),
        50000  -- 50km radius
    )
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- 6. Create view for disaster statistics
CREATE OR REPLACE VIEW disaster_stats AS
SELECT 
    type,
    COUNT(*) as zone_count,
    SUM(population) as total_population,
    COUNT(CASE WHEN risk_level = 'high' THEN 1 END) as high_risk_count,
    COUNT(CASE WHEN risk_level = 'medium' THEN 1 END) as medium_risk_count,
    COUNT(CASE WHEN risk_level = 'low' THEN 1 END) as low_risk_count
FROM disaster_zones
GROUP BY type;

-- 7. Create admin audit log table
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id SERIAL PRIMARY KEY,
    action VARCHAR(50) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER,
    user_id INTEGER,
    changes JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created ON admin_audit_log(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON admin_audit_log(action);

-- 8. Grant necessary permissions (adjust user as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON facilities TO your_app_user;
-- GRANT SELECT ON disaster_zones TO your_app_user;
-- GRANT SELECT ON disaster_stats TO your_app_user;
-- GRANT INSERT ON admin_audit_log TO your_app_user;

-- Verification queries
SELECT 'Facilities table columns:' as info;
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'facilities';

SELECT 'Disaster zones created:' as info;
SELECT COUNT(*) as total_zones, type, risk_level 
FROM disaster_zones 
GROUP BY type, risk_level;

SELECT 'Disaster statistics:' as info;
SELECT * FROM disaster_stats;

COMMIT;
