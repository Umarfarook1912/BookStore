import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { FaCartPlus } from 'react-icons/fa';

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
        const existing = cart.find((i) => i.book === book._id);
        if (existing) existing.quantity += 1;
        else cart.push({ book: book._id, title: book.title, price: book.price, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        navigate('/cart');
    };

    if (!book) return <Container className="py-4">Loading...</Container>;

    return (
        <Container className="py-4">
            <Row>
                <Col md={4}>
                    {book.coverImage && <img src={book.coverImage} className="img-fluid" alt={book.title} />}
                </Col>
                <Col md={8}>
                    <h3>{book.title}</h3>
                    <p className="text-muted">{book.author}</p>
                    <p>{book.description}</p>
                    <h4>${book.price.toFixed(2)}</h4>
                    <Button variant="dark" onClick={addToCart}><FaCartPlus style={{ marginRight: 8 }} />Add to Cart</Button>
                </Col>
            </Row>
        </Container>
    );
}
