import { useState, useEffect, useCallback } from 'react';
import api from './services/api'; // Use the api service
import './App.css';
import { FaEdit, FaTrash } from 'react-icons/fa';


const CrudContainer = () => {
    // Data state
    const [profiles, setProfiles] = useState([]);
    const [error, setError] = useState('');

    // UI State
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form and editing state
    const [form, setForm] = useState({ name: '', email: '', phoneNumber: '', age: '', fatherNumber: '' });
    const [editId, setEditId] = useState(null);

    // Selection for bulk actions
    const [selected, setSelected] = useState(new Set());

    // Pagination and Sorting State
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [sort, setSort] = useState({ sortBy: 'name', order: 'asc' });

    const profileModel = {
        name: '',
        email: '',
        phoneNumber: '',
        age: '',
        fatherNumber: ''
    };

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError('');
        try {
            const { page } = pagination;
            const { sortBy, order } = sort;
            const response = await api.get(`/profiles?page=${page}&limit=10&sortBy=${sortBy}&order=${order}`);
            setProfiles(
  response.data.profiles.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })
  )
);
            setPagination({
                page: Number(response.data.currentPage),
                totalPages: response.data.totalPages,
            });
        } catch (err) {
            setError('Failed to fetch data. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [pagination.page, sort]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Add Modal Handlers
    const handleAdd = () => {
        setForm(profileModel);
        setShowAddModal(true);
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/profiles', form);
            setShowAddModal(false);
            fetchData(); // Refresh data
        } catch (err) {
            setError('Failed to add profile.');
            console.error(err);
        }
    };

    // Edit Modal Handlers
    const handleEdit = (id) => {
        const profile = profiles.find(p => p._id === id);
        if (!profile) return;
        setEditId(id);
        setForm({
            name: profile.name,
            email: profile.email,
            phoneNumber: profile.phoneNumber,
            age: profile.age,
            fatherNumber: profile.fatherNumber,
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/profiles/${editId}`, form);
            setShowEditModal(false);
            setEditId(null);
            fetchData(); // Refresh data
        } catch (err) {
            setError('Failed to update profile.');
            console.error(err);
        }
    };

    // Delete Handlers
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this profile?')) {
            try {
                await api.delete(`/profiles/${id}`);
                fetchData(); // Refresh data
            } catch (err) {
                setError('Failed to delete profile.');
                console.error(err);
            }
        }
    };

    const handleBulkDelete = async () => {
        if (selected.size === 0) return;
        if (window.confirm(`Are you sure you want to delete ${selected.size} selected profiles?`)) {
            try {
                await api.post('/profiles/delete-many', { ids: [...selected] });
                setSelected(new Set());
                fetchData(); // Refresh data
            } catch (err) {
                setError('Failed to delete selected profiles.');
                console.error(err);
            }
        }
    };

    // Selection Handlers
    const handleSelect = (id) => {
        const newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelected(newSelected);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelected(new Set(profiles.map(p => p._id)));
        } else {
            setSelected(new Set());
        }
    };

    // Sorting and Pagination Handlers
    const handleSort = (sortByField) => {
        const newOrder = sort.sortBy === sortByField && sort.order === 'asc' ? 'desc' : 'asc';
        setSort({ sortBy: sortByField, order: newOrder });
    };

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= pagination.totalPages) {
            setPagination(p => ({ ...p, page: newPage }));
        }
    };

    // Render Logic
    const renderTableHeader = () => {
        const headers = ['Name', 'Email', 'Phone Number', 'Age', "Father's Number", 'Created At'];
        const fields = ['name', 'email', 'phoneNumber', 'age', 'fatherNumber', 'createdAt'];
        return (
            <tr>
                <th><input type="checkbox" onChange={handleSelectAll} checked={selected.size === profiles.length && profiles.length > 0} /></th>
                {headers.map((header, index) => (
                    <th key={fields[index]} onClick={() => handleSort(fields[index])}>
                        {header} {sort.sortBy === fields[index] ? (sort.order === 'asc' ? '▲' : '▼') : ''}
                    </th>
                ))}
                <th>Actions</th>
            </tr>
        );
    };

    const renderTableBody = () => {
        if (isLoading) return <tr><td colSpan="8" style={{ textAlign: 'center' }}>Loading...</td></tr>;
        if (error) return <tr><td colSpan="8" style={{ textAlign: 'center', color: 'red' }}>{error}</td></tr>;
        if (profiles.length === 0) return <tr><td colSpan="8" style={{ textAlign: 'center' }}>No profiles found.</td></tr>;

        return profiles.map(profile => (
            <tr key={profile._id}>
                <td><input type="checkbox" checked={selected.has(profile._id)} onChange={() => handleSelect(profile._id)} /></td>
                <td>{profile.name}</td>
                <td>{profile.email}</td>
                <td>{profile.phoneNumber}</td>
                <td>{profile.age}</td>
                <td>{profile.fatherNumber}</td>
                <td>{new Date(profile.createdAt).toLocaleDateString()}</td>
                <td>
                    <button className="edit-button" onClick={() => handleEdit(profile._id)}><FaEdit /></button>
                    <button className="delete-button" onClick={() => handleDelete(profile._id)}><FaTrash /></button>
                </td>
            </tr>
        ));
    };

    const renderPagination = () => (
        <div className="pagination-container">
            <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page <= 1}>Previous</button>
            <span>Page {pagination.page} of {pagination.totalPages || 1}</span>
            <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>Next</button>
        </div>
    );

    const renderModal = (title, handleSubmit, children, onCancel) => (
        <div className="crud-modal-overlay">
            <div className="crud-modal">
                <h3>{title}</h3>
                <form className="crud-modal-form" onSubmit={handleSubmit}>
                    {children}
                    <div className="modal-actions">
                        <button type="button" onClick={onCancel}>Cancel</button>
                        <button type="submit">{title.split(' ')[0]}</button>
                    </div>
                </form>
            </div>
        </div>
    );

    const formFields = (
        <>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" required />
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
            <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="Age" required />
            <input name="fatherNumber" value={form.fatherNumber} onChange={handleChange} placeholder="Father's Number" required />
        </>
    );

    return (
        <div className="crud-container">
            <h2>User Profiles Dashboard</h2>
            <div className="main-actions">
                {selected.size > 0 && <button className="delete-button" onClick={handleBulkDelete}>Delete Selected ({selected.size})</button>}
                <button onClick={handleAdd}>Add Profile</button>
            </div>
            <div className="table-wrapper">
                <table>
                    <thead>{renderTableHeader()}</thead>
                    <tbody>{renderTableBody()}</tbody>
                </table>
            </div>
            {renderPagination()}

            {showAddModal && renderModal("Add Profile", handleAddSubmit, formFields, () => setShowAddModal(false))}
            {showEditModal && renderModal("Edit Profile", handleEditSubmit, formFields, () => setShowEditModal(false))}
        </div>
    );
};

export default CrudContainer;
