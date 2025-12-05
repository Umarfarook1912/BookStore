import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => setCart(JSON.parse(localStorage.getItem('cart') || '[]')), []);

    const updateQty = (idx, qty) => {
        const copy = [...cart]; copy[idx].quantity = qty; setCart(copy); localStorage.setItem('cart', JSON.stringify(copy));
    };

    const remove = (idx) => { const c = [...cart]; c.splice(idx, 1); setCart(c); localStorage.setItem('cart', JSON.stringify(c)); };

    const checkout = () => navigate('/checkout');

    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

    return (
        <div className="container py-4">
            <h3>Your Cart</h3>
            {cart.length === 0 && <p>Your cart is empty. <Link to="/">Browse books</Link></p>}
            {cart.map((it, idx) => (
                <div className="card mb-2" key={it.book}><div className="card-body d-flex justify-content-between align-items-center">
                    <div>
                        <h6>{it.title}</h6>
                        <p className="mb-0">${it.price.toFixed(2)}</p>
                    </div>
                    <div>
                        <input type="number" value={it.quantity} min={1} onChange={e => updateQty(idx, Number(e.target.value))} style={{ width: 80 }} />
                        <button className="btn btn-link ms-2" onClick={() => remove(idx)}>Remove</button>
                    </div>
                </div></div>
            ))}
            {cart.length > 0 && <div className="mt-3">
                <h5>Total: ${total.toFixed(2)}</h5>
                <button className="btn btn-success" onClick={checkout}>Checkout</button>
            </div>}
        </div>
    );
}
