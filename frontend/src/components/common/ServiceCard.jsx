import { Badge, Button, Card, Image, ListGroup, Spinner } from "react-bootstrap";

export default function ServiceCard({
  service,                   // { id, title, description, priceCents, isActive, ... }
  bannerUrl,                 // optional
  priceFormatter,            // (cents)=>string
  showOwnerActions = false,  // chỉ bật nếu là owner
  busy = false,              // id đang toggle
  onEdit,                    // () => void
  onToggleActive,            // () => void
  extraListItems,            // optional ReactNode
  footer,                    // optional ReactNode
}) {
  const centsToStr = priceFormatter ?? ((c) => (c ?? 0).toLocaleString("vi-VN"));

  return (
    <Card className="h-100 shadow-sm">
      <div style={{ position: "relative" }}>
        <Image
          src={
            bannerUrl || service.imgUrl ||
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop"
          }
          alt="banner"
          style={{ width: "100%", height: 140, objectFit: "cover" }}
        />
        <Badge
          bg={service.isActive ? "success" : "secondary"}
          style={{ position: "absolute", top: 10, left: 10 }}
        >
          {service.isActive ? "Active" : "Paused"}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="mb-1">{service.title}</Card.Title>
          <div className="fw-bold text-primary">{centsToStr(service.priceCents)} ₫</div>
        </div>

        <Card.Text className="text-muted" style={{ minHeight: 48 }}>
          {service.description || <span className="fst-italic">No description</span>}
        </Card.Text>

        <ListGroup variant="flush" className="mb-3">
          {extraListItems ?? (
            <ListGroup.Item className="small">
              <i className="bi bi-megaphone-fill me-2 text-warning" />
              Promote to riders & drivers with ads
            </ListGroup.Item>
          )}
        </ListGroup>

        <div className="mt-auto d-flex gap-2">
          {showOwnerActions ? (
            <>
              <Button size="sm" variant="primary" onClick={onEdit}>
                Edit
              </Button>
              <Button
                size="sm"
                variant={service.isActive ? "outline-secondary" : "success"}
                onClick={onToggleActive}
                disabled={busy}
              >
                {busy ? <Spinner size="sm" /> : service.isActive ? "Pause" : "Reactivate"}
              </Button>
            </>
          ) : (
            footer ?? null
          )}
        </div>
      </Card.Body>
    </Card>
  );
}