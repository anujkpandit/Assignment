import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../Signin.css';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleGoogleLogin = () => {
  window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
};


    const validateForm = () => {
        if (!formData.email || !formData.password) {
            return '⚠️ All fields are required.';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            return '❌ Please enter a valid email address.';
        }
        if (formData.password.length < 6) {
            return '🔑 Password must be at least 6 characters long.';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post('/users/login', formData);
            if (response.data?.token) {
                localStorage.setItem('authToken', response.data.token);
                navigate('/dashboard');
            } else {
                setError('Login successful, but no token was provided.');
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    'Login failed. Please check your credentials.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Login</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    disabled={loading}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
            <button onClick={handleGoogleLogin} disabled={loading} className="button-google">
  <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google Logo" />
  Sign in with Google
</button>

            <Link to="/register">Don&apos;t have an account? Register</Link>
        </div>
    );
};

export default Login;
