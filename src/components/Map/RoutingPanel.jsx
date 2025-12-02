import { useState, useEffect, useRef } from 'react';
import { Navigation, MapPin, Clock, Car, PersonStanding, X, Route, AlertCircle, Search } from 'lucide-react';

const PlaceSearchInput = ({ value, onChange, onSelectPlace, placeholder, label }) => {
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [searching, setSearching] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        const searchPlaces = async () => {
            if (value.length < 2) {
                setSearchResults([]);
                return;
            }

            // Check if it's already coordinates
            if (value.includes(',')) {
                setSearchResults([]);
                return;
            }

            setSearching(true);
            try {
                const response = await fetch(`/api/population/search?q=${encodeURIComponent(value)}&limit=8`);
                const data = await response.json();
                setSearchResults(data);
                setShowResults(true);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setSearching(false);
            }
        };

        const debounce = setTimeout(searchPlaces, 300);
        return () => clearTimeout(debounce);
    }, [value]);

    const handleSelectPlace = (place) => {
        onChange(place.name);
        onSelectPlace(place);
        setShowResults(false);
        setSearchResults([]);
    };

    return (
        <div style={{ position: 'relative' }}>
            <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                marginBottom: 'var(--spacing-xs)'
            }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                {label}
            </label>
            <div style={{ position: 'relative' }}>
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    placeholder={placeholder}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-sm)',
                        paddingLeft: '2.5rem',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.875rem'
                    }}
                />
                <Search
                    size={16}
                    style={{
                        position: 'absolute',
                        left: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--text-muted)'
                    }}
                />
                {searching && (
                    <div style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '16px',
                        height: '16px',
                        border: '2px solid var(--border-color)',
                        borderTop: '2px solid var(--color-accent)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                )}
            </div>

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: '4px',
                    backgroundColor: 'white',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    maxHeight: '250px',
                    overflowY: 'auto',
                    zIndex: 1000
                }}>
                    {searchResults.map((place, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSelectPlace(place)}
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-sm)',
                                border: 'none',
                                backgroundColor: 'white',
                                textAlign: 'left',
                                cursor: 'pointer',
                                borderBottom: idx < searchResults.length - 1 ? '1px solid var(--border-color)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                transition: 'background-color 0.15s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                        >
                            <MapPin size={14} color={place.type === 'place' ? '#3b82f6' : '#10b981'} />
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-main)' }}>
                                    {place.name}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    {place.type === 'place' && place.population && `Pop: ${place.population.toLocaleString()}`}
                                    {place.type !== 'place' && place.type}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const RoutingPanel = ({ onRouteCalculate, onClose }) => {
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [originCoords, setOriginCoords] = useState(null);
    const [destCoords, setDestCoords] = useState(null);
    const [travelMode, setTravelMode] = useState('driving');
    const [useCurrentLocation, setUseCurrentLocation] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const getCurrentLocation = () => {
        setUseCurrentLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setOrigin('Current Location');
                    setOriginCoords({ lat, lng });
                    setUseCurrentLocation(false);
                },
                (error) => {
                    setError('Unable to get your location. Please enter manually.');
                    setUseCurrentLocation(false);
                }
            );
        } else {
            setError('Geolocation is not supported by your browser.');
            setUseCurrentLocation(false);
        }
    };

    const handleOriginSelect = (place) => {
        setOriginCoords({ lat: place.lat, lng: place.lng });
    };

    const handleDestSelect = (place) => {
        setDestCoords({ lat: place.lat, lng: place.lng });
    };

    const geocodeIfNeeded = async (text) => {
        // Check if it's already coordinates
        const coordMatch = text.match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
        if (coordMatch) {
            return { lat: parseFloat(coordMatch[1]), lng: parseFloat(coordMatch[2]) };
        }

        // Try to geocode the place name
        try {
            const response = await fetch(`/api/population/geocode?place=${encodeURIComponent(text)}`);
            const data = await response.json();
            if (data.error) {
                return null;
            }
            return { lat: data.lat, lng: data.lng };
        } catch (error) {
            return null;
        }
    };

    const calculateRoute = async () => {
        if (!origin || !destination) {
            setError('Please enter both origin and destination');
            return;
        }

        setCalculating(true);
        setError(null);
        setResult(null);

        try {
            // Get coordinates for origin
            let originCoordinates = originCoords;
            if (!originCoordinates) {
                originCoordinates = await geocodeIfNeeded(origin);
                if (!originCoordinates) {
                    setError(`Could not find location: ${origin}`);
                    setCalculating(false);
                    return;
                }
            }

            // Get coordinates for destination
            let destCoordinates = destCoords;
            if (!destCoordinates) {
                destCoordinates = await geocodeIfNeeded(destination);
                if (!destCoordinates) {
                    setError(`Could not find location: ${destination}`);
                    setCalculating(false);
                    return;
                }
            }

            // Call backend API
            const response = await fetch(
                `/api/accessibility/route?` +
                `originLat=${originCoordinates.lat}&originLng=${originCoordinates.lng}&` +
                `destLat=${destCoordinates.lat}&destLng=${destCoordinates.lng}&` +
                `mode=${travelMode}`
            );

            if (!response.ok) {
                throw new Error('Failed to calculate route');
            }

            const data = await response.json();

            // Show result even if route not found (will show estimated time)
            setResult(data);

            // Pass result to parent component for map display
            if (onRouteCalculate) {
                onRouteCalculate(data, originCoordinates, destCoordinates);
            }
        } catch (err) {
            setError(err.message || 'Failed to calculate route');
        } finally {
            setCalculating(false);
        }
    };

    const formatTime = (minutes) => {
        if (minutes < 60) {
            return `${Math.round(minutes)} min`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = Math.round(minutes % 60);
        return `${hours}h ${mins}min`;
    };

    return (
        <div style={{
            position: 'absolute',
            top: '80px',
            left: '20px',
            width: '400px',
            backgroundColor: 'white',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 1000,
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 100px)',
            display: 'flex',
            flexDirection: 'column'
        }}>
            {/* Header */}
            <div style={{
                padding: 'var(--spacing-md)',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                    <Navigation size={20} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                        Route Planner
                    </h3>
                </div>
                <button
                    onClick={onClose}
                    style={{
                        background: 'rgba(255,255,255,0.2)',
                        border: 'none',
                        color: 'white',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}
                >
                    <X size={18} />
                </button>
            </div>

            {/* Content */}
            <div style={{ padding: 'var(--spacing-md)', overflowY: 'auto', flex: 1 }}>
                {/* Origin Input */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <PlaceSearchInput
                        value={origin}
                        onChange={setOrigin}
                        onSelectPlace={handleOriginSelect}
                        placeholder="e.g., Zomba, Lilongwe, or coordinates"
                        label="Starting Point"
                    />
                    <button
                        onClick={getCurrentLocation}
                        disabled={useCurrentLocation}
                        style={{
                            marginTop: 'var(--spacing-xs)',
                            padding: 'var(--spacing-xs) var(--spacing-sm)',
                            backgroundColor: 'var(--bg-surface-hover)',
                            color: 'var(--color-accent)',
                            border: '1px solid var(--border-color)',
                            borderRadius: 'var(--radius-sm)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                        }}
                        title="Use current location"
                    >
                        <Navigation size={12} />
                        {useCurrentLocation ? 'Getting location...' : 'Use my location'}
                    </button>
                </div>

                {/* Destination Input */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <PlaceSearchInput
                        value={destination}
                        onChange={setDestination}
                        onSelectPlace={handleDestSelect}
                        placeholder="e.g., Blantyre, Mzuzu, or coordinates"
                        label="Destination"
                    />
                </div>

                {/* Travel Mode Selection */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: 'var(--text-main)',
                        marginBottom: 'var(--spacing-xs)'
                    }}>
                        Travel Mode
                    </label>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                        <button
                            onClick={() => setTravelMode('driving')}
                            style={{
                                flex: 1,
                                padding: 'var(--spacing-sm)',
                                border: travelMode === 'driving' ? '2px solid var(--color-accent)' : '1px solid var(--border-color)',
                                backgroundColor: travelMode === 'driving' ? 'rgba(59, 130, 246, 0.1)' : 'white',
                                color: travelMode === 'driving' ? 'var(--color-accent)' : 'var(--text-secondary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-xs)',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        >
                            <Car size={18} />
                            Driving
                        </button>
                        <button
                            onClick={() => setTravelMode('walking')}
                            style={{
                                flex: 1,
                                padding: 'var(--spacing-sm)',
                                border: travelMode === 'walking' ? '2px solid var(--color-accent)' : '1px solid var(--border-color)',
                                backgroundColor: travelMode === 'walking' ? 'rgba(59, 130, 246, 0.1)' : 'white',
                                color: travelMode === 'walking' ? 'var(--color-accent)' : 'var(--text-secondary)',
                                borderRadius: 'var(--radius-md)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 'var(--spacing-xs)',
                                fontWeight: 600,
                                fontSize: '0.875rem'
                            }}
                        >
                            <PersonStanding size={18} />
                            Walking
                        </button>
                    </div>
                </div>

                {/* Calculate Button */}
                <button
                    onClick={calculateRoute}
                    disabled={calculating || !origin || !destination}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        backgroundColor: calculating ? 'var(--bg-surface-hover)' : 'var(--color-accent)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: calculating ? 'not-allowed' : 'pointer',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 'var(--spacing-sm)'
                    }}
                >
                    <Route size={18} />
                    {calculating ? 'Calculating...' : 'Calculate Route'}
                </button>

                {/* Error Message */}
                {error && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: 'var(--radius-md)',
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                    }}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                {/* Result */}
                {result && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        {!result.success && (
                            <div style={{
                                fontSize: '0.875rem',
                                color: '#f59e0b',
                                marginBottom: 'var(--spacing-sm)',
                                fontWeight: 600
                            }}>
                                ⚠ {result.error}
                            </div>
                        )}
                        
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <Clock size={18} color={result.success ? "#10b981" : "#f59e0b"} />
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: result.success ? '#10b981' : '#f59e0b' }}>
                                {formatTime(result.travelTime || result.estimatedTime)}
                                {!result.success && ' (est.)'}
                            </span>
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            <div>
                                {result.success ? 'Road Distance' : 'Straight-line Distance'}: {' '}
                                {((result.distance || result.straightLineDistance) / 1000).toFixed(2)} km
                            </div>
                            <div>Mode: {travelMode === 'driving' ? 'Driving' : 'Walking'}</div>
                            {result.note && (
                                <div style={{
                                    marginTop: 'var(--spacing-xs)',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    fontStyle: 'italic'
                                }}>
                                    💡 {result.note}
                                </div>
                            )}
                            {result.accessible !== undefined && (
                                <div style={{
                                    marginTop: 'var(--spacing-xs)',
                                    color: result.accessible ? '#10b981' : '#ef4444',
                                    fontWeight: 600
                                }}>
                                    {result.accessible ? '✓ Route accessible' : '⚠ Limited accessibility'}
                                </div>
                            )}
                            {/* Show snap distance information */}
                            {(result.originSnapDistance || result.destinationSnapDistance) && (
                                <div style={{
                                    marginTop: 'var(--spacing-sm)',
                                    paddingTop: 'var(--spacing-sm)',
                                    borderTop: '1px solid rgba(16, 185, 129, 0.2)',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)'
                                }}>
                                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>Snap to Road:</div>
                                    {result.originSnapDistance && (
                                        <div>Origin: {result.originSnapDistance.toFixed(1)} km from road</div>
                                    )}
                                    {result.destinationSnapDistance && (
                                        <div>Destination: {result.destinationSnapDistance.toFixed(1)} km from road</div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tip */}
                <div style={{
                    marginTop: 'var(--spacing-md)',
                    padding: 'var(--spacing-sm)',
                    backgroundColor: 'rgba(59, 130, 246, 0.05)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                }}>
                    💡 <strong>Tip:</strong> Type city names (Zomba, Lilongwe, Blantyre) or use coordinates. Results appear as you type!
                </div>
            </div>
        </div>
    );
};

export default RoutingPanel;
