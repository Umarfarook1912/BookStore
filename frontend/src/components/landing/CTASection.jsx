import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { FaGift, FaArrowRight, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CTASection() {
    return (
        <section className="py-5 position-relative overflow-hidden">
            <div className="cta-gradient-bg"></div>
            <Container>
                <Row className="justify-content-center">
                    <Col lg={10}>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center"
                        >
                            <div className="cta-badge mb-4">
                                <FaGift className="me-2" />
                                Limited Time Offer
                            </div>
                            
                            <h2 className="display-4 fw-bold text-white mb-3">
                                Start Your Reading Journey Today
                            </h2>
                            
                            <p className="lead text-light mb-5 opacity-75 mx-auto" style={{ maxWidth: '700px' }}>
                                Join thousands of readers who've found their next favorite book with us. 
                                Get your first month free with no commitment.
                            </p>

                            <div className="benefits mb-5">
                                <Row className="justify-content-center g-3">
                                    <Col md={4}>
                                        <div className="d-flex align-items-center justify-content-center text-white">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Free shipping on first order</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center justify-content-center text-white">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>No credit card required</span>
                                        </div>
                                    </Col>
                                    <Col md={4}>
                                        <div className="d-flex align-items-center justify-content-center text-white">
                                            <FaCheckCircle className="text-success me-2" />
                                            <span>Cancel anytime</span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                            <div className="cta-form-wrapper bg-white rounded-4 shadow-lg p-4">
                                <Row className="g-3 align-items-center">
                                    <Col md={6}>
                                        <Form.Control 
                                            type="email" 
                                            placeholder="Enter your email address" 
                                            size="lg"
                                            className="border-0 shadow-sm"
                                        />
                                    </Col>
                                    <Col md={4}>
                                        <Button 
                                            href="/register" 
                                            variant="primary" 
                                            size="lg"
                                            className="w-100 rounded-pill px-4 shadow"
                                        >
                                            Get Started Free
                                            <FaArrowRight className="ms-2" />
                                        </Button>
                                    </Col>
                                    <Col md={2}>
                                        <Button 
                                            href="/browse" 
                                            variant="outline-primary" 
                                            size="lg"
                                            className="w-100 rounded-pill"
                                        >
                                            Browse
                                        </Button>
                                    </Col>
                                </Row>
                                <p className="text-muted small mt-3 mb-0">
                                    By signing up, you agree to our Terms and Privacy Policy
                                </p>
                            </div>

                            <div className="mt-4">
                                <div className="d-flex align-items-center justify-content-center gap-4 text-white opacity-75">
                                    <div>
                                        <h3 className="fw-bold mb-0">50K+</h3>
                                        <small>Happy Readers</small>
                                    </div>
                                    <div className="vr"></div>
                                    <div>
                                        <h3 className="fw-bold mb-0">4.9/5</h3>
                                        <small>Average Rating</small>
                                    </div>
                                    <div className="vr"></div>
                                    <div>
                                        <h3 className="fw-bold mb-0">24/7</h3>
                                        <small>Support</small>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Col>
                </Row>
            </Container>
        </section>
    );
}