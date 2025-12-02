import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Menu, Search, X } from 'lucide-react';

const Header = ({ toggleSidebar, onDistrictSelect }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [districts, setDistricts] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Fetch all districts on mount
        fetch('/api/districts')
            .then(res => res.json())
            .then(data => setDistricts(data))
            .catch(err => console.error('Error fetching districts:', err));
    }, []);

    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = districts.filter(d =>
                d.shapeName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredDistricts(filtered);
            setShowDropdown(true);
        } else {
            setFilteredDistricts([]);
            setShowDropdown(false);
        }
    }, [searchQuery, districts]);

    const handleDistrictSelect = async (districtName) => {
        setLoading(true);
        setSearchQuery(districtName);
        setShowDropdown(false);

        try {
            const response = await fetch(`/api/districts/facilities?name=${encodeURIComponent(districtName)}`);
            const data = await response.json();
            
            if (onDistrictSelect) {
                onDistrictSelect(data);
            }
        } catch (error) {
            console.error('Error fetching district facilities:', error);
            alert('Failed to load district data');
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setShowDropdown(false);
        if (onDistrictSelect) {
            onDistrictSelect(null);
        }
    };

    return (
        <header style={{
            height: '70px',
            backgroundColor: 'var(--bg-surface)',
            borderBottom: '2px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 var(--spacing-lg)',
            justifyContent: 'space-between',
            zIndex: 20,
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)' }}>
                <button
                    onClick={toggleSidebar}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        padding: 'var(--spacing-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'pointer'
                    }}
                    aria-label="Toggle Menu"
                >
                    <Menu size={24} />
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        padding: '8px',
                        borderRadius: 'var(--radius-md)',
                        color: 'white',
                        display: 'flex',
                        boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }}>
                        <MapIcon size={24} />
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '1.4rem',
                            fontWeight: 700,
                            color: 'var(--text-main)',
                            letterSpacing: '-0.025em',
                            marginBottom: '2px'
                        }}>
                            GeoAccess Malawi
                        </h1>
                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-muted)',
                            fontWeight: 500
                        }}>
                            Spatial Accessibility Analysis Platform
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', flex: 1, justifyContent: 'center', maxWidth: '600px', position: 'relative' }}>
                <div style={{ position: 'relative', width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-surface-hover)',
                        borderRadius: 'var(--radius-lg)',
                        padding: '10px 16px',
                        border: '2px solid var(--border-color)',
                        transition: 'all 0.2s',
                        boxShadow: showDropdown ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                    }}>
                        <Search size={20} style={{ color: 'var(--text-muted)', marginRight: '8px' }} />
                        <input
                            type="text"
                            placeholder="Search district (e.g., Lilongwe, Blantyre)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                flex: 1,
                                fontSize: '0.95rem',
                                color: 'var(--text-main)'
                            }}
                        />
                        {searchQuery && (
                            <button
                                onClick={clearSearch}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '4px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    color: 'var(--text-muted)'
                                }}
                            >
                                <X size={18} />
                            </button>
                        )}
                        {loading && (
                            <div style={{
                                width: '16px',
                                height: '16px',
                                border: '2px solid var(--border-color)',
                                borderTop: '2px solid #3b82f6',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        )}
                    </div>

                    {showDropdown && filteredDistricts.length > 0 && (
                        <div style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            marginTop: '8px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '2px solid var(--border-color)',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            zIndex: 1000
                        }}>
                            {filteredDistricts.map((district) => (
                                <div
                                    key={district.id}
                                    onClick={() => handleDistrictSelect(district.shapeName)}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid var(--border-color)',
                                        transition: 'background-color 0.2s',
                                        fontSize: '0.95rem',
                                        color: 'var(--text-main)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-surface-hover)'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{ fontWeight: 500 }}>{district.shapeName}</div>
                                    {district.shapeGroup && (
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {district.shapeGroup}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xs)',
                    padding: '6px 12px',
                    backgroundColor: 'var(--bg-surface-hover)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#10b981',
                        animation: 'pulse 2s infinite'
                    }}></div>
                    <span>Live Data</span>
                </div>
            </div>
        </header>
    );
};

export default Header;
