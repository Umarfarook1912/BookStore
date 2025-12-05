import { Container, Row, Col, Card } from 'react-bootstrap';

export default function FeaturesSection(){
  return (
    <section className="py-5 bg-light">
      <Container>
        <h2 className="mb-4">Explore features</h2>
        <Row>
          <Col md={4} className="mb-3">
            <Card className="p-3 h-100">
              <h5>Personalized recommendations</h5>
              <p className="text-muted mb-0">Get book suggestions tailored to your interests.</p>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="p-3 h-100">
              <h5>Easy returns</h5>
              <p className="text-muted mb-0">Hassle-free returns within 30 days.</p>
            </Card>
          </Col>
          <Col md={4} className="mb-3">
            <Card className="p-3 h-100">
              <h5>Gift cards</h5>
              <p className="text-muted mb-0">Share the joy of reading with gift cards.</p>
            </Card>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
