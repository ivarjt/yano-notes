import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Notes from './components/Notes';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // Try to get username from localStorage token for display only
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        setUsername(decoded.sub);
      } catch (error) {
        console.error('Invalid token in localStorage, removing...');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const handleLogin = (newToken) => {
    try {
      const decoded = jwtDecode(newToken);
      setUsername(decoded.sub);
      localStorage.setItem('token', newToken);
    } catch (error) {
      console.error('Failed to decode token');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername(null);
  };

  return (
    <Router>
      <nav style={{ marginBottom: '1rem' }}>
        {!username ? (
          <>
            <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginRight: '1rem' }}>Logged in as {username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home username={username} onLogout={handleLogout} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
