import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getUsers, updateUser, deleteUser } from '../services/authService';
import './UsersList.css';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
  });

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchUsers();
  }, [currentPage, isAuthenticated, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUsers(currentPage);
      setUsers(data.data);
      setTotalPages(data.total_pages);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUser(editingUser.id, editForm);
      // Update the user in the local state
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...updatedUser }
          : user
      ));
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        if (users.length === 1 && currentPage > 1) {
          setCurrentPage(prev => prev - 1);
        }
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="users-container">
      <h2>Users List</h2>
      {error && <div className="error-message">{error}</div>}
      
      <div className="users-grid">
        {users.map((user) => (
          <div key={user.id} className="user-card">
            {editingUser?.id === user.id ? (
              <form onSubmit={handleUpdate} className="edit-form">
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  placeholder="First Name"
                />
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  placeholder="Last Name"
                />
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Email"
                />
                <div className="button-group">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setEditingUser(null)}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <img src={user.avatar} alt={`${user.first_name} ${user.last_name}`} className="user-avatar" />
                <h3>{user.first_name} {user.last_name}</h3>
                <p>{user.email}</p>
                <div className="button-group">
                  <button onClick={() => handleEdit(user)}>Edit</button>
                  <button onClick={() => handleDelete(user.id)} className="delete">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList; 