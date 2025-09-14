// src/pages/Companies/CompanyPublicProfilePage.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Col, Row, Spinner, Badge, Button } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import ConfirmModal from "../../components/common/ConfirmModal";

import { 
  getCompanyPublicProfile, 
  listCompanyReviews, 
  createCompanyReview,
} from "../../api/companies";
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
  "https://imgt.taimienphi.vn/cf/Images/tt/2021/8/20/top-anh-dai-dien-dep-chat-39.jpg";


function StarInput({ value, onChange, size = 20 }) {
  const v = Number(value || 0);
  return (
    <span>
      {[1,2,3,4,5].map((n) => (
        <i
          key={n}
          className={`bi ${n <= v ? "bi-star-fill text-warning" : "bi-star"}`}
          style={{ fontSize: size, cursor: "pointer" }}
          onClick={() => onChange(n)}
        />
      ))}
    </span>
  );
}

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

  // Client-side filter (applies to the current page list)
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

  // --- Feedback state ---
  const [revPage, setRevPage] = useState(1);
  const [revSize, setRevSize] = useState(5);
  const [reviews, setReviews] = useState([]);
  const [revTotalItems, setRevTotalItems] = useState(0);
  const [revTotalPages, setRevTotalPages] = useState(1);
  const [revLoading, setRevLoading] = useState(false);

  // form
  const isLoggedIn = !!profile;
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [posting, setPosting] = useState(false);

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
        // user might not be a driver yet
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
        // optional: ignore status fetch errors
      }
    })();
  }, [isDriver, driverUserId]);

  // Applications for this driver (to detect whether applied to this company) — driver only
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


  useEffect(() => {
    if (!companyId) return;
    (async () => {
      try {
        setRevLoading(true);
        const res = await listCompanyReviews(companyId, { page: revPage, size: revSize });
        setReviews(res.items || []);
        setRevTotalItems(res.totalItems || 0);
        setRevTotalPages(res.totalPages || 1);
      } catch (e) {
        console.error(e);
      } finally {
        setRevLoading(false);
      }
    })();
  }, [companyId, revPage, revSize]);

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
      toast.error("You need to log in with a Driver account to apply.");
      return;
    }
    if (!driverUserId) {
      toast.error("You need to log in with a Driver account to apply.");
      return;
    }
    if (isHired) {
      toast.error("You are already employed by a company and cannot apply elsewhere.");
      return;
    }
    setApplyOpen(true);
  };

  const doApply = async () => {
    if (!driverUserId || !companyId) return;
    setBusy(true);
    try {
      // Optimistic UI: mark as applied first
      setIsApplied(true);
      const res = await applyToCompanyAsDriver(driverUserId, { companyId });
      if (res?.id) setApplicationId(res.id);
      toast.success("Application sent!");
    } catch (e) {
      // rollback if API fails
      setIsApplied(false);
      const code = e?.response?.data?.error?.code;
      if (code === "ALREADY_EMPLOYED") {
        setIsHired(true);
        toast.error("You are already employed by a company.");
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
      toast.error("No application found to cancel.");
      return;
    }
    setRecallOpen(true);
  };

  const doRecall = async () => {
    if (!driverUserId || !applicationId) return;
    setBusy(true);
    try {
      // Optimistic UI: unmark applied
      setIsApplied(false);
      await cancelApplication(driverUserId, applicationId);
      setApplicationId(null);
      toast.success("Application recalled.");
    } catch (e) {
      // rollback if API fails
      setIsApplied(true);
      toast.error(e?.message || "Recall failed");
    } finally {
      setBusy(false);
      setRecallOpen(false);
    }
  };


  const submitReview = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to leave feedback.");
      return;
    }
    const r = Number(myRating);
    if (r < 1 || r > 5) {
      toast.error("Please select a rating (1–5).");
      return;
    }
    setPosting(true);
    try {
      await createCompanyReview(companyId, { rating: r, comment: myComment?.trim() || undefined });
      toast.success("Thanks for your feedback!");
      // reset & reload first page to show newest
      setMyRating(0);
      setMyComment("");
      setRevPage(1);
      // refetch
      const res = await listCompanyReviews(companyId, { page: 1, size: revSize });
      setReviews(res.items || []);
      setRevTotalItems(res.totalItems || 0);
      setRevTotalPages(res.totalPages || 1);
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || "Failed to submit review.");
    } finally {
      setPosting(false);
    }
  };

  // ---------- Guards / loading states ----------
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


    console.log(reviews);
    

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

              {/* Aggregate rating from backend */}
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

              {/* Quick stats */}
              <div className="small text-muted mt-3">
                Services: <strong>{data.activeServicesCount ?? services.length}</strong>
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
                      title={isHired ? "You are already employed by a company" : undefined}
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
      
      {/* Feedback */}
      <Row className="g-3 mt-3">
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="h6 mb-0">Feedback</Card.Title>
              </div>

              <Row className="g-3">
                {/* Left: Public list of reviews */}
                <Col xs={12} md={7}>
                  {revLoading ? (
                    <div className="py-3 text-center">
                      <Spinner animation="border" />
                    </div>
                  ) : reviews.length === 0 ? (
                    <div className="text-muted">No feedback yet.</div>
                  ) : (
                    <>
                      <div className="d-flex flex-column gap-3">
                        {reviews.map((r) => (
                          <div key={r.id} className="border rounded p-2">
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={r.userImgUrl || FALLBACK_LOGO}
                                onError={(e)=> e.currentTarget.src = FALLBACK_LOGO}
                                alt={r.userName || "User"}
                                width={32}
                                height={32}
                                style={{ objectFit: "cover", borderRadius: 8 }}
                              />
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2">
                                  <strong className="me-1">{r.userName || "Anonymous"}</strong>
                                  <span className="text-muted small">
                                    {new Date(r.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <div>
                                  {/* read-only stars */}
                                  {[1,2,3,4,5].map((n) => (
                                    <i
                                      key={n}
                                      className={`bi ${n <= r.rating ? "bi-star-fill text-warning" : "bi-star"}`}
                                      style={{ fontSize: 14 }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            {r.comment && (
                              <div className="mt-2">{r.comment}</div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3">
                        <PaginationBar
                          page={revPage}
                          size={revSize}
                          totalItems={revTotalItems}
                          totalPages={revTotalPages}
                          onPageChange={setRevPage}
                          onSizeChange={(s) => { setRevSize(s); setRevPage(1); }}
                          sizeOptions={[5, 10, 20]}
                        />
                      </div>
                    </>
                  )}
                </Col>

                {/* Right: form for logged-in users */}
                <Col xs={12} md={5}>
                  <div className="border rounded p-3">
                    <div className="fw-semibold mb-2">Leave a review</div>
                    {isLoggedIn ? (
                      <>
                        <div className="mb-2">
                          <div className="small text-muted mb-1">Your rating</div>
                          <StarInput value={myRating} onChange={setMyRating} />
                        </div>
                        <div className="mb-2">
                          <div className="small text-muted mb-1">Comment (optional)</div>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={myComment}
                            onChange={(e) => setMyComment(e.target.value)}
                            placeholder="Share your experience…"
                          />
                        </div>
                        <div className="d-grid">
                          <Button size="sm" onClick={submitReview} disabled={posting}>
                            {posting ? "Submitting..." : "Submit"}
                          </Button>
                        </div>
                        <div className="small text-muted mt-2">
                          Note: later we’ll only allow riders who used this company’s services to review.
                        </div>
                      </>
                    ) : (
                      <div className="text-muted">
                        Please log in to leave feedback.
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
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
            Apply to <strong>{data.company.name}</strong>?<br />
            The employer will review your profile and contact you.
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
            Are you sure you want to recall your application at{" "}
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
