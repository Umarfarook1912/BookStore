import { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import { 
  FaCreditCard, 
  FaLock, 
  FaShippingFast, 
  FaCheckCircle,
  FaArrowLeft,
  FaRegCreditCard,
  FaPaypal,
  FaGoogle,
  FaApple
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import notify from '../services/notify';
import './Checkout.css';

export default function Checkout() {
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    saveInfo: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
    if (cartData.length === 0) {
      notify.toastError('Your cart is empty');
      navigate('/cart');
    }
    setCart(cartData);
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const submit = async () => {
    // Form validation
    if (!formData.fullName || !formData.email || !formData.address || 
        !formData.city || !formData.state || !formData.zipCode) {
      notify.toastError('Please fill in all required fields');
      return;
    }

    if (formData.paymentMethod === 'credit-card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        notify.toastError('Please enter card details');
        return;
      }
    }

    const items = cart.map((i) => ({ book: i.book, quantity: i.quantity }));
    const orderData = {
      items,
      shippingAddress: {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      paymentMethod: formData.paymentMethod
    };

    setLoading(true);
    try {
      await api.post('/orders', orderData);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
      notify.toastSuccess('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      notify.toastError(err?.response?.data?.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total > 25 ? 0 : 5.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  return (
    <Container className="checkout-page py-5">
      <div className="d-flex align-items-center mb-5">
        <Button 
          variant="outline-primary" 
          className="me-3"
          onClick={() => navigate('/cart')}
        >
          <FaArrowLeft />
        </Button>
        <div>
          <h1 className="display-6 fw-bold mb-1">Checkout</h1>
          <p className="text-muted mb-0">Complete your purchase securely</p>
        </div>
      </div>

      <Row>
        <Col lg={8} className="mb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Contact Information */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="mb-0">Contact Information</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control 
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control 
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control 
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="(123) 456-7890"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Shipping Address */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <div className="d-flex align-items-center">
                  <FaShippingFast className="me-2 text-primary" />
                  <h5 className="mb-0">Shipping Address</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12} className="mb-3">
                    <Form.Group>
                      <Form.Label>Address *</Form.Label>
                      <Form.Control 
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        placeholder="123 Main St"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>City *</Form.Label>
                      <Form.Control 
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="New York"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label>State *</Form.Label>
                      <Form.Control 
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="NY"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Form.Group>
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control 
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="10001"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Country</Form.Label>
                      <Form.Select 
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Check 
                  type="checkbox"
                  id="save-info"
                  label="Save this information for next time"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleInputChange}
                />
              </Card.Body>
            </Card>

            {/* Payment Method */}
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-0">
                <div className="d-flex align-items-center">
                  <FaRegCreditCard className="me-2 text-primary" />
                  <h5 className="mb-0">Payment Method</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="payment-methods mb-4">
                  <Form.Check 
                    type="radio"
                    id="credit-card"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handleInputChange}
                    label={
                      <div className="d-flex align-items-center">
                        <FaRegCreditCard className="me-2" />
                        Credit Card
                      </div>
                    }
                    className="mb-3"
                  />
                  
                  {formData.paymentMethod === 'credit-card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3"
                    >
                      <Row>
                        <Col md={12} className="mb-3">
                          <Form.Group>
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control 
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleInputChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength={19}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control 
                              name="cardExpiry"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              maxLength={5}
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Group>
                            <Form.Label>CVC</Form.Label>
                            <Form.Control 
                              name="cardCvc"
                              value={formData.cardCvc}
                              onChange={handleInputChange}
                              placeholder="123"
                              maxLength={3}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </motion.div>
                  )}

                  <Form.Check 
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleInputChange}
                    label={
                      <div className="d-flex align-items-center">
                        <FaPaypal className="me-2 text-primary" />
                        PayPal
                      </div>
                    }
                    className="mb-3"
                  />

                  <Form.Check 
                    type="radio"
                    id="google-pay"
                    name="paymentMethod"
                    value="google-pay"
                    checked={formData.paymentMethod === 'google-pay'}
                    onChange={handleInputChange}
                    label={
                      <div className="d-flex align-items-center">
                        <FaGoogle className="me-2" />
                        Google Pay
                      </div>
                    }
                    className="mb-3"
                  />

                  <Form.Check 
                    type="radio"
                    id="apple-pay"
                    name="paymentMethod"
                    value="apple-pay"
                    checked={formData.paymentMethod === 'apple-pay'}
                    onChange={handleInputChange}
                    label={
                      <div className="d-flex align-items-center">
                        <FaApple className="me-2" />
                        Apple Pay
                      </div>
                    }
                  />
                </div>

                <Alert variant="light" className="border">
                  <FaLock className="me-2 text-primary" />
                  <strong>Secure Checkout:</strong> Your payment information is encrypted and secure.
                </Alert>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="order-items mb-3">
                {cart.map((item, idx) => (
                  <div key={idx} className="d-flex align-items-center mb-3">
                    <img 
                      src={item.coverImage || 'https://via.placeholder.com/50x70'} 
                      alt={item.title}
                      className="me-3 rounded"
                      style={{ width: '50px', height: '70px', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <div className="fw-semibold small">{item.title}</div>
                      <div className="text-muted small">Qty: {item.quantity}</div>
                    </div>
                    <div className="fw-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-success" : ""}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <h5 className="mb-0">Total</h5>
                  <h4 className="text-primary fw-bold mb-0">${grandTotal.toFixed(2)}</h4>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg"
                className="w-100 py-3 rounded-pill shadow-lg"
                onClick={submit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Processing...
                  </>
                ) : (
                  <>
                    <FaCreditCard className="me-3" />
                    Place Order - ${grandTotal.toFixed(2)}
                  </>
                )}
              </Button>

              <div className="mt-4 text-center">
                <small className="text-muted">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </small>
              </div>

              <div className="security-badges mt-4 text-center">
                <div className="d-flex justify-content-center gap-3">
                  <span className="security-badge">
                    <FaLock /> SSL Secure
                  </span>
                  <span className="security-badge">
                    <FaCheckCircle /> 30-Day Returns
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}