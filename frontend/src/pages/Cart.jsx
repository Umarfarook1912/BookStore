import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FaTrash, FaCreditCard } from 'react-icons/fa';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), []);

    const updateQty = (idx, qty) => {
        const copy = [...cart];
        copy[idx].quantity = qty;
        setCart(copy);
        localStorage.setItem('cart', JSON.stringify(copy));
    };

    const remove = (idx) => {
        const c = [...cart];
        c.splice(idx, 1);
        setCart(c);
        localStorage.setItem('cart', JSON.stringify(c));
    };

    const checkout = () => navigate('/checkout');

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <Container className="py-4">
            <h3>Your Cart</h3>
            {cart.length === 0 && <p>Your cart is empty. <Link to="/">Browse books</Link></p>}

            {cart.map((it, idx) => (
                <Card className="mb-2" key={it.book}>
                    <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>{it.title}</h6>
                            <p className="mb-0">${it.price.toFixed(2)}</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <Form.Control type="number" value={it.quantity} min={1} onChange={e => updateQty(idx, Number(e.target.value))} style={{ width: 100 }} />
                            <Button variant="link" className="ms-2 text-danger" onClick={() => remove(idx)}><FaTrash /></Button>
                        </div>
                    </Card.Body>
                </Card>
            ))}

            {cart.length > 0 && (
                <div className="mt-3">
                    <h5>Total: ${total.toFixed(2)}</h5>
                    <Button variant="primary" onClick={checkout}><FaCreditCard style={{ marginRight: 8 }} />Checkout</Button>
                </div>
            )}
        </Container>
    );
}
