import { Container, Row, Col } from 'react-bootstrap';

export default function Footer() {
    return (
        <footer className="footer mt-5">
            <Container>
                <Row>
                    <Col md={6}>
                        <h5>BookStore</h5>
                        <p className="text-muted">A simple bookstore demo built with React and Express.</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <small className="text-muted">© {new Date().getFullYear()} BookStore. All rights reserved.</small>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}
