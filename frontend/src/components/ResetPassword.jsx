import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import './Login.css';

const ResetPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const emailFromState = location.state?.email || '';

    const [formData, setFormData] = useState({
        email: emailFromState,
        token: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password strength
        if (formData.newPassword.length < 8) {
            setError('Password must be at least 8 characters');
            return;
        }

        if (!/\d/.test(formData.newPassword)) {
            setError('Password must contain at least one number');
            return;
        }

        setLoading(true);

        try {
            await apiClient.post('/api/reset-password', {
                email: formData.email,
                token: formData.token,
                new_password: formData.newPassword
            });

            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Password reset failed');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="success-message" style={{
                        padding: '3rem',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Password Reset Successful!</h3>
                        <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
                            Your password has been updated.
                        </p>
                        <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            Redirecting to login page...
                        </p>
                    </div>
                    <div className="login-bg">
                        <div className="particle"></div>
                        <div className="particle"></div>
                        <div className="particle"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">🔑</div>
                        <h1>Reset Password</h1>
                    </div>
                    <p className="tagline">Enter your reset code and new password</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && (
                        <div className="error-message">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="token">Reset Code</label>
                        <input
                            type="text"
                            id="token"
                            name="token"
                            value={formData.token}
                            onChange={handleChange}
                            placeholder="Enter 6-digit code"
                            required
                            maxLength={6}
                            pattern="\d{6}"
                            style={{ letterSpacing: '0.5rem', fontSize: '1.2rem', textAlign: 'center' }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Enter new password"
                            required
                            autoComplete="new-password"
                        />
                        <small style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                            Min 8 characters, must include a number
                        </small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm new password"
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#5B8C3D',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                            }}
                        >
                            Back to Login
                        </button>
                    </div>
                </form>

                {/* Animated background */}
                <div className="login-bg">
                    <div className="particle"></div>
                    <div className="particle"></div>
                    <div className="particle"></div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
