// src/pages/Drivers/DriverApplicationsPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import { listCompanyServicesPublic, getCompanyById } from "../../api/companies";
import {
  getMyDriverProfile,
  listDriverApplications,
  cancelApplication,
} from "../../api/drivers";

import ConfirmModal from "../../components/common/ConfirmModal";
import PaginationBar from "../../components/common/PaginationBar";
import FilterBar from "../../components/common/FilterBar";
import CompanyCardForDriver from "../../components/driver/CompanyCardForDriver";

/**
 * Notes:
 * - Backend endpoint: GET /api/drivers/{userId}/applications?status=Applied (exists).
 * - We fetch the applications list, then fetch company info for each application.
 * - FilterBar applies client-side filter/sort over the applied companies.
 * - Pagination: uses BE pagination (on applications). After client-side filtering,
 *   the page may contain fewer items — acceptable trade-off.
 */
export default function DriverApplicationsPage() {
  const { profile } = useAuth();
  const [driverUserId, setDriverUserId] = useState(profile?.id || null);

  // Raw from server (applications page)
  const [apps, setApps] = useState([]); // [{ id, companyId, status, ... }]
  const [companiesById, setCompaniesById] = useState({}); // { [companyId]: Company }
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 9,
    totalPages: 1,
    totalItems: 0,
  });

  // Filters (client-side)
  const [q, setQ] = useState("");
  const [minRating, setMinRating] = useState("");
  const [membership, setMembership] = useState("");
  const [sort, setSort] = useState("rating:desc");

  // Services cache per company
  const [expanded, setExpanded] = useState({});
  const [servicesCache, setServicesCache] = useState({});
  const [loadingServices, setLoadingServices] = useState({});

  // Recall application (cancel)
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recallingApp, setRecallingApp] = useState(null); // { appId, companyId }

  const debounced = useRef(null);

  // Ensure driver id is known (fetch if missing)
  useEffect(() => {
    if (!driverUserId) {
      (async () => {
        try {
          const me = await getMyDriverProfile();
          setDriverUserId(me.userId);
        } catch {
          // User might not be a driver yet
        }
      })();
    }
  }, [driverUserId]);

  const fetchApplicationsPage = async (page = 1, size = pageInfo.size) => {
    if (!driverUserId) return;
    setLoading(true);
    try {
      // Only fetch status Applied
      const res = await listDriverApplications(driverUserId, {
        page,
        size,
        status: "Applied",
      });
      const items = res.items || [];
      setApps(items);
      setPageInfo({
        page: res.page,
        size: res.size,
        totalPages: res.totalPages,
        totalItems: res.totalItems,
      });

      // Fetch companies for the current page of applications (cache results)
      const companyIds = [...new Set(items.map((a) => a.companyId))];
      const need = companyIds.filter((id) => !companiesById[id]);
      if (need.length > 0) {
        const results = await Promise.allSettled(
          need.map((id) => getCompanyById(id))
        );
        const add = {};
        need.forEach((id, idx) => {
          const r = results[idx];
          if (r.status === "fulfilled" && r.value) add[id] = r.value;
        });
        setCompaniesById((prev) => ({ ...prev, ...add }));
      }
    } catch (e) {
      toast.error(e.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchApplicationsPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverUserId]);

  // Debounce filters — client-side filter only (no BE call needed).
  // Keep here to allow future switch to server-side easily.
  useEffect(() => {
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => {
      // Re-render is enough; if desired, call fetchApplicationsPage(1)
      // to reset to first page when filters change.
    }, 300);
    return () => clearTimeout(debounced.current);
  }, [q, minRating, membership, sort]);

  // Computed: merge applications with company info, then filter/sort on client
  const appliedCards = useMemo(() => {
    const rows = apps
      .map((a) => {
        const c = companiesById[a.companyId];
        return c ? { app: a, company: c } : null;
      })
      .filter(Boolean);

    // Client filters
    let filtered = rows;
    if (q) {
      const qq = q.toLowerCase();
      filtered = filtered.filter((r) =>
        (r.company.name || "").toLowerCase().includes(qq)
      );
    }
    if (membership) {
      filtered = filtered.filter(
        (r) => (r.company.membership || "") === membership
      );
    }
    if (minRating) {
      const mr = Number(minRating);
      if (!Number.isNaN(mr)) {
        filtered = filtered.filter(
          (r) => (Number(r.company.rating) || 0) >= mr
        );
      }
    }

    // Sorting helpers
    const byMembershipRank = (m) =>
      m === "Premium" ? 3 : m === "Basic" ? 2 : m === "Free" ? 1 : 0;

    const cmpNameAsc = (a, b) =>
      (a.company.name || "").localeCompare(b.company.name || "");
    const cmpNameDesc = (a, b) => cmpNameAsc(b, a);

    const cmpRatingAsc = (a, b) =>
      (Number(a.company.rating) || 0) - (Number(b.company.rating) || 0);
    const cmpRatingDesc = (a, b) => cmpRatingAsc(b, a);

    const cmpMembershipAsc = (a, b) =>
      byMembershipRank(a.company.membership || "") -
      byMembershipRank(b.company.membership || "");
    const cmpMembershipDesc = (a, b) => cmpMembershipAsc(b, a);

    const [field, dir] = (sort || "rating:desc").split(":");
    const primary =
      field === "name"
        ? dir === "asc"
          ? cmpNameAsc
          : cmpNameDesc
        : field === "rating"
        ? dir === "asc"
          ? cmpRatingAsc
          : cmpRatingDesc
        : dir === "asc"
        ? cmpMembershipAsc
        : cmpMembershipDesc;

    // Always prioritize membership Premium > Basic > Free, then apply secondary sort
    filtered.sort((a, b) => {
      const pri =
        byMembershipRank(b.company.membership || "") -
        byMembershipRank(a.company.membership || "");
      if (pri !== 0) return pri;
      return primary(a, b);
    });

    return filtered;
  }, [apps, companiesById, q, minRating, membership, sort]);

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

  // Open confirm recall
  const openRecall = (companyId) => {
    const app = apps.find((a) => a.companyId === companyId);
    if (!app) {
      toast.error("Could not find an application to recall.");
      return;
    }
    setRecallingApp({ appId: app.id || app.Id, companyId });
    setConfirmOpen(true);
  };

  const doRecall = async () => {
    if (!driverUserId || !recallingApp) return;
    try {
      const cancellingCompany = await cancelApplication(
        driverUserId,
        recallingApp.appId
      );
      console.log("cancelling company", cancellingCompany);

      toast.success("Cancelled job application as driver successfully!");

      // Update UI: remove the recalled application from current list
      setApps((prev) =>
        prev.filter((x) => (x.id || x.Id) !== recallingApp.appId)
      );
    } catch (e) {
      toast.error(e.message || "Could not recall the application");
    } finally {
      setRecallingApp(null);
      setConfirmOpen(false);
    }
  };

  return (
    <div>
      {/* FilterBar similar to DriverJobsPage */}
      <FilterBar
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Search companies by name…",
        }}
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
              { value: "membership:asc", label: "Membership ↑" },
              { value: "membership:desc", label: "Membership ↓" },
            ],
          },
        ]}
      />

      {loading ? (
        <div className="py-5 text-center">
          <Spinner animation="border" />
        </div>
      ) : appliedCards.length === 0 ? (
        <div className="text-center py-5 text-muted">
          You have no applications (Applied).
        </div>
      ) : (
        <>
          <Row className="g-3">
            {appliedCards.map(({ app, company }) => (
              <Col xs={12} sm={6} lg={4} key={company.id}>
                <CompanyCardForDriver
                  company={company}
                  isExpanded={!!expanded[company.id]}
                  onToggleServices={onToggleServices}
                  services={servicesCache[company.id] || []}
                  loadingServices={!!loadingServices[company.id]}
                  // On the Applications page: the company is always applied
                  isApplied={true}
                  // Reuse button slot: show "Recall Application"
                  onRecall={() => openRecall(company.id)}
                  // Do not show "Apply" button here
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
              onPageChange={(p) => fetchApplicationsPage(p, pageInfo.size)}
              onSizeChange={(s) => fetchApplicationsPage(1, s)}
            />
          </div>
        </>
      )}

      <ConfirmModal
        show={confirmOpen}
        onHide={() => {
          setConfirmOpen(false);
          setRecallingApp(null);
        }}
        title="Recall Application"
        message={
          recallingApp ? (
            <div>
              Cancel your application to this company?
              <br />
              The system will remove your application.
            </div>
          ) : (
            "Recall?"
          )
        }
        confirmText="Recall"
        variant="danger"
        onConfirm={doRecall}
      />
    </div>
  );
}
