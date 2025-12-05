import { useEffect, useState } from 'react';
import api from '../services/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import { FaTrash, FaPlus } from 'react-icons/fa';

export default function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [orders, setOrders] = useState([]);
    const [statusMap, setStatusMap] = useState({});
    const [toast, setToast] = useState({ show: false, message: '', bg: 'success' });
    const [form, setForm] = useState({ title: '', author: '', price: 0 });

    const load = async () => {
        try {
            const res = await api.get('/books');
            setBooks(res.data.items || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadOrders = async () => {
        try {
            const res = await api.get('/orders');
            const list = res.data || [];
            setOrders(list);
            // initialize status map with current statuses
            const map = {};
            list.forEach(o => { map[o._id] = o.status; });
            setStatusMap(map);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { load(); loadOrders(); }, []);

    const updateOrderStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            await loadOrders();
            setToast({ show: true, message: `Order ${orderId} updated to ${status}`, bg: 'success' });
        } catch (err) {
            console.error('Failed to update order status', err);
            setToast({ show: true, message: err?.response?.data?.message || 'Failed to update order status', bg: 'danger' });
        }
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', form);
            setForm({ title: '', author: '', price: 0 });
            load();
        } catch (err) {
            alert('Failed');
        }
    };

    const remove = async (id) => {
        if (!confirm('Delete?')) return;
        await api.delete(`/books/${id}`);
        load();
    };

    return (
        <Container className="py-4">
            <h3>Admin Dashboard</h3>
            <Row>
                <Col md={6}>
                    <h5>Add Book</h5>
                    <Form onSubmit={submit}>
                        <Form.Control className="mb-2" placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                        <Form.Control className="mb-2" placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} />
                        <Form.Control type="number" className="mb-2" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} />
                        <Button type="submit" variant="primary"><FaPlus style={{ marginRight: 8 }} />Add</Button>
                    </Form>
                </Col>
                <Col md={6}>
                    <h5>Books</h5>
                    <ListGroup>
                        {books.map(b => (
                            <ListGroup.Item key={b._id} className="d-flex justify-content-between align-items-center">
                                <div>{b.title} - ${b.price.toFixed(2)}</div>
                                <div><Button size="sm" variant="danger" onClick={() => remove(b._id)}><FaTrash /></Button></div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>

            <hr />
            <h4>Recent Orders</h4>
            {orders.length === 0 && <p>No orders found.</p>}
            {orders.map(o => (
                <Card className="mb-3" key={o._id}>
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <strong>Order ID:</strong> {o._id}
                                <div><small>User: {o.user?.name || o.user?.email}</small></div>
                                <div className="small mt-1">Placed: {new Date(o.createdAt).toLocaleString()}</div>
                            </div>
                            <div className="text-end">
                                <div><strong>Total:</strong> ${o.total.toFixed(2)}</div>
                                <div className="mt-2 d-flex align-items-center justify-content-end gap-2">
                                    <Form.Select aria-label="Order status" value={statusMap[o._id] ?? o.status} onChange={(e) => setStatusMap(s => ({ ...s, [o._id]: e.target.value }))} style={{ width: 160 }}>
                                        <option value="pending">pending</option>
                                        <option value="processing">processing</option>
                                        <option value="shipped">shipped</option>
                                        <option value="delivered">delivered</option>
                                        <option value="cancelled">cancelled</option>
                                    </Form.Select>
                                    <Button size="sm" variant="primary" onClick={() => updateOrderStatus(o._id, statusMap[o._id] || o.status)} disabled={(statusMap[o._id] || o.status) === o.status}>Update</Button>
                                </div>
                            </div>
                        </div>

                        <ListGroup className="mt-3">
                            {o.items.map(it => (
                                <ListGroup.Item key={it.book._id || it.book}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <div><strong>{it.book?.title || it.book}</strong></div>
                                            <div className="text-muted small">Qty: {it.quantity}</div>
                                        </div>
                                        <div>${(it.price * it.quantity).toFixed(2)}</div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            ))}
            <ToastContainer position="top-end" className="p-3">
                <Toast bg={toast.bg} onClose={() => setToast(s => ({ ...s, show: false }))} show={toast.show} delay={3000} autohide>
                    <Toast.Body className="text-white">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>
        </Container>
    );
}
