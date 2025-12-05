import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function BookDetails() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get(`/books/${id}`);
                setBook(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, [id]);

    const addToCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find(i => i.book === book._id);
        if (existing) existing.quantity += 1; else cart.push({ book: book._id, title: book.title, price: book.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    if (!book) return <div className="container py-4">Loading...</div>;

    return (
        <div className="container py-4">
            <div className="row">
                <div className="col-md-4">
                    {book.coverImage && <img src={book.coverImage} className="img-fluid" alt={book.title} />}
                </div>
                <div className="col-md-8">
                    <h3>{book.title}</h3>
                    <p className="text-muted">{book.author}</p>
                    <p>{book.description}</p>
                    <h4>${book.price.toFixed(2)}</h4>
                    <button className="btn btn-success" onClick={addToCart}>Add to Cart</button>
                </div>
            </div>
        </div>
    );
}
