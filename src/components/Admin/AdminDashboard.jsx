import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, MapPin, Building2, School } from 'lucide-react';
import './AdminDashboard.css';

function AdminDashboard() {
    const [facilities, setFacilities] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFacility, setEditingFacility] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        type: 'hospital',
        latitude: '',
        longitude: '',
        address: '',
        capacity: '',
        contact: ''
    });
    const [stats, setStats] = useState({
        totalHospitals: 0,
        totalSchools: 0,
        totalFacilities: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFacilities();
        fetchStats();
    }, []);

    const fetchFacilities = async () => {
        try {
            const response = await fetch('/api/admin/facilities');
            if (!response.ok) throw new Error('API not available');
            const data = await response.json();
            setFacilities(data);
        } catch (error) {
            console.warn('Using mock data (demo mode):', error.message);
            // Mock data for demonstration
            setFacilities([
                {
                    id: 1,
                    name: 'Kamuzu Central Hospital',
                    type: 'hospital',
                    latitude: -13.9833,
                    longitude: 33.7833,
                    address: 'Lilongwe, Malawi',
                    capacity: 500,
                    contact: '+265 1 754 333'
                },
                {
                    id: 2,
                    name: 'Queen Elizabeth Central Hospital',
                    type: 'hospital',
                    latitude: -15.7833,
                    longitude: 35.0167,
                    address: 'Blantyre, Malawi',
                    capacity: 1000,
                    contact: '+265 1 871 911'
                },
                {
                    id: 3,
                    name: 'Lilongwe Primary School',
                    type: 'school',
                    latitude: -13.9833,
                    longitude: 33.7900,
                    address: 'Lilongwe, Malawi',
                    capacity: 800,
                    contact: '+265 1 754 000'
                }
            ]);
            setError('Using sample data (demo mode)');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/admin/stats');
            if (!response.ok) throw new Error('API not available');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.warn('Using mock stats (demo mode)');
            // Mock stats
            setStats({
                totalHospitals: 45,
                totalSchools: 120,
                totalFacilities: 165
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const url = editingFacility 
            ? `/api/admin/facilities/${editingFacility.id}`
            : '/api/admin/facilities';
        
        const method = editingFacility ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchFacilities();
                fetchStats();
                resetForm();
                setShowAddModal(false);
            }
        } catch (error) {
            console.error('Error saving facility:', error);
            alert('Failed to save facility');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this facility?')) return;

        try {
            const response = await fetch(`/api/admin/facilities/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchFacilities();
                fetchStats();
            }
        } catch (error) {
            console.error('Error deleting facility:', error);
            alert('Failed to delete facility');
        }
    };

    const handleEdit = (facility) => {
        setEditingFacility(facility);
        setFormData({
            name: facility.name,
            type: facility.type,
            latitude: facility.latitude,
            longitude: facility.longitude,
            address: facility.address || '',
            capacity: facility.capacity || '',
            contact: facility.contact || ''
        });
        setShowAddModal(true);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            type: 'hospital',
            latitude: '',
            longitude: '',
            address: '',
            capacity: '',
            contact: ''
        });
        setEditingFacility(null);
    };

    if (loading) {
        return (
            <div className="admin-dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
                    <h2>Loading Admin Dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {error && (
                <div style={{
                    background: '#fef3c7',
                    border: '1px solid #f59e0b',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '20px',
                    color: '#92400e'
                }}>
                    {error}
                </div>
            )}
            
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <button 
                    className="btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowAddModal(true);
                    }}
                >
                    <Plus size={20} />
                    Add New Facility
                </button>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <Building2 size={32} />
                    <div>
                        <h3>{stats.totalHospitals}</h3>
                        <p>Hospitals</p>
                    </div>
                </div>
                <div className="stat-card">
                    <School size={32} />
                    <div>
                        <h3>{stats.totalSchools}</h3>
                        <p>Schools</p>
                    </div>
                </div>
                <div className="stat-card">
                    <MapPin size={32} />
                    <div>
                        <h3>{stats.totalFacilities}</h3>
                        <p>Total Facilities</p>
                    </div>
                </div>
            </div>

            <div className="facilities-table">
                <h2>All Facilities</h2>
                {facilities.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        color: '#6b7280'
                    }}>
                        <MapPin size={48} style={{ margin: '0 auto 20px', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '10px' }}>No facilities yet</h3>
                        <p>Click "Add New Facility" to get started</p>
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facilities.map(facility => (
                                <tr key={facility.id}>
                                    <td>{facility.name}</td>
                                    <td>
                                        <span className={`badge badge-${facility.type}`}>
                                            {facility.type}
                                        </span>
                                    </td>
                                    <td>{facility.latitude}, {facility.longitude}</td>
                                    <td>{facility.address || 'N/A'}</td>
                                    <td>
                                        <button 
                                            className="btn-icon"
                                            onClick={() => handleEdit(facility)}
                                            title="Edit"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button 
                                            className="btn-icon btn-danger"
                                            onClick={() => handleDelete(facility.id)}
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showAddModal && (
                <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>{editingFacility ? 'Edit Facility' : 'Add New Facility'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Facility Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({...formData, type: e.target.value})}
                                    required
                                >
                                    <option value="hospital">Hospital</option>
                                    <option value="school">School</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Latitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={e => setFormData({...formData, latitude: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Longitude *</label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={e => setFormData({...formData, longitude: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={e => setFormData({...formData, address: e.target.value})}
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Capacity</label>
                                    <input
                                        type="number"
                                        value={formData.capacity}
                                        onChange={e => setFormData({...formData, capacity: e.target.value})}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Contact</label>
                                    <input
                                        type="text"
                                        value={formData.contact}
                                        onChange={e => setFormData({...formData, contact: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button 
                                    type="button" 
                                    className="btn-secondary"
                                    onClick={() => {
                                        setShowAddModal(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn-primary">
                                    {editingFacility ? 'Update' : 'Add'} Facility
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
