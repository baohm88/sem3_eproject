import { useEffect, useState } from "react";
import { Card, Row, Col, Button, Badge, Image, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import TransactionList from "../../components/common/TransactionList";
import EditProfileModal from "../../components/common/EditProfileModal";
import TagInput from "../../components/common/TagInput";
import DriverAvailabilityToggle from "../../components/driver/DriverAvailabilityToggle";
import {
    getMyDriverProfile,
    updateMyDriverProfile,
    getDriverWallet,
    listDriverTransactions,
    updateDriverAvailability,
} from "../../api/drivers";
import { jsonOrCsvToArray, arrayToJson } from "../../utils/skills.ts";

export default function DriverProfilePage() {
    const [loading, setLoading] = useState(true);
    const [driver, setDriver] = useState(null);
    const [wallet, setWallet] = useState(null);
    const [txs, setTxs] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [skillsCsv, setSkillsCsv] = useState("");
    const [bioExpanded, setBioExpanded] = useState(false);

    const placeholderAvatar =
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=1200&auto=format&fit=crop&q=60";

    const centsToVnd = (c) =>
        (Math.round(c) / 100).toLocaleString("vi-VN", {
            maximumFractionDigits: 0,
        });

    const refreshWalletAndTx = async (driverUserId) => {
        try {
            const w = await getDriverWallet(driverUserId);
            setWallet(w);
            const tRes = await listDriverTransactions(driverUserId, {
                size: 10,
                page: 1,
            });
            setTxs(tRes.items || []);
        } catch {
            // optional
        }
    };

    const refresh = async () => {
        setLoading(true);
        try {
            const d = await getMyDriverProfile();
            setDriver(d);
            await refreshWalletAndTx(d.userId);
        } catch (e) {
            toast.error(e.message || "Cannot load driver");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refresh();
    }, []);

    const onSaveProfile = async (payload) => {
        const arr = skillsCsv
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        const next = { ...payload, skills: arrayToJson(arr) };
        const updated = await updateMyDriverProfile(next);
        setDriver(updated);
    };

    const toggleAvailable = async (next) => {
        try {
            const updated = await updateDriverAvailability(driver.userId, next);
            setDriver(updated);
        } catch (e) {
            toast.error(e.message || "Update failed");
        }
    };

    const editFields = [
        { name: "fullName", label: "Full name", placeholder: "Nguyen Van A" },
        { name: "phone", label: "Phone", placeholder: "+84 9xx xxx xxx" },
        {
            name: "imgUrl",
            label: "Avatar URL",
            placeholder: "https://...",
            helpText: "Bỏ trống để giữ nguyên",
        },
        { name: "location", label: "Location", placeholder: "Ho Chi Minh" },
        {
            name: "bio",
            label: "Bio",
            as: "textarea",
            rows: 3,
            placeholder: "Tell us about yourself...",
        },
    ];

    useEffect(() => {
        if (showEdit && driver) {
            const arr = jsonOrCsvToArray(driver.skills);
            setSkillsCsv(arr.join(", "));
        }
    }, [showEdit, driver]);

    const truncate = (text, n = 160) =>
        text?.length > n ? text.slice(0, n) + "…" : text;

    if (loading) {
        return (
            <div className="py-5 text-center">
                <Spinner animation="border" />
            </div>
        );
    }

    if (!driver) {
        return (
            <div className="py-5 text-center text-muted">
                No driver profile.
            </div>
        );
    }

    const bioHasMore = (driver.bio || "").length > 160;

    return (
        <>
            <Row className="gy-3 align-items-stretch mt-3">
                {/* Left – avatar + info + bio */}
                <Col xs={12} md={6} lg={5}>
                    <Card className="shadow-sm">
                        <Card.Body className="d-flex gap-3 align-items-center">
                            <Image
                                src={driver.imgUrl || placeholderAvatar}
                                roundedCircle
                                style={{
                                    width: 96,
                                    height: 96,
                                    objectFit: "cover",
                                }}
                                alt="Avatar"
                            />
                            <div className="flex-grow-1">
                                <div className="d-flex flex-wrap align-items-center gap-2">
                                    <h4 className="mb-0">
                                        {driver.fullName || "Unnamed Driver"}
                                    </h4>
                                    <Badge bg="info">
                                        Rating{" "}
                                        {driver.rating?.toFixed?.(1) ?? "0.0"}
                                    </Badge>
                                    {driver.isAvailable ? (
                                        <Badge bg="success">Available</Badge>
                                    ) : (
                                        <Badge bg="secondary">Offline</Badge>
                                    )}
                                </div>
                                <div className="text-muted mt-2">
                                    <div>
                                        {driver.phone || (
                                            <span className="fst-italic">
                                                No phone
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        {driver.location || (
                                            <span className="fst-italic">
                                                No location
                                            </span>
                                        )}
                                    </div>
                                </div>


                                

                                <div className="mt-3 d-flex gap-2 align-items-center">
                                    <DriverAvailabilityToggle
                                        checked={driver.isAvailable}
                                        onChange={toggleAvailable}
                                    />
                                    <Button
                                        size="sm"
                                        variant="primary"
                                        onClick={() => setShowEdit(true)}
                                    >
                                        Edit profile
                                    </Button>
                                    
                                </div>
                            </div>
                        </Card.Body>

                        <Card.Body className="pt-0">
  <div className="border-top pt-3">
    <div className="fw-semibold mb-2">
      <i className="bi bi-stars me-2 text-warning" />
      Skills
    </div>
    {jsonOrCsvToArray(driver.skills).length ? (
      <div className="d-flex flex-wrap gap-2">
        {jsonOrCsvToArray(driver.skills).map((sk) => (
          <span key={sk} className="badge rounded-pill text-bg-light border">
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

                        {/* Bio section */}
                        <Card.Body className="pt-0">
                            <div className="border-top pt-3">
                                <div className="d-flex align-items-center justify-content-between mb-2">
                                    <div className="fw-semibold">
                                        <i className="bi bi-person-lines-fill me-2 text-primary" />
                                        About me
                                    </div>
                                    {!driver.bio && (
                                        <Button
                                            variant="link"
                                            size="sm"
                                            onClick={() => setShowEdit(true)}
                                        >
                                            Add bio
                                        </Button>
                                    )}
                                </div>

                                {driver.bio ? (
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
                                                onClick={() =>
                                                    setBioExpanded((s) => !s)
                                                }
                                            >
                                                {bioExpanded
                                                    ? "Show less"
                                                    : "Read more"}
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-muted fst-italic">
                                        Chưa có giới thiệu. Hãy thêm vài dòng để
                                        thu hút công ty & khách hàng.
                                    </div>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Right – wallet & transactions */}
                <Col xs={12} md={6} lg={7}>
                    <Row className="g-3">
                        <Col xs={12}>
                            <Card className="shadow-sm">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <div className="text-muted">
                                            Wallet balance
                                        </div>
                                        <h3 className="mb-0">
                                            {wallet
                                                ? centsToVnd(
                                                      wallet.balanceCents
                                                  )
                                                : "--"}{" "}
                                            ₫
                                        </h3>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xs={12}>
                            <Card className="shadow-sm">
                                <Card.Header className="bg-white">
                                    <strong>Recent Transactions</strong>
                                </Card.Header>
                                <TransactionList
                                    transactions={txs}
                                    limit={10}
                                    perspectiveWalletId={wallet?.id}
                                />
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <EditProfileModal
                show={showEdit}
                onHide={() => setShowEdit(false)}
                initial={driver}
                fields={editFields}
                onSave={onSaveProfile}
                title="Edit Driver Profile"
            >
                {/* Skills nằm TRONG Modal.Body để không bị backdrop che */}
                <div className="mt-3">
                    <div className="mb-2 fw-semibold">Skills</div>
                    <TagInput value={skillsCsv} onChange={setSkillsCsv} />
                </div>
            </EditProfileModal>
        </>
    );
}
