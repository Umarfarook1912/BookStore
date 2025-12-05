import { Container, Row, Col, Button } from 'react-bootstrap';
import { FaGift } from 'react-icons/fa';

export default function CTASection() {
    return (
        <section className="py-5 text-center">
            <Container>
                <Row className="justify-content-center">
                    <Col md={8}>
                        <h3>Ready to find your next read?</h3>
                        <p className="text-muted">Sign up and start exploring thousands of books.</p>
                        <Button href="/register" variant="primary"><FaGift className="me-2" />Get Started</Button>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
