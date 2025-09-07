import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { listDrivers } from "../../api/drivers";
import {
    getMyCompany,
    inviteDriver,
    listInvitations,
    cancelInvitation,
} from "../../api/companies";
import { useAuth } from "../../context/AuthContext";

import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import DriverCard from "../../components/driver/DriverCard";
import InviteDriverModal from "../../components/driver/InviteDriverModal";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function DriversPage() {
    const { profile } = useAuth();
    const isCompany = profile?.role === "Company";

    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState(""); // "", "available", "offline"
    const [minRating, setMinRating] = useState("");
    const [sort, setSort] = useState("rating:desc");

    // NEW: hide hired
    const [hideHired, setHideHired] = useState(false);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [debouncedName, setDebouncedName] = useState(searchTerm);
    useEffect(() => {
        const t = setTimeout(() => setDebouncedName(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    const [companyId, setCompanyId] = useState(null);
    const [invitedMap, setInvitedMap] = useState({});

    const [showInvite, setShowInvite] = useState(false);
    const [selectedDriver, setSelectedDriver] = useState(null);

    const [showRecall, setShowRecall] = useState(false);
    const [recallDriver, setRecallDriver] = useState(null);

    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!isCompany) return;
            try {
                const me = await getMyCompany();
                if (mounted) setCompanyId(me.id);
            } catch (e) {
                console.error(e);
                toast.error("Không lấy được thông tin company của bạn.");
            }
        })();
        return () => (mounted = false);
    }, [isCompany]);

    const loadInvited = async (cid) => {
        if (!cid) return;
        try {
            const res = await listInvitations(cid, { page: 1, size: 500 });
            const map = {};
            (res.items || [])
                .filter((i) => i.status === "Pending")
                .forEach((i) => {
                    if (i.driverUserId) map[i.driverUserId] = i.id;
                });
            setInvitedMap(map);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (companyId) loadInvited(companyId);
    }, [companyId]);

    const fetchDrivers = async () => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                sort,
                ...(debouncedName.trim() ? { name: debouncedName.trim() } : {}),
                ...(status ? { isAvailable: status === "available" } : {}),
                ...(minRating ? { minRating: Number(minRating) } : {}),
                ...(hideHired ? { excludeHired: true } : {}), // <— NEW
            };
            const res = await listDrivers(params);
            setDrivers(res.items || []);
            setTotalItems(res.totalItems || 0);
            setTotalPages(res.totalPages || 0);
        } catch (e) {
            console.error(e);
            toast.error("Tải danh sách tài xế thất bại.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDrivers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedName, status, minRating, sort, page, size, hideHired]); // <— nhớ thêm hideHired

    const canInvite = isCompany && !!companyId;

    const handleInviteClick = (driver) => {
        if (!canInvite) return;
        // an toàn thêm: chặn mời nếu đã hired
        if (driver?.isHired) {
            toast.info("Driver này đã thuộc về một công ty.");
            return;
        }
        setSelectedDriver(driver);
        setShowInvite(true);
    };

    const handleSendInvite = async ({
        driverUserId,
        baseSalaryCents,
        expiresAt,
    }) => {
        try {
            await inviteDriver(companyId, {
                driverUserId,
                baseSalaryCents,
                expiresAt,
            });
            toast.success("Đã gửi lời mời.");
            setInvitedMap((prev) => ({
                ...prev,
                [driverUserId]: "__just_Pending__",
            }));
            loadInvited(companyId);
        } catch (e) {
            console.error(e);
            toast.error(
                e?.response?.data?.error?.message || "Gửi invite thất bại."
            );
        } finally {
            setShowInvite(false);
            setSelectedDriver(null);
        }
    };

    const handleRecallClick = (driver) => {
        setRecallDriver(driver);
        setShowRecall(true);
    };

    const doRecall = async () => {
        try {
            const res = await cancelInvitation(
                companyId,
                invitedMap[recallDriver.userId]
            );
            console.log("after cancel:", res);
            setInvitedMap((prev) => {
                const { [recallDriver.userId]: _, ...rest } = prev;
                return rest;
            });
        } finally {
            setShowRecall(false);
            setRecallDriver(null);
        }
    };

    return (
        <Container className="py-4">
            <FilterBar
                search={{
                    value: searchTerm,
                    onChange: (v) => {
                        setSearchTerm(v);
                        setPage(1);
                    },
                    placeholder: "Search drivers by name…",
                }}
                selects={[
                    {
                        value: status,
                        onChange: (v) => {
                            setStatus(v);
                            setPage(1);
                        },
                        style: { maxWidth: 180 },
                        options: [
                            { value: "", label: "All statuses" },
                            { value: "available", label: "Available" },
                            { value: "offline", label: "Offline" },
                        ],
                    },
                    {
                        // NEW: Hide hired
                        value: hideHired ? "hide" : "",
                        onChange: (v) => {
                            setHideHired(v === "hide");
                            setPage(1);
                        },
                        style: { maxWidth: 160 },
                        options: [
                            { value: "", label: "Hired: Show all" },
                            { value: "hide", label: "Hired: Hide" },
                        ],
                    },
                    {
                        value: minRating,
                        onChange: (v) => {
                            setMinRating(v);
                            setPage(1);
                        },
                        style: { maxWidth: 160 },
                        options: [
                            { value: "", label: "Min rating" },
                            { value: "4.5", label: "≥ 4.5" },
                            { value: "4.0", label: "≥ 4.0" },
                            { value: "3.5", label: "≥ 3.5" },
                            { value: "3.0", label: "≥ 3.0" },
                        ],
                    },
                    {
                        value: sort,
                        onChange: (v) => {
                            setSort(v);
                            setPage(1);
                        },
                        style: { maxWidth: 220 },
                        options: [
                            { value: "rating:desc", label: "Sort: Rating ↓" },
                            { value: "rating:asc", label: "Sort: Rating ↑" },
                            { value: "name:asc", label: "Sort: Name ↑" },
                            { value: "name:desc", label: "Sort: Name ↓" },
                        ],
                    },
                ]}
            />

            {loading ? (
                <div className="py-5 text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <>
                    <Row className="g-4 mt-1">
                        {drivers.map((d) => (
                            <Col xs={12} md={6} lg={4} key={d.id}>
                                <DriverCard
                                    driver={d}
                                    isInvited={!!invitedMap[d.userId]}
                                    onInvite={
                                        canInvite
                                            ? handleInviteClick
                                            : undefined
                                    }
                                    onRecall={
                                        canInvite
                                            ? handleRecallClick
                                            : undefined
                                    }
                                />
                            </Col>
                        ))}
                        {!drivers.length && (
                            <Col
                                xs={12}
                                className="text-center text-muted py-5"
                            >
                                No drivers found.
                            </Col>
                        )}
                    </Row>

                    <div className="mt-4">
                        <PaginationBar
                            page={page}
                            size={size}
                            totalItems={totalItems}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                            onSizeChange={(s) => {
                                setSize(s);
                                setPage(1);
                            }}
                        />
                    </div>
                </>
            )}

            <InviteDriverModal
                show={showInvite}
                onHide={() => setShowInvite(false)}
                driver={selectedDriver}
                onSubmit={handleSendInvite}
            />

            <ConfirmModal
                show={showRecall}
                onHide={() => setShowRecall(false)}
                title="Recall Invitation"
                message={
                    recallDriver ? (
                        <div>
                            Bạn có chắc muốn <strong>thu hồi lời mời</strong> đã
                            gửi cho <strong>{recallDriver.fullName}</strong>?
                        </div>
                    ) : (
                        "Recall this invitation?"
                    )
                }
                confirmText="Yes, recall"
                variant="danger"
                onConfirm={doRecall}
            />
        </Container>
    );
}
