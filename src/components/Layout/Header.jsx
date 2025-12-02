import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Menu, Search, X } from 'lucide-react';

const Header = () => {

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
