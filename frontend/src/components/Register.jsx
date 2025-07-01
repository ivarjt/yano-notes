import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8000/auth/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
  navigate('/login');
} else {
  alert("Registration failed: " + data.detail);
}if (res.ok) {
      setMessage('Account created! You can now log in.');
    } else {
      const data = await res.json();
      setMessage(`Error: ${data.detail || 'Unknown error'}`);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Register</h2>
      <input
        value={username}
        onChange={e => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        value={password}
        onChange={e => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
      />
      <button type="submit">Register</button>
      {message && <p>{message}</p>}
    </form>
  );
}
