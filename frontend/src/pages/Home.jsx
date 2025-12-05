import { useEffect, useState } from 'react';
import api from '../services/api';
import BookCard from '../components/BookCard';

export default function Home() {
    const [books, setBooks] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const res = await api.get('/books');
                setBooks(res.data.items || []);
            } catch (err) {
                console.error(err);
            }
        };
        load();
    }, []);

    return (
        <div className="container py-4">
            <h2>Browse Books</h2>
            <div className="row g-3 mt-2">
                {books.map(b => (
                    <div className="col-sm-6 col-md-4 col-lg-3" key={b._id}>
                        <BookCard book={b} />
                    </div>
                ))}
                {books.length === 0 && <p>No books found.</p>}
            </div>
        </div>
    );
}
