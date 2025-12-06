import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import {
    FaHome,
    FaShoppingCart,
    FaSignInAlt,
    FaUserPlus,
    FaUser,
    FaBook,
    FaChartBar,
    FaBox,
    FaCog,
    FaSignOutAlt,
    FaSearch,
    FaBell,
    FaStore,
    FaTags
} from 'react-icons/fa';
import './Navbar.css';

export default function AppNavbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <>
           
            {/* Main Navbar */}
            <Navbar expand="lg" variant="dark" className="main-navbar shadow">
                <Container>
                    {/* Brand Logo */}
                    <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
                        <div className="brand-logo me-2">
                            <FaBook />
                        </div>
                        <div>
                            <span className="fw-bold">BookStore</span>
                            <small className="d-block text-light opacity-75">Your Literary Haven</small>
                        </div>
                    </Navbar.Brand>

                    {/* Search Bar - Desktop */}
                    <div className="search-container d-none d-lg-flex">
                        <form onSubmit={handleSearch} className="w-100">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control border-end-0"
                                    placeholder="Search books, authors, genres..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Button
                                    type="submit"
                                    variant="outline-light"
                                    className="border-start-0"
                                >
                                    <FaSearch />
                                </Button>
                            </div>
                        </form>
                    </div>

                    <div className="d-flex align-items-center gap-3 ms-auto">
                        <Navbar.Toggle aria-controls="main-nav" />
                    </div>

                    <Navbar.Collapse id="main-nav">
                        {/* Search Bar - Mobile */}
                        <div className="d-lg-none mb-3">
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search books..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <Button type="submit" variant="primary">
                                        <FaSearch />
                                    </Button>
                                </div>
                            </form>
                        </div>

                        {/* Main Navigation */}
                        <Nav className="mx-auto">
                            <Nav.Link as={Link} to="/" className="nav-link-hover nav-gap">
                                <FaHome className="me-2" /> Home
                            </Nav.Link>
                            <Nav.Link as={Link} to="/browse" className="nav-link-hover nav-gap">
                                <FaStore className="me-2" /> Browse
                            </Nav.Link>
                            <NavDropdown
                                title={
                                    <>
                                        <FaBook className="me-2" /> Categories
                                    </>
                                }
                                id="categories-dropdown"
                                className="nav-dropdown-hover nav-gap"
                            >
                                <NavDropdown.Item as={Link} to="/category/fiction">Fiction</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/category/non-fiction">Non-Fiction</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/category/sci-fi">Science Fiction</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/category/biography">Biography</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item as={Link} to="/browse">All Categories</NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link as={Link} to="/best-sellers" className="nav-link-hover nav-gap">
                                <FaChartBar className="me-2" /> Best Sellers
                            </Nav.Link>
                            {user && (
                                <>
                                    <Nav.Link as={Link} to={user?.role === 'admin' ? '/admin' : '/orders'} className="nav-link-hover nav-gap">
                                        <FaBox className="me-2" /> {user?.role === 'admin' ? 'Dashboard' : 'Orders'}
                                    </Nav.Link>
                                    {user?.role === 'admin' && (
                                        <Nav.Link as={Link} to="/admin/books" className="nav-link-hover nav-gap">
                                            <FaCog className="me-2" /> Manage Books
                                        </Nav.Link>
                                    )}
                                </>
                            )}
                        </Nav>

                        {/* User Section */}
                        <Nav className="ms-lg-auto">
                            {!user ? (
                                <div className="d-flex flex-column flex-lg-row gap-2">
                                    <Button
                                        as={Link}
                                        to="/login"
                                        variant="outline-light"
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <FaSignInAlt className="me-2" /> Login
                                    </Button>
                                    <Button
                                        as={Link}
                                        to="/register"
                                        variant="light"
                                        className="d-flex align-items-center justify-content-center"
                                    >
                                        <FaUserPlus className="me-2" /> Sign Up Free
                                    </Button>
                                </div>
                            ) : (
                                <NavDropdown
                                    title={
                                        <div className="d-flex align-items-center">
                                            <div className="user-avatar me-2">
                                                <FaUser />
                                            </div>
                                            <div className="d-flex flex-column">
                                                <span className="fw-semibold">{user.name}</span>
                                                <small className="text-light opacity-75">{user.role}</small>
                                            </div>
                                        </div>
                                    }
                                    id="user-dropdown"
                                    align="end"
                                    className="user-dropdown"
                                >
                                    <div className="px-3 py-2 user-info">
                                        <div className="fw-semibold">{user.name}</div>
                                        <small className="text-muted">{user.email}</small>
                                    </div>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/profile" className="d-flex align-items-center">
                                        <FaUser className="me-2" /> My Profile
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/orders" className="d-flex align-items-center">
                                        <FaBox className="me-2" /> My Orders
                                    </NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/wishlist" className="d-flex align-items-center">
                                        <FaBook className="me-2" /> Wishlist
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item as={Link} to="/settings" className="d-flex align-items-center">
                                        <FaCog className="me-2" /> Settings
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        onClick={handleLogout}
                                        className="text-danger d-flex align-items-center"
                                    >
                                        <FaSignOutAlt className="me-2" /> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}