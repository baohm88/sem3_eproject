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
import api from "../../api/axios"; // used to quickly fetch driver profile by userId

import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import DriverCard from "../../components/driver/DriverCard";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function CompanyInvitesPage() {
  const { profile } = useAuth();
  const isCompany = profile?.role === "Company";

  // Company & invites
  const [companyId, setCompanyId] = useState(null);
  const [invites, setInvites] = useState([]); // raw array from backend
  const [loading, setLoading] = useState(true);

  // Driver cache: userId -> profile
  const [driversMap, setDriversMap] = useState({}); // { [userId]: DriverProfile }
  const fetchingRef = useRef(new Set()); // avoid duplicate fetches

  // Client-side filters / sort
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("Pending"); // "", "Pending", "Accepted", "Rejected", "Cancelled", "Expired"
  const [sort, setSort] = useState("createdAt:desc"); // "createdAt:desc|asc" | "name:asc|desc"

  // Client-side pagination
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);

  document.title = "Your Invites - Mycabs.com"

  // Debounce search
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
        toast.error("Failed to load your company data."); // keep VN message as-is
      }
    })();
    return () => (mounted = false);
  }, [isCompany]);

  // Load invites (backend has no filters yet → fetch large set, filter client-side)
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
      toast.error("Failed to load the company's invites."); // keep VN message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchInvites(companyId);
  }, [companyId]);

  // Helper: fetch driver profile by userId (with cache)
  const ensureDriverLoaded = async (userId) => {
    if (!userId || driversMap[userId] || fetchingRef.current.has(userId)) return;
    try {
      fetchingRef.current.add(userId);
      const res = await api.get(`/api/drivers/${userId}`);
      const driver = res?.data?.data;
      if (driver) {
        setDriversMap((m) => ({ ...m, [userId]: driver }));
      }
    } catch (e) {
      // ignore errors: still render the card with limited info
    } finally {
      fetchingRef.current.delete(userId);
    }
  };

  // Derived list: filter + search + sort (all client-side)
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
        const na = (driversMap[a.driverUserId]?.fullName || "").toLowerCase();
        const nb = (driversMap[b.driverUserId]?.fullName || "").toLowerCase();
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

  // Client-side pagination
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

  // Preload driver profiles for the current page
  useEffect(() => {
    paged.forEach((i) => ensureDriverLoaded(i.driverUserId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paged]);

  // Cancel invitation modal state
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
      toast.success("Invite cancelled successfully."); // keep VN message
      await fetchInvites(companyId); // refresh list
    } catch (e) {
      console.error(e);
      toast.error(
        e?.response?.data?.error?.message || "Failed to cancel invite."
      );
    } finally {
      setSelectedInvite(null);
      setShowCancel(false);
    }
  };

  return (
    <Container className="py-4">
      {/* FilterBar — styled consistently with CompaniesPage */}
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
              { value: "createdAt:desc", label: "Sort: Newest ↓" },
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
          No invite pending driver's approval.
        </div>
      ) : (
        <>
          <Row className="g-4 mt-1">
            {paged.map((inv) => {
              const d = driversMap[inv.driverUserId];
              // Map to DriverCard props (fallback to minimal info while loading)
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

              // Show "Invited" badge when Pending (customizable via DriverCard props if supported)
              return (
                <Col xs={12} md={6} lg={4} key={inv.id}>
                  <DriverCard
                    driver={driverForCard}
                    isInvited={isPending}
                    // Other statuses via a custom badge if DriverCard supports it
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
                    // Allow Recall only when Pending
                    onRecall={isPending ? () => openCancel(inv) : undefined}
                    // Do not show Invite button on this page
                    onInvite={undefined}
                  />
                </Col>
              );
            })}
          </Row>

          {/* PaginationBar — same UX as CompaniesPage */}
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

      {/* Cancel confirmation modal */}
      <ConfirmModal
        show={showCancel}
        onHide={() => setShowCancel(false)}
        title="Cancel Invitation"
        message={
          selectedInvite ? (
            <div>
              Recall invite to
              <strong>
                {driversMap[selectedInvite.driverUserId]?.fullName || "driver"}
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
