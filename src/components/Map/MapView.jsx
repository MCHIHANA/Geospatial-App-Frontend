import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, GeoJSON, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import DistrictSearchBox from './DistrictSearchBox';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const MapClickHandler = ({ onMapClick }) => {
    useMapEvents({
        click: (e) => {
            onMapClick(e.latlng);
        }
    });
    return null;
};

const MapView = ({ showHospitals, showSchools, showIsochrone, isochroneTime, userLocation, nearestFacilities, districtData }) => {
    const position = [-13.2543, 34.3015]; // Center of Malawi
    const [facilities, setFacilities] = useState(null);
    const [allFacilities, setAllFacilities] = useState(null);
    const [isochrone, setIsochrone] = useState(null);
    const [selectedPoint, setSelectedPoint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        fetch('/api/facilities')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch facilities');
                return res.json();
            })
            .then(data => {
                setFacilities(data);
                setAllFacilities(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching facilities:', err);
                setError('Failed to load facilities. Make sure the backend server is running on port 4000.');
                setLoading(false);
            });
    }, []);

    // Update facilities when districtData changes
    useEffect(() => {
        if (districtData && districtData.district) {
            // If districtData has facilities included (from getFacilitiesInDistrict)
            if (districtData.features) {
                setFacilities(districtData);
            }
        }
    }, [districtData]);

    // Update facilities when nearestFacilities changes
    useEffect(() => {
        if (nearestFacilities) {
            setFacilities(nearestFacilities);
        }
    }, [nearestFacilities]);

    const handleMapClick = (latlng) => {
        if (showIsochrone) {
            setSelectedPoint(latlng);
            setIsochrone(null); // Clear previous isochrone
            fetch(`/api/accessibility/isochrone?lat=${latlng.lat}&lng=${latlng.lng}&time=${isochroneTime}`)
                .then(res => {
                    if (!res.ok) throw new Error('Failed to fetch isochrone');
                    return res.json();
                })
                .then(data => {
                    if (data.features && data.features.length > 0) {
                        setIsochrone(data);
                    } else {
                        console.warn('No reachable area found for this point');
                    }
                })
                .catch(err => {
                    console.error('Error fetching isochrone:', err);
                    alert('Failed to calculate catchment area. The point may be too far from the road network.');
                });
        }
    };

    const handleSearch = (district) => {
        setLoading(true);
        fetch(`/api/facilities/search?district=${encodeURIComponent(district)}`)
            .then(res => res.json())
            .then(data => {
                setFacilities(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Search error:', err);
                setLoading(false);
            });
    };

    const handleClearSearch = () => {
        if (allFacilities) {
            setFacilities(allFacilities);
        } else {
            // Fallback if allFacilities is somehow null
            window.location.reload();
        }
    };

    const getFilteredFacilities = () => {
        if (!facilities) return [];
        return facilities.features.filter(f => {
            const type = f.properties.type?.toLowerCase();
            if (showHospitals && (type.includes('hospital') || type.includes('clinic') || type.includes('health'))) return true;
            if (showSchools && (type.includes('school') || type.includes('college'))) return true;
            return false;
        });
    };

    if (error) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                backgroundColor: '#f3f4f6',
                padding: '2rem'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>Connection Error</h3>
                    <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ position: 'relative', height: '100%', width: '100%' }}>
            <DistrictSearchBox onSearch={handleSearch} onClear={handleClearSearch} />
            <MapContainer
                center={position}
                zoom={7}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                />

                <MapClickHandler onMapClick={handleMapClick} />

                {/* District Boundary */}
                {districtData && districtData.district && (
                    <GeoJSON
                        key={`district-${districtData.district.properties.id}`}
                        data={districtData.district}
                        style={{
                            fillColor: 'transparent',
                            color: '#3b82f6',
                            weight: 3,
                            dashArray: '5, 5'
                        }}
                    />
                )}

                {/* User Location Marker */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                        <Popup>
                            <strong>Your Location</strong>
                        </Popup>
                    </Marker>
                )}

                {showIsochrone && isochrone && isochrone.features && isochrone.features.length > 0 && (
                    <GeoJSON
                        data={isochrone}
                        style={{
                            fillColor: '#3b82f6',
                            fillOpacity: 0.2,
                            color: '#3b82f6',
                            weight: 2
                        }}
                    />
                )}

                {selectedPoint && showIsochrone && (
                    <CircleMarker
                        center={[selectedPoint.lat, selectedPoint.lng]}
                        radius={6}
                        pathOptions={{
                            color: '#3b82f6',
                            fillColor: '#3b82f6',
                            fillOpacity: 1,
                            weight: 2
                        }}
                    >
                        <Popup>
                            <strong>Selected Point</strong><br />
                            {isochroneTime} min travel time
                        </Popup>
                    </CircleMarker>
                )}

                {getFilteredFacilities().map((feature) => {
                    const type = feature.properties.type?.toLowerCase() || '';
                    const isHospital = type.includes('hospital') || type.includes('clinic') || type.includes('health');
                    return (
                        <CircleMarker
                            key={feature.properties.id}
                            center={[
                                feature.geometry.coordinates[1], // lat
                                feature.geometry.coordinates[0]  // lng
                            ]}
                            radius={5}
                            pathOptions={{
                                color: isHospital ? '#ef4444' : '#10b981',
                                fillColor: isHospital ? '#ef4444' : '#10b981',
                                fillOpacity: 0.7,
                                weight: 1
                            }}
                        >
                            <Popup>
                                <strong>{feature.properties.name}</strong><br />
                                Type: {feature.properties.type}<br />
                                {feature.properties.amenity && `Amenity: ${feature.properties.amenity}`}
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};

export default MapView;
