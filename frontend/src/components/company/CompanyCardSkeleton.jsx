import { Card, Placeholder } from "react-bootstrap";

export default function CompanyCardSkeleton({ imgHeight = 180 }) {
  return (
    <Card className="h-100 shadow-sm">
      <div className="bg-light" style={{ height: imgHeight }} />
      <Card.Body>
        <Placeholder as={Card.Title} animation="wave">
          <Placeholder xs={8} />
        </Placeholder>
        <Placeholder as="p" animation="wave">
          <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={7} />
        </Placeholder>
        <div className="d-flex gap-2">
          <Placeholder.Button variant="primary" xs={3} style={{ height: 24 }} />
          <Placeholder.Button variant="secondary" xs={3} style={{ height: 24 }} />
        </div>
      </Card.Body>
    </Card>
  );
}
