import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import MapPage from './pages/MapPage';
import AdminDashboard from './components/Admin/AdminDashboard';
import DisasterAreas from './components/Disaster/DisasterAreas';
import './index.css';

function App() {
    return (
        <Router>
            <div className="app-container" style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                width: '100vw',
                overflow: 'hidden',
                backgroundColor: 'var(--bg-body)'
            }}>
                <Header />
                
                <div style={{
                    padding: '15px 30px',
                    background: 'white',
                    borderBottom: '1px solid #e5e7eb'
                }}>
                    <Navigation />
                </div>

                <div style={{
                    display: 'flex',
                    flex: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    width: '100%'
                }}>
                    <Routes>
                        <Route path="/" element={<MapPage />} />
                        <Route path="/admin" element={<AdminDashboard />} />
                        <Route path="/disasters" element={<DisasterAreas />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
