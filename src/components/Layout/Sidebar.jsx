import { Layers, Info, Hospital, GraduationCap, Users, MapPin, AlertTriangle, TrendingUp } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--spacing-md)',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            border: active ? '2px solid var(--color-accent)' : '2px solid transparent',
            background: active ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
            color: active ? 'var(--color-accent)' : 'var(--text-secondary)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'left',
            marginBottom: 'var(--spacing-xs)',
            fontWeight: active ? 600 : 500,
            transition: 'all var(--transition-fast)',
            cursor: 'pointer',
            fontSize: '0.9rem'
        }}
        onMouseEnter={(e) => {
            if (!active) {
                e.currentTarget.style.background = 'var(--bg-surface-hover)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
            }
        }}
        onMouseLeave={(e) => {
            if (!active) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'transparent';
            }
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Icon size={20} />
            <span>{label}</span>
        </div>
        {badge && (
            <span style={{
                backgroundColor: active ? 'var(--color-accent)' : 'var(--bg-surface-hover)',
                color: active ? 'white' : 'var(--text-secondary)',
                padding: '2px 8px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 600
            }}>
                {badge}
            </span>
        )}
    </button>
);

const Sidebar = ({
    isOpen,
    showHospitals,
    setShowHospitals,
    showSchools,
    setShowSchools,
    showPopulation,
    setShowPopulation,
    showIsochrone,
    setShowIsochrone,
    isochroneTime,
    setIsochroneTime,
    onOpenRoutePlanner
}) => {
    return (
        <aside style={{
            width: '320px',
            height: '100%',
            backgroundColor: 'var(--bg-surface)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            position: 'absolute',
            left: isOpen ? 0 : '-320px',
            top: 0,
            zIndex: 10,
            transition: 'left var(--transition-normal)',
            boxShadow: isOpen ? '2px 0 12px rgba(0,0,0,0.1)' : 'none',
            overflowY: 'auto'
        }}>
            {/* Mission Statement */}
            <div style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'rgba(59, 130, 246, 0.05)',
                borderBottom: '1px solid var(--border-color)'
            }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-sm)'
                }}>
                    <AlertTriangle size={20} color="#f59e0b" />
                    <h3 style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: 'var(--text-main)'
                    }}>
                        Problem Statement
                    </h3>
                </div>
                <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.5'
                }}>
                    Identify and analyze spatial inequities in access to essential services.
                    Help prioritize infrastructure improvements for underserved communities.
                </p>
            </div>

            <div style={{ padding: 'var(--spacing-lg)', flex: 1 }}>
                {/* Data Layers Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        marginBottom: 'var(--spacing-md)',
                        paddingLeft: 'var(--spacing-sm)',
                        letterSpacing: '0.05em'
                    }}>
                        📊 Data Layers
                    </h3>
                    <SidebarItem
                        icon={Hospital}
                        label="Health Facilities"
                        active={showHospitals}
                        onClick={() => setShowHospitals(!showHospitals)}
                        badge="162"
                    />
                    <SidebarItem
                        icon={GraduationCap}
                        label="Education Facilities"
                        active={showSchools}
                        onClick={() => setShowSchools(!showSchools)}
                        badge="757"
                    />
                    <SidebarItem
                        icon={Users}
                        label="Population Centers"
                        active={showPopulation}
                        onClick={() => setShowPopulation(!showPopulation)}
                        badge="25K+"
                    />
                </div>

                {/* Analysis Tools Section */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <h3 style={{
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        color: 'var(--text-muted)',
                        fontWeight: 700,
                        marginBottom: 'var(--spacing-md)',
                        paddingLeft: 'var(--spacing-sm)',
                        letterSpacing: '0.05em'
                    }}>
                        🔍 Analysis Tools
                    </h3>

                    {/* Route Planner Button */}
                    <button
                        onClick={onOpenRoutePlanner}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-md)',
                            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                            transition: 'all var(--transition-fast)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 11l19-9-9 19-2-8-8-2z" />
                        </svg>
                        Route Planner
                    </button>

                    <SidebarItem
                        icon={MapPin}
                        label="Catchment Areas"
                        active={showIsochrone}
                        onClick={() => setShowIsochrone(!showIsochrone)}
                    />

                    {showIsochrone && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            backgroundColor: 'rgba(59, 130, 246, 0.05)',
                            borderRadius: 'var(--radius-md)',
                            marginTop: 'var(--spacing-sm)',
                            marginBottom: 'var(--spacing-sm)',
                            border: '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                            <label style={{
                                fontSize: '0.875rem',
                                color: 'var(--text-main)',
                                display: 'block',
                                marginBottom: 'var(--spacing-xs)',
                                fontWeight: 600
                            }}>
                                Travel Time: {isochroneTime} minutes
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={isochroneTime}
                                onChange={(e) => setIsochroneTime(Number(e.target.value))}
                                style={{
                                    width: '100%',
                                    cursor: 'pointer',
                                    accentColor: 'var(--color-accent)'
                                }}
                            />
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                marginTop: 'var(--spacing-xs)'
                            }}>
                                <span>5 min</span>
                                <span>60 min</span>
                            </div>
                            <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                marginTop: 'var(--spacing-sm)',
                                padding: 'var(--spacing-xs)',
                                backgroundColor: 'white',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--border-color)'
                            }}>
                                💡 Click on the map to see reachable areas
                            </div>
                        </div>
                    )}

                    <SidebarItem
                        icon={TrendingUp}
                        label="Accessibility Score"
                    />
                </div>

                {/* Key Insights */}
                <div style={{
                    padding: 'var(--spacing-md)',
                    backgroundColor: 'rgba(239, 68, 68, 0.05)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)',
                        marginBottom: 'var(--spacing-sm)'
                    }}>
                        <Info size={16} color="#ef4444" />
                        <h4 style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#ef4444'
                        }}>
                            Key Objectives
                        </h4>
                    </div>
                    <ul style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.6',
                        paddingLeft: '1.2rem',
                        margin: 0
                    }}>
                        <li>Identify service deserts</li>
                        <li>Map underserved communities</li>
                        <li>Support equity-based planning</li>
                        <li>Prioritize infrastructure needs</li>
                    </ul>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                padding: 'var(--spacing-md)',
                borderTop: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-body)'
            }}>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>
                        Promoting Equitable Access
                    </p>
                    <p style={{ margin: 0 }}>
                        Data-driven spatial analysis for Malawi
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
