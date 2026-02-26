import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import './Login.css';  // Reuse login styles

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [resetToken, setResetToken] = useState('');  // For dev/testing
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/api/forgot-password', { email });
            setSuccess(true);
            setResetToken(response.data.token);  // For dev - remove in production

            // Auto-navigate to reset page after 2 seconds
            setTimeout(() => {
                navigate('/reset-password', { state: { email } });
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to send reset code');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-container">
                        <div className="logo-icon">🔐</div>
                        <h1>Forgot Password</h1>
                    </div>
                    <p className="tagline">Enter your email to receive a reset code</p>
                </div>

                {!success ? (
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
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                            />
                        </div>

                        <button type="submit" className="login-button" disabled={loading}>
                            {loading ? 'Sending...' : 'Send Reset Code'}
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
                ) : (
                    <div className="success-message" style={{
                        padding: '2rem',
                        background: 'rgba(34, 197, 94, 0.1)',
                        borderRadius: '8px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: '#16a34a', marginBottom: '0.5rem' }}>Reset Code Sent!</h3>
                        <p style={{ color: '#4a5568' }}>
                            Check your email for a 6-digit code.
                        </p>
                        {resetToken && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                background: '#fff3cd',
                                borderRadius: '6px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}>
                                Dev Mode - Your code: {resetToken}
                            </div>
                        )}
                        <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '1rem' }}>
                            Redirecting to reset page...
                        </p>
                    </div>
                )}

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

export default ForgotPassword;
