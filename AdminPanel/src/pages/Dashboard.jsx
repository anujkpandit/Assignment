import { useNavigate } from 'react-router-dom';
import CrudContainer from '../CrudContainer'; // Assuming CrudContainer is in src/

const Dashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem' }}>
                <h1>Dashboard</h1>
                <button onClick={handleLogout} className='logout-btn'>Logout</button>
            </header>
            <main>
                <CrudContainer />
            </main>
        </div>
    );
};

export default Dashboard;
