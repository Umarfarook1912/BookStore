import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { FaUserCheck, FaSyncAlt, FaGift, FaBookOpen, FaChartLine, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function FeaturesSection() {
    const features = [
        {
            icon: <FaUserCheck className="fs-1" />,
            title: "Personalized Recommendations",
            description: "AI-powered suggestions based on your reading history and preferences.",
            badge: "AI-Powered",
            gradient: "primary"
        },
        {
            icon: <FaSyncAlt className="fs-1" />,
            title: "Easy Returns & Exchanges",
            description: "Hassle-free returns within 30 days. Free return shipping included.",
            badge: "30 Days",
            gradient: "success"
        },
        {
            icon: <FaGift className="fs-1" />,
            title: "Gift Cards & Wrapping",
            description: "Beautiful gift wrapping options and digital gift cards available.",
            badge: "Popular",
            gradient: "warning"
        },
        {
            icon: <FaBookOpen className="fs-1" />,
            title: "Monthly Book Clubs",
            description: "Join our book clubs and get curated selections delivered monthly.",
            badge: "New",
            gradient: "info"
        },
        {
            icon: <FaChartLine className="fs-1" />,
            title: "Reading Statistics",
            description: "Track your reading habits, progress, and set personal goals.",
            badge: "Track",
            gradient: "danger"
        },
        {
            icon: <FaUsers className="fs-1" />,
            title: "Community Reviews",
            description: "Read reviews from fellow readers and share your thoughts.",
            badge: "Social",
            gradient: "secondary"
        }
    ];

    return (
        <section className="py-5 position-relative">
            <Container>
                <Row className="justify-content-center mb-5">
                    <Col lg={8} className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <Badge bg="primary" className="mb-3 px-3 py-2 rounded-pill">
                                ✨ Premium Features
                            </Badge>
                            <h2 className="display-5 fw-bold mb-3">
                                Everything You Need for <span className="text-primary">Perfect Reading</span>
                            </h2>
                            <p className="text-muted lead">
                                Discover tools and services designed to enhance your reading journey
                            </p>
                        </motion.div>
                    </Col>
                </Row>

                <Row className="g-4">
                    {features.map((feature, index) => (
                        <Col lg={4} md={6} key={index}>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -5 }}
                            >
                                <Card className="h-100 border-0 shadow-sm overflow-hidden feature-card-hover">
                                    <div className={`feature-card-header bg-gradient-${feature.gradient}`}>
                                        <div className="feature-icon-wrapper">
                                            {feature.icon}
                                        </div>
                                    </div>
                                    <Card.Body className="p-4">
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <Card.Title className="h5 mb-0">{feature.title}</Card.Title>
                                            <Badge bg={`${feature.gradient}-subtle`} text={feature.gradient} className="rounded-pill">
                                                {feature.badge}
                                            </Badge>
                                        </div>
                                        <Card.Text className="text-muted">
                                            {feature.description}
                                        </Card.Text>
                                        <a href="/features" className="text-decoration-none small fw-semibold">
                                            Learn more →
                                        </a>
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