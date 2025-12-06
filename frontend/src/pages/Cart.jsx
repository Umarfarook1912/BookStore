import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { 
  FaTrash, 
  FaCreditCard, 
  FaArrowLeft,
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaHeart,
  FaTag,
  FaShippingFast
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Cart.css';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      setLoading(true);
      const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
      setCart(cartData);
      setLoading(false);
    };
    
    loadCart();
    // Listen for cart updates from other components
    window.addEventListener('cartUpdated', loadCart);
    return () => window.removeEventListener('cartUpdated', loadCart);
  }, []);

  const updateQuantity = (idx, change) => {
    const newCart = [...cart];
    const newQty = newCart[idx].quantity + change;
    if (newQty < 1) return removeItem(idx);
    
    newCart[idx].quantity = newQty;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (idx) => {
    const newCart = [...cart];
    newCart.splice(idx, 1);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const moveToWishlist = (item) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find(b => b.book === item.book)) {
      wishlist.push(item);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
    removeItem(cart.findIndex(i => i.book === item.book));
  };

  const clearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setCart([]);
      localStorage.removeItem('cart');
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const checkout = () => navigate('/checkout');

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total > 25 ? 0 : 5.99;
  const tax = total * 0.08;
  const grandTotal = total + shipping + tax;

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading cart...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="cart-page py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="display-6 fw-bold">
            <FaShoppingCart className="me-3 text-primary" />
            Shopping Cart
          </h1>
          <p className="text-muted">Review your items and proceed to checkout</p>
        </div>
        <Button 
          variant="outline-primary" 
          as={Link} 
          to="/browse"
          className="d-flex align-items-center"
        >
          <FaArrowLeft className="me-2" /> Continue Shopping
        </Button>
      </div>

      <AnimatePresence>
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-5"
          >
            <div className="empty-cart-icon mb-4">
              <FaShoppingCart />
            </div>
            <h3 className="mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">Add some amazing books to your cart!</p>
            <Button 
              variant="primary" 
              size="lg"
              as={Link} 
              to="/browse"
              className="px-5 rounded-pill"
            >
              Browse Books
            </Button>
          </motion.div>
        ) : (
          <Row>
            <Col lg={8} className="mb-4">
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white border-0 py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Cart Items ({cart.length})</h5>
                    <Button 
                      variant="link" 
                      className="text-danger"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0 cart-table">
                      <thead>
                        <tr>
                          <th width="120">Product</th>
                          <th>Details</th>
                          <th width="150">Price</th>
                          <th width="180">Quantity</th>
                          <th width="120">Total</th>
                          <th width="100">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item, idx) => (
                          <motion.tr 
                            key={`${item.book}-${idx}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                          >
                            <td>
                              <img 
                                src={item.coverImage || 'https://via.placeholder.com/80x120?text=Book'} 
                                alt={item.title}
                                className="cart-item-img"
                              />
                            </td>
                            <td>
                              <div>
                                <h6 className="mb-1">{item.title}</h6>
                                <p className="text-muted small mb-1">{item.author}</p>
                                <Badge bg="light" text="dark" className="small">
                                  <FaTag className="me-1" /> Fiction
                                </Badge>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold">${item.price.toFixed(2)}</div>
                              {item.originalPrice && (
                                <del className="text-muted small">${item.originalPrice.toFixed(2)}</del>
                              )}
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  className="rounded-circle"
                                  onClick={() => updateQuantity(idx, -1)}
                                >
                                  <FaMinus />
                                </Button>
                                <Form.Control
                                  type="number"
                                  value={item.quantity}
                                  min={1}
                                  onChange={(e) => {
                                    const newQty = parseInt(e.target.value) || 1;
                                    if (newQty >= 1) {
                                      const newCart = [...cart];
                                      newCart[idx].quantity = newQty;
                                      setCart(newCart);
                                      localStorage.setItem('cart', JSON.stringify(newCart));
                                      window.dispatchEvent(new Event('cartUpdated'));
                                    }
                                  }}
                                  className="mx-2 text-center"
                                  style={{ width: '70px' }}
                                />
                                <Button 
                                  variant="outline-secondary" 
                                  size="sm"
                                  className="rounded-circle"
                                  onClick={() => updateQuantity(idx, 1)}
                                >
                                  <FaPlus />
                                </Button>
                              </div>
                            </td>
                            <td>
                              <div className="fw-bold">${(item.price * item.quantity).toFixed(2)}</div>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  className="rounded-circle"
                                  onClick={() => removeItem(idx)}
                                  title="Remove"
                                >
                                  <FaTrash />
                                </Button>
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  className="rounded-circle"
                                  onClick={() => moveToWishlist(item)}
                                  title="Move to Wishlist"
                                >
                                  <FaHeart />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">Order Summary</h5>
                </Card.Header>
                <Card.Body>
                  <div className="order-summary">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Subtotal ({cart.length} items)</span>
                      <span className="fw-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-success" : ""}>
                        {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between mb-4">
                      <h5 className="mb-0">Total</h5>
                      <h4 className="text-primary fw-bold mb-0">${grandTotal.toFixed(2)}</h4>
                    </div>

                    <Button 
                      variant="primary" 
                      size="lg"
                      className="w-100 py-3 rounded-pill mb-3 shadow-lg"
                      onClick={checkout}
                    >
                      <FaCreditCard className="me-3" />
                      Proceed to Checkout
                    </Button>

                    <div className="secure-checkout text-center">
                      <small className="text-muted">
                        <FaShippingFast className="me-2" />
                        Free shipping on orders over $25
                      </small>
                    </div>

                    <div className="mt-4">
                      <h6 className="mb-3">We accept:</h6>
                      <div className="d-flex gap-2">
                        {['💳', '💰', '🔐', '🏦'].map((emoji, index) => (
                          <span key={index} className="payment-method">
                            {emoji}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              {/* Promo Code */}
              <Card className="border-0 shadow-sm mt-4">
                <Card.Body>
                  <h6 className="mb-3">Have a promo code?</h6>
                  <div className="input-group">
                    <Form.Control 
                      placeholder="Enter promo code" 
                    />
                    <Button variant="outline-primary">
                      Apply
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              {/* Quick Links */}
              <Card className="border-0 shadow-sm mt-4">
                <Card.Body>
                  <h6 className="mb-3">Need help?</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Link to="/shipping" className="text-decoration-none">
                        Shipping & Delivery
                      </Link>
                    </li>
                    <li className="mb-2">
                      <Link to="/returns" className="text-decoration-none">
                        Returns & Exchanges
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="text-decoration-none">
                        Contact Support
                      </Link>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </AnimatePresence>
    </Container>
  );
}