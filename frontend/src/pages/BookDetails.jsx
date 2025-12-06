import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import notify from '../services/notify';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { 
  FaCartPlus, 
  FaHeart, 
  FaShareAlt, 
  FaStar, 
  FaTruck, 
  FaShieldAlt, 
  FaArrowLeft,
  FaBook,
  FaTag,
  FaCalendarAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './BookDetails.css';

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
        
        // Load related books
        try {
          const relatedRes = await api.get(`/books?genre=${res.data.genre}`);
          setRelatedBooks(relatedRes.data.items?.filter(b => b._id !== id) || []);
        } catch (err) {
          console.error('Failed to load related books:', err);
        }
      } catch (err) {
        console.error(err);
        notify.toastError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i) => i.book === book._id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ 
        book: book._id, 
        title: book.title, 
        author: book.author,
        price: book.price, 
        coverImage: book.coverImage,
        quantity 
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    notify.toastSuccess(`${quantity}x "${book.title}" added to cart`);
  };

  const addToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.find(b => b._id === book._id)) {
      wishlist.push(book);
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
      notify.toastSuccess('Added to wishlist');
    } else {
      notify.toastInfo('Already in wishlist');
    }
  };

  const shareBook = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Check out "${book.title}" by ${book.author}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      notify.toastSuccess('Link copied to clipboard');
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading book details...</p>
      </Container>
    );
  }

  if (!book) {
    return (
      <Container className="py-5 text-center">
        <h4>Book not found</h4>
        <Button variant="outline-primary" onClick={() => navigate('/browse')}>
          <FaArrowLeft className="me-2" /> Browse Books
        </Button>
      </Container>
    );
  }

  return (
    <Container className="book-details py-5">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/' }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/browse' }}>Books</Breadcrumb.Item>
        <Breadcrumb.Item active>{book.title}</Breadcrumb.Item>
      </Breadcrumb>

      <Row>
        {/* Book Image */}
        <Col lg={5} md={6} className="mb-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="book-cover-card border-0 shadow-lg overflow-hidden">
              <div className="book-cover-container">
                <img 
                  src={book.coverImage || 'https://via.placeholder.com/400x600?text=Book+Cover'} 
                  alt={book.title}
                  className="book-cover-img"
                />
                <div className="book-badges position-absolute top-0 start-0 p-3">
                  <Badge bg="success" className="me-2 px-3 py-2 rounded-pill">
                    Bestseller
                  </Badge>
                  {book.discount && (
                    <Badge bg="danger" className="px-3 py-2 rounded-pill">
                      -{book.discount}%
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>

        {/* Book Details */}
        <Col lg={7} md={6}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Category & Rating */}
            <div className="mb-3">
              <Badge bg="light" text="dark" className="d-inline-flex align-items-center me-3">
                <FaTag className="me-1" /> {book.genre || 'Fiction'}
              </Badge>
              <div className="d-inline-flex align-items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar 
                    key={i} 
                    className={i < (book.rating || 4.5) ? "text-warning" : "text-muted"} 
                  />
                ))}
                <span className="ms-2 text-muted">({book.rating || 4.5}/5)</span>
              </div>
            </div>

            {/* Title & Author */}
            <h1 className="display-5 fw-bold mb-3 book-title">{book.title}</h1>
            <p className="fs-4 text-muted mb-4">
              by <Link to={`/author/${book.author}`} className="text-decoration-none author-link">
                {book.author}
              </Link>
            </p>

            {/* Price */}
            <div className="price-section mb-4">
              <div className="d-flex align-items-baseline">
                <h2 className="text-primary fw-bold me-3">${book.price.toFixed(2)}</h2>
                {book.originalPrice && (
                  <del className="text-muted fs-5">${book.originalPrice.toFixed(2)}</del>
                )}
                {book.discount && (
                  <Badge bg="danger" className="ms-2 fs-6">
                    Save {book.discount}%
                  </Badge>
                )}
              </div>
              <p className="text-success mb-0">
                <FaCheckCircle className="me-2" /> In Stock - Ready to ship
              </p>
            </div>

            {/* Description */}
            <div className="mb-5">
              <h5 className="mb-3">Description</h5>
              <p className="lead text-muted">{book.description}</p>
              <div className="row g-3 mt-3">
                <div className="col-6">
                  <div className="d-flex align-items-center text-muted">
                    <FaBook className="me-3 text-primary" />
                    <div>
                      <small>Category</small>
                      <div className="fw-semibold">{book.genre || 'Fiction'}</div>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="d-flex align-items-center text-muted">
                    <FaCalendarAlt className="me-3 text-primary" />
                    <div>
                      <small>Published</small>
                      <div className="fw-semibold">{book.publishedYear || '2024'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="actions-section mb-5">
              <div className="d-flex align-items-center mb-4">
                <span className="me-3 fw-semibold">Quantity:</span>
                <div className="quantity-selector d-flex align-items-center">
                  <Button 
                    variant="outline-secondary" 
                    className="rounded-circle"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="mx-3 fs-4 fw-bold">{quantity}</span>
                  <Button 
                    variant="outline-secondary" 
                    className="rounded-circle"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    +
                  </Button>
                </div>
                <small className="text-muted ms-3">({book.stock || 50} available)</small>
              </div>

              <div className="d-flex flex-wrap gap-3">
                <Button 
                  variant="primary" 
                  size="lg"
                  className="px-5 py-3 rounded-pill shadow-lg"
                  onClick={addToCart}
                >
                  <FaCartPlus className="me-3" />
                  Add to Cart - ${(book.price * quantity).toFixed(2)}
                </Button>
                
                <Button 
                  variant="outline-primary" 
                  size="lg"
                  className="px-4 py-3 rounded-pill"
                  onClick={addToWishlist}
                >
                  <FaHeart className="me-2" />
                  Wishlist
                </Button>
                
                <Button 
                  variant="outline-secondary" 
                  size="lg"
                  className="px-4 py-3 rounded-pill"
                  onClick={shareBook}
                >
                  <FaShareAlt className="me-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="features-section">
              <h5 className="mb-4">Why buy from us?</h5>
              <Row>
                <Col md={4} className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaTruck className="fs-2 text-primary me-3" />
                    <div>
                      <h6 className="mb-1">Free Shipping</h6>
                      <small className="text-muted">On orders over $25</small>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaShieldAlt className="fs-2 text-primary me-3" />
                    <div>
                      <h6 className="mb-1">Secure Payment</h6>
                      <small className="text-muted">100% secure & encrypted</small>
                    </div>
                  </div>
                </Col>
                <Col md={4} className="mb-3">
                  <div className="d-flex align-items-center">
                    <FaCheckCircle className="fs-2 text-primary me-3" />
                    <div>
                      <h6 className="mb-1">Easy Returns</h6>
                      <small className="text-muted">30-day return policy</small>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </motion.div>
        </Col>
      </Row>

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <section className="mt-5 pt-5 border-top">
          <h3 className="mb-4">You might also like</h3>
          <Row className="g-4">
            {relatedBooks.slice(0, 4).map(relatedBook => (
              <Col key={relatedBook._id} lg={3} md={4} sm={6}>
                <Card className="h-100 border-0 shadow-sm related-book-card">
                  <Card.Img 
                    variant="top" 
                    src={relatedBook.coverImage || 'https://via.placeholder.com/200x300'} 
                    className="related-book-img"
                  />
                  <Card.Body>
                    <Card.Title className="h6 mb-2">{relatedBook.title}</Card.Title>
                    <Card.Text className="small text-muted mb-2">{relatedBook.author}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <strong className="text-primary">${relatedBook.price.toFixed(2)}</strong>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        as={Link}
                        to={`/books/${relatedBook._id}`}
                      >
                        View
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
}