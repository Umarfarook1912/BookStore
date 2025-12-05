import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import BookCard from '../components/BookCard';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import Pagination from 'react-bootstrap/Pagination';

export default function Home() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filters/state
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [author, setAuthor] = useState('');
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [ratingMin, setRatingMin] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [searchParams, setSearchParams] = useSearchParams();
    const debounceRef = useRef(null);

    // initialize from URL params
    useEffect(() => {
        const s = searchParams.get('search') || '';
        const g = searchParams.get('genre') || '';
        const a = searchParams.get('author') || '';
        const pmin = searchParams.get('priceMin') || '';
        const pmax = searchParams.get('priceMax') || '';
        const rmin = searchParams.get('ratingMin') || '';
        const pg = parseInt(searchParams.get('page') || '1', 10) || 1;
        setSearch(s);
        setGenre(g);
        setAuthor(a);
        setPriceMin(pmin);
        setPriceMax(pmax);
        setRatingMin(rmin);
        setPage(pg);
    }, []);

    const fetchBooks = async (opts = {}) => {
        setLoading(true);
        try {
            const params = {};
            if ((opts.search ?? search) !== '') params.search = opts.search ?? search;
            if ((opts.genre ?? genre) !== '') params.genre = opts.genre ?? genre;
            if ((opts.author ?? author) !== '') params.author = opts.author ?? author;
            if ((opts.priceMin ?? priceMin) !== '') params.priceMin = opts.priceMin ?? priceMin;
            if ((opts.priceMax ?? priceMax) !== '') params.priceMax = opts.priceMax ?? priceMax;
            if ((opts.ratingMin ?? ratingMin) !== '') params.ratingMin = opts.ratingMin ?? ratingMin;
            params.page = opts.page ?? page;

            const res = await api.get('/books', { params });
            setBooks(res.data.items || []);
            setTotalPages(res.data.pages || 1);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Fetch when filters change with debounce for search
    useEffect(() => {
        // clear previous debounce
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            // sync params to URL
            const params = {};
            if (search) params.search = search;
            if (genre) params.genre = genre;
            if (author) params.author = author;
            if (priceMin) params.priceMin = priceMin;
            if (priceMax) params.priceMax = priceMax;
            if (ratingMin) params.ratingMin = ratingMin;
            if (page && page > 1) params.page = String(page);
            setSearchParams(params, { replace: true });
            fetchBooks({});
        }, 500);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, genre, author, priceMin, priceMax, ratingMin, page]);

    return (
        <Container className="py-4">
            <h2>Browse Books</h2>

            <Form className="my-3">
                <Row className="g-2 align-items-end">
                    <Col md={4}>
                        <Form.Label>Search</Form.Label>
                        <InputGroup>
                            <Form.Control placeholder="Search title, description..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
                            <Button variant="outline-secondary" onClick={() => { setSearch(''); setPage(1); }} aria-label="Clear search">Clear</Button>
                        </InputGroup>
                    </Col>
                    <Col md={2}>
                        <Form.Label>Genre</Form.Label>
                        <Form.Control placeholder="Genre" value={genre} onChange={(e) => { setGenre(e.target.value); setPage(1); }} />
                    </Col>
                    <Col md={2}>
                        <Form.Label>Author</Form.Label>
                        <Form.Control placeholder="Author" value={author} onChange={(e) => { setAuthor(e.target.value); setPage(1); }} />
                    </Col>
                    <Col md={2}>
                        <Form.Label>Price Min</Form.Label>
                        <Form.Control type="number" min="0" placeholder="0" value={priceMin} onChange={(e) => { setPriceMin(e.target.value); setPage(1); }} />
                    </Col>
                    <Col md={2}>
                        <Form.Label>Price Max</Form.Label>
                        <Form.Control type="number" min="0" placeholder="99.99" value={priceMax} onChange={(e) => { setPriceMax(e.target.value); setPage(1); }} />
                    </Col>
                    <Col md={2} className="mt-2">
                        <Form.Label>Min Rating</Form.Label>
                        <Form.Select value={ratingMin} onChange={(e) => { setRatingMin(e.target.value); setPage(1); }}>
                            <option value="">Any</option>
                            <option value="1">1+</option>
                            <option value="2">2+</option>
                            <option value="3">3+</option>
                            <option value="4">4+</option>
                            <option value="5">5</option>
                        </Form.Select>
                    </Col>
                    <Col md={2} className="mt-2">
                        <Button variant="primary" onClick={() => fetchBooks({ page: 1 })}>Apply</Button>{' '}
                        <Button variant="secondary" onClick={() => { setSearch(''); setGenre(''); setAuthor(''); setPriceMin(''); setPriceMax(''); setRatingMin(''); setPage(1); }}>Reset</Button>
                    </Col>
                </Row>
            </Form>

            {loading && (
                <div className="d-flex justify-content-center my-4"><Spinner animation="border" /></div>
            )}

            <Row className="g-3 mt-2">
                {books.map((b) => (
                    <Col sm={6} md={4} lg={3} key={b._id}>
                        <BookCard book={b} />
                    </Col>
                ))}
            </Row>
            {books.length === 0 && !loading && <p className="mt-3">No books found.</p>}

            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.Prev onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} />
                    <Pagination.Item active>{page}</Pagination.Item>
                    <Pagination.Next onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} />
                </Pagination>
            </div>
        </Container>
    );
}
