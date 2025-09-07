// src/pages/Companies/CompanyInvitesPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import {
    getMyCompany,
    listInvitations,
    cancelInvitation,
} from "../../api/companies";
import api from "../../api/axios"; // dùng để fetch nhanh profile driver theo userId

import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import DriverCard from "../../components/driver/DriverCard";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function CompanyInvitesPage() {
    const { profile } = useAuth();
    const isCompany = profile?.role === "Company";

    // Company & invites
    const [companyId, setCompanyId] = useState(null);
    const [invites, setInvites] = useState([]); // raw từ BE
    const [loading, setLoading] = useState(true);

    // Driver cache: userId -> profile
    const [driversMap, setDriversMap] = useState({}); // { [userId]: DriverProfile }
    const fetchingRef = useRef(new Set()); // tránh fetch trùng

    // Filters / Sort (client)
    const [searchTerm, setSearchTerm] = useState("");
    const [status, setStatus] = useState("Pending"); // "", "Pending", "Accepted", "Rejected", "Cancelled",  "Expired"
    const [sort, setSort] = useState("createdAt:desc"); // "createdAt:desc|asc" | "name:asc|desc"

    // Pagination (client)
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(3);

    // debounce search
    const [debouncedName, setDebouncedName] = useState(searchTerm);
    useEffect(() => {
        const t = setTimeout(() => setDebouncedName(searchTerm), 300);
        return () => clearTimeout(t);
    }, [searchTerm]);

    // Load company id
    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!isCompany) {
                setLoading(false);
                return;
            }
            try {
                const me = await getMyCompany();
                if (mounted) setCompanyId(me.id);
            } catch (e) {
                console.error(e);
                toast.error("Không lấy được thông tin công ty của bạn.");
            }
        })();
        return () => (mounted = false);
    }, [isCompany]);

    // Load invites (BE chưa có filter -> lấy rộng, filter client)
    const fetchInvites = async (cid) => {
        if (!cid) return;
        setLoading(true);
        try {
            const res = await listInvitations(cid, {
                page: 1,
                size: 1000,
            });
            setInvites(res.items || []);
        } catch (e) {
            console.error(e);
            toast.error("Không tải được danh sách lời mời.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyId) fetchInvites(companyId);
    }, [companyId]);

    // Helper: fetch driver profile by userId (cache)
    const ensureDriverLoaded = async (userId) => {
        if (!userId || driversMap[userId] || fetchingRef.current.has(userId))
            return;
        try {
            fetchingRef.current.add(userId);
            const res = await api.get(`/api/drivers/${userId}`);
            const driver = res?.data?.data;
            if (driver) {
                setDriversMap((m) => ({ ...m, [userId]: driver }));
            }
        } catch (e) {
            // bỏ qua: vẫn render card với thông tin hạn chế
        } finally {
            fetchingRef.current.delete(userId);
        }
    };

    // Derived list: filter + search + sort
    const filteredSorted = useMemo(() => {
        const term = (debouncedName || "").trim().toLowerCase();

        let arr = invites.slice();

        if (status) {
            arr = arr.filter(
                (i) => (i.status || "").toLowerCase() === status.toLowerCase()
            );
        }

        if (term) {
            arr = arr.filter((i) => {
                const d = driversMap[i.driverUserId];
                const name = (d?.fullName || "").toLowerCase();
                return name.includes(term);
            });
        }

        // sort
        const [field, dir = "desc"] = (sort || "createdAt:desc").split(":");
        arr.sort((a, b) => {
            if (field === "name") {
                const na = (
                    driversMap[a.driverUserId]?.fullName || ""
                ).toLowerCase();
                const nb = (
                    driversMap[b.driverUserId]?.fullName || ""
                ).toLowerCase();
                if (na < nb) return dir === "asc" ? -1 : 1;
                if (na > nb) return dir === "asc" ? 1 : -1;
                // tie-break by createdAt desc
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                // createdAt
                const ta = new Date(a.createdAt).getTime();
                const tb = new Date(b.createdAt).getTime();
                return dir === "asc" ? ta - tb : tb - ta;
            }
        });

        return arr;
    }, [invites, driversMap, debouncedName, status, sort]);

    // Pagination (client)
    const totalItems = filteredSorted.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / size));
    const pageSafe = Math.min(page, totalPages);
    useEffect(() => {
        if (page !== pageSafe) setPage(pageSafe);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [totalPages]);

    const paged = useMemo(() => {
        const start = (pageSafe - 1) * size;
        const end = start + size;
        return filteredSorted.slice(start, end);
    }, [filteredSorted, pageSafe, size]);

    // Preload drivers for current page
    useEffect(() => {
        paged.forEach((i) => ensureDriverLoaded(i.driverUserId));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paged]);

    // Cancel invitation modal
    const [showCancel, setShowCancel] = useState(false);
    const [selectedInvite, setSelectedInvite] = useState(null);

    const openCancel = (invite) => {
        setSelectedInvite(invite);
        setShowCancel(true);
    };

    const doCancel = async () => {
        if (!companyId || !selectedInvite) return;
        try {
            await cancelInvitation(companyId, selectedInvite.id);
            toast.success("Đã huỷ lời mời.");
            await fetchInvites(companyId); // refresh
        } catch (e) {
            console.error(e);
            toast.error(
                e?.response?.data?.error?.message || "Huỷ lời mời thất bại."
            );
        } finally {
            setSelectedInvite(null);
            setShowCancel(false);
        }
    };

    return (
        <Container className="py-4">
            {/* FilterBar — đồng bộ với CompaniesPage style */}
            <FilterBar
                search={{
                    value: searchTerm,
                    onChange: (v) => {
                        setSearchTerm(v);
                        setPage(1);
                    },
                    placeholder: "Search invited drivers by name…",
                }}
                selects={[
                    {
                        value: status,
                        onChange: (v) => {
                            setStatus(v);
                            setPage(1);
                        },
                        style: { maxWidth: 200 },
                        options: [
                            { value: "", label: "All statuses" },
                            { value: "Pending", label: "Pending" },
                            { value: "Accepted", label: "Accepted" },
                            { value: "Rejected", label: "Rejected" },
                            { value: "Cancelled", label: "Cancelled" },
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
                            {
                                value: "createdAt:desc",
                                label: "Sort: Newest ↓",
                            },
                            { value: "createdAt:asc", label: "Sort: Oldest ↑" },
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
            ) : totalItems === 0 ? (
                <div className="text-center text-muted py-5">
                    Không có lời mời nào đang chờ driver duyệt.
                </div>
            ) : (
                <>
                    <Row className="g-4 mt-1">
                        {paged.map((inv) => {
                            const d = driversMap[inv.driverUserId];
                            // Map sang DriverCard
                            const driverForCard = d || {
                                userId: inv.driverUserId,
                                fullName: "Loading…",
                                phone: null,
                                imgUrl: null,
                                rating: 0,
                                isAvailable: true,
                            };

                            const isPending = inv.status === "Pending";
                            const isAccepted = inv.status === "Accepted";
                            const isRejected = inv.status === "Rejected";
                            const isCancelled = inv.status === "Cancelled";

                            // Hiển thị badge Invited khi Pending, có thể custom trong DriverCard theo prop
                            return (
                                <Col xs={12} md={6} lg={4} key={inv.id}>
                                    <DriverCard
                                        driver={driverForCard}
                                        isInvited={isPending}
                                        // Hiển thị trạng thái khác qua subtitle/customBadge nếu DriverCard hỗ trợ
                                        statusBadge={
                                            isPending
                                                ? "Invited"
                                                : isAccepted
                                                ? "Accepted"
                                                : isRejected
                                                ? "Rejected"
                                                : isCancelled
                                                ? "Cancelled"
                                                : ""
                                        }
                                        // Chỉ cho phép Recall khi đang Pending
                                        onRecall={
                                            isPending
                                                ? () => openCancel(inv)
                                                : undefined
                                        }
                                        // Không show nút Invite ở trang này
                                        onInvite={undefined}
                                    />
                                </Col>
                            );
                        })}
                    </Row>

                    {/* PaginationBar — giống CompaniesPage */}
                    <div className="mt-4">
                        <PaginationBar
                            page={pageSafe}
                            size={size}
                            totalItems={totalItems}
                            totalPages={totalPages}
                            onPageChange={(p) => setPage(p)}
                            onSizeChange={(s) => {
                                setSize(s);
                                setPage(1);
                            }}
                            sizeOptions={[6, 12, 24, 48]}
                        />
                    </div>
                </>
            )}

            {/* Cancel confirm */}
            <ConfirmModal
                show={showCancel}
                onHide={() => setShowCancel(false)}
                title="Cancel Invitation"
                message={
                    selectedInvite ? (
                        <div>
                            Thu hồi lời mời đã gửi cho{" "}
                            <strong>
                                {driversMap[selectedInvite.driverUserId]
                                    ?.fullName || "driver"}
                            </strong>
                            ?
                        </div>
                    ) : (
                        "Cancel this invitation?"
                    )
                }
                confirmText="Yes, cancel"
                variant="danger"
                onConfirm={doCancel}
            />
        </Container>
    );
}
