// import { useEffect, useMemo, useState } from "react";
// import { useParams } from "react-router-dom";
// import { Card, Col, Row, Spinner, Badge, Button } from "react-bootstrap"; 
// import { toast } from "react-toastify";

// import { getCompanyPublicProfile } from "../../api/companies";
// import ServiceCard from "../../components/common/ServiceCard";
// import FilterBar from "../../components/common/FilterBar";
// import PaginationBar from "../../components/common/PaginationBar";

// const FALLBACK_LOGO =
//   "https://dummyimage.com/300x300/e9ecef/6c757d.jpg&text=No+Logo";

// export default function CompanyPublicProfilePage() {
//   const { companyId } = useParams();

//   const [loading, setLoading] = useState(true);
//   const [data, setData] = useState(null);

//   // phân trang + sort (server-side)
//   const [page, setPage] = useState(1);
//   const [size, setSize] = useState(6);
//   const [sort, setSort] = useState("updatedAt:desc");

//   // filter (client-side trên trang hiện tại)
//   const [query, setQuery] = useState("");

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const res = await getCompanyPublicProfile(companyId, { page, size, sort });
//       setData(res);
//     } catch (e) {
//       toast.error(e?.message || "Cannot load company profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!companyId) return;
//     fetchProfile();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [companyId, page, size, sort]);

//   // ------------------------
//   // 🔧 TẤT CẢ HOOKS PHẢI Ở TOP-LEVEL (trước mọi return)
//   // Derive dữ liệu an toàn để useMemo luôn chạy ở mọi render
//   const services = Array.isArray(data?.services) ? data.services : [];
//   const displayedServices = useMemo(() => {
//     if (!query.trim()) return services;
//     const q = query.trim().toLowerCase();
//     return services.filter(
//       (s) =>
//         s.title?.toLowerCase().includes(q) ||
//         s.description?.toLowerCase().includes(q)
//     );
//   }, [services, query]);

//   const totalItems = Number(data?.totalItems ?? services.length);
//   const totalPages =
//     Number(data?.totalPages ?? Math.max(1, Math.ceil(totalItems / size)));
//   // ------------------------

//   // guard: nếu thiếu param trong URL
//   if (!companyId) {
//     return (
//       <div className="py-5 text-center text-danger">
//         Invalid URL: missing companyId
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="py-5 text-center">
//         <Spinner animation="border" />
//       </div>
//     );
//   }

//   if (!data?.company) {
//     return <div className="py-5 text-center text-muted">Company not found.</div>;
//   }

//   const company = data.company;
//   const logoSrc =
//     company.imgUrl && company.imgUrl.trim() ? company.imgUrl : FALLBACK_LOGO;

//   // Định dạng giá cho ServiceCard: KHÔNG chia 100 (theo model service hiện tại)
//   const fmtPrice = (c) => (c ?? 0).toLocaleString("vi-VN");

//     console.log('company profile:', data);

//   return (
//     <div className="py-3">
//       <Row className="g-3">
//         {/* Left column: logo + meta */}
//         <Col xs={12} md={4} lg={3}>
//           <Card className="shadow-sm">
//             <Card.Body className="text-center">
//               <img
//                 src={logoSrc}
//                 alt={company.name}
//                 onError={(e) => (e.currentTarget.src = FALLBACK_LOGO)}
//                 style={{
//                   width: 128,
//                   height: 128,
//                   objectFit: "cover",
//                   borderRadius: 16,
//                 }}
//               />
//               <h5 className="mt-3 mb-1">{company.name}</h5>

//               {/* rating tổng hợp từ BE */}
//               {data.rating != null && (
//                 <div className="small mb-1">⭐ {Number(data.rating).toFixed(2)}</div>
//               )}

//               <div className="text-muted small">
//                 {company.description || "—"}
//               </div>

//               <div className="mt-2">
//                 <Badge bg="info">{company.membership}</Badge>
//                 {company.isActive ? (
//                   <Badge bg="success" className="ms-2"> Active</Badge>
//                 ) : (
//                   <Badge bg="secondary" className="ms-2">Inactive</Badge>
//                 )}
//               </div>

//               {company.membershipExpiresAt && (
//                 <div className="small text-muted mt-2">
//                   Expires:{" "}
//                   {new Date(company.membershipExpiresAt).toLocaleDateString()}
//                 </div>
//               )}

//               {/* quick stats */}
//               <div className="small text-muted mt-3">
//                 Services: <strong>{data.activeServicesCount ?? services.length}</strong>
//                 {" · "}Drivers: <strong>{data.driversCount ?? 0}</strong>
//               </div>
//             </Card.Body>
//           </Card>
//         </Col>

//         {/* Right column: services + filters + pagination */}
//         <Col xs={12} md={8} lg={9}>
//           <Card className="shadow-sm">
//             <Card.Body>
//               <div className="d-flex justify-content-between align-items-center">
//                 <Card.Title className="h6 mb-0">Services</Card.Title>
//               </div>

//               {/* ✅ Dùng FilterBar bản generic */}
//               <FilterBar
//                 search={{
//                   value: query,
//                   onChange: (v) => setQuery(v),
//                   placeholder: "Search services...",
//                 }}
//                 selects={[
//                   {
//                     value: sort,
//                     onChange: (v) => {
//                       setSort(v);
//                       setPage(1);
//                     },
//                     options: [
//                       { value: "updatedAt:desc", label: "Newest updated" },
//                       { value: "priceCents:asc", label: "Price: Low to High" },
//                       { value: "priceCents:desc", label: "Price: High to Low" },
//                       { value: "title:asc", label: "Title: A → Z" },
//                       { value: "title:desc", label: "Title: Z → A" },
//                     ],
//                     style: { maxWidth: 220 },
//                     ariaLabel: "Sort services",
//                   },
//                 ]}
//               />

//               {displayedServices.length ? (
//                 <>
//                   <Row className="g-3">
//                     {displayedServices.map((svc) => (
//                       <Col xs={12} md={6} key={svc.id}>
//                         <ServiceCard
//                           service={svc}
//                           priceFormatter={fmtPrice}
//                           showOwnerActions={false}
//                           footer={<Button size="sm">Book</Button>}
//                         />
//                       </Col>
//                     ))}
//                   </Row>

//                   {/* PaginationBar: chỉ hiện khi KHÔNG search local */}
//                   {!query.trim() && (
//                     <div className="mt-3">
//                       <PaginationBar
//                         page={page}
//                         size={size}
//                         totalItems={totalItems}
//                         totalPages={totalPages}
//                         onPageChange={setPage}
//                         onSizeChange={(val) => {
//                           setSize(val);
//                           setPage(1);
//                         }}
//                         sizeOptions={[6, 12, 24]}
//                       />
//                     </div>
//                   )}

//                   {query.trim() && (
//                     <div className="small text-muted mt-2">
//                       Showing <strong>{displayedServices.length}</strong>{" "}
//                       result(s) (filtered locally on this page)
//                     </div>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-muted">No active services</div>
//               )}
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//     </div>
//   );
// }

// src/pages/Companies/CompanyPublicProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spinner, Badge, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/common/ConfirmModal";

import { getCompanyPublicProfile } from "../../api/companies";
import {
  applyToCompanyAsDriver,
  getMyDriverProfile,
  listDriverApplications,
  cancelApplication,
  getEmploymentStatus,
} from "../../api/drivers";

import ServiceCard from "../../components/common/ServiceCard";
import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";

const FALLBACK_LOGO =
  "https://dummyimage.com/300x300/e9ecef/6c757d.jpg&text=No+Logo";

export default function CompanyPublicProfilePage() {
  const { companyId } = useParams();
  const { profile } = useAuth();
  const role = profile?.role;
  const isDriver = role === "Driver";

  // ---------- Company data ----------
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  // Server-side pagination + sort
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);
  const [sort, setSort] = useState("updatedAt:desc");

  // Client-side filter (on current page)
  const [query, setQuery] = useState("");

  // ---------- Driver actions state ----------
  const [driverUserId, setDriverUserId] = useState(
    isDriver ? profile?.id || null : null
  );
  const [isHired, setIsHired] = useState(false);
  const [isApplied, setIsApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);

  const [applyOpen, setApplyOpen] = useState(false);
  const [recallOpen, setRecallOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  // ---------- Fetch profile ----------
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getCompanyPublicProfile(companyId, { page, size, sort });
      setData(res);
    } catch (e) {
      toast.error(e?.message || "Cannot load company profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!companyId) return;
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, page, size, sort]);

  // Keep driverUserId in sync with role/profile
  useEffect(() => {
    if (isDriver) {
      setDriverUserId(profile?.id || null);
    } else {
      setDriverUserId(null);
    }
  }, [isDriver, profile?.id]);

  // Ensure driver id (fetch if driver & missing)
  useEffect(() => {
    if (!isDriver) return;
    if (driverUserId) return;
    (async () => {
      try {
        const me = await getMyDriverProfile();
        setDriverUserId(me.userId);
      } catch {
        // user có thể chưa là driver
      }
    })();
  }, [isDriver, driverUserId]);

  // Employment status (driver only)
  useEffect(() => {
    if (!isDriver || !driverUserId) return;
    (async () => {
      try {
        const s = await getEmploymentStatus(driverUserId);
        setIsHired(!!s?.isHired);
      } catch {
        // optional
      }
    })();
  }, [isDriver, driverUserId]);

  // Applications for this driver (to detect applied to this company) — driver only
  useEffect(() => {
    if (!isDriver || !driverUserId || !companyId) return;
    (async () => {
      try {
        const res = await listDriverApplications(driverUserId, {
          page: 1,
          size: 200,
          status: "Applied",
        });
        const item = (res.items || []).find((a) => a.companyId === companyId);
        setIsApplied(!!item);
        setApplicationId(item?.id || null);
      } catch {
        // optional
      }
    })();
  }, [isDriver, driverUserId, companyId]);

  // ---------- Derivations (hooks must be top-level) ----------
  const services = Array.isArray(data?.services) ? data.services : [];
  const displayedServices = useMemo(() => {
    if (!query.trim()) return services;
    const q = query.trim().toLowerCase();
    return services.filter(
      (s) =>
        s.title?.toLowerCase().includes(q) ||
        s.description?.toLowerCase().includes(q)
    );
  }, [services, query]);

  const totalItems = Number(data?.totalItems ?? services.length);
  const totalPages =
    Number(data?.totalPages ?? Math.max(1, Math.ceil(totalItems / size)));

  const fmtPrice = (c) => (c ?? 0).toLocaleString("vi-VN");

  // ---------- CTA handlers ----------
  const openApply = () => {
    if (!isDriver) {
      toast.error("Bạn cần đăng nhập bằng tài khoản Driver để ứng tuyển.");
      return;
    }
    if (!driverUserId) {
      toast.error("Bạn cần đăng nhập bằng tài khoản Driver để ứng tuyển.");
      return;
    }
    if (isHired) {
      toast.error("Bạn đã là tài xế của một công ty, không thể ứng tuyển nơi khác.");
      return;
    }
    setApplyOpen(true);
  };

  const doApply = async () => {
    if (!driverUserId || !companyId) return;
    setBusy(true);
    try {
      // Optimistic UI
      setIsApplied(true);
      const res = await applyToCompanyAsDriver(driverUserId, { companyId });
      if (res?.id) setApplicationId(res.id);
      toast.success("Đã gửi ứng tuyển!");
    } catch (e) {
      // rollback
      setIsApplied(false);
      const code = e?.response?.data?.error?.code;
      if (code === "ALREADY_EMPLOYED") {
        setIsHired(true);
        toast.error("Bạn đã là tài xế của một công ty.");
      } else {
        toast.error(e?.message || "Apply failed");
      }
    } finally {
      setBusy(false);
      setApplyOpen(false);
    }
  };

  const openRecall = () => {
    if (!applicationId) {
      toast.error("Không tìm thấy application để huỷ.");
      return;
    }
    setRecallOpen(true);
  };

  const doRecall = async () => {
    if (!driverUserId || !applicationId) return;
    setBusy(true);
    try {
      // Optimistic UI
      setIsApplied(false);
      await cancelApplication(driverUserId, applicationId);
      setApplicationId(null);
      toast.success("Đã huỷ ứng tuyển.");
    } catch (e) {
      // rollback
      setIsApplied(true);
      toast.error(e?.message || "Recall failed");
    } finally {
      setBusy(false);
      setRecallOpen(false);
    }
  };

  // ---------- Guards ----------
  if (!companyId) {
    return (
      <div className="py-5 text-center text-danger">
        Invalid URL: missing companyId
      </div>
    );
  }

  if (loading) {
    return (
      <div className="py-5 text-center">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!data?.company) {
    return (
      <div className="py-5 text-center text-muted">Company not found.</div>
    );
  }

  const company = data.company;
  const logoSrc =
    company.imgUrl && company.imgUrl.trim() ? company.imgUrl : FALLBACK_LOGO;

  return (
    <div className="py-3">
      <Row className="g-3">
        {/* Left column: logo + meta (+ CTA for Driver) */}
        <Col xs={12} md={4} lg={3}>
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <img
                src={logoSrc}
                alt={company.name}
                onError={(e) => (e.currentTarget.src = FALLBACK_LOGO)}
                style={{
                  width: 128,
                  height: 128,
                  objectFit: "cover",
                  borderRadius: 16,
                }}
              />
              <h5 className="mt-3 mb-1">{company.name}</h5>

              {/* rating tổng hợp từ BE */}
              {data.rating != null && (
                <div className="small mb-1">
                  ⭐ {Number(data.rating).toFixed(2)}
                </div>
              )}

              <div className="text-muted small">
                {company.description || "—"}
              </div>

              <div className="mt-2">
                <Badge bg="info">{company.membership}</Badge>
                {company.isActive ? (
                  <Badge bg="success" className="ms-2">
                    Active
                  </Badge>
                ) : (
                  <Badge bg="secondary" className="ms-2">
                    Inactive
                  </Badge>
                )}
              </div>

              {company.membershipExpiresAt && (
                <div className="small text-muted mt-2">
                  Expires:{" "}
                  {new Date(company.membershipExpiresAt).toLocaleDateString()}
                </div>
              )}

              {/* quick stats */}
              <div className="small text-muted mt-3">
                Services:{" "}
                <strong>
                  {data.activeServicesCount ?? services.length}
                </strong>
                {" · "}Drivers: <strong>{data.driversCount ?? 0}</strong>
              </div>

              {/* CTA: Apply / Recall (only for Driver) */}
              {isDriver && (
                <div className="mt-3 d-grid gap-2">
                  {isApplied ? (
                    <Button
                      size="sm"
                      variant="outline-danger"
                      disabled={busy}
                      onClick={openRecall}
                    >
                      {busy ? "Processing..." : "Recall Application"}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      disabled={busy || isHired}
                      onClick={openApply}
                      title={
                        isHired
                          ? "Bạn đã là tài xế của một công ty"
                          : undefined
                      }
                    >
                      {busy ? "Processing..." : "Apply to Company"}
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Right column: services + filters + pagination */}
        <Col xs={12} md={8} lg={9}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <Card.Title className="h6 mb-0">Services</Card.Title>
              </div>

              {/* FilterBar */}
              <FilterBar
                search={{
                  value: query,
                  onChange: (v) => setQuery(v),
                  placeholder: "Search services...",
                }}
                selects={[
                  {
                    value: sort,
                    onChange: (v) => {
                      setSort(v);
                      setPage(1);
                    },
                    options: [
                      { value: "updatedAt:desc", label: "Newest updated" },
                      { value: "priceCents:asc", label: "Price: Low to High" },
                      { value: "priceCents:desc", label: "Price: High to Low" },
                      { value: "title:asc", label: "Title: A → Z" },
                      { value: "title:desc", label: "Title: Z → A" },
                    ],
                    style: { maxWidth: 220 },
                    ariaLabel: "Sort services",
                  },
                ]}
              />

              {displayedServices.length ? (
                <>
                  <Row className="g-3">
                    {displayedServices.map((svc) => (
                      <Col xs={12} md={6} key={svc.id}>
                        <ServiceCard
                          service={svc}
                          priceFormatter={fmtPrice}
                          showOwnerActions={false}
                          footer={<Button size="sm">Book</Button>}
                        />
                      </Col>
                    ))}
                  </Row>

                  {/* Pagination: only when not searching locally */}
                  {!query.trim() && (
                    <div className="mt-3">
                      <PaginationBar
                        page={page}
                        size={size}
                        totalItems={totalItems}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        onSizeChange={(val) => {
                          setSize(val);
                          setPage(1);
                        }}
                        sizeOptions={[6, 12, 24]}
                      />
                    </div>
                  )}

                  {query.trim() && (
                    <div className="small text-muted mt-2">
                      Showing <strong>{displayedServices.length}</strong>{" "}
                      result(s) (filtered locally on this page)
                    </div>
                  )}
                </>
              ) : (
                <div className="text-muted">No active services</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Apply modal */}
      <ConfirmModal
        show={applyOpen}
        onHide={() => setApplyOpen(false)}
        title="Apply to Company"
        message={
          <div>
            Ứng tuyển vào <strong>{data.company.name}</strong>?<br />
            Nhà tuyển dụng sẽ xem hồ sơ và liên hệ bạn.
          </div>
        }
        confirmText="Apply"
        variant="primary"
        onConfirm={doApply}
      />

      {/* Recall modal */}
      <ConfirmModal
        show={recallOpen}
        onHide={() => setRecallOpen(false)}
        title="Recall Application"
        message={
          <div>
            Bạn có chắc muốn huỷ ứng tuyển tại{" "}
            <strong>{data.company.name}</strong>?
          </div>
        }
        confirmText="Yes, recall"
        variant="danger"
        onConfirm={doRecall}
      />
    </div>
  );
}
