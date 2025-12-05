import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import notify from '../services/notify';

export default function Checkout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cart.length) return notify.toastError('Cart empty');
        const items = cart.map((i) => ({ book: i.book, quantity: i.quantity }));
        setLoading(true);
        try {
            await api.post('/orders', { items });
            localStorage.removeItem('cart');
            notify.toastSuccess('Order placed');
            navigate('/orders');
        } catch (err) {
            notify.toastError(err?.response?.data?.message || 'Order failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-4">
            <h3>Checkout</h3>
            <p>Confirm and place your order.</p>
            <Button variant="primary" onClick={submit} disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</Button>
        </Container>
    );
}
