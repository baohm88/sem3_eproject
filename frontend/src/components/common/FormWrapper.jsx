import { Container, Row, Col, Card } from "react-bootstrap";

export default function FormWrapper({ title, children, footer }) {
    return (
        <Container className="d-flex justify-content-center align-items-center min-vh-100">
            <Row className="w-100">
                <Col md={{ span: 6, offset: 3 }}>
                    <Card className="shadow-lg p-4 rounded-4">
                        <Card.Body>
                            {title && (
                                <h2 className="text-center mb-4">{title}</h2>
                            )}
                            {children}
                            {footer && (
                                <div className="text-center mt-3">{footer}</div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
