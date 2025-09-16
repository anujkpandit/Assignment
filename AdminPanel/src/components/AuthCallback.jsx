import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AuthCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const token = new URLSearchParams(location.search).get('token');
        if (token) {
            localStorage.setItem('authToken', token);
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    }, [location, navigate]);

    return <div>Loading...</div>;
};

export default AuthCallback;
