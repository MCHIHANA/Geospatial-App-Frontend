import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Popup, Marker } from 'react-leaflet';
import { AlertTriangle, Droplets, Wind, Mountain, Flame } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './DisasterAreas.css';

const disasterTypes = {
    flood: { icon: Droplets, color: '#3b82f6', label: 'Flood Prone' },
    cyclone: { icon: Wind, color: '#8b5cf6', label: 'Cyclone Risk' },
    earthquake: { icon: Mountain, color: '#ef4444', label: 'Earthquake Zone' },
    drought: { icon: Flame, color: '#f59e0b', label: 'Drought Prone' }
};

function DisasterAreas() {
    const [disasterZones, setDisasterZones] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [stats, setStats] = useState({
        flood: 0,
        cyclone: 0,
        earthquake: 0,
        drought: 0
    });
    const [affectedFacilities, setAffectedFacilities] = useState([]);

    useEffect(() => {
        fetchDisasterZones();
        fetchStats();
    }, []);

    useEffect(() => {
        if (selectedType !== 'all') {
            fetchAffectedFacilities(selectedType);
        }
    }, [selectedType]);

    const fetchDisasterZones = async () => {
        try {
            console.log('Fetching disaster zones...');
            // Mock data - replace with actual API call
            const mockZones = [
                {
                    id: 1,
                    name: 'Lower Shire Valley',
                    type: 'flood',
                    riskLevel: 'high',
                    coordinates: [
                        [-16.8, 35.0],
                        [-16.8, 35.3],
                        [-17.0, 35.3],
                        [-17.0, 35.0]
                    ],
                    population: 150000,
                    lastIncident: '2023-03-15'
                },
                {
                    id: 2,
                    name: 'Karonga District',
                    type: 'earthquake',
                    riskLevel: 'medium',
                    coordinates: [
                        [-9.9, 33.9],
                        [-9.9, 34.1],
                        [-10.1, 34.1],
                        [-10.1, 33.9]
                    ],
                    population: 95000,
                    lastIncident: '2020-09-10'
                },
                {
                    id: 3,
                    name: 'Southern Region',
                    type: 'cyclone',
                    riskLevel: 'high',
                    coordinates: [
                        [-15.5, 35.0],
                        [-15.5, 35.5],
                        [-16.0, 35.5],
                        [-16.0, 35.0]
                    ],
                    population: 200000,
                    lastIncident: '2022-01-24'
                },
                {
                    id: 4,
                    name: 'Central Plains',
                    type: 'drought',
                    riskLevel: 'medium',
                    coordinates: [
                        [-13.5, 33.5],
                        [-13.5, 34.0],
                        [-14.0, 34.0],
                        [-14.0, 33.5]
                    ],
                    population: 120000,
                    lastIncident: '2021-11-05'
                }
            ];
            setDisasterZones(mockZones);
        } catch (error) {
            console.error('Error fetching disaster zones:', error);
        }
    };

    const fetchStats = async () => {
        try {
            // Mock stats - replace with actual API call
            setStats({
                flood: 8,
                cyclone: 5,
                earthquake: 3,
                drought: 6
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchAffectedFacilities = async (type) => {
        try {
            // Mock data - replace with actual API call
            const mockFacilities = [
                { id: 1, name: 'Nsanje District Hospital', type: 'hospital', distance: '2.3 km' },
                { id: 2, name: 'Bangula Health Center', type: 'hospital', distance: '5.1 km' },
                { id: 3, name: 'Makhanga Primary School', type: 'school', distance: '1.8 km' }
            ];
            setAffectedFacilities(mockFacilities);
        } catch (error) {
            console.error('Error fetching affected facilities:', error);
        }
    };

    const getPolygonColor = (type, riskLevel) => {
        const baseColor = disasterTypes[type].color;
        const opacity = riskLevel === 'high' ? 0.6 : 0.4;
        return baseColor;
    };

    const filteredZones = selectedType === 'all' 
        ? disasterZones 
        : disasterZones.filter(zone => zone.type === selectedType);

    return (
        <div className="disaster-areas">
            <div className="disaster-header">
                <div>
                    <h1>Natural Disaster-Prone Areas</h1>
                    <p>Monitor and manage high-risk zones in Malawi</p>
                </div>
            </div>

            <div className="disaster-stats">
                {Object.entries(disasterTypes).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                        <div 
                            key={type}
                            className={`disaster-stat-card ${selectedType === type ? 'active' : ''}`}
                            onClick={() => setSelectedType(selectedType === type ? 'all' : type)}
                        >
                            <Icon size={28} style={{ color: config.color }} />
                            <div>
                                <h3>{stats[type]}</h3>
                                <p>{config.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="disaster-content">
                <div className="disaster-map-container">
                    <MapContainer
                        center={[-13.254308, 34.301525]}
                        zoom={7}
                        style={{ height: '100%', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        
                        {filteredZones.map(zone => (
                            <Polygon
                                key={zone.id}
                                positions={zone.coordinates}
                                pathOptions={{
                                    color: getPolygonColor(zone.type, zone.riskLevel),
                                    fillColor: getPolygonColor(zone.type, zone.riskLevel),
                                    fillOpacity: zone.riskLevel === 'high' ? 0.4 : 0.25,
                                    weight: 2
                                }}
                            >
                                <Popup>
                                    <div className="disaster-popup">
                                        <h3>{zone.name}</h3>
                                        <p><strong>Type:</strong> {disasterTypes[zone.type].label}</p>
                                        <p><strong>Risk Level:</strong> <span className={`risk-${zone.riskLevel}`}>{zone.riskLevel}</span></p>
                                        <p><strong>Population:</strong> {zone.population.toLocaleString()}</p>
                                        <p><strong>Last Incident:</strong> {zone.lastIncident}</p>
                                    </div>
                                </Popup>
                            </Polygon>
                        ))}
                    </MapContainer>
                </div>

                <div className="disaster-sidebar">
                    <div className="disaster-zones-list">
                        <h3>Risk Zones</h3>
                        {filteredZones.map(zone => {
                            const Icon = disasterTypes[zone.type].icon;
                            return (
                                <div key={zone.id} className="zone-card">
                                    <div className="zone-header">
                                        <Icon size={20} style={{ color: disasterTypes[zone.type].color }} />
                                        <h4>{zone.name}</h4>
                                    </div>
                                    <div className="zone-details">
                                        <span className={`risk-badge risk-${zone.riskLevel}`}>
                                            {zone.riskLevel} risk
                                        </span>
                                        <p>{zone.population.toLocaleString()} people</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {selectedType !== 'all' && affectedFacilities.length > 0 && (
                        <div className="affected-facilities">
                            <h3>Affected Facilities</h3>
                            {affectedFacilities.map(facility => (
                                <div key={facility.id} className="facility-item">
                                    <AlertTriangle size={16} />
                                    <div>
                                        <p className="facility-name">{facility.name}</p>
                                        <p className="facility-distance">{facility.distance} from zone</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DisasterAreas;
