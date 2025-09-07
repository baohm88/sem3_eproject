import { Card, Button, Badge, Image } from "react-bootstrap";
import DriverAvailabilityToggle from "./DriverAvailabilityToggle";

export default function DriverIdentity({
    driver,
    placeholderAvatar,
    onEdit,
    onToggleAvailable,
    bioExpanded,
    setBioExpanded,
    truncate,
}) {
    const bioHasMore = (driver.bio || "").length > 160;

    return (
        <Card className="shadow-sm">
            <Card.Body className="d-flex gap-3 align-items-center">
                <Image
                    src={driver?.imgUrl || placeholderAvatar}
                    roundedCircle
                    style={{ width: 96, height: 96, objectFit: "cover" }}
                    alt="Avatar"
                />
                <div className="flex-grow-1">
                    <div className="d-flex flex-wrap align-items-center gap-2">
                        <h4 className="mb-0">
                            {driver?.fullName || "Unnamed Driver"}
                        </h4>
                        <Badge bg="info">
                            Rating {driver?.rating?.toFixed?.(1) ?? "0.0"}
                        </Badge>
                        {driver?.isAvailable ? (
                            <Badge bg="success">Available</Badge>
                        ) : (
                            <Badge bg="secondary">Offline</Badge>
                        )}
                    </div>

                    <div className="text-muted mt-2">
                        <div>
                            {driver?.phone || (
                                <span className="fst-italic">No phone</span>
                            )}
                        </div>
                        <div>
                            {driver?.location || (
                                <span className="fst-italic">No location</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-3 d-flex gap-2 align-items-center">
                        <DriverAvailabilityToggle
                            checked={!!driver?.isAvailable}
                            onChange={onToggleAvailable}
                        />
                        <Button size="sm" variant="primary" onClick={onEdit}>
                            Edit profile
                        </Button>
                    </div>
                </div>
            </Card.Body>

            {/* Skills */}
            <Card.Body className="pt-0">
                <div className="border-top pt-3">
                    <div className="fw-semibold mb-2">
                        <i className="bi bi-stars me-2 text-warning" />
                        Skills
                    </div>
                    {Array.isArray(driver?.skills) &&
                    driver.skills.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {driver.skills.map((sk) => (
                                <span
                                    key={sk}
                                    className="badge rounded-pill text-bg-light border"
                                >
                                    {sk}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="text-muted fst-italic">
                            No skills yet. Add some in your profile.
                        </div>
                    )}
                </div>
            </Card.Body>

            {/* Bio */}
            <Card.Body className="pt-0">
                <div className="border-top pt-3">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="fw-semibold">
                            <i className="bi bi-person-lines-fill me-2 text-primary" />
                            About me
                        </div>
                        {!driver?.bio && (
                            <Button variant="link" size="sm" onClick={onEdit}>
                                Add bio
                            </Button>
                        )}
                    </div>

                    {driver?.bio ? (
                        <div className="bg-light rounded p-3">
                            <div
                                className="text-muted"
                                style={{
                                    whiteSpace: "pre-wrap",
                                    lineHeight: 1.6,
                                }}
                            >
                                {bioExpanded
                                    ? driver.bio
                                    : truncate(driver.bio, 160)}
                            </div>
                            {bioHasMore && (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="px-0 mt-2"
                                    onClick={() => setBioExpanded((s) => !s)}
                                >
                                    {bioExpanded ? "Show less" : "Read more"}
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="text-muted fst-italic">
                            Chưa có giới thiệu. Hãy thêm vài dòng để thu hút
                            công ty & khách hàng.
                        </div>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
}
