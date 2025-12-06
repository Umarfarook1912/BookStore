import { useEffect, useState } from 'react';
import api from '../services/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import notify from '../services/notify';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import { 
  FaTrash, 
  FaPlus, 
  FaEdit,
  FaChartLine,
  FaUsers,
  FaBox,
  FaDollarSign,
  FaShoppingCart,
  FaCalendarAlt,
  FaFilter,
  FaSearch,
  FaSync,
  FaEye,
  FaFileExport,
  FaCog,
  FaBook,
  FaTachometerAlt
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [form, setForm] = useState({ 
    title: '', 
    author: '', 
    price: '', 
    genre: '',
    description: '',
    stock: 10,
    coverImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books');
      setBooks(res.data.items || []);
    } catch (err) {
      console.error(err);
      notify.toastError('Failed to load books');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await api.get('/orders');
      const list = res.data || [];
      setOrders(list);
      const map = {};
      list.forEach(o => { map[o._id] = o.status; });
      setStatusMap(map);
      
      // Calculate stats
      setStats({
        totalBooks: books.length,
        totalOrders: list.length,
        totalRevenue: list.reduce((sum, order) => sum + order.total, 0),
        pendingOrders: list.filter(o => o.status === 'pending').length
      });
    } catch (err) {
      console.error(err);
      notify.toastError('Failed to load orders');
    }
  };

  useEffect(() => { 
    load(); 
    loadOrders(); 
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      await loadOrders();
      notify.toastSuccess(`Order updated to ${status}`);
    } catch (err) {
      console.error('Failed to update order status', err);
      notify.toastError(err?.response?.data?.message || 'Failed to update order status');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/books', form);
      setForm({ 
        title: '', 
        author: '', 
        price: '', 
        genre: '',
        description: '',
        stock: 10,
        coverImage: ''
      });
      load();
      notify.toastSuccess('Book added successfully');
    } catch (err) {
      console.error('Failed to add book', err);
      notify.toastError(err?.response?.data?.message || 'Failed to add book');
    }
  };

  const remove = async (id) => {
    const ok = await notify.confirm(
      'Delete Book?', 
      'Are you sure you want to delete this book? This action cannot be undone.',
      'warning'
    );
    if (!ok) return;
    try {
      await api.delete(`/books/${id}`);
      load();
      notify.toastSuccess('Book deleted successfully');
    } catch (err) {
      console.error('Failed to delete book', err);
      notify.toastError(err?.response?.data?.message || 'Failed to delete book');
    }
  };

  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger'
  };

  const getStatusColor = (status) => {
    return statusColors[status] || 'secondary';
  };

  return (
    <Container fluid className="admin-dashboard py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">
            <FaTachometerAlt className="me-2 text-primary" />
            Admin Dashboard
          </h2>
          <p className="text-muted mb-0">Manage your bookstore efficiently</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" className="d-flex align-items-center">
            <FaFileExport className="me-2" /> Export
          </Button>
          <Button variant="primary" className="d-flex align-items-center">
            <FaSync className="me-2" /> Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Books</h6>
                  <h3 className="fw-bold">{stats.totalBooks}</h3>
                  <small className="text-success">+12% from last month</small>
                </div>
                <div className="stat-icon bg-primary">
                  <FaBook />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Orders</h6>
                  <h3 className="fw-bold">{stats.totalOrders}</h3>
                  <small className="text-success">+8% from last month</small>
                </div>
                <div className="stat-icon bg-success">
                  <FaShoppingCart />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Revenue</h6>
                  <h3 className="fw-bold">${stats.totalRevenue.toFixed(2)}</h3>
                  <small className="text-success">+15% from last month</small>
                </div>
                <div className="stat-icon bg-warning">
                  <FaDollarSign />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xl={3} lg={6} md={6} sm={12} className="mb-3">
          <Card className="stat-card border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Pending Orders</h6>
                  <h3 className="fw-bold">{stats.pendingOrders}</h3>
                  <small className="text-danger">Needs attention</small>
                </div>
                <div className="stat-icon bg-info">
                  <FaBox />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header className="bg-white border-0">
          <div className="admin-tabs">
            <Button 
              variant={activeTab === 'overview' ? 'primary' : 'outline-primary'} 
              className="me-2"
              onClick={() => setActiveTab('overview')}
            >
              <FaChartLine className="me-2" /> Overview
            </Button>
            <Button 
              variant={activeTab === 'books' ? 'primary' : 'outline-primary'} 
              className="me-2"
              onClick={() => setActiveTab('books')}
            >
              <FaBook className="me-2" /> Books
            </Button>
            <Button 
              variant={activeTab === 'orders' ? 'primary' : 'outline-primary'} 
              className="me-2"
              onClick={() => setActiveTab('orders')}
            >
              <FaShoppingCart className="me-2" /> Orders
            </Button>
            <Button 
              variant={activeTab === 'customers' ? 'primary' : 'outline-primary'}
              onClick={() => setActiveTab('customers')}
            >
              <FaUsers className="me-2" /> Customers
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* Books Management */}
          {activeTab === 'books' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Row>
                <Col lg={4} md={6} className="mb-4">
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Header className="bg-primary text-white">
                      <h5 className="mb-0">
                        <FaPlus className="me-2" /> Add New Book
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form onSubmit={submit}>
                        <Form.Group className="mb-3">
                          <Form.Label>Title</Form.Label>
                          <Form.Control 
                            placeholder="Enter book title"
                            value={form.title}
                            onChange={e => setForm({ ...form, title: e.target.value })}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Author</Form.Label>
                          <Form.Control 
                            placeholder="Enter author name"
                            value={form.author}
                            onChange={e => setForm({ ...form, author: e.target.value })}
                            required
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Genre</Form.Label>
                          <Form.Control 
                            placeholder="Enter genre"
                            value={form.genre}
                            onChange={e => setForm({ ...form, genre: e.target.value })}
                          />
                        </Form.Group>
                        <Row>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>Price</Form.Label>
                              <Form.Control 
                                type="number"
                                placeholder="0.00"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                required
                              />
                            </Form.Group>
                          </Col>
                          <Col>
                            <Form.Group className="mb-3">
                              <Form.Label>Stock</Form.Label>
                              <Form.Control 
                                type="number"
                                value={form.stock}
                                onChange={e => setForm({ ...form, stock: e.target.value })}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Description</Form.Label>
                          <Form.Control 
                            as="textarea" 
                            rows={3}
                            placeholder="Book description"
                            value={form.description}
                            onChange={e => setForm({ ...form, description: e.target.value })}
                          />
                        </Form.Group>
                        <Form.Group className="mb-3">
                          <Form.Label>Cover Image URL</Form.Label>
                          <Form.Control 
                            placeholder="https://example.com/image.jpg"
                            value={form.coverImage}
                            onChange={e => setForm({ ...form, coverImage: e.target.value })}
                          />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="w-100">
                          <FaPlus className="me-2" /> Add Book
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={8} md={6}>
                  <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-white">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">All Books ({books.length})</h5>
                        <Form.Control 
                          placeholder="Search books..." 
                          className="w-auto"
                        />
                      </div>
                    </Card.Header>
                    <Card.Body className="p-0">
                      {loading ? (
                        <div className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <Table hover className="mb-0">
                            <thead>
                              <tr>
                                <th>Cover</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Genre</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {books.map(b => (
                                <tr key={b._id}>
                                  <td>
                                    <img 
                                      src={b.coverImage || 'https://via.placeholder.com/50x70?text=Book'} 
                                      alt={b.title}
                                      className="book-thumb"
                                    />
                                  </td>
                                  <td>
                                    <div className="fw-semibold">{b.title}</div>
                                    <small className="text-muted">{b.description?.substring(0, 50)}...</small>
                                  </td>
                                  <td>{b.author}</td>
                                  <td>
                                    <Badge bg="light" text="dark">{b.genre || 'N/A'}</Badge>
                                  </td>
                                  <td className="fw-bold">${b.price.toFixed(2)}</td>
                                  <td>
                                    <Badge bg={b.stock > 10 ? 'success' : 'warning'}>
                                      {b.stock} in stock
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex gap-2">
                                      <Button size="sm" variant="outline-primary">
                                        <FaEdit />
                                      </Button>
                                      <Button 
                                        size="sm" 
                                        variant="outline-danger"
                                        onClick={() => remove(b._id)}
                                      >
                                        <FaTrash />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </motion.div>
          )}

          {/* Orders Management */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-sm">
                <Card.Header className="bg-white">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Recent Orders ({orders.length})</h5>
                    <div className="d-flex gap-2">
                      <Form.Control 
                        placeholder="Search orders..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-auto"
                      />
                      <Button variant="outline-primary">
                        <FaFilter className="me-2" /> Filter
                      </Button>
                    </div>
                  </div>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Date</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Items</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map(o => (
                          <tr key={o._id}>
                            <td>
                              <code className="text-primary">{o._id.substring(0, 8)}...</code>
                            </td>
                            <td>
                              <div>{o.user?.name || 'N/A'}</div>
                              <small className="text-muted">{o.user?.email}</small>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <FaCalendarAlt className="me-2 text-muted" />
                                {new Date(o.createdAt).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="fw-bold">${o.total.toFixed(2)}</td>
                            <td>
                              <Form.Select 
                                value={statusMap[o._id] ?? o.status}
                                onChange={(e) => setStatusMap(s => ({ ...s, [o._id]: e.target.value }))}
                                className={`status-select bg-${getStatusColor(statusMap[o._id] || o.status)}-subtle`}
                              >
                                {Object.keys(statusColors).map(status => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                                ))}
                              </Form.Select>
                            </td>
                            <td>
                              <Badge bg="light" text="dark">
                                {o.items.length} items
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <Button 
                                  size="sm" 
                                  variant="outline-primary"
                                  onClick={() => {
                                    setSelectedOrder(o);
                                    setShowOrderModal(true);
                                  }}
                                >
                                  <FaEye />
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="primary"
                                  onClick={() => updateOrderStatus(o._id, statusMap[o._id] || o.status)}
                                  disabled={(statusMap[o._id] || o.status) === o.status}
                                >
                                  Update
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          )}
        </Card.Body>
      </Card>

      {/* Order Details Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Order Information</h6>
                  <div className="mb-2">
                    <strong>Order ID:</strong> {selectedOrder._id}
                  </div>
                  <div className="mb-2">
                    <strong>Date:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  <div>
                    <strong>Status:</strong> {' '}
                    <Badge bg={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </Col>
                <Col md={6}>
                  <h6>Customer Information</h6>
                  <div className="mb-2">
                    <strong>Name:</strong> {selectedOrder.user?.name || 'N/A'}
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}
                  </div>
                </Col>
              </Row>
              
              <h6>Order Items</h6>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map(it => (
                    <tr key={it.book._id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={it.book.coverImage || 'https://via.placeholder.com/40x60'} 
                            alt={it.book.title}
                            className="me-2"
                            style={{ width: 40, height: 60, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-semibold">{it.book.title}</div>
                            <small className="text-muted">{it.book.author}</small>
                          </div>
                        </div>
                      </td>
                      <td>${it.price.toFixed(2)}</td>
                      <td>{it.quantity}</td>
                      <td className="fw-bold">${(it.price * it.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              <div className="d-flex justify-content-end mt-3">
                <div className="text-end">
                  <div>Subtotal: <strong>${selectedOrder.total.toFixed(2)}</strong></div>
                  <div>Shipping: <strong>$0.00</strong></div>
                  <div className="fs-5 mt-2">Total: <strong>${selectedOrder.total.toFixed(2)}</strong></div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <Button variant="primary">
            Print Invoice
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}