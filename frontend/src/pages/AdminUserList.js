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
  const navigate = useNavigate(); // Hook pour naviguer entre les pages

  const fetchUsers = async () => {
    setLoading(true);
    setError(''); // Reset des erreurs avant chaque appel
    try {
      const params = new URLSearchParams({ name, email, role }).toString();
      const response = await fetch(`http://localhost:5000/api/users?${params}`, {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajout du token pour l'authentification
        },
      });
  
      if (!response.ok) {
        // Si la réponse est une erreur (status != 2xx), afficher le message d'erreur
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des utilisateurs.');
      }
  
      const data = await response.json();
      setUsers(data);
      setSuccess('Utilisateurs récupérés avec succès.');
    } catch (err) {
      // Affichage de l'erreur complète
      console.error('Erreur lors de la récupération des utilisateurs:', err);
      setError(err.message);
      setUsers([]); // On vide la liste des utilisateurs en cas d'erreur
    }
    setLoading(false);
  };
  
  
  const fetchRoles = async () => {
    setError(''); // Reset des erreurs avant chaque appel
    setSuccess('');
    try {
      const response = await fetch('http://localhost:5000/api/roles', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Si authentification est requise
        },
      });
  
      if (!response.ok) {
        // Si la réponse est une erreur (status != 2xx), afficher le message d'erreur
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData);
        throw new Error(errorData.message || 'Erreur lors de la récupération des rôles.');
      }
  
      const data = await response.json();
      setRoles(data);
      setSuccess('Rôles récupérés avec succès.');
    } catch (err) {
      console.error('Erreur lors de la récupération des rôles:', err);
      setError(err.message);
      setRoles([]); // On vide la liste des rôles en cas d'erreur
    }
  };
  
  // Fonction pour mettre à jour un rôle
  const updateRole = async (userId, newRoleId) => {
    setError(''); // Reset des erreurs avant chaque appel
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Ajout du token pour l'authentification
        },
        body: JSON.stringify({ roleId: newRoleId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la mise à jour du rôle.');
      }

      setSuccess('Le rôle a été mis à jour avec succès !');
      fetchUsers(); // Rafraîchir la liste des utilisateurs
    } catch (err) {
      setError(err.message);
      setSuccess(''); // En cas d'erreur, on vide le message de succès
    }
  };

  // Chargement initial des utilisateurs et des rôles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []); // Effectué une seule fois lors du chargement du composant

  return (
    <div className="admin-container">
      <img src={logo} alt="Site Logo" className="site-logo" /> {/* Affiche le logo */}
      <h1>Gestion des Utilisateurs</h1>

      <form onSubmit={(e) => { e.preventDefault(); fetchUsers(); }} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginRight: "10px" }}
        />
        <select value={role} onChange={(e) => setRole(e.target.value)} style={{ marginRight: "10px" }}>
          <option value="">Tous les rôles</option>
          {roles.map((role) => (
            <option key={role.id_role} value={role.id_role}>
              {role.name_role}
            </option>
          ))}
        </select>
        <button type="submit">Rechercher</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table border="1" style={{ width: "100%", textAlign: "left" }}>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id_profile}>
                <td>{user.name_profile}</td>
                <td>{user.mail_profile}</td>
                <td>
                  {user.roles && user.roles.length > 0
                    ? user.roles.map((role) => role.name_role).join(", ")
                    : "Aucun rôle"}
                </td>
                <td>
                  <select
                    value={user.id_role || ""}
                    onChange={(e) => updateRole(user.id_profile, e.target.value)}
                  >
                    <option value="" disabled></option>
                    {roles.map((role) => (
                      <option key={role.id_role} value={role.id_role}>
                        {role.name_role}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPage;