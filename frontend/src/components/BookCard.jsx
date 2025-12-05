import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
    return (
        <div className="card h-100">
            {book.coverImage && <img src={book.coverImage} className="card-img-top" alt={book.title} />}
            <div className="card-body d-flex flex-column">
                <h5 className="card-title">{book.title}</h5>
                <p className="card-text text-muted">{book.author}</p>
                <p className="card-text mt-auto">${book.price.toFixed(2)}</p>
                <Link to={`/books/${book._id}`} className="btn btn-primary mt-2">Details</Link>
            </div>
        </div>
    );
}
