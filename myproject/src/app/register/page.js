'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('resident'); // default role
  const [specialization, setSpecialization] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async () => {
    setError('');

    if (!name || !email || !password || !role) {
      setError('Please fill all required fields');
      return;
    }
    if (role === 'worker' && !specialization) {
      setError('Please select specialization');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, flatNo, role, specialization }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      alert('Registered successfully! Please login.');
      router.push('/login');
    } catch {
      setError('Server error');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
      <h2>Register</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      /><br /><br />

      {role === 'resident' && (
        <>
          <input
            placeholder="Flat Number"
            value={flatNo}
            onChange={e => setFlatNo(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          /><br /><br />
        </>
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      /><br /><br />

      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        style={{ width: '100%', padding: 8 }}
      >
        <option value="resident">Resident</option>
        <option value="worker">Worker</option>
      </select><br /><br />

      {role === 'worker' && (
        <select
          value={specialization}
          onChange={e => setSpecialization(e.target.value)}
          style={{ width: '100%', padding: 8 }}
        >
          <option value="">Select specialization</option>
          <option value="electrician">Electrician</option>
          <option value="plumber">Plumber</option>
          <option value="carpenter">Carpenter</option>
        </select>
      )}
      <br /><br />

      <button onClick={handleRegister} style={{ padding: '10px 20px' }}>
        Register
      </button>
      {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
    </div>
  );
}
