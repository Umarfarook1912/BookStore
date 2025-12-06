import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShippingFast, FaShieldAlt, FaTags, FaHeadset, FaAward, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function WhySection() {
    const features = [
        {
            icon: <FaShippingFast size={40} />,
            title: "Fast & Free Delivery",
            description: "Free shipping on orders over $25. Delivery within 2-3 business days.",
            color: "primary"
        },
        {
            icon: <FaShieldAlt size={40} />,
            title: "Secure Payments",
            description: "256-bit SSL encryption. Your payment information is always protected.",
            color: "success"
        },
        {
            icon: <FaTags size={40} />,
            title: "Best Prices",
            description: "Price match guarantee. We'll match any competitor's price.",
            color: "warning"
        },
        {
            icon: <FaHeadset size={40} />,
            title: "24/7 Support",
            description: "Round-the-clock customer service via chat, email, or phone.",
            color: "info"
        },
        {
            icon: <FaAward size={40} />,
            title: "Quality Guarantee",
            description: "All books are carefully inspected before shipping.",
            color: "danger"
        },
        {
            icon: <FaClock size={40} />,
            title: "Easy Returns",
            description: "30-day hassle-free return policy. No questions asked.",
            color: "secondary"
        }
    ];

    return (
        <section className="py-5 bg-light position-relative overflow-hidden">
            <div className="position-absolute top-0 start-0 w-100 h-100 bg-pattern"></div>
            <Container className="position-relative">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-5"
                >
                    <span className="badge bg-primary-subtle text-primary mb-3 px-3 py-2 rounded-pill">
                        Why Choose Us
                    </span>
                    <h2 className="display-5 fw-bold mb-3">The BookStore Difference</h2>
                    <p className="text-muted lead mx-auto" style={{ maxWidth: '700px' }}>
                        We're committed to providing the best reading experience with premium service
                    </p>
                </motion.div>

                <Row className="g-4">
                    {features.map((feature, index) => (
                        <Col lg={4} md={6} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="h-100 border-0 shadow-sm hover-lift transition-all">
                                    <Card.Body className="p-4 text-center">
                                        <div className={`icon-wrapper bg-${feature.color}-subtle text-${feature.color} rounded-circle p-3 mb-4 mx-auto`} 
                                             style={{ width: '80px', height: '80px' }}>
                                            {feature.icon}
                                        </div>
                                        <Card.Title className="h5 mb-3">{feature.title}</Card.Title>
                                        <Card.Text className="text-muted">
                                            {feature.description}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </motion.div>
                        </Col>
                    ))}
                </Row>
            </Container>
        </section>
    );
}