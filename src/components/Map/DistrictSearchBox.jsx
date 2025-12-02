import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const DistrictSearchBox = ({ onSearch, onClear }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
        onClear();
    };

    return (
        <div style={{
            position: 'absolute',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: '300px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            padding: '8px'
        }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center' }}>
                <Search size={20} color="#6b7280" style={{ marginLeft: '8px' }} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search district (e.g. Mzimba)"
                    style={{
                        border: 'none',
                        outline: 'none',
                        padding: '8px 12px',
                        width: '100%',
                        fontSize: '14px',
                        color: '#374151'
                    }}
                />
                {query && (
                    <button
                        type="button"
                        onClick={handleClear}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#9ca3af'
                        }}
                    >
                        <X size={16} />
                    </button>
                )}
            </form>
        </div>
    );
};

export default DistrictSearchBox;
