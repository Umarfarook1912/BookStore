import { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Checkout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submit = async () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        if (!cart.length) return alert('Cart empty');
        const items = cart.map(i => ({ book: i.book, quantity: i.quantity }));
        setLoading(true);
        try {
            await api.post('/orders', { items });
            localStorage.removeItem('cart');
            alert('Order placed');
            navigate('/');
        } catch (err) {
            alert(err?.response?.data?.message || 'Order failed');
        } finally { setLoading(false); }
    };

    return (
        <div className="container py-4">
            <h3>Checkout</h3>
            <p>Confirm and place your order.</p>
            <button className="btn btn-primary" onClick={submit} disabled={loading}>{loading ? 'Placing...' : 'Place Order'}</button>
        </div>
    );
}
