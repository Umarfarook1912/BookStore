import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaBook } from 'react-icons/fa';
import heroImg from '../../assets/hero-books-2.svg';

export default function HeroSection() {
    return (
        <section className="hero">
            <Container>
                <Row className="align-items-center">
                    <Col lg={6} md={7} sm={12}>
                        <h1 className="display-4">Discover your next favorite book</h1>
                        <p className="lead text-muted">Browse thousands of titles across genres. Fast checkout, secure payments, and reliable delivery.</p>
                        <div className="mt-3">
                            <Button href="/browse" variant="primary" className="me-2"><FaBook style={{ marginRight: 8 }} />Browse Books</Button>
                            <Button href="/register" variant="outline-primary">Get Started</Button>
                        </div>
                    </Col>
                    <Col lg={6} md={5} sm={12} className="text-center mt-4 mt-md-0">
                        <img src={heroImg} alt="books illustration" style={{ maxWidth: '90%', height: 'auto', borderRadius: 12 }} />
                    </Col>
                </Row>
            </Container>
        </section>
    );
}
