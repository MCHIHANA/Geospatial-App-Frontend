-- PostGIS Database Setup Script
-- Run this with: psql -U postgres -f setup-database.sql

-- Create database
CREATE DATABASE geospatial_db;

-- Connect to the new database
\c geospatial_db

-- Enable PostGIS extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Verify PostGIS is installed
SELECT PostGIS_Version();

-- Create user (optional but recommended)
CREATE USER geospatial_user WITH PASSWORD 'geospatial_password_2024';
GRANT ALL PRIVILEGES ON DATABASE geospatial_db TO geospatial_user;
GRANT ALL PRIVILEGES ON SCHEMA public TO geospatial_user;

-- Display success message
\echo 'PostGIS database setup complete!'
\echo 'Database: geospatial_db'
\echo 'User: geospatial_user'
\echo 'Password: geospatial_password_2024'
