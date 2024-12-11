import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png'; // Import du logo

const AdminGroupCreation = () => {
  const [studentGroups, setStudentGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [groupStudents, setGroupStudents] = useState([]);
  const [searchGroup, setSearchGroup] = useState('');
  const [searchStudent, setSearchStudent] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [newGroupName, setNewGroupName] = useState('');
  const [yearStudentGroup, setYearStudentGroup] = useState('');
  const [semesterStudentGroup, setSemesterStudentGroup] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch all student groups
  const fetchStudentGroups = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/student-groups', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching student groups.');
      }

      const data = await response.json();
      setStudentGroups(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/students', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching students.');
      }

      const data = await response.json();
      console.log(data); // Ajoutez cette ligne pour inspecter les données

      // Filtrage basé sur un champ role ou une autre condition
      const filteredStudents = data.filter(student => student.role === 'student');
      setStudents(filteredStudents);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Fetch students in a selected group
  const fetchGroupStudents = async (groupId) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:5000/api/student-groups/${groupId}/students`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error fetching group students.');
      }

      const data = await response.json();
      setGroupStudents(data);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Create a new student group
  const createStudentGroup = async () => {
    if (!newGroupName || !yearStudentGroup || !semesterStudentGroup) {
      setError('Please fill in all fields for the new group.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/student-groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name_student_group: newGroupName,
          year_student_group: yearStudentGroup,
          semester_student_group: semesterStudentGroup,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creating student group.');
      }

      setNewGroupName('');
      setYearStudentGroup('');
      setSemesterStudentGroup('');
      fetchStudentGroups(); // Refresh the student groups list
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Add student to selected group
  const addStudentToGroup = async (studentId) => {
    if (!selectedGroup) {
      setError('Please select a group first.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/student-groups/${selectedGroup}/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ studentId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error adding student to group.');
      }

      fetchGroupStudents(selectedGroup); // Refresh students in the selected group
      fetchStudents(); // Refresh the students list
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Handle group search
  const handleGroupSearchChange = (event) => {
    setSearchGroup(event.target.value);
  };

  // Handle student search
  const handleStudentSearchChange = (event) => {
    setSearchStudent(event.target.value);
  };

  // Handle group selection
  const handleGroupSelect = (groupId) => {
    setSelectedGroup(groupId);
    fetchGroupStudents(groupId); // Fetch students in the selected group
  };

  // useEffect to fetch student groups and students when the component is mounted
  useEffect(() => {
    fetchStudentGroups();
    fetchStudents();
  }, []);

  return (
    <div className="admin-container">
      <img src={logo} alt="Site Logo" className="site-logo" />
      <h1>Student Group Management</h1>

      <div className="content">
        {/* First Column: Student Groups */}
        <div className="column">
          <h2>Student Groups</h2>
          <input
            type="text"
            placeholder="Search Student Groups"
            value={searchGroup}
            onChange={handleGroupSearchChange}
            style={{ marginBottom: '10px' }}
          />
          <ul>
            {studentGroups
              .filter((group) =>
                group.name_student_group.toLowerCase().includes(searchGroup.toLowerCase())
              )
              .map((group) => (
                <li key={group.id_student_group}>
                  <button
                    className={selectedGroup === group.id_student_group ? 'selected' : ''}
                    onClick={() => handleGroupSelect(group.id_student_group)}
                  >
                    {group.name_student_group}
                  </button>
                </li>
              ))}
          </ul>

          <div>
            <input
              type="text"
              placeholder="New Group Name"
              value={newGroupName}
              onChange={(e) => setNewGroupName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Year (e.g., 2024)"
              value={yearStudentGroup}
              onChange={(e) => setYearStudentGroup(e.target.value)}
            />
            <input
              type="text"
              placeholder="Semester (e.g., Spring)"
              value={semesterStudentGroup}
              onChange={(e) => setSemesterStudentGroup(e.target.value)}
            />
            <button onClick={createStudentGroup}>Create Group</button>
          </div>
        </div>

        {/* Second Column: Students */}
        <div className="column">
          <h2>Students</h2>
          <input
            type="text"
            placeholder="Search Students"
            value={searchStudent}
            onChange={handleStudentSearchChange}
            style={{ marginBottom: '10px' }}
          />
          <ul>
            {students
              .filter((student) =>
                `${student.first_name_profile} ${student.last_name_profile}`
                  .toLowerCase()
                  .includes(searchStudent.toLowerCase())
              )
              .map((student) => (
                <li key={student.id_profile}>
                  <span>
                    {student.first_name_profile} {student.last_name_profile}
                  </span>
                  <button onClick={() => addStudentToGroup(student.id_profile)}>
                    Add to Group
                  </button>
                </li>
              ))}
          </ul>
        </div>

        {/* Third Column: Students in Selected Group */}
        <div className="column">
          <h2>Students in Selected Group</h2>
          {selectedGroup ? (
            groupStudents.length > 0 ? (
              <ul>
                {groupStudents.map((student) => (
                  <li key={student.id_profile}>
                    {student.first_name_profile} {student.last_name_profile}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No students in this group yet.</p>
            )
          ) : (
            <p>Select a group to see students.</p>
          )}
        </div>
      </div>

      {/* Loading and Error handling */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* CSS Styles */}
      <style>{`
        .admin-container {
          padding: 20px;
        }

        .site-logo {
          width: 150px;
          margin-bottom: 20px;
        }

        .content {
          display: flex;
          gap: 30px;
        }

        .column {
          width: 33%;
        }

        input[type="text"], input[type="number"] {
          width: 100%;
          padding: 8px;
          margin-bottom: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        button {
          padding: 8px 15px;
          background-color: #888; /* Grey */
          color: white;
          border: none;
          cursor: pointer;
        }

        button:hover {
          background-color: #4CAF50; /* Green */
        }

        button.selected {
          background-color: #1E90FF; /* Blue */
        }

        ul {
          list-style-type: none;
          padding-left: 0;
        }

        ul li {
          margin-bottom: 10px;
        }

        ul li button {
          margin-left: 10px;
        }
      `}</style>
    </div>
  );
};

export default AdminGroupCreation;
