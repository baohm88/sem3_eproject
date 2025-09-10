// src/components/common/FormRapper.jsx
import { Container, Row, Col, Card } from "react-bootstrap";

/**
 * FormWrapper
 *
 * A centered, responsive wrapper for auth/CRUD forms.
 *
 * Props:
 * - title?: string        // Optional heading shown above the form
 * - children: ReactNode   // The form content
 * - footer?: ReactNode    // Optional footer (e.g., links or helper text)
 *
 * Layout:
 * - Vertically & horizontally centers the card within the viewport.
 * - Uses a medium column with offset for a balanced width on desktop.
 * - Adds a shadowed, rounded card for a clean, focused form container.
 */
export default function FormWrapper({ title, children, footer }) {
  return (
    // Full-height container; center content on both axes
    <Container className="d-flex justify-content-center align-items-center min-vh-100" role="main">
      <Row className="w-100">
        {/* 6/12 width on md+, centered via offset; 100% width on mobile */}
        <Col md={{ span: 6, offset: 3 }}>
          {/* Elevated card with padding and rounded corners */}
          <Card className="shadow-lg p-4 rounded-4">
            <Card.Body>
              {/* Optional title */}
              {title && <h2 className="text-center mb-4">{title}</h2>}

              {/* Main form content */}
              {children}

              {/* Optional footer: e.g., "Already have an account? Sign in" */}
              {footer && <div className="text-center mt-3">{footer}</div>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
