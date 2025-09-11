// src/pages/Drivers/DriverInvitesPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

import {
  getMyDriverProfile,
  listDriverInvites,
  acceptInvite,
  rejectInvite,
} from "../../api/drivers";

import { getCompanyById } from "../../api/companies";
import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import CompanyCardForDriver from "../../components/driver/CompanyCardForDriver";
import ConfirmModal from "../../components/common/ConfirmModal";

export default function DriverInvitesPage() {
  const { profile } = useAuth();
  const [driverUserId, setDriverUserId] = useState(profile?.id || null);

  // Server data
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageInfo, setPageInfo] = useState({
    page: 1,
    size: 9,
    totalPages: 1,
    totalItems: 0,
  });

  // Company cache for the current page: { [companyId]: company }
  const [companiesById, setCompaniesById] = useState({});

  // Filters (aligned with other pages)
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("Pending"); // default: show only active/pending invites
  const [sort, setSort] = useState("createdAt:desc");

  // Accept/Reject confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmType, setConfirmType] = useState(null); // "accept" | "reject"
  const [workingInvite, setWorkingInvite] = useState(null);

  const debounced = useRef(null);

  // Ensure we have the driver id (fetch if missing)
  useEffect(() => {
    if (!driverUserId) {
      (async () => {
        try {
          const me = await getMyDriverProfile();
          setDriverUserId(me.userId);
        } catch {
          // user might not be a driver yet
        }
      })();
    }
  }, [driverUserId]);

  const fetchInvites = async (page = 1, size = pageInfo.size) => {
    if (!driverUserId) return;
    setLoading(true);
    try {
      // Call backend: driver invites (supports status, sort, page/size)
      const res = await listDriverInvites(driverUserId, {
        page,
        size,
        status: status || undefined,
        sort,
      });

      const items = res.items || [];
      setInvites(items);
      setPageInfo({
        page: res.page,
        size: res.size,
        totalPages: res.totalPages,
        totalItems: res.totalItems,
      });

      // Load company info for the current page (simple cache)
      const ids = Array.from(new Set(items.map((x) => x.companyId)));
      const need = ids.filter((id) => !companiesById[id]);
      if (need.length) {
        const found = await Promise.all(
          need.map((id) => getCompanyById(id).catch(() => null))
        );
        const map = {};
        found.forEach((c) => {
          if (c && c.id) map[c.id] = c;
        });
        setCompaniesById((prev) => ({ ...prev, ...map }));
      }
    } catch (e) {
      toast.error(e?.message || "Failed to fetch invites");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInvites(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverUserId]);

  // Debounce refetch on filter changes
  useEffect(() => {
    if (debounced.current) clearTimeout(debounced.current);
    debounced.current = setTimeout(() => {
      fetchInvites(1);
    }, 350);
    return () => clearTimeout(debounced.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, sort]);

  // Client-side filter: search by company name on the current page
  const filteredInvites = useMemo(() => {
    if (!q.trim()) return invites;
    const term = q.trim().toLowerCase();
    return invites.filter((inv) => {
      const c = companiesById[inv.companyId];
      return c?.name?.toLowerCase().includes(term);
    });
  }, [q, invites, companiesById]);

  // Open confirm modals
  const openAccept = (inv) => {
    setWorkingInvite(inv);
    setConfirmType("accept");
    setConfirmOpen(true);
  };
  const openReject = (inv) => {
    setWorkingInvite(inv);
    setConfirmType("reject");
    setConfirmOpen(true);
  };

  // Confirm handler for accept/reject
  const doConfirm = async () => {
    if (!workingInvite || !driverUserId) return;
    try {
      if (confirmType === "accept") {
        const res = await acceptInvite(driverUserId, workingInvite.id);
        // res is intentionally unused; keep logic unchanged
        toast.success("Invitation accepted");
      } else {
        await rejectInvite(driverUserId, workingInvite.id);
        toast.success("Invitation rejected");
      }
      // Refresh current page after action
      fetchInvites(pageInfo.page);
    } catch (e) {
      toast.error(e?.response?.data?.error?.message || "Action failed");
    } finally {
      setConfirmOpen(false);
      setWorkingInvite(null);
      setConfirmType(null);
    }
  };

  return (
    <Container className="py-4">
      {/* FilterBar — consistent with other pages */}
      <FilterBar
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Search companies by name…",
        }}
        selects={[
          {
            value: status,
            onChange: (v) => {
              setStatus(v);
            },
            style: { maxWidth: 180 },
            options: [
              { value: "", label: "All statuses" },
              { value: "Pending", label: "Pending" },
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
            },
            style: { maxWidth: 220 },
            options: [
              { value: "createdAt:desc", label: "Newest first" },
              { value: "createdAt:asc", label: "Oldest first" },
            ],
          },
        ]}
      />

      {loading ? (
        <div className="py-5 text-center">
          <Spinner animation="border" />
        </div>
      ) : pageInfo.totalItems === 0 ? (
        <div className="text-center py-5 text-muted">
          No job invitations. Try applying as a driver.
        </div>
      ) : (
        <>
          <Row className="g-3">
            {filteredInvites.map((inv) => {
              const company = companiesById[inv.companyId];
              if (!company) return null;

              const isPending = inv.status === "Pending";

              return (
                <Col xs={12} sm={6} lg={4} key={inv.id}>
                  <CompanyCardForDriver
                    invite={inv}
                    company={company}
                    inviteStatus={inv.status}
                    onAccept={isPending ? () => openAccept(inv) : undefined}
                    onReject={isPending ? () => openReject(inv) : undefined}
                    // If you want to disable card actions when not Pending:
                    disabledActions={!isPending}
                  />
                </Col>
              );
            })}
          </Row>

          <div className="mt-3">
            <PaginationBar
              page={pageInfo.page}
              size={pageInfo.size}
              totalItems={pageInfo.totalItems}
              totalPages={pageInfo.totalPages}
              onPageChange={(p) => fetchInvites(p, pageInfo.size)}
              onSizeChange={(s) => fetchInvites(1, s)}
            />
          </div>
        </>
      )}

      {/* Confirm modal */}
      <ConfirmModal
        show={confirmOpen}
        onHide={() => {
          setConfirmOpen(false);
          setWorkingInvite(null);
          setConfirmType(null);
        }}
        title={confirmType === "accept" ? "Accept Invitation" : "Reject Invitation"}
        message={
          workingInvite ? (
            <div>
              {confirmType === "accept" ? "Accept" : "Reject"} the invitation from{" "}
              <strong>
                {companiesById[workingInvite.companyId]?.name || "company"}
              </strong>
              ?
            </div>
          ) : (
            ""
          )
        }
        confirmText={confirmType === "accept" ? "Accept" : "Reject"}
        variant={confirmType === "accept" ? "primary" : "danger"}
        onConfirm={doConfirm}
      />
    </Container>
  );
}
