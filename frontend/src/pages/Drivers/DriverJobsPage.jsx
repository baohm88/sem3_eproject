import { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Collapse,
  Form,
  InputGroup,
  Pagination,
  Row,
  Spinner,
} from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import {
  listCompanies,
  listCompanyServices,
} from "../../api/companies";
import {
  applyToCompany,
} from "../../api/drivers";
import ConfirmModal from "../../components/common/ConfirmModal";
import { getMyDriverProfile } from "../../api/drivers";

const PLACEHOLDER_LOGO =
  "https://images.unsplash.com/photo-1554189097-ffe88e998a2b?w=600&auto=format&fit=crop&q=60";

function centsToVnd(cents) {
  return (cents / 100).toLocaleString("vi-VN");
}

export default function DriverJobsPage() {
  const { profile } = useAuth();
  const [driverUserId, setDriverUserId] = useState(profile?.id || null);

  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, size: 9, totalPages: 1, totalItems: 0 });

  const [q, setQ] = useState("");
  const [minRating, setMinRating] = useState("");
  const [membership, setMembership] = useState(""); // "", "Pro", "Business", "Free"
  const [sort, setSort] = useState("rating:desc"); // gợi ý: rating desc

  const [expanded, setExpanded] = useState({}); // { [companyId]: boolean }
  const [servicesCache, setServicesCache] = useState({}); // { [companyId]: Service[] }
  const [loadingServices, setLoadingServices] = useState({}); // { [companyId]: boolean }

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applyingCompany, setApplyingCompany] = useState(null);

  const debounced = useRef(null);

  // ensure driverUserId (fallback)
  useEffect(() => {
    (async () => {
      if (!driverUserId) {
        try {
          const me = await getMyDriverProfile();
          setDriverUserId(me.userId);
        } catch {
          // ignore; user có thể chưa là Driver
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchCompanies = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        size: pageInfo.size,
        sort,
        // back-end đang hỗ trợ: name, membership, isActive, minRating, maxRating, page, size, sort
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
      toast.error(e.message || "Cannot load companies");
    } finally {
      setLoading(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchCompanies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // debounce filters/search
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
    // only fetch once
    if (!servicesCache[cid]) {
      try {
        setLoadingServices((ls) => ({ ...ls, [cid]: true }));
        // server-side filter isActive=true
        const res = await listCompanyServices(cid, { isActive: true, page: 1, size: 6, sort: "updatedAt:desc" });
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
      toast.error("Bạn cần đăng nhập bằng tài khoản Driver để ứng tuyển.");
      return;
    }
    setApplyingCompany(company);
    setConfirmOpen(true);
  };

  const doApply = async () => {
    if (!applyingCompany || !driverUserId) return;
    try {
      await applyToCompany(driverUserId, { companyId: applyingCompany.id });
      toast.success(`Đã ứng tuyển vào ${applyingCompany.name}`);
    } catch (e) {
      toast.error(e.message || "Apply failed");
    } finally {
      setApplyingCompany(null);
    }
  };

  const membershipBadge = (m) => (
    <Badge bg={m === "Pro" ? "success" : m === "Business" ? "primary" : "secondary"}>
      {m || "Free"}
    </Badge>
  );

  const pager = useMemo(() => {
    const items = [];
    const total = pageInfo.totalPages || 1;
    const cur = pageInfo.page || 1;

    const goto = (p) => {
      if (p < 1 || p > total) return;
      fetchCompanies(p);
    };

    items.push(
      <Pagination.Prev key="prev" disabled={cur <= 1} onClick={() => goto(cur - 1)} />
    );
    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || Math.abs(i - cur) <= 1) {
        items.push(
          <Pagination.Item key={i} active={cur === i} onClick={() => goto(i)}>
            {i}
          </Pagination.Item>
        );
      } else if (
        (i === 2 && cur > 3) ||
        (i === total - 1 && cur < total - 2)
      ) {
        items.push(<Pagination.Ellipsis key={`e-${i}`} disabled />);
      }
    }
    items.push(
      <Pagination.Next key="next" disabled={cur >= total} onClick={() => goto(cur + 1)} />
    );

    return <Pagination className="mt-3">{items}</Pagination>;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo]);

  return (
    <div className="py-3">
      {/* Filters */}
      <Card className="border-0 shadow-sm mb-3">
        <Card.Body className="d-flex flex-column flex-md-row gap-2">
          <InputGroup className="flex-grow-1">
            <InputGroup.Text><i className="bi bi-search" /></InputGroup.Text>
            <Form.Control
              placeholder="Search companies by name…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </InputGroup>
          <Form.Select
            value={membership}
            onChange={(e) => setMembership(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="">All plans</option>
            <option value="Business">Business</option>
            <option value="Pro">Pro</option>
            <option value="Free">Free</option>
          </Form.Select>
          <Form.Select
            value={minRating}
            onChange={(e) => setMinRating(e.target.value)}
            style={{ maxWidth: 160 }}
          >
            <option value="">Min rating</option>
            <option value="4.5">≥ 4.5</option>
            <option value="4.0">≥ 4.0</option>
            <option value="3.5">≥ 3.5</option>
          </Form.Select>
          <Form.Select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ maxWidth: 180 }}
          >
            <option value="rating:desc">Sort: Rating (high→low)</option>
            <option value="name:asc">Sort: Name (A→Z)</option>
            <option value="name:desc">Sort: Name (Z→A)</option>
          </Form.Select>
        </Card.Body>
      </Card>

      {/* Grid */}
      {loading ? (
        <div className="py-5 text-center">
          <Spinner animation="border" />
        </div>
      ) : companies.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <Card.Body className="text-center py-5 text-muted">
            Không có công ty nào phù hợp.
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row className="g-3">
            {companies.map((c) => {
              const isExp = !!expanded[c.id];
              const svc = servicesCache[c.id] || [];
              return (
                <Col xs={12} sm={6} lg={4} key={c.id}>
                  <Card className="h-100 shadow-sm">
                    <Card.Body className="d-flex flex-column">
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={c.imgUrl || PLACEHOLDER_LOGO}
                          alt={c.name}
                          style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 12 }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2">
                            <Card.Title className="mb-0">{c.name || "Untitled"}</Card.Title>
                            {membershipBadge(c.membership)}
                          </div>
                          <div className="small text-muted">
                            Rating {c.rating?.toFixed?.(1) ?? "0.0"}
                          </div>
                        </div>
                      </div>

                      <Card.Text className="text-muted mt-2" style={{ minHeight: 44 }}>
                        {c.description || <span className="fst-italic">No description</span>}
                      </Card.Text>

                      <div className="mt-auto d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          onClick={() => onToggleServices(c.id)}
                        >
                          {isExp ? "Hide services" : "View services"}
                        </Button>
                        <Button size="sm" onClick={() => openApply(c)}>
                          Apply
                        </Button>
                      </div>

                      <Collapse in={isExp}>
                        <div>
                          <hr />
                          {loadingServices[c.id] ? (
                            <div className="py-2 text-center">
                              <Spinner size="sm" animation="border" />
                            </div>
                          ) : svc.length === 0 ? (
                            <div className="text-muted fst-italic">No active services.</div>
                          ) : (
                            <ul className="list-unstyled mb-0">
                              {svc.map((s) => (
                                <li key={s.id} className="d-flex justify-content-between py-1">
                                  <span className="text-truncate me-2">{s.title}</span>
                                  <span className="fw-semibold">{centsToVnd(s.priceCents)} ₫</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </Collapse>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {pager}
        </>
      )}

      {/* Confirm apply */}
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
              Ứng tuyển vào <strong>{applyingCompany.name}</strong>?<br />
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
    </div>
  );
}
