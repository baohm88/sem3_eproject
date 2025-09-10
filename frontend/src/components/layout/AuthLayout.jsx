import { Container, Row, Col, Card } from "react-bootstrap";

/**
 * AuthLayout
 * Centered card layout for auth-related pages (login, register, forgot password, etc.).
 *
 * Props:
 * - title?: string        // Optional heading shown above the content
 * - children: ReactNode   // Main form/content
 * - footer?: ReactNode    // Optional footer (e.g., links to "Create account", "Forgot password")
 */
export default function AuthLayout({ title, children, footer }) {
  return (
    <>
      {/* Full-height viewport container to vertically center the auth card */}
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Row className="w-100">
          {/* Narrow column centered on md+ screens */}
          <Col md={{ span: 6, offset: 3 }}>
            <Card className="shadow-lg p-4 rounded-4">
              <Card.Body>
                {/* Optional page title */}
                {title && <h2 className="text-center mb-4">{title}</h2>}

                {/* Main content (auth form) */}
                {children}

                {/* Optional footer area for helper links/actions */}
                {footer && <div className="text-center mt-3">{footer}</div>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
