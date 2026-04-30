import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const { login, signupParent } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      if (!login(username, password)) {
        setError('Invalid username or password');
      }
    } else {
      const res = signupParent(name, username, password);
      if (res.success) {
        setSuccess('Signup successful! Please login.');
        setIsLogin(true);
        setUsername('');
        setPassword('');
        setName('');
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2>Smart Canteen System</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            {isLogin ? 'Sign in to your account' : 'Register as a Parent'}
          </p>
        </div>

        {error && <div style={{ backgroundColor: 'var(--danger-color)', color: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        {success && <div style={{ backgroundColor: 'var(--success-color)', color: 'white', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', textAlign: 'center' }}>{success}</div>}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" value={name} onChange={e => setName(e.target.value)} required />
            </div>
          )}
          <div className="input-group">
            <label className="input-label">Username</label>
            <input type="text" className="input-field" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="input-group">
            <label className="input-label">Password</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isLogin ? 'Need a parent account? Sign up' : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
