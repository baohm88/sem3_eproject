// import { useEffect, useMemo, useState } from "react";
// import { Container, Row, Col } from "react-bootstrap";
// import { toast } from "react-toastify";

// import { listDrivers } from "../../api/drivers";
// import { getMyCompany, inviteDriver } from "../../api/companies";
// import { useAuth } from "../../context/AuthContext";

// import FilterBar from "../../components/common/FilterBar";
// import PaginationBar from "../../components/common/PaginationBar";
// import DriverCard from "../../components/driver/DriverCard";
// import InviteDriverModal from "../../components/driver/InviteDriverModal";

// export default function DriversPage() {
//     const { profile } = useAuth(); // giả định hook có { role: 'Company' | 'Driver' | 'Rider' | 'Admin' | null }
//     const isCompany = profile?.role === "Company";

//     // filters
//     const [q, setQ] = useState("");
//     const [status, setStatus] = useState("all"); 
//     const [minRating, setMinRating] = useState(""); 
//     const [sort, setSort] = useState("rating:desc");

//     // paging
//     const [page, setPage] = useState(1);
//     const [size, setSize] = useState(12);

//     // data
//     const [loading, setLoading] = useState(false);
//     const [result, setResult] = useState({
//         items: [],
//         totalItems: 0,
//         page: 1,
//         size: 12,
//     });

//     // companyId để gửi invite
//     const [companyId, setCompanyId] = useState(null);

//     // invite modal
//     const [showInvite, setShowInvite] = useState(false);
//     const [selectedDriver, setSelectedDriver] = useState(null);

//     // lấy company id nếu là Company
//     useEffect(() => {
//         let mounted = true;
//         (async () => {
//             if (!isCompany) return;
//             try {
//                 const me = await getMyCompany();
//                 if (mounted) setCompanyId(me.id);
//             } catch (e) {
//                 console.error(e);
//                 toast.error("Không lấy được thông tin company của bạn.");
//             }
//         })();
//         return () => (mounted = false);
//     }, [isCompany]);

//     const fetchData = async () => {
//         setLoading(true);
//         try {
//             const params = { page, size, sort };
//             if (q.trim()) params.name = q.trim();
//             if (status !== "all") params.isAvailable = status === "available";
//             if (minRating) params.minRating = Number(minRating);

//             const res = await listDrivers(params);
//             setResult(res);
//         } catch (e) {
//             console.error(e);
//             toast.error("Tải danh sách tài xế thất bại.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // tải khi đổi page/size/sort
//     useEffect(() => {
//         fetchData();
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [page, size, sort]);

//     const onSearch = () => {
//         setPage(1);
//         fetchData();
//     };

//     const canInvite = isCompany && !!companyId;

//     const handleInviteClick = (driver) => {
//         if (!canInvite) return;
//         setSelectedDriver(driver);
//         setShowInvite(true);
//     };

//     const handleSendInvite = async ({
//         driverUserId,
//         baseSalaryCents,
//         expiresAt,
//     }) => {
//         try {
//             await inviteDriver(companyId, {
//                 driverUserId,
//                 baseSalaryCents,
//                 expiresAt,
//             });
//             toast.success("Đã gửi lời mời.");
//         } catch (e) {
//             console.error(e);
//             toast.error(
//                 e?.response?.data?.error?.message || "Gửi invite thất bại."
//             );
//         }
//     };

//     // cấu hình cho FilterBar (giả định API kiểu config; nếu khác thì map lại phần này)
//     const filterConfig = useMemo(
//         () => ({
//             searchPlaceholder: "Search drivers by name...",
//             searchValue: q,
//             onSearchValueChange: setQ,
//             onSubmit: onSearch,
//             selects: [
//                 {
//                     key: "status",
//                     label: "Status",
//                     value: status,
//                     onChange: (v) => setStatus(v),
//                     options: [
//                         { value: "all", label: "All statuses" },
//                         { value: "available", label: "Available" },
//                         { value: "offline", label: "Offline" },
//                     ],
//                 },
//                 {
//                     key: "minRating",
//                     label: "Min rating",
//                     value: minRating,
//                     onChange: (v) => setMinRating(v),
//                     options: [
//                         { value: "", label: "Min rating" },
//                         { value: "1", label: "1+" },
//                         { value: "2", label: "2+" },
//                         { value: "3", label: "3+" },
//                         { value: "4", label: "4+" },
//                         { value: "4.5", label: "4.5+" },
//                     ],
//                 },
//                 {
//                     key: "sort",
//                     label: "Sort",
//                     value: sort,
//                     onChange: (v) => setSort(v),
//                     options: [
//                         { value: "rating:desc", label: "Rating ↓" },
//                         { value: "rating:asc", label: "Rating ↑" },
//                         { value: "name:asc", label: "Name A–Z" },
//                         { value: "name:desc", label: "Name Z–A" },
//                     ],
//                 },
//             ],
//         }),
//         [q, status, minRating, sort]
//     );

//     return (
//         <Container className="py-4">
//             <h4 className="mb-3">Drivers</h4>

//             {/* ===== FilterBar (giữ nguyên) ===== */}
//             {/* TODO: map props FilterBar nếu khác API của bạn */}
//             <FilterBar
//                 searchPlaceholder={filterConfig.searchPlaceholder}
//                 searchValue={filterConfig.searchValue}
//                 onSearchValueChange={filterConfig.onSearchValueChange}
//                 onSubmit={filterConfig.onSubmit}
//                 selects={filterConfig.selects}
//                 loading={loading}
//             />

//             {/* ===== Grid drivers ===== */}
//             <Row xs={1} md={2} lg={3} className="g-3 mt-2">
//                 {result.items?.map((d) => (
//                     <Col key={d.id}>
//                         <DriverCard
//                             driver={d}
//                             // chỉ truyền onInvite khi là Company => nút Invite sẽ không render nếu không có prop
//                             onInvite={canInvite ? handleInviteClick : undefined}
//                         />
//                     </Col>
//                 ))}
//                 {!loading && (result.items?.length ?? 0) === 0 && (
//                     <Col>
//                         <div className="text-muted">No drivers found.</div>
//                     </Col>
//                 )}
//             </Row>

//             {/* ===== Pagination (giữ nguyên PaginationBar) ===== */}
//             <div className="d-flex justify-content-between align-items-center mt-3">
//                 <div className="text-muted small">
//                     {result.totalItems > 0
//                         ? `Showing ${Math.min(
//                               (page - 1) * size + 1,
//                               result.totalItems
//                           )}–${Math.min(
//                               (page - 1) * size + (result.items?.length || 0),
//                               result.totalItems
//                           )} of ${result.totalItems}`
//                         : "Showing 0 of 0"}
//                 </div>

//                 <div className="d-flex align-items-center gap-2">
//                     <select
//                         className="form-select form-select-sm"
//                         style={{ width: 90 }}
//                         value={size}
//                         onChange={(e) => {
//                             setSize(Number(e.target.value));
//                             setPage(1);
//                         }}
//                     >
//                         {[6, 12, 18, 24].map((n) => (
//                             <option key={n} value={n}>
//                                 {n} / page
//                             </option>
//                         ))}
//                     </select>

//                     <PaginationBar
//                         page={page}
//                         totalItems={result.totalItems || 0}
//                         pageSize={size}
//                         onChange={setPage}
//                     />
//                 </div>
//             </div>

//             {/* ===== Invite modal ===== */}
//             <InviteDriverModal
//                 show={showInvite}
//                 onHide={() => setShowInvite(false)}
//                 driver={selectedDriver}
//                 onSubmit={handleSendInvite}
//             />
//         </Container>
//     );
// }


// src/pages/Drivers/DriversPage.jsx
import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";

import { listDrivers } from "../../api/drivers";
import { getMyCompany, inviteDriver } from "../../api/companies";
import { useAuth } from "../../context/AuthContext";

import FilterBar from "../../components/common/FilterBar";
import PaginationBar from "../../components/common/PaginationBar";
import DriverCard from "../../components/driver/DriverCard";
import InviteDriverModal from "../../components/driver/InviteDriverModal";

export default function DriversPage() {
  const { profile } = useAuth();
  const isCompany = profile?.role === "Company";

  // data
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters & sort (giống CompaniesPage)
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");        // "", "available", "offline"
  const [minRating, setMinRating] = useState("");  // "", "4.5", "4.0", ...
  const [sort, setSort] = useState("rating:desc"); // same server API

  // pagination (giống CompaniesPage)
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(12);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // debounce search (giống CompaniesPage)
  const [debouncedName, setDebouncedName] = useState(searchTerm);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedName(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // companyId để gửi invite
  const [companyId, setCompanyId] = useState(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isCompany) return;
      try {
        const me = await getMyCompany();
        if (mounted) setCompanyId(me.id);
      } catch (e) {
        console.error(e);
        toast.error("Không lấy được thông tin company của bạn.");
      }
    })();
    return () => (mounted = false);
  }, [isCompany]);

  // fetch
  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        size,
        sort,
        ...(debouncedName.trim() ? { name: debouncedName.trim() } : {}),
        ...(status ? { isAvailable: status === "available" } : {}),
        ...(minRating ? { minRating: Number(minRating) } : {}),
      };

      const res = await listDrivers(params);
      setDrivers(res.items || []);
      setTotalItems(res.totalItems || 0);
      setTotalPages(res.totalPages || 0);
    } catch (e) {
      console.error(e);
      toast.error("Tải danh sách tài xế thất bại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName, status, minRating, sort, page, size]);

  // invite
  const [showInvite, setShowInvite] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const canInvite = isCompany && !!companyId;

  const handleInviteClick = (driver) => {
    if (!canInvite) return;
    setSelectedDriver(driver);
    setShowInvite(true);
  };

  const handleSendInvite = async ({ driverUserId, baseSalaryCents, expiresAt }) => {
    try {
      await inviteDriver(companyId, { driverUserId, baseSalaryCents, expiresAt });
      toast.success("Đã gửi lời mời.");
      setShowInvite(false);
    } catch (e) {
      console.error(e);
      toast.error(e?.response?.data?.error?.message || "Gửi invite thất bại.");
    }
  };

  return (
    <Container className="py-4">
      {/* FilterBar: giữ đúng API và phong cách như CompaniesPage */}
      <FilterBar
        search={{
          value: searchTerm,
          onChange: (v) => {
            setSearchTerm(v);
            setPage(1);
          },
          placeholder: "Search drivers by name…",
        }}
        selects={[
          {
            value: status,
            onChange: (v) => {
              setStatus(v);
              setPage(1);
            },
            style: { maxWidth: 180 },
            options: [
              { value: "", label: "All statuses" },
              { value: "available", label: "Available" },
              { value: "offline", label: "Offline" },
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
              { value: "3.0", label: "≥ 3.0" },
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
            ],
          },
        ]}
      />

      {/* Grid cards */}
      <Row className="g-4 mt-1">
        {drivers.map((d) => (
          <Col xs={12} md={6} lg={4} key={d.id}>
            <DriverCard
              driver={d}
              onInvite={canInvite ? handleInviteClick : undefined}
            />
          </Col>
        ))}
        {!loading && !drivers.length && (
          <Col xs={12} className="text-center text-muted py-5">
            No drivers found.
          </Col>
        )}
      </Row>

      {/* Pagination: dùng đúng PaginationBar như CompaniesPage */}
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

      {/* Invite modal */}
      <InviteDriverModal
        show={showInvite}
        onHide={() => setShowInvite(false)}
        driver={selectedDriver}
        onSubmit={handleSendInvite}
      />
    </Container>
  );
}
