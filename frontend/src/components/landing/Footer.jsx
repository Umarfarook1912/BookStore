import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaBook, FaArrowRight } from 'react-icons/fa';

export default function Footer() {
    const footerLinks = {
        "Shop": ["Browse Books", "Best Sellers", "New Arrivals", "Coming Soon"],
        "Support": ["Help Center", "Contact Us", "Shipping Info", "Returns"],
        "Company": ["About Us", "Careers", "Press", "Blog"],
        "Legal": ["Privacy Policy", "Terms of Service", "Cookie Policy", "Accessibility"]
    };

    return (
        <footer className="footer bg-dark text-white pt-5">
            <Container>
                <Row className="g-4">
                    <Col lg={4} md={6}>
                        <div className="mb-4">
                            <div className="d-flex align-items-center mb-3">
                                <FaBook className="text-primary fs-3 me-2" />
                                <h4 className="fw-bold mb-0">BookStore</h4>
                            </div>
                            <p className="text-light opacity-75 mb-4">
                                Your gateway to endless stories. We're passionate about connecting readers 
                                with books that inspire, educate, and entertain.
                            </p>
                            <div className="social-links d-flex gap-3">
                                {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
                                    <a 
                                        key={index} 
                                        href="#" 
                                        className="social-icon d-flex align-items-center justify-content-center rounded-circle"
                                    >
                                        <Icon />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </Col>

                    {Object.entries(footerLinks).map(([category, links]) => (
                        <Col lg={2} md={3} key={category}>
                            <h6 className="fw-bold mb-4">{category}</h6>
                            <ul className="list-unstyled">
                                {links.map((link, index) => (
                                    <li key={index} className="mb-2">
                                        <a 
                                            href="#" 
                                            className="text-light opacity-75 text-decoration-none hover-opacity-100 d-inline-flex align-items-center gap-2"
                                        >
                                            <FaArrowRight className="small" />
                                            {link}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Col>
                    ))}

                    <Col lg={4} md={6}>
                        <div className="mb-4">
                            <h6 className="fw-bold mb-4">Stay Updated</h6>
                            <p className="text-light opacity-75 mb-3">
                                Subscribe to our newsletter for book recommendations and exclusive offers.
                            </p>
                            <Form className="d-flex mb-3">
                                <Form.Control 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="rounded-end-0 border-end-0"
                                />
                                <Button variant="primary" className="rounded-start-0">
                                    <FaArrowRight />
                                </Button>
                            </Form>
                            <small className="text-light opacity-75">
                                We respect your privacy. Unsubscribe at any time.
                            </small>
                        </div>
                    </Col>
                </Row>

                <hr className="my-5 opacity-25" />

                <Row className="align-items-center">
                    <Col md={6}>
                        <div className="d-flex flex-wrap align-items-center gap-3">
                            <span className="text-light opacity-75">
                                © {new Date().getFullYear()} BookStore. All rights reserved.
                            </span>
                            <div className="d-flex gap-3">
                                <a href="#" className="text-light opacity-75 text-decoration-none small">
                                    Privacy Policy
                                </a>
                                <a href="#" className="text-light opacity-75 text-decoration-none small">
                                    Terms of Service
                                </a>
                                <a href="#" className="text-light opacity-75 text-decoration-none small">
                                    Cookies
                                </a>
                            </div>
                        </div>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <div className="d-flex flex-wrap justify-content-md-end gap-3 align-items-center mt-3 mt-md-0">
                            <span className="text-light opacity-75">Payment Methods:</span>
                            <div className="d-flex gap-2">
                                {['💳', '🔐', '💰', '🏦'].map((emoji, index) => (
                                    <span key={index} className="bg-light text-dark rounded px-2 py-1 small">
                                        {emoji}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </footer>
    );
}