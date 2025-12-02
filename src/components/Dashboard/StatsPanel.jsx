import { useState, useEffect } from 'react';
import { Activity, Users, Clock, ChevronDown, ChevronUp, AlertTriangle, MapPin, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, subtext, color, trend }) => (
    <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        marginBottom: 'var(--spacing-sm)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
    }}>
        <div style={{
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: color,
            color: 'white',
            display: 'flex',
            boxShadow: `0 4px 12px ${color}40`
        }}>
            <Icon size={22} />
        </div>
        <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>
                {label}
            </div>
            <div style={{ 
                fontSize: '1.5rem', 
                fontWeight: 800, 
                color: 'var(--text-main)',
                marginBottom: '2px'
            }}>
                {value}
            </div>
            {subtext && (
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    {subtext}
                </div>
            )}
            {trend && (
                <div style={{
                    fontSize: '0.7rem',
                    color: trend.type === 'good' ? '#10b981' : '#ef4444',
                    marginTop: '4px',
                    fontWeight: 600
                }}>
                    {trend.text}
                </div>
            )}
        </div>
    </div>
);

const StatsPanel = () => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        // Fetch facility counts
        fetch('/api/facilities')
            .then(res => res.json())
            .then(data => {
                const hospitals = data.features.filter(f => {
                    const type = f.properties.type?.toLowerCase() || '';
                    return type.includes('hospital') || type.includes('clinic') || type.includes('pharmacy');
                }).length;
                
                const schools = data.features.filter(f => {
                    const type = f.properties.type?.toLowerCase() || '';
                    return type.includes('school') || type.includes('kindergarten') || 
                           type.includes('college') || type.includes('university');
                }).length;

                setStats({ hospitals, schools, total: data.features.length });
            })
            .catch(err => console.error('Error fetching stats:', err));
    }, []);

    return (
        <div className="glass-panel" style={{
            position: 'absolute',
            top: 'var(--spacing-md)',
            right: 'var(--spacing-md)',
            width: '340px',
            zIndex: 1000,
            padding: 'var(--spacing-md)',
            borderRadius: 'var(--radius-lg)',
            transition: 'all var(--transition-normal)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
        }}>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isExpanded ? 'var(--spacing-md)' : 0,
                    cursor: 'pointer',
                    padding: 'var(--spacing-xs)'
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <h2 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '10px',
                    color: 'var(--text-main)'
                }}>
                    <Activity size={20} color="#3b82f6" />
                    Accessibility Metrics
                </h2>
                <button style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    padding: '4px'
                }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
            </div>

            {isExpanded && (
                <div className="animate-slide-in">
                    <StatCard
                        icon={Activity}
                        label="Health Facilities"
                        value={stats ? stats.hospitals : '...'}
                        subtext="Hospitals, Clinics, Pharmacies"
                        color="#ef4444"
                        trend={{ type: 'info', text: 'Covering major urban areas' }}
                    />
                    <StatCard
                        icon={Users}
                        label="Education Facilities"
                        value={stats ? stats.schools : '...'}
                        subtext="Schools, Colleges, Universities"
                        color="#10b981"
                        trend={{ type: 'info', text: 'Distributed across regions' }}
                    />
                    <StatCard
                        icon={MapPin}
                        label="Coverage Analysis"
                        value="Active"
                        subtext="Click map for catchment areas"
                        color="#3b82f6"
                    />
                    
                    {/* Problem-Solving Insights */}
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        backgroundColor: 'rgba(245, 158, 11, 0.1)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(245, 158, 11, 0.3)'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-xs)',
                            marginBottom: 'var(--spacing-sm)'
                        }}>
                            <AlertTriangle size={16} color="#f59e0b" />
                            <h3 style={{
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                color: '#f59e0b',
                                margin: 0
                            }}>
                                Analysis Goals
                            </h3>
                        </div>
                        <ul style={{
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)',
                            lineHeight: '1.7',
                            paddingLeft: '1.2rem',
                            margin: 0
                        }}>
                            <li>Identify service deserts</li>
                            <li>Map travel time disparities</li>
                            <li>Support infrastructure planning</li>
                            <li>Promote equitable access</li>
                        </ul>
                    </div>

                    {/* Quick Guide */}
                    <div style={{
                        marginTop: 'var(--spacing-sm)',
                        padding: 'var(--spacing-sm)',
                        backgroundColor: 'rgba(59, 130, 246, 0.05)',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5'
                    }}>
                        <strong style={{ color: 'var(--text-main)' }}>💡 Quick Start:</strong><br />
                        1. Enable layers in sidebar<br />
                        2. Activate catchment analysis<br />
                        3. Click map to identify gaps
                    </div>
                </div>
            )}
        </div>
    );
};

export default StatsPanel;
