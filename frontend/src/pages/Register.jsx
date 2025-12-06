import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import notify from '../services/notify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import ProgressBar from 'react-bootstrap/ProgressBar';
import {
    FaUserPlus,
    FaCheckCircle,
    FaLock,
    FaEnvelope,
    FaUser,
    FaEye,
    FaEyeSlash,
    FaArrowLeft,
    FaShieldAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
        newsletter: true
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const { setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        return strength;
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            notify.toastError('Please enter your name');
            return false;
        }
        if (!formData.email.trim()) {
            notify.toastError('Please enter your email');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            notify.toastError('Please enter a valid email address');
            return false;
        }
        if (formData.password.length < 8) {
            notify.toastError('Password must be at least 8 characters long');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            notify.toastError('Passwords do not match');
            return false;
        }
        if (!formData.agreeTerms) {
            notify.toastError('You must agree to the terms and conditions');
            return false;
        }
        return true;
    };

    const submit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            setUser(res.data.token, res.data.user);
            notify.toastSuccess('Registration successful! Welcome to BookStore!');
            navigate('/');
        } catch (err) {
            notify.toastError(err?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength < 50) return 'danger';
        if (passwordStrength < 75) return 'warning';
        return 'success';
    };

    return (
        <Container className="auth-page">
            <Row className="justify-content-center align-items-center w-100">
                <Col>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="auth-form-container">
                            <div className="auth-header bg-gradient-primary text-white p-4 text-center">
                                <Button
                                    variant="link"
                                    className="text-white position-absolute top-0 start-0 m-3"
                                    onClick={() => navigate('/')}
                                >
                                    <FaArrowLeft />
                                </Button>
                                <div className="auth-icon mb-3">
                                    <FaUserPlus />
                                </div>
                                <h2 className="fw-bold mb-2">Create Account</h2>
                                <p className="mb-0 opacity-75">Join thousands of readers today</p>
                            </div>
                            <Card.Body className="p-4 p-md-5">
                                <Form onSubmit={submit}>
                                    {/* Name Field */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <FaUser className="me-2" />
                                            Full Name
                                        </Form.Label>
                                        <Form.Control
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full name"
                                            required
                                            className="py-3"
                                        />
                                    </Form.Group>

                                    {/* Email Field */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <FaEnvelope className="me-2" />
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            placeholder="Enter your email"
                                            required
                                            className="py-3"
                                        />
                                    </Form.Group>

                                    {/* Password Field */}
                                    <Form.Group className="mb-3">
                                        <Form.Label className="fw-semibold">
                                            <FaLock className="me-2" />
                                            Password
                                        </Form.Label>
                                        <div className="password-input">
                                            <Form.Control
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Create a strong password"
                                                required
                                                className="py-3"
                                            />
                                            <Button
                                                variant="link"
                                                className="password-toggle"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </div>
                                        {formData.password && (
                                            <div className="mt-2">
                                                <ProgressBar
                                                    now={passwordStrength}
                                                    variant={getStrengthColor()}
                                                    className="mb-1"
                                                />
                                                <small className="text-muted">
                                                    Password strength: {passwordStrength < 50 ? 'Weak' : passwordStrength < 75 ? 'Good' : 'Strong'}
                                                </small>
                                            </div>
                                        )}
                                    </Form.Group>

                                    {/* Confirm Password */}
                                    <Form.Group className="mb-4">
                                        <Form.Label className="fw-semibold">
                                            <FaShieldAlt className="me-2" />
                                            Confirm Password
                                        </Form.Label>
                                        <div className="password-input">
                                            <Form.Control
                                                type={showConfirmPassword ? "text" : "password"}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Confirm your password"
                                                required
                                                className="py-3"
                                            />
                                            <Button
                                                variant="link"
                                                className="password-toggle"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            >
                                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                            </Button>
                                        </div>
                                        {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                            <small className="text-danger">Passwords do not match</small>
                                        )}
                                    </Form.Group>

                                    {/* Terms and Newsletter */}
                                    <div className="mb-4">
                                        <Form.Check
                                            type="checkbox"
                                            id="agree-terms"
                                            name="agreeTerms"
                                            checked={formData.agreeTerms}
                                            onChange={handleInputChange}
                                            label={
                                                <small>
                                                    I agree to the <Link to="/terms" className="text-decoration-none">Terms of Service</Link> and <Link to="/privacy" className="text-decoration-none">Privacy Policy</Link>
                                                </small>
                                            }
                                            className="mb-3"
                                        />
                                        <Form.Check
                                            type="checkbox"
                                            id="newsletter"
                                            name="newsletter"
                                            checked={formData.newsletter}
                                            onChange={handleInputChange}
                                            label={
                                                <small>
                                                    Subscribe to our newsletter for book recommendations and exclusive offers
                                                </small>
                                            }
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="lg"
                                        className="w-100 py-3 rounded-pill mb-4 shadow"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Creating Account...
                                            </>
                                        ) : (
                                            <>
                                                <FaUserPlus className="me-2" />
                                                Create Account
                                            </>
                                        )}
                                    </Button>

                                    {/* Already have account */}
                                    <div className="text-center">
                                        <p className="mb-0">
                                            Already have an account?{' '}
                                            <Link to="/login" className="text-decoration-none fw-semibold">
                                                Sign in here
                                            </Link>
                                        </p>
                                    </div>
                                </Form>
                            </Card.Body>

                            <Card.Footer className="bg-light text-center p-3">
                                <div className="benefits">
                                    <small className="text-muted d-flex justify-content-center gap-4">
                                        <span><FaCheckCircle className="me-1 text-success" /> Secure Registration</span>
                                        <span><FaCheckCircle className="me-1 text-success" /> Free Shipping</span>
                                        <span><FaCheckCircle className="me-1 text-success" /> Exclusive Deals</span>
                                    </small>
                                </div>
                            </Card.Footer>
                        </Card>
                    </motion.div>
                </Col>
            </Row>
        </Container>
    );
}