// src/pages/Companies/CompanyApplicationsPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Spinner, Badge } from "react-bootstrap";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import {
  getMyCompany,
  listApplications,
  approveApplication,
  rejectApplication,
} from "../../api/companies";
import api from "../../api/axios";

import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import DriverCard from "../../components/driver/DriverCard";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function CompanyApplicationsPage() {
  const { profile } = useAuth();
  const isCompany = profile?.role === "Company";

  // Server-side page data
  const [companyId, setCompanyId] = useState(null);
  const [items, setItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Query params (server-side)
  const [status, setStatus] = useState("Applied"); // server-side filter
  const [sort, setSort] = useState("createdAt:desc"); // send to server; local fallback if needed
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(6);

  document.title = "Job Applications to Your Company - Mycabs.com"

  // Client-side name search (on current page only)
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedName, setDebouncedName] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Prefetch driver profiles for name search & display
  const [driversMap, setDriversMap] = useState({});
  const fetchingRef = useRef(new Set());
  const ensureDriverLoaded = async (userId) => {
    if (!userId || driversMap[userId] || fetchingRef.current.has(userId)) return;
    try {
      fetchingRef.current.add(userId);
      const res = await api.get(`/api/drivers/${userId}`);
      const driver = res?.data?.data;
      if (driver) setDriversMap((m) => ({ ...m, [userId]: driver }));
    } catch {
      // ignore
    } finally {
      fetchingRef.current.delete(userId);
    }
  };

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
        toast.error("Failed to load your company profile.");
      }
    })();
    return () => (mounted = false);
  }, [isCompany]);

  // Fetch applications from server (status, sort, page, size)
  const fetchPage = async (cid, opts = {}) => {
    if (!cid) return;
    setLoading(true);
    try {
      const params = {
        page,
        size,
        status: status || undefined,
        sort: sort || undefined, // BE may ignore; we send it for forward-compat
        ...opts,
      };
      const res = await listApplications(cid, params);
      setItems(res.items || []);
      setTotalItems(res.totalItems ?? 0);
      setTotalPages(res.totalPages ?? 1);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load job applications.");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when server-side query params change
  useEffect(() => {
    if (companyId) fetchPage(companyId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId, status, sort, page, size]);

  // Prefetch driver profiles for current server page
  useEffect(() => {
    items.forEach((a) => ensureDriverLoaded(a.driverUserId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  // Client-side name filter (on current server page)
  const filteredByName = useMemo(() => {
    const term = (debouncedName || "").trim().toLowerCase();
    if (!term) return items;
    return items.filter((a) => {
      const d = driversMap[a.driverUserId];
      const name = (d?.fullName || "").toLowerCase();
      return name.includes(term);
    });
  }, [items, driversMap, debouncedName]);

  // Fallback local sort when BE doesn't support the selected one (e.g., name)
  const locallySorted = useMemo(() => {
    const [field, dir = "desc"] = (sort || "createdAt:desc").split(":");
    // If sorting by name, or if you want to force asc createdAt locally, do it here.
    if (field === "name" || field === "createdAt") {
      const arr = filteredByName.slice();
      arr.sort((a, b) => {
        if (field === "name") {
          const na = (driversMap[a.driverUserId]?.fullName || "").toLowerCase();
          const nb = (driversMap[b.driverUserId]?.fullName || "").toLowerCase();
          if (na < nb) return dir === "asc" ? -1 : 1;
          if (na > nb) return dir === "asc" ? 1 : -1;
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          // createdAt fallback (if BE doesn't support asc)
          const ta = new Date(a.createdAt).getTime();
          const tb = new Date(b.createdAt).getTime();
          return dir === "asc" ? ta - tb : tb - ta;
        }
      });
      return arr;
    }
    // For any other fields, return as-is (server expected to sort)
    return filteredByName;
  }, [filteredByName, sort, driversMap]);

  // Actions: approve / reject
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // 'approve' | 'reject'
  const [acting, setActing] = useState(false);

  const openConfirm = (app, action) => {
    setSelectedApp(app);
    setConfirmAction(action);
    setShowConfirm(true);
  };

  const doConfirm = async () => {
    if (!companyId || !selectedApp || !confirmAction) return;
    setActing(true);
    try {
      if (confirmAction === "approve") {
        await approveApplication(companyId, selectedApp.id);
        toast.success("Application approved.");
      } else {
        await rejectApplication(companyId, selectedApp.id);
        toast.success("Application rejected.");
      }
      await fetchPage(companyId); // refresh current server page
    } catch (e) {
      console.error(e);
      toast.error(
        e?.response?.data?.error?.message || "Failed to process the application."
      );
    } finally {
      setActing(false);
      setSelectedApp(null);
      setConfirmAction(null);
      setShowConfirm(false);
    }
  };

  return (
    <Container className="py-4">
      <FilterBar
        search={{
          value: searchTerm,
          onChange: (v) => {
            setSearchTerm(v);
            // keep current page; we filter current server page client-side
          },
          placeholder: "Search applicants by name…",
        }}
        selects={[
          {
            value: status,
            onChange: (v) => {
              setStatus(v);
              setPage(1);
            },
            style: { maxWidth: 220 },
            options: [
              { value: "", label: "All statuses" },
              { value: "Applied", label: "Applied" },
              { value: "Accepted", label: "Accepted" },
              { value: "Rejected", label: "Rejected" },
              { value: "Cancelled", label: "Cancelled" },
              { value: "Expired", label: "Expired" },
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
              { value: "createdAt:desc", label: "Sort: Newest ↓" },
              { value: "createdAt:asc", label: "Sort: Oldest ↑" },
              { value: "name:asc", label: "Sort: Name ↑" },   // local fallback
              { value: "name:desc", label: "Sort: Name ↓" },  // local fallback
            ],
          },
        ]}
      />

      {loading ? (
        <div className="py-5 text-center">
          <Spinner animation="border" />
        </div>
      ) : (locallySorted?.length ?? 0) === 0 ? (
        <div className="text-center text-muted py-5">
          No applications found for the current filters.
        </div>
      ) : (
        <>
          <Row className="g-4 mt-1">
            {locallySorted.map((app) => {
              const d = driversMap[app.driverUserId];
              const driverForCard = d || {
                userId: app.driverUserId,
                fullName: "Loading…",
                phone: null,
                imgUrl: null,
                rating: 0,
                isAvailable: true,
              };

              const isApplied = app.status === "Applied";
              const isAccepted = app.status === "Accepted";
              const isRejected = app.status === "Rejected";
              const isCancelled = app.status === "Cancelled";
              const isExpired = app.status === "Expired";

              const statusBadge =
                (isApplied && <Badge bg="info">Applied</Badge>) ||
                (isAccepted && <Badge bg="success">Accepted</Badge>) ||
                (isRejected && <Badge bg="danger">Rejected</Badge>) ||
                (isCancelled && <Badge bg="secondary">Cancelled</Badge>) ||
                (isExpired && <Badge bg="dark">Expired</Badge>) || <></>;

              const appliedOn = new Date(app.createdAt).toLocaleString();

              const footer = (
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {statusBadge}
                  <span className="text-muted small">Applied on {appliedOn}</span>
                  <span className="flex-grow-1" />
                  {isApplied ? (
                    <>
                      <button
                        className="btn btn-success btn-sm"
                        disabled={acting}
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirm(app, "approve");
                        }}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        disabled={acting}
                        onClick={(e) => {
                          e.stopPropagation();
                          openConfirm(app, "reject");
                        }}
                      >
                        Reject
                      </button>
                    </>
                  ) : null}
                </div>
              );

              return (
                <Col xs={12} md={6} lg={4} key={app.id}>
                  <DriverCard driver={driverForCard} footer={footer} showBio />
                </Col>
              );
            })}
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
              sizeOptions={[6, 12, 24, 48]}
            />
          </div>
        </>
      )}

      <ConfirmModal
        show={showConfirm}
        onHide={() => {
          if (!acting) setShowConfirm(false);
        }}
        title={
          confirmAction === "approve" ? "Approve Application" : "Reject Application"
        }
        message={
          selectedApp ? (
            <div>
              {confirmAction === "approve"
                ? "Approve the application from "
                : "Reject the application from "}
              <strong>
                {driversMap[selectedApp.driverUserId]?.fullName || "this driver"}
              </strong>
              ?
            </div>
          ) : (
            "Are you sure?"
          )
        }
        confirmText={confirmAction === "approve" ? "Yes, approve" : "Yes, reject"}
        variant={confirmAction === "approve" ? "success" : "danger"}
        onConfirm={doConfirm}
        disabled={acting}
      />
    </Container>
  );
}
