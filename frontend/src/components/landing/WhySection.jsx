import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaShippingFast, FaShieldAlt, FaTags } from 'react-icons/fa';

export default function WhySection() {
  return (
    <section className="py-5">
      <Container>
        <h2 className="mb-4">Why choose BookStore?</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="feature-card p-3 h-100">
              <div className="d-flex align-items-start">
                <FaShippingFast size={32} className="me-3 text-success" />
                <div>
                  <h5>Fast delivery</h5>
                  <p className="mb-0 text-muted">Quick dispatch and reliable shipping worldwide.</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="feature-card p-3 h-100">
              <div className="d-flex align-items-start">
                <FaShieldAlt size={32} className="me-3 text-success" />
                <div>
                  <h5>Secure payments</h5>
                  <p className="mb-0 text-muted">We use industry-standard encryption to protect your data.</p>
                </div>
              </div>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="feature-card p-3 h-100">
              <div className="d-flex align-items-start">
                <FaTags size={32} className="me-3 text-success" />
                <div>
                  <h5>Great prices</h5>
                  <p className="mb-0 text-muted">Competitive pricing and frequent discounts.</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  );
}
