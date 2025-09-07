import { useEffect, useRef, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import { listCompanies, listCompanyServicesPublic } from "../../api/companies";
import {
    applyToCompanyAsDriver,
    getMyDriverProfile,
    listDriverApplications,
    cancelApplication,
    getEmploymentStatus,
} from "../../api/drivers";

import ConfirmModal from "../../components/common/ConfirmModal";
import PaginationBar from "../../components/common/PaginationBar";
import FilterBar from "../../components/common/FilterBar";
import CompanyCardForDriver from "../../components/driver/CompanyCardForDriver";

export default function DriverJobsPage() {
    const { profile } = useAuth();
    const [driverUserId, setDriverUserId] = useState(profile?.id || null);
    const [isHired, setIsHired] = useState(false);

    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pageInfo, setPageInfo] = useState({
        page: 1,
        size: 9,
        totalPages: 1,
        totalItems: 0,
    });

    // filters
    const [q, setQ] = useState("");
    const [minRating, setMinRating] = useState("");
    const [membership, setMembership] = useState("");
    const [sort, setSort] = useState("rating:desc");

    // services cache per company
    const [expanded, setExpanded] = useState({});
    const [servicesCache, setServicesCache] = useState({});
    const [loadingServices, setLoadingServices] = useState({});

    // apply state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [applyingCompany, setApplyingCompany] = useState(null);
    const [appliedIds, setAppliedIds] = useState(new Set());
    const [applicationsMap, setApplicationsMap] = useState({}); // { companyId: applicationId }

    // recall state
    const [recallOpen, setRecallOpen] = useState(false);
    const [recallingCompany, setRecallingCompany] = useState(null);

    const debounced = useRef(null);

    // ensure driver id
    useEffect(() => {
        if (!driverUserId) {
            (async () => {
                try {
                    const me = await getMyDriverProfile();
                    setDriverUserId(me.userId);
                } catch {
                    // user có thể chưa là driver
                }
            })();
        }
    }, [driverUserId]);

    // fetch driver employment status
    useEffect(() => {
        const loadEmployment = async () => {
            if (!driverUserId) return;
            try {
                const s = await getEmploymentStatus(driverUserId);
                setIsHired(!!s?.isHired);
            } catch (e) {
                toast.error(e?.message)
            }
        };
        loadEmployment();
    }, [driverUserId]);

    // load applications of driver
    useEffect(() => {
        const loadApplications = async () => {
            if (!driverUserId) return;
            try {
                const res = await listDriverApplications(driverUserId, {
                    page: 1,
                    size: 200,
                    status: "Applied",
                });

                const ids = new Set();
                const map = {};
                (res.items || []).forEach((a) => {
                    ids.add(a.companyId);
                    map[a.companyId] = a.id;
                });
                setAppliedIds(ids);
                setApplicationsMap(map);
            } catch (e) {
                toast.error(e?.message)
            }
        };
        loadApplications();
    }, [driverUserId]);

    const fetchCompanies = async (page = 1, size = pageInfo.size) => {
        setLoading(true);
        try {
            const params = {
                page,
                size,
                sort,
                name: q || undefined,
                membership: membership || undefined,
                minRating: minRating ? Number(minRating) : undefined,
                isActive: true,
            };
            const res = await listCompanies(params);
            setCompanies(res.items || []);
            setPageInfo({
                page: res.page,
                size: res.size,
                totalPages: res.totalPages,
                totalItems: res.totalItems,
            });
        } catch (e) {
            toast.error(e.message || "Failed to fetch companies");
        } finally {
            setLoading(false);
        }
    };

    // initial
    useEffect(() => {
        fetchCompanies(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // debounce filters
    useEffect(() => {
        if (debounced.current) clearTimeout(debounced.current);
        debounced.current = setTimeout(() => {
            fetchCompanies(1);
        }, 400);
        return () => clearTimeout(debounced.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [q, minRating, membership, sort]);

    const onToggleServices = async (cid) => {
        setExpanded((s) => ({ ...s, [cid]: !s[cid] }));
        if (!servicesCache[cid]) {
            try {
                setLoadingServices((ls) => ({ ...ls, [cid]: true }));
                const res = await listCompanyServicesPublic(cid, {
                    isActive: true,
                    page: 1,
                    size: 6,
                    sort: "updatedAt:desc",
                });
                setServicesCache((c) => ({ ...c, [cid]: res.items || [] }));
            } catch (e) {
                toast.error(e.message || "Cannot load services");
            } finally {
                setLoadingServices((ls) => ({ ...ls, [cid]: false }));
            }
        }
    };

    const openApply = (company) => {
        if (!driverUserId) {
            toast.error(
                "Bạn cần đăng nhập bằng tài khoản Driver để ứng tuyển."
            );
            return;
        }
        if (isHired) {
            toast.error(
                "Bạn đã là tài xế của một công ty, không thể ứng tuyển nơi khác."
            );
            return;
        }
        setApplyingCompany(company);
        setConfirmOpen(true);
    };

    const doApply = async () => {
        if (!applyingCompany || !driverUserId) return;
        if (isHired) {
            toast.error("Bạn đã là tài xế của một công ty.");
            return;
        }
        try {
            const res = await applyToCompanyAsDriver(driverUserId, {
                companyId: applyingCompany.id,
            });
            console.log("APPLY RES", res);
        } catch (e) {
            const code = e?.response?.data?.error?.code;
            if (code === "ALREADY_EMPLOYED") {
                setIsHired(true);
                toast.error("Bạn đã là tài xế của một công ty.");
            } else {
                toast.error(e.message || "Apply failed");
            }
        } finally {
            setApplyingCompany(null);
            setConfirmOpen(false);
        }
    };

    const openRecall = (company) => {
        setRecallingCompany(company);
        setRecallOpen(true);
    };

    const doRecallApplication = async () => {
        if (!recallingCompany || !driverUserId) return;
        try {
            const appId = applicationsMap[recallingCompany.id];
            if (!appId) {
                toast.error("Không tìm thấy application để huỷ");
                return;
            }
            await cancelApplication(driverUserId, appId); // <-- DELETE endpoint mới
            toast.success(`Đã huỷ ứng tuyển tại ${recallingCompany.name}`);

            setAppliedIds((prev) => {
                const next = new Set(prev);
                next.delete(recallingCompany.id);
                return next;
            });
            setApplicationsMap((prev) => {
                const { [recallingCompany.id]: _, ...rest } = prev;
                return rest;
            });
        } catch (e) {
            toast.error(e.message || "Recall failed");
        } finally {
            setRecallingCompany(null);
            setRecallOpen(false);
        }
    };

    return (
        <div>
            <FilterBar
                search={{value: q, onChange: setQ, placeholder: "Search companies by name…"}}
                selects={[
                    {
                        value: membership,
                        onChange: setMembership,
                        style: { maxWidth: 180 },
                        options: [
                            { value: "", label: "All plans" },
                            { value: "Premium", label: "Premium" },
                            { value: "Basic", label: "Basic" },
                            { value: "Free", label: "Free" },
                        ],
                    },
                    {
                        value: minRating,
                        onChange: setMinRating,
                        style: { maxWidth: 160 },
                        options: [
                            { value: "", label: "Min rating" },
                            { value: "4.5", label: "≥ 4.5" },
                            { value: "4.0", label: "≥ 4.0" },
                            { value: "3.5", label: "≥ 3.5" },
                        ],
                    },
                    {
                        value: sort,
                        onChange: setSort,
                        style: { maxWidth: 200 },
                        options: [
                            { value: "rating:desc", label: "Rating ↓" },
                            { value: "rating:asc", label: "Rating ↑" },
                            { value: "name:asc", label: "Name ↑" },
                            { value: "name:desc", label: "Name ↓" },
                            {
                                value: "membership:asc",
                                label: "Membership ↑",
                            },
                            {
                                value: "membership:desc",
                                label: "Membership ↓",
                            },
                        ],
                    },
                ]}
            />

            {loading ? (
                <div className="py-5 text-center">
                    <Spinner animation="border" />
                </div>
            ) : companies.length === 0 ? (
                <div className="text-center py-5 text-muted">
                    Không có công ty nào phù hợp.
                </div>
            ) : (
                <>
                    <Row className="g-3">
                        {companies.map((c) => (
                            <Col xs={12} sm={6} lg={4} key={c.id}>
                                <CompanyCardForDriver
                                    company={c}
                                    isExpanded={!!expanded[c.id]}
                                    onToggleServices={onToggleServices}
                                    services={servicesCache[c.id] || []}
                                    loadingServices={!!loadingServices[c.id]}
                                    onApply={openApply}
                                    onRecall={openRecall}
                                    isApplied={appliedIds.has(c.id)}
                                    disabledActions={isHired}
                                />
                            </Col>
                        ))}
                    </Row>

                    <div className="mt-3">
                        <PaginationBar
                            page={pageInfo.page}
                            size={pageInfo.size}
                            totalItems={pageInfo.totalItems}
                            totalPages={pageInfo.totalPages}
                            onPageChange={(p) =>
                                fetchCompanies(p, pageInfo.size)
                            }
                            onSizeChange={(s) => fetchCompanies(1, s)}
                        />
                    </div>
                </>
            )}

            {/* Apply modal */}
            <ConfirmModal
                show={confirmOpen}
                onHide={() => {
                    setConfirmOpen(false);
                    setApplyingCompany(null);
                }}
                title="Apply to Company"
                message={
                    applyingCompany ? (
                        <div>
                            Ứng tuyển vào{" "}
                            <strong>{applyingCompany.name}</strong>?<br />
                            Nhà tuyển dụng sẽ xem hồ sơ và liên hệ bạn.
                        </div>
                    ) : (
                        "Apply?"
                    )
                }
                confirmText="Apply"
                variant="primary"
                onConfirm={doApply}
            />

            {/* Recall modal */}
            <ConfirmModal
                show={recallOpen}
                onHide={() => {
                    setRecallOpen(false);
                    setRecallingCompany(null);
                }}
                title="Recall Application"
                message={
                    recallingCompany ? (
                        <div>
                            Bạn có chắc muốn huỷ ứng tuyển tại{" "}
                            <strong>{recallingCompany.name}</strong>?
                        </div>
                    ) : (
                        "Recall?"
                    )
                }
                confirmText="Yes, recall"
                variant="danger"
                onConfirm={doRecallApplication}
            />
        </div>
    );
}
