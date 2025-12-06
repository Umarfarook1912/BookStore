import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Badge from 'react-bootstrap/Badge';
import { 
  FaBook, 
  FaStar, 
  FaShoppingCart, 
  FaHeart, 
  FaEye,
  FaTag,
  FaShippingFast
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import './BookCard.css';

export default function BookCard({ book }) {
  const isNew = true; // You can calculate this based on book.createdAt
  const rating = book.rating || 4.5;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="book-card h-100 border-0 shadow-sm overflow-hidden">
        {/* Card Image with Overlays */}
        <div className="book-image-container position-relative">
          <Card.Img 
            variant="top" 
            src={book.coverImage || 'https://via.placeholder.com/300x400?text=Book+Cover'} 
            alt={book.title}
            className="book-image"
          />
          
          {/* Overlay Badges */}
          <div className="position-absolute top-0 start-0 p-3">
            {isNew && (
              <Badge bg="success" className="rounded-pill px-3 py-2">
                New
              </Badge>
            )}
            {book.discount && (
              <Badge bg="danger" className="rounded-pill px-3 py-2 ms-2">
                -{book.discount}%
              </Badge>
            )}
          </div>
          
          {/* Quick Actions Overlay */}
          <div className="book-actions position-absolute bottom-0 w-100 p-3">
            <div className="d-flex justify-content-center gap-2">
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle action-btn"
                title="Add to Wishlist"
              >
                <FaHeart />
              </Button>
              <Button 
                variant="light" 
                size="sm" 
                className="rounded-circle action-btn"
                as={Link}
                to={`/books/${book._id}`}
                title="Quick View"
              >
                <FaEye />
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                className="rounded-circle action-btn"
                title="Add to Cart"
              >
                <FaShoppingCart />
              </Button>
            </div>
          </div>
        </div>

        <Card.Body className="d-flex flex-column p-4">
          {/* Book Category */}
          <div className="mb-2">
            <Badge bg="light" text="dark" className="d-inline-flex align-items-center">
              <FaTag className="me-1 small" /> {book.genre || 'Fiction'}
            </Badge>
          </div>

          {/* Book Title */}
          <Card.Title className="book-title mb-2">
            <FaBook className="me-2 text-primary" />
            {book.title}
          </Card.Title>

          {/* Author */}
          <Card.Text className="text-muted mb-3">
            by <span className="author-name">{book.author}</span>
          </Card.Text>

          {/* Rating */}
          <div className="d-flex align-items-center mb-3">
            <div className="d-flex">
              {[...Array(5)].map((_, i) => (
                <FaStar 
                  key={i} 
                  className={i < Math.floor(rating) ? "text-warning" : "text-muted"} 
                />
              ))}
            </div>
            <small className="ms-2 text-muted">({rating})</small>
          </div>

          {/* Description */}
          <Card.Text className="book-description small text-muted mb-4">
            {book.description?.substring(0, 80) || 'A captivating read that will keep you engaged from start to finish.'}...
          </Card.Text>

          {/* Price and Actions */}
          <div className="mt-auto d-flex justify-content-between align-items-center">
            <div>
              <div className="d-flex align-items-baseline">
                <strong className="fs-4 text-primary">${book.price.toFixed(2)}</strong>
                {book.originalPrice && (
                  <del className="text-muted small ms-2">${book.originalPrice.toFixed(2)}</del>
                )}
              </div>
              <small className="text-success d-flex align-items-center">
                <FaShippingFast className="me-1" /> Free Shipping
              </small>
            </div>
            <div className="d-flex gap-2">
              <Button 
                variant="outline-primary" 
                size="sm"
                as={Link}
                to={`/books/${book._id}`}
                className="rounded-pill px-3"
              >
                Details
              </Button>
              <Button 
                variant="primary" 
                size="sm"
                className="rounded-pill px-3"
              >
                <FaShoppingCart className="me-1" /> Add
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
}