import React, { useState, useEffect } from 'react';
import '../index.css'; // Assurez-vous que votre CSS est bien importé
import logo from '../assets/images/logo.png'; // Import du logo
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams();
      if (name) params.append('name', name);
      if (email) params.append('email', email);
      if (role) params.append('role', role);

      console.log('Calling fetchUsers function');
      console.log('API request with parameters:', params.toString());

      const response = await fetch(`http://localhost:5000/api/users?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching users.');
      }

      const data = await response.json();
      console.log('Fetched users data:', data);
      setUsers(data);
      setError('');
      setSuccess('Users successfully fetched.');
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
      setUsers([]);
    }
    setLoading(false);
  };

  const fetchRoles = async () => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/roles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error fetching roles.');
      }

      const data = await response.json();
      setRoles(data);
      setSuccess('Roles successfully fetched.');
    } catch (err) {
      console.error('Error fetching roles:', err);
      setError(err.message);
      setRoles([]);
    }
  };

  const updateRole = async (userId, newRoleId) => {
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ roleId: newRoleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error updating role.');
      }

      setSuccess('Role updated successfully!');
      fetchUsers();
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  // useEffect that triggers every time a filter changes (name, email, role)
  useEffect(() => {
    fetchUsers();
  }, [name, email, role]); // This ensures fetchUsers is called each time any of the filters change

  // Handle role change in the filter
  const handleRoleChange = (event) => {
    setRole(event.target.value); // Update the selected role
  };

  // Handle name change in the filter
  const handleNameChange = (event) => {
    setName(event.target.value); // Update the name filter
  };

  // Handle email change in the filter
  const handleEmailChange = (event) => {
    setEmail(event.target.value); // Update the email filter
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="admin-container">
      <img src={logo} alt="Site Logo" className="site-logo" />
      <h1>User Management</h1>

      <form
        style={{ marginBottom: '20px' }}
      >
        <input
          type="text"
          placeholder="First Name"
          value={name}
          onChange={handleNameChange} // Call handleNameChange
          style={{ marginRight: '10px' }}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange} // Call handleEmailChange
          style={{ marginRight: '10px' }}
        />
        <select
          value={role}
          onChange={handleRoleChange} // Call handleRoleChange
          style={{ marginRight: '10px' }}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role.id_role} value={role.id_role}>
              {role.name_role}
            </option>
          ))}
        </select>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id_profile}>
                  <td>{user.first_name_profile} {user.last_name_profile}</td> {/* Display first and last name */}
                  <td>{user.mail_profile}</td>
                  <td>{user.name_role}</td>
                  <td>
                    <select
                      value={user.id_role || ''}
                      onChange={(e) => updateRole(user.id_profile, e.target.value)}
                    >
                      {roles.map((role) => (
                        <option key={role.id_role} value={role.id_role}>
                          {role.name_role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center' }}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;
