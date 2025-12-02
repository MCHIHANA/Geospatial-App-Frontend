// React core imports
import { useState } from 'react';

// Layout components
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';

// Map components
import MapView from './components/Map/MapView';
import RoutingPanel from './components/Map/RoutingPanel';

// Dashboard components
import StatsPanel from './components/Dashboard/StatsPanel';
import DistrictPanel from './components/Dashboard/DistrictPanel';

// Styles and icons
import './index.css';
import { MapPin } from 'lucide-react';

function App() {
    // UI state management
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showRoutingPanel, setShowRoutingPanel] = useState(false);
    const [showDistrictPanel, setShowDistrictPanel] = useState(false);
    
    // Layer visibility state
    const [showHospitals, setShowHospitals] = useState(true);
    const [showSchools, setShowSchools] = useState(false);
    const [showPopulation, setShowPopulation] = useState(false);
    const [showIsochrone, setShowIsochrone] = useState(false);
    const [isochroneTime, setIsochroneTime] = useState(15);
    
    // Data state
    const [routeData, setRouteData] = useState(null);
    const [districtData, setDistrictData] = useState(null);
    const [userLocation, setUserLocation] = useState(null);
    const [nearestFacilities, setNearestFacilities] = useState(null);

    // Toggle sidebar visibility
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleRouteCalculate = (result, origin, destination) => {
        setRouteData({ result, origin, destination });
    };

    const handleDistrictSelect = (district) => {
        // Fetch full district geometry details and facilities
        fetch(`/api/districts/facilities?name=${district.shapeName}`)
            .then(res => res.json())
            .then(data => {
                setDistrictData(data);
                if (data) {
                    setShowHospitals(true);
                    setShowSchools(true);
                }
            })
            .catch(err => console.error(err));
    };

    const handleFindNearest = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setUserLocation({ lat: latitude, lng: longitude });

                    // Fetch nearest facilities
                    fetch(`/api/facilities/nearest?lat=${latitude}&lng=${longitude}&limit=10`)
                        .then(res => res.json())
                        .then(data => {
                            setNearestFacilities(data);
                            setShowHospitals(true);
                            setShowSchools(true);
                        })
                        .catch(err => console.error('Error fetching nearest:', err));
                },
                (error) => {
                    console.error("Error getting location:", error);
                    alert("Unable to retrieve your location.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div className="app-container" style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            width: '100vw',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-body)'
        }}>
            <Header toggleSidebar={toggleSidebar} onDistrictSelect={handleDistrictSelect} />

            <div style={{
                display: 'flex',
                flex: 1,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <Sidebar
                    isOpen={sidebarOpen}
                    showHospitals={showHospitals}
                    setShowHospitals={setShowHospitals}
                    showSchools={showSchools}
                    setShowSchools={setShowSchools}
                    showPopulation={showPopulation}
                    setShowPopulation={setShowPopulation}
                    showIsochrone={showIsochrone}
                    setShowIsochrone={setShowIsochrone}
                    isochroneTime={isochroneTime}
                    setIsochroneTime={setIsochroneTime}
                    onOpenRoutePlanner={() => setShowRoutingPanel(true)}
                >
                    <div style={{ marginTop: '20px', padding: '0 10px' }}>
                        <button
                            onClick={() => setShowDistrictPanel(!showDistrictPanel)}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: showDistrictPanel ? '#e5e7eb' : 'white',
                                border: '1px solid #d1d5db',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '500',
                                marginBottom: '10px'
                            }}
                        >
                            {showDistrictPanel ? 'Hide Districts' : 'Show Districts List'}
                        </button>

                        {showDistrictPanel && (
                            <div style={{ height: '300px', overflow: 'hidden' }}>
                                <DistrictPanel onDistrictSelect={handleDistrictSelect} />
                            </div>
                        )}
                    </div>
                </Sidebar>

                <main style={{
                    flex: 1,
                    position: 'relative',
                    marginLeft: sidebarOpen ? '320px' : '0',
                    transition: 'margin-left var(--transition-normal)',
                    height: '100%',
                    width: '100%'
                }}>
                    <MapView
                        showHospitals={showHospitals}
                        showSchools={showSchools}
                        showPopulation={showPopulation}
                        showIsochrone={showIsochrone}
                        isochroneTime={isochroneTime}
                        routeData={routeData}
                        districtData={districtData}
                        userLocation={userLocation}
                        nearestFacilities={nearestFacilities}
                    />
                    {!showDistrictPanel && <StatsPanel />}
                    {showRoutingPanel && (
                        <RoutingPanel
                            onRouteCalculate={handleRouteCalculate}
                            onClose={() => setShowRoutingPanel(false)}
                        />
                    )}

                    {/* Floating Action Buttons */}
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '30px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '15px',
                        zIndex: 999
                    }}>
                        {!showRoutingPanel && (
                            <button
                                onClick={() => setShowRoutingPanel(true)}
                                style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    border: 'none',
                                    boxShadow: '0 4px 20px rgba(59, 130, 246, 0.4)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all var(--transition-fast)'
                                }}
                                title="Open Route Planner"
                            >
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M3 11l19-9-9 19-2-8-8-2z" />
                                </svg>
                            </button>
                        )}

                        <button
                            onClick={handleFindNearest}
                            style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                background: 'white',
                                color: '#3b82f6',
                                border: 'none',
                                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all var(--transition-fast)'
                            }}
                            title="Find Nearest Facilities"
                        >
                            <MapPin size={28} />
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default App;
