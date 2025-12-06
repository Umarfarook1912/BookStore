import { useContext, useState } from 'react';
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
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { 
  FaSignInAlt, 
  FaGoogle, 
  FaFacebook, 
  FaTwitter, 
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaArrowLeft
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data.token, res.data.user);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      }
      notify.toastSuccess('Login successful!');
      navigate('/');
    } catch (err) {
      notify.toastError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    notify.toastInfo(`${provider} login coming soon!`);
  };

  const handleForgotPassword = () => {
    if (!email) {
      notify.toastError('Please enter your email address first');
      return;
    }
    notify.toastInfo('Password reset email sent!');
  };

  // Load remembered email
  useState(() => {
    const rememberedEmail = localStorage.getItem('rememberEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  });

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
              <div className="auth-header bg-primary text-white p-4 text-center">
                <Button 
                  variant="link" 
                  className="text-white position-absolute top-0 start-0 m-3"
                  onClick={() => navigate('/')}
                >
                  <FaArrowLeft />
                </Button>
                <div className="auth-icon mb-3">
                  <FaSignInAlt />
                </div>
                <h2 className="fw-bold mb-2">Welcome Back</h2>
                <p className="mb-0 opacity-75">Sign in to your account to continue</p>
              </div>

              <Card.Body className="p-4 p-md-5">
                {/* Social Login Buttons */}
                <div className="social-login mb-4">
                  <h6 className="text-center mb-3">Sign in with</h6>
                  <div className="d-flex justify-content-center gap-3">
                    <Button 
                      variant="outline-primary" 
                      className="social-btn"
                      onClick={() => handleSocialLogin('Google')}
                    >
                      <FaGoogle />
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      className="social-btn"
                      onClick={() => handleSocialLogin('Facebook')}
                    >
                      <FaFacebook />
                    </Button>
                    <Button 
                      variant="outline-primary" 
                      className="social-btn"
                      onClick={() => handleSocialLogin('Twitter')}
                    >
                      <FaTwitter />
                    </Button>
                  </div>
                </div>

                <div className="divider my-4 position-relative text-center">
                  <span className="bg-white px-3">or continue with email</span>
                </div>

                {/* Login Form */}
                <Form onSubmit={submit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaEnvelope className="me-2" />
                      Email Address
                    </Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="py-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaLock className="me-2" />
                      Password
                    </Form.Label>
                    <div className="password-input">
                      <Form.Control 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
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
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check 
                      type="checkbox"
                      id="remember-me"
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Button 
                      variant="link" 
                      className="text-decoration-none"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </Button>
                  </div>

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
                        Signing in...
                      </>
                    ) : (
                      <>
                        <FaSignInAlt className="me-2" />
                        Sign In
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Sign up here
                      </Link>
                    </p>
                  </div>
                </Form>
              </Card.Body>

              <Card.Footer className="bg-light text-center p-3">
                <small className="text-muted">
                  By signing in, you agree to our Terms of Service and Privacy Policy
                </small>
              </Card.Footer>
            </Card>

            {/* Demo Account Alert */}
            <Alert variant="info" className="mt-4">
              <strong>Demo Account:</strong> Use email: demo@example.com, password: demo123
            </Alert>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
}