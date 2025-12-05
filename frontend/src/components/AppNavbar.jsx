import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AppNavbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">BookStore</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav" aria-controls="nav" aria-expanded="false">
                    <span className="navbar-toggler-icon" />
                </button>
                <div className="collapse navbar-collapse" id="nav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/cart">Cart</Link></li>
                        {user?.role === 'admin' && (
                            <li className="nav-item"><Link className="nav-link" to="/admin">Admin</Link></li>
                        )}
                    </ul>
                    <ul className="navbar-nav ms-auto">
                        {!user ? (
                            <>
                                <li className="nav-item"><Link className="nav-link" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link" to="/register">Register</Link></li>
                            </>
                        ) : (
                            <li className="nav-item dropdown">
                                <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">{user.name}</a>
                                <ul className="dropdown-menu dropdown-menu-end">
                                    <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                                    <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
                                </ul>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}
