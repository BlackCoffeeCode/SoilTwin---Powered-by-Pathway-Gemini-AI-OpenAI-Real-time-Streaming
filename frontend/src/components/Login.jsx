import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(username, password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Invalid credentials');
        }

        setLoading(false);
    };

    const handleDemoLogin = async (demoUser) => {
        setError('');
        setLoading(true);

        const credentials = {
            admin: { username: 'admin', password: 'password' },
            farmer: { username: 'farmer', password: 'password' },
        };

        const creds = credentials[demoUser];
        const result = await login(creds.username, creds.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">🌱</div>
                        <h1>SoilTwin</h1>
                    </div>
                    <p className="tagline">Digital Twin for Sustainable Agriculture</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#6b7280',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                textDecoration: 'underline'
                            }}
                        >
                            Forgot password?
                        </button>
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="demo-logins">
                    <p className="demo-label">Quick Demo Access:</p>
                    <div className="demo-buttons">
                        <button
                            onClick={() => handleDemoLogin('admin')}
                            className="demo-button admin"
                            disabled={loading}
                        >
                            <span className="demo-icon">👑</span>
                            <span>Admin Login</span>
                        </button>
                        <button
                            onClick={() => handleDemoLogin('farmer')}
                            className="demo-button farmer"
                            disabled={loading}
                        >
                            <span className="demo-icon">👨‍🌾</span>
                            <span>Farmer Login</span>
                        </button>
                    </div>
                </div>

                <div className="login-footer">
                    <p>
                        Don't have an account?{' '}
                        <button
                            className="demo-button"
                            onClick={() => navigate('/register')}
                            style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#5B8C3D' }}
                        >
                            Register here
                        </button>
                    </p>
                    <p style={{ marginTop: '1rem', opacity: 0.7 }}>
                        Powered by Pathway • Gemini AI • Real-time Streaming
                    </p>
                </div>
            </div>

            {/* Animated background */}
            <div className="login-bg">
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
                <div className="particle"></div>
            </div>
        </div>
    );
};

export default Login;
