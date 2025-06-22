import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ token }) => {
  const [team, setTeam] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/manager/team', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTeam(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load team data.');
        setLoading(false);
      });
  }, [token]);

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px',
        backgroundColor: '#fafafa',
        boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
        borderRadius: '12px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          color: '#1976d2',
          marginBottom: '24px',
          fontWeight: '700',
        }}
      >
        My Team
      </h2>

      {loading && <p style={{ textAlign: 'center', color: '#666' }}>Loading team members...</p>}

      {error && (
        <p
          style={{
            color: '#d32f2f',
            textAlign: 'center',
            marginBottom: '16px',
            fontWeight: '600',
          }}
        >
          {error}
        </p>
      )}

      {!loading && !error && (
        <ul
          style={{
            listStyleType: 'none',
            padding: 0,
            margin: 0,
          }}
        >
          {team.length === 0 ? (
            <li
              style={{
                padding: '10px 0',
                color: '#555',
                fontStyle: 'italic',
                textAlign: 'center',
              }}
            >
              No team members assigned.
            </li>
          ) : (
            team.map((emp) => (
              <li
                key={emp.id}
                style={{
                  padding: '12px 16px',
                  marginBottom: '8px',
                  backgroundColor: '#e3f2fd',
                  borderRadius: '8px',
                  color: '#0d47a1',
                  fontWeight: '600',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  transition: 'background-color 0.3s',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#bbdefb')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
              >
                {emp.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;
