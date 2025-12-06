import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';
import { 
  FaBox, 
  FaTruck, 
  FaCheckCircle, 
  FaClock,
  FaTimesCircle,
  FaEye,
  FaDownload,
  FaPrint,
  FaFilter,
  FaCalendarAlt,
  FaShoppingBag
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import './Orders.css';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const intervalRef = useRef(null);

  const load = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    intervalRef.current = setInterval(load, 10000); // Poll every 10 seconds
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const statusConfig = {
    pending: { 
      icon: <FaClock />, 
      color: 'warning', 
      label: 'Pending',
      description: 'Your order is being processed'
    },
    processing: { 
      icon: <FaBox />, 
      color: 'info', 
      label: 'Processing',
      description: 'Order is being prepared for shipment'
    },
    shipped: { 
      icon: <FaTruck />, 
      color: 'primary', 
      label: 'Shipped',
      description: 'Order is on its way to you'
    },
    delivered: { 
      icon: <FaCheckCircle />, 
      color: 'success', 
      label: 'Delivered',
      description: 'Order has been delivered'
    },
    cancelled: { 
      icon: <FaTimesCircle />, 
      color: 'danger', 
      label: 'Cancelled',
      description: 'Order has been cancelled'
    }
  };

  const getStatusConfig = (status) => {
    return statusConfig[status] || { icon: <FaBox />, color: 'secondary', label: status };
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const printInvoice = (order) => {
    window.print();
    // In a real app, this would generate a PDF
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading your orders...</p>
      </Container>
    );
  }

  return (
    <Container className="orders-page py-5">
      <div className="mb-5">
        <h1 className="display-6 fw-bold mb-2">
          <FaShoppingBag className="me-3 text-primary" />
          My Orders
        </h1>
        <p className="text-muted">Track and manage all your purchases</p>
      </div>

      {/* Stats */}
      <Row className="mb-5">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-primary me-3">
                  <FaBox />
                </div>
                <div>
                  <h4 className="fw-bold mb-0">{orders.length}</h4>
                  <small className="text-muted">Total Orders</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-success me-3">
                  <FaCheckCircle />
                </div>
                <div>
                  <h4 className="fw-bold mb-0">
                    {orders.filter(o => o.status === 'delivered').length}
                  </h4>
                  <small className="text-muted">Delivered</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-warning me-3">
                  <FaClock />
                </div>
                <div>
                  <h4 className="fw-bold mb-0">
                    {orders.filter(o => o.status === 'pending' || o.status === 'processing').length}
                  </h4>
                  <small className="text-muted">In Progress</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-info me-3">
                  <FaTruck />
                </div>
                <div>
                  <h4 className="fw-bold mb-0">
                    {orders.filter(o => o.status === 'shipped').length}
                  </h4>
                  <small className="text-muted">Shipped</small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter Tabs */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-3">
          <div className="d-flex flex-wrap align-items-center justify-content-between">
            <div className="order-filters">
              <Button 
                variant={filter === 'all' ? 'primary' : 'outline-primary'}
                size="sm"
                className="rounded-pill me-2 mb-2"
                onClick={() => setFilter('all')}
              >
                All Orders ({orders.length})
              </Button>
              {Object.keys(statusConfig).map(status => (
                <Button 
                  key={status}
                  variant={filter === status ? statusConfig[status].color : `outline-${statusConfig[status].color}`}
                  size="sm"
                  className="rounded-pill me-2 mb-2"
                  onClick={() => setFilter(status)}
                >
                  {statusConfig[status].icon} {statusConfig[status].label} 
                  ({orders.filter(o => o.status === status).length})
                </Button>
              ))}
            </div>
            <Button variant="outline-secondary" size="sm" className="mb-2">
              <FaFilter className="me-2" /> Filter
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Orders List */}
      <AnimatePresence>
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center py-5"
          >
            <div className="empty-orders-icon mb-4">
              <FaBox />
            </div>
            <h3 className="mb-3">No orders found</h3>
            <p className="text-muted mb-4">
              {filter === 'all' 
                ? "You haven't placed any orders yet." 
                : `You don't have any ${filter} orders.`}
            </p>
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
          filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-0 shadow-sm mb-4 order-card">
                <Card.Header className="bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="mb-1">Order #{order._id.substring(0, 8)}</h5>
                      <div className="d-flex align-items-center text-muted">
                        <FaCalendarAlt className="me-2" />
                        <small>{formatDate(order.createdAt)}</small>
                      </div>
                    </div>
                    <Badge 
                      bg={getStatusConfig(order.status).color} 
                      className="px-3 py-2"
                    >
                      {getStatusConfig(order.status).icon} {' '}
                      {getStatusConfig(order.status).label}
                    </Badge>
                  </div>
                </Card.Header>

                <Card.Body>
                  {/* Order Items */}
                  <div className="order-items mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="d-flex align-items-center mb-3">
                        <img 
                          src={item.book?.coverImage || 'https://via.placeholder.com/60x90'} 
                          alt={item.book?.title}
                          className="me-3 rounded"
                          style={{ width: '60px', height: '90px', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{item.book?.title || item.book}</h6>
                          <small className="text-muted d-block">{item.book?.author}</small>
                          <small className="text-muted">Quantity: {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <div className="fw-bold">${item.price.toFixed(2)} each</div>
                          <div className="text-muted small">
                            Total: ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="order-summary bg-light p-3 rounded mb-4">
                    <Row>
                      <Col md={4} className="mb-2">
                        <small className="text-muted d-block">Payment Method</small>
                        <div className="fw-semibold">{order.paymentMethod || 'Credit Card'}</div>
                      </Col>
                      <Col md={4} className="mb-2">
                        <small className="text-muted d-block">Shipping Address</small>
                        <div className="fw-semibold">
                          {order.shippingAddress?.city}, {order.shippingAddress?.state}
                        </div>
                      </Col>
                      <Col md={4} className="mb-2">
                        <small className="text-muted d-block">Order Total</small>
                        <div className="fw-bold text-primary">${order.total.toFixed(2)}</div>
                      </Col>
                    </Row>
                  </div>

                  {/* Order Actions */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted">
                        {getStatusConfig(order.status).description}
                      </small>
                    </div>
                    <div className="d-flex gap-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        as={Link}
                        to={`/orders/${order._id}`}
                      >
                        <FaEye className="me-2" /> View Details
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => printInvoice(order)}
                      >
                        <FaPrint className="me-2" /> Print Invoice
                      </Button>
                      <Button 
                        variant="outline-success" 
                        size="sm"
                      >
                        <FaDownload className="me-2" /> Download
                      </Button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </Container>
  );
}