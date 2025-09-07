<Card className="h-100 shadow-sm">
                                    <div style={{ position: "relative" }}>
                                        <Image
                                            src={placeholderBanner}
                                            alt="banner"
                                            style={{
                                                width: "100%",
                                                height: 140,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Badge
                                            bg={
                                                svc.isActive
                                                    ? "success"
                                                    : "secondary"
                                            }
                                            style={{
                                                position: "absolute",
                                                top: 10,
                                                left: 10,
                                            }}
                                        >
                                            {svc.isActive ? "Active" : "Paused"}
                                        </Badge>
                                    </div>
                                    <Card.Body className="d-flex flex-column">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <Card.Title className="mb-1">
                                                {svc.title}
                                            </Card.Title>
                                            <div className="fw-bold text-primary">
                                                {centsToVnd(svc.priceCents)} ₫
                                            </div>
                                        </div>
                                        <Card.Text
                                            className="text-muted"
                                            style={{ minHeight: 48 }}
                                        >
                                            {svc.description || (
                                                <span className="fst-italic">
                                                    No description
                                                </span>
                                            )}
                                        </Card.Text>

                                        <ListGroup
                                            variant="flush"
                                            className="mb-3"
                                        >
                                            <ListGroup.Item className="small">
                                                <i className="bi bi-megaphone-fill me-2 text-warning" />
                                                Promote to riders & drivers with
                                                ads
                                            </ListGroup.Item>
                                        </ListGroup>

                                        <div className="mt-auto d-flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="primary"
                                                onClick={() => openEdit(svc)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant={
                                                    svc.isActive
                                                        ? "outline-secondary"
                                                        : "success"
                                                }
                                                onClick={() =>
                                                    toggleActive(svc)
                                                }
                                                disabled={busyId === svc.id}
                                            >
                                                {busyId === svc.id ? (
                                                    <Spinner size="sm" />
                                                ) : svc.isActive ? (
                                                    "Pause"
                                                ) : (
                                                    "Reactivate"
                                                )}
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>