import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import { FaBook, FaStar, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import heroImg from '../../assets/book.jpg';
import './Landing.css';

export default function HeroSection() {
    return (
        <section className="hero-section position-relative overflow-hidden">
            <div className="hero-bg-shape"></div>
            <Container className="position-relative">
                <Row className="align-items-center min-vh-80 py-5">
                    <Col lg={6} md={7} sm={12}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">
                                📚 5,000+ Books Available
                            </Badge>
                            <h1 className="display-4 fw-bold mb-3 hero-title">
                                Discover Your Next
                                <span className="text-primary"> Favorite Book</span>
                            </h1>
                            <p className="lead text-muted mb-4">
                                Dive into our vast collection of books across all genres. 
                                Enjoy curated recommendations, exclusive deals, and seamless shopping experience.
                            </p>
                            <div className="d-flex flex-wrap gap-3 align-items-center mt-4">
                                <Button 
                                    href="/browse" 
                                    variant="primary" 
                                    className="px-4 py-3 rounded-pill shadow"
                                    size="lg"
                                >
                                    <FaBook className="me-2" />
                                    Browse Books
                                    <FaArrowRight className="ms-2" />
                                </Button>
                                <Button 
                                    href="/register" 
                                    variant="outline-primary" 
                                    className="px-4 py-3 rounded-pill"
                                    size="lg"
                                >
                                    Get Started Free
                                </Button>
                            </div>
                            <div className="mt-5 d-flex align-items-center gap-4">
                                <div className="d-flex align-items-center">
                                    <FaStar className="text-warning me-2" />
                                    <div>
                                        <h5 className="mb-0">4.8/5</h5>
                                        <small className="text-muted">Customer Rating</small>
                                    </div>
                                </div>
                                <div className="vr"></div>
                                <div>
                                    <h5 className="mb-0">24/7</h5>
                                    <small className="text-muted">Support Available</small>
                                </div>
                                <div className="vr"></div>
                                <div>
                                    <h5 className="mb-0">30-Day</h5>
                                    <small className="text-muted">Easy Returns</small>
                                </div>
                            </div>
                        </motion.div>
                    </Col>
                    <Col lg={6} md={5} sm={12} className="text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="hero-image-container position-relative">
                                <img 
                                    src={heroImg} 
                                    alt="books illustration" 
                                    className="hero-image img-fluid shadow-lg"
                                />
                                <div className="floating-card floating-card-1">
                                    <FaBook className="text-primary" />
                                    <small>Best Sellers</small>
                                </div>
                                <div className="floating-card floating-card-2">
                                    <small>50% Off</small>
                                </div>
                                <div className="floating-card floating-card-3">
                                    <small>New Arrivals</small>
                                </div>
                            </div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}