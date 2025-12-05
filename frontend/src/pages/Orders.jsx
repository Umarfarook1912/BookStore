import { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const intervalRef = useRef(null);

  const load = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // initial load
    load();
    // Poll for changes every 5 seconds so admin updates propagate
    intervalRef.current = setInterval(load, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const statusVariant = (s) => {
    switch (s) {
      case 'pending': return 'warning';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'delivered': return 'success';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Container className="py-4">
      <h3>My Orders</h3>
      {orders.length === 0 && <p>You have no orders yet.</p>}
      {orders.map((o) => (
        <Card className="mb-3" key={o._id}>
          <Card.Body>
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div><strong>Order ID:</strong> {o._id}</div>
                <div className="small text-muted">Placed: {new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="text-end">
                <div><strong>Total:</strong> ${o.total.toFixed(2)}</div>
                <Badge bg={statusVariant(o.status)} className="mt-2 text-capitalize">{o.status}</Badge>
              </div>
            </div>

            <ListGroup className="mt-3">
              {o.items.map((it) => (
                <ListGroup.Item key={it.book._id || it.book}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <div><strong>{it.book?.title || it.book}</strong></div>
                      <div className="text-muted small">{it.book?.author || ''}</div>
                      <div className="small text-muted">Qty: {it.quantity}</div>
                    </div>
                    <div>${(it.price * it.quantity).toFixed(2)}</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
