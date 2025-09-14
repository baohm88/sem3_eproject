// src/pages/companies/CompaniesPage.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { listCompanies } from "../../api/companies.ts"; // note: explicit .ts import is unusual in CRA/Vite JS projects
import { useAuth } from "../../context/AuthContext";
import PaginationBar from "../../components/common/PaginationBar";
import CompanyCard from "../../components/company/CompanyCard.jsx";
import CompanyCardSkeleton from "../../components/company/CompanyCardSkeleton.jsx";
import FilterBar from "../../components/common/FilterBar.jsx";

/**
 * CompaniesPage
 * - Fetch & display a paginated grid of companies
 * - Supports search, filters, sorting, and admin-only status filter
 * - Debounces search input to reduce API calls
 */
export default function CompaniesPage() {
  const { profile } = useAuth();
  const isAdmin = profile?.role === "Admin";

  // Data state
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [membership, setMembership] = useState(""); // "", "Premium", "Basic", "Free"
  const [minRating, setMinRating] = useState(""); // "", "4.5", "4.0", "3.5"
  const [sort, setSort] = useState("name:asc");
  const [statusFilter, setStatusFilter] = useState(""); // "", "active", "inactive" (admin only)

  // Pagination state
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(3);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Favorites (demo-only UI state; not persisted)
  const [favorites, setFavorites] = useState([]);

  const navigate = useNavigate();

  document.title = "Listings — Mycabs.com";

  // Debounce search term → update `debouncedName`
  const [debouncedName, setDebouncedName] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch companies with current filters/pagination
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        sort,
        ...(debouncedName.trim() ? { name: debouncedName.trim() } : {}),
        ...(membership ? { membership } : {}),
        ...(minRating ? { minRating: Number(minRating) } : {}),
        ...(statusFilter === "active"
          ? { isActive: true }
          : statusFilter === "inactive"
          ? { isActive: false }
          : {}),
      };

      const res = await listCompanies(params);
      setCompanies(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 0);
    } catch {
      toast.error("Failed to fetch companies");
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever filters/sort/pagination change
  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, membership, minRating, sort, statusFilter, page, size]);

  // Toggle favorite (pure UI)
  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <Container className="py-4">
      {/* Generic FilterBar */}
      <FilterBar
        search={{
          value: searchTerm,
          onChange: (v) => {
            setSearchTerm(v);
            setPage(1);
          },
          placeholder: "Search by company name…",
        }}
        selects={[
          {
            value: membership,
            onChange: (v) => {
              setMembership(v);
              setPage(1);
            },
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
            onChange: (v) => {
              setMinRating(v);
              setPage(1);
            },
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
            onChange: (v) => {
              setSort(v);
              setPage(1);
            },
            style: { maxWidth: 220 },
            options: [
              { value: "rating:desc", label: "Sort: Rating ↓" },
              { value: "rating:asc", label: "Sort: Rating ↑" },
              { value: "name:asc", label: "Sort: Name ↑" },
              { value: "name:desc", label: "Sort: Name ↓" },
              { value: "membership:asc", label: "Sort: Membership ↑" },
              { value: "membership:desc", label: "Sort: Membership ↓" },
            ],
          },
          ...(isAdmin
            ? [
                {
                  value: statusFilter,
                  onChange: (v) => {
                    setStatusFilter(v);
                    setPage(1);
                  },
                  style: { maxWidth: 180 },
                  options: [
                    { value: "", label: "All statuses" },
                    { value: "active", label: "Active only" },
                    { value: "inactive", label: "Inactive only" },
                  ],
                },
              ]
            : []),
        ]}
      />

      {/* Cards grid */}
      {loading ? (
        <Row className="g-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Col xs={12} md={6} lg={4} key={`sk-${i}`}>
              <CompanyCardSkeleton />
            </Col>
          ))}
        </Row>
      ) : (
        <>
          <Row className="g-4">
            {companies.map((c) => (
              <Col xs={12} md={6} lg={4} key={c.id}>
                <CompanyCard
                  company={c}
                  isFavorite={favorites.includes(c.id)}
                  onToggleFavorite={() => toggleFavorite(c.id)}
                  onClick={() => navigate(`/listings/${c.id}`)}
                  showDescription
                  showStatusBadges
                  imgHeight={200}
                />
              </Col>
            ))}

            {!companies.length && (
              <Col xs={12} className="text-center text-muted py-5">
                No companies found.
              </Col>
            )}
          </Row>

          {/* Pagination */}
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
            />
          </div>
        </>
      )}
    </Container>
  );
}
