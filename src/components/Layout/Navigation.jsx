import { Link, useLocation } from 'react-router-dom';
import { Map, Shield, AlertTriangle } from 'lucide-react';
import './Navigation.css';

function Navigation() {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: Map, label: 'Map View' },
        { path: '/admin', icon: Shield, label: 'Admin Dashboard' },
        { path: '/disasters', icon: AlertTriangle, label: 'Disaster Areas' }
    ];

    return (
        <nav className="main-navigation">
            {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Icon size={20} />
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

export default Navigation;
