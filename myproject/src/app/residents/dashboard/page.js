'use client';

import { useState, useEffect } from 'react';

export default function ResidentDashboard() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setCurrentUserId(id);

    if (id) {
      // Fetch complaints for this user from backend API
      fetch(`http://localhost:5000/api/complaints/user/${id}`)
        .then(res => res.json())
        .then(data => setComplaints(data))
        .catch(err => {
          console.error('Failed to fetch complaints', err);
          setComplaints([]);
        });
    }
  }, []);

  if (!currentUserId) return <div>Loading user info...</div>;

  if (complaints.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
        <h1>Resident Dashboard</h1>
        <p>No complaints filed yet.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h1>Resident Dashboard</h1>
      <ul>
        {complaints.map(c => (
          <li key={c._id || c.id}>
            <strong>{c.category}</strong> - {c.status} ({c._id || c.id})
          </li>
        ))}
      </ul>
    </div>
  );
}
