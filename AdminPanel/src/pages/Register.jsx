import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import '../Signin.css';

const Register = () => {
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        phonenumber: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const validateForm = () => {
        if (
            !formData.firstname ||
            !formData.lastname ||
            !formData.phonenumber ||
            !formData.email ||
            !formData.password
        ) {
            return '⚠️ All fields are required.';
        }
        if (!/^[A-Za-z]+$/.test(formData.firstname)) {
            return '❌ First name should only contain letters.';
        }
        if (!/^[A-Za-z]+$/.test(formData.lastname)) {
            return '❌ Last name should only contain letters.';
        }
        if (!/^\d{10}$/.test(formData.phonenumber)) {
            return '📞 Phone number must be 10 digits.';
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

        try {
            await api.post('/users/register', formData);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <h1>Register</h1>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <input
                    name="firstname"
                    placeholder="First Name"
                    onChange={handleChange}
                />
                <input
                    name="lastname"
                    placeholder="Last Name"
                    onChange={handleChange}
                />
                <input
                    name="phonenumber"
                    placeholder="Phone Number"
                    onChange={handleChange}
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                />
                <button type="submit">Register</button>
            </form>
            <Link to="/login">Already have an account? Login</Link>
        </div>
    );
};

export default Register;
