import React, { useState, useEffect } from 'react';
import { Search, MapPin, School, Activity } from 'lucide-react';

const DistrictPanel = ({ onDistrictSelect }) => {
    const [districts, setDistricts] = useState([]);
    const [filteredDistricts, setFilteredDistricts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/districts')
            .then(res => res.json())
            .then(data => {
                setDistricts(data);
                setFilteredDistricts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching districts:', err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredDistricts(districts);
        } else {
            const query = searchQuery.toLowerCase();
            setFilteredDistricts(districts.filter(d =>
                d.shapeName.toLowerCase().includes(query)
            ));
        }
    }, [searchQuery, districts]);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            padding: '16px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
                Districts
            </h2>

            <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
                <input
                    type="text"
                    placeholder="Search districts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        borderRadius: '6px',
                        border: '1px solid #d1d5db',
                        outline: 'none',
                        fontSize: '0.875rem'
                    }}
                />
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Loading...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {filteredDistricts.map(district => (
                            <div
                                key={district.id}
                                onClick={() => onDistrictSelect(district)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#f9fafb',
                                    cursor: 'pointer',
                                    transition: 'background-color 0.2s',
                                    border: '1px solid #e5e7eb'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: '600', color: '#374151' }}>{district.shapeName}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280', backgroundColor: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>
                                        {district.shapeGroup}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: '12px', fontSize: '0.8rem', color: '#6b7280' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <School size={14} />
                                        <span>{district.schoolCount || 0} Schools</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <Activity size={14} />
                                        <span>{district.healthCount || 0} Health</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DistrictPanel;
