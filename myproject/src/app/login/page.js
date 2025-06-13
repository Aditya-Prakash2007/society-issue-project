'use client'
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin(e) {
    e.preventDefault();    // stop page reload

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);

        alert('Login successful');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Error during login:', err);
      alert('Something went wrong');
    }
  }

  return (
    <div className="container">
      <h1>Login Page</h1>
      <form onSubmit={handleLogin}>
        <input  type="email" placeholder="Email" onChange={e => setEmail(e.target.value)}  required/>
      
        <input  type="password" placeholder="Password"  onChange={e => setPassword(e.target.value)} required />
         
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
          
         
          
    

