// src/pages/companies/CompanyDrivers.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { getMyCompany } from "../../api/companies";
import { listCompanyDrivers } from "../../api/companies";
import { paySalary } from "../../api/companies";
import DriverCard from "../../components/driver/DriverCard";
import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import PaySalaryModal from "../../components/company/PaySalaryModal";

export default function CompanyDrivers() {
  const [companyId, setCompanyId] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Minimal paging/filter state
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(9);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");

  // Pay-salary modal state
  const [showPay, setShowPay] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);

  document.title = "Your Drivers - Mycabs.com"

  // Fetch company id on mount
  useEffect(() => {
    (async () => {
      try {
        const me = await getMyCompany();
        setCompanyId(me.id);
      } catch (e) {
        // VN toast message preserved by design
        toast.error(e?.message || "Failed to load the company");
      }
    })();
  }, []);

  // Load drivers for current company
  const loadDrivers = async (p = page, s = size) => {
    if (!companyId) return;
    setLoading(true);
    try {
      const res = await listCompanyDrivers(companyId, {
        page: p,
        size: s,
        q: q || undefined,
      });
      setDrivers(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      toast.error(e?.message || "Load drivers failed");
    } finally {
      setLoading(false);
    }
  };

  // Reload when company id becomes available
  useEffect(() => {
    loadDrivers(1, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  // Reload when search query changes
  useEffect(() => {
    loadDrivers(1, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const openPay = (d) => {
    setSelectedDriver(d);
    setShowPay(true);
  };

  const handlePayConfirm = async (payload) => {
    try {
      if (!companyId) throw new Error("Missing companyId");
      const data = await paySalary(companyId, payload);
      toast.success(
        data?.reused
          ? "Paid this period earlier (idempotent)"
          : `Paid salary for the period of ${data?.period || ""}`
      );
      setShowPay(false);
      setSelectedDriver(null);
      // Optional: reload list if you display wallet-related numbers…
      // await loadDrivers(page, size);
    } catch (e) {
      toast.error(
        e?.response?.data?.error?.message || e?.message || "Payout failed"
      );
    }
  };

  return (
    <Container className="py-4">
      <FilterBar
        search={{
          value: q,
          onChange: setQ,
          placeholder: "Search employees by name…",
        }}
      />

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <>
          <Row className="g-3">
            {drivers.map((d) => (
              <Col xs={12} md={6} lg={4} key={d.userId || d.id}>
                <div className="d-flex flex-column h-100">
                  <DriverCard
                    driver={d}
                    showBio={false}
                    showEmployment={true}
                    employment={{
                      baseSalaryCents: d.baseSalaryCents,
                      joinedAt: d.joinedAt,
                    }}
                    footer={
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={(e) => {
                          e.stopPropagation();
                          openPay(d);
                        }}
                      >
                        Pay salary
                      </button>
                    }
                  />
                </div>
              </Col>
            ))}
            {!drivers.length && (
              <Col xs={12} className="text-center text-muted py-5">
                No employees found.
              </Col>
            )}
          </Row>

          {/* Pagination */}
          <div className="mt-3">
            <PaginationBar
              page={page}
              size={size}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={(p) => {
                setPage(p);
                loadDrivers(p, size);
              }}
              onSizeChange={(s) => {
                setSize(s);
                setPage(1);
                loadDrivers(1, s);
              }}
              sizeOptions={[6, 9, 12, 24]}
            />
          </div>
        </>
      )}

      <PaySalaryModal
        show={showPay}
        onHide={() => setShowPay(false)}
        driver={selectedDriver}
        onConfirm={handlePayConfirm}
      />
    </Container>
  );
}
