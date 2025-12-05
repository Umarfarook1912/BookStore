import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { FaHome, FaShoppingCart, FaSignInAlt, FaUserPlus, FaUser } from 'react-icons/fa';

export default function AppNavbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Navbar expand="lg" variant="dark" style={{ backgroundColor: 'var(--bs-primary)' }}>
            <Container>
                <Navbar.Brand as={Link} to="/">BookStore</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav" style={{ position: 'relative' }}>
                    <Nav className="nav-center">
                        <Nav.Link as={Link} to="/browse"><FaHome style={{ marginRight: 6 }} />Browse</Nav.Link>
                        <Nav.Link as={Link} to="/cart"><FaShoppingCart style={{ marginRight: 6 }} />Cart</Nav.Link>
                        {user && <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>}
                        {user?.role === 'admin' && (
                            <Nav.Link as={Link} to="/admin">Admin</Nav.Link>
                        )}
                    </Nav>

                    <Nav className="ms-auto nav-right">
                        {!user ? (
                            <>
                                <Nav.Link as={Link} to="/login"><FaSignInAlt style={{ marginRight: 6 }} />Login</Nav.Link>
                                <Nav.Link as={Link} to="/register"><FaUserPlus style={{ marginRight: 6 }} />Register</Nav.Link>
                            </>
                        ) : (
                            <NavDropdown title={<><FaUser style={{ marginRight: 8 }} />{user.name}</>} id="user-dropdown" align="end">
                                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
