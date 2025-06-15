'use client';
import { useEffect, useState } from 'react';

export default function WorkerDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [qrInput, setQrInput] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/worker/my-complaints', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log('Complaints fetched:', data);
        if (Array.isArray(data)) {
          setComplaints(data);
        } else if (Array.isArray(data.complaints)) {
          setComplaints(data.complaints);
        } else {
          setComplaints([]);
        }
      })
      .catch(err => {
        console.error('Error fetching complaints:', err);
        setComplaints([]);
      });
  }, []);

  const markInProgress = async (id) => {
    await fetch(`http://localhost:5000/api/worker/${id}/in-progress`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    setComplaints(prev =>
      prev.map(c => c._id === id ? { ...c, status: 'In Progress' } : c)
    );
  };

  const markResolved = async () => {
    const res = await fetch(`http://localhost:5000/api/worker/${selectedId}/resolve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ qrCodeText: qrInput })
    });

    const data = await res.json();
    if (data.error) {
      alert(data.error);
    } else {
      alert(`${data.message}\nTokens: ${data.totalTokens}\nMoney: ₹${data.estimatedMoney}`);
      setComplaints(prev =>
        prev.map(c => c._id === selectedId ? { ...c, status: 'Resolved' } : c)
      );
      setQrInput('');
      setSelectedId(null);
    }
  };

  // Find the selected complaint object to show details
  const selectedComplaint = complaints.find(c => c._id === selectedId);

  return (
    <div style={{ padding: 20 }}>
      <h1>Worker Dashboard</h1>
      <ul>
        {complaints.map(c => (
          <li key={c._id} style={{ marginBottom: '15px' }}>
            <strong>{c.category}</strong> - {c.description} <br />
            Status: <i>{c.status}</i> | Priority: {c.priority}
            <br />
            {c.status === 'Submitted' && (
              <button onClick={() => markInProgress(c._id)}>Mark In Progress</button>
            )}
            {c.status === 'In Progress' && (
              <button onClick={() => setSelectedId(c._id)}>Scan QR & Complete</button>
            )}
          </li>
        ))}
      </ul>

      {selectedId && selectedComplaint && (
        <div style={{ marginTop: 20, padding: 15, border: '1px solid #ccc', borderRadius: 5 }}>
          <h3>Verifying Complaint</h3>
          <p><strong>Category:</strong> {selectedComplaint.category}</p>
          <p><strong>Description:</strong> {selectedComplaint.description}</p>

          <h3>Enter QR Code Text</h3>
          <input
            value={qrInput}
            onChange={e => setQrInput(e.target.value)}
            placeholder="Scan QR and paste here"
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
          <button onClick={markResolved}>Verify & Mark Completed</button>
        </div>
      )}
    </div>
  );
}
