// src/pages/ServicesPage.jsx

// Public services listing with server-side pagination & sorting.
import { useEffect, useRef, useState } from "react";
import { Row, Col, Spinner, Container } from "react-bootstrap";
import { toast } from "react-toastify";
import { listAllCompaniesServices } from "../api/companies.ts";
import ServiceCard from "../components/common/ServiceCard";
import FilterBar from "../components/common/FilterBar";
import PaginationBar from "../components/common/PaginationBar";

const centsToVnd = (c) => (c ?? 0).toLocaleString("vi-VN");

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [q, setQ] = useState("");
  const [sort, setSort] = useState(""); // "" => let the backend use its default (membership rank + randomized)
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const deb = useRef(null);

  const fetchData = async (p = page, s = size) => {
    setLoading(true);
    try {
      const params = {
        page: p,
        size: s,
        // Do not send isActive / companyIsActive — the backend already filters only active ones by default
        ...(q.trim() ? { q: q.trim() } : {}),
        ...(sort ? { sort } : {}), // if empty, let the backend apply its default/randomized ordering
      };
      const res = await listAllCompaniesServices(params);
      setItems(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 0);
      setPage(res.page || p);
      setSize(res.size || s);
    } catch (e) {
      toast.error(e?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounce search/sort changes to avoid excessive requests
  useEffect(() => {
    if (deb.current) clearTimeout(deb.current);
    deb.current = setTimeout(() => {
      fetchData(1, size);
    }, 350);
    return () => clearTimeout(deb.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, sort]);

  return (
    <Container className="py-3">
      <h4 className="mb-3">Services</h4>

      <FilterBar
        search={{
          value: q,
          onChange: (v) => setQ(v),
          placeholder: "Search services…",
        }}
        selects={[
          {
            value: sort,
            onChange: (v) => setSort(v),
            style: { maxWidth: 240 },
            options: [
              { value: "", label: "Premium services first" },
              { value: "price:asc", label: "Price ↑" },
              { value: "price:desc", label: "Price ↓" },
              { value: "title:asc", label: "Title A→Z" },
              { value: "title:desc", label: "Title Z→A" },
              { value: "updatedAt:desc", label: "Recently updated" },
              { value: "createdAt:desc", label: "Newest created" },
            ],
          },
        ]}
      />

      {loading ? (
        <div className="py-5 text-center">
          <Spinner animation="border" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-5 text-center text-muted">No services found.</div>
      ) : (
        <>
          <Row className="g-3 mt-1">
            {items.map((svc) => (
              <Col xs={12} sm={6} lg={4} key={svc.id}>
                <ServiceCard
                  service={svc}
                  priceFormatter={centsToVnd}
                  // Public list: not the owner → do not show owner actions
                  footer={
                    <span className="text-muted small">
                      Updated: {new Date(svc.updatedAt).toLocaleDateString()}
                    </span>
                  }
                />
              </Col>
            ))}
          </Row>

          <div className="mt-3">
            <PaginationBar
              page={page}
              size={size}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={(p) => fetchData(p, size)}
              onSizeChange={(s) => fetchData(1, s)}
            />
          </div>
        </>
      )}
    </Container>
  );
}
