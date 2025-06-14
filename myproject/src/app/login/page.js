'use client'
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tokens, setTokens] = useState(null);
  const [message, setMessage] = useState('');

  async function handleLogin(e) {
    e.preventDefault();

    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setTokens(data.tokens);
      setMessage(`Login successful! Your tokens: ${data.tokens}`);
      localStorage.setItem('token', data.token);  
    } else {
      setMessage(data.error || 'Login failed');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {tokens !== null && (
        <div>
          <h3>Your Token Balance:</h3>
          <p>{tokens} tokens</p>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}
