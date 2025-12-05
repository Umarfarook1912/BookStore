import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { FaBook } from 'react-icons/fa';

export default function BookCard({ book }) {
    return (
        <Card className="h-100 shadow-sm">
            {book.coverImage && <Card.Img variant="top" src={book.coverImage} alt={book.title} />}
            <Card.Body className="d-flex flex-column">
                <Card.Title><FaBook style={{ marginRight: 8 }} />{book.title}</Card.Title>
                <Card.Text className="text-muted">{book.author}</Card.Text>
                <div className="mt-auto d-flex justify-content-between align-items-center">
                    <strong>${book.price.toFixed(2)}</strong>
                    <Button as={Link} to={`/books/${book._id}`} variant="light">Details</Button>
                </div>
            </Card.Body>
        </Card>
    );
}
