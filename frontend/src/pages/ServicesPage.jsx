// // src/pages/ServicesPage.jsx
// import { useEffect, useRef, useState } from "react";
// import { Row, Col, Spinner, Container } from "react-bootstrap";
// import { toast } from "react-toastify";
// import { listAllCompaniesServices } from "../api/companies.ts";
// import ServiceCard from "../components/common/ServiceCard";
// import FilterBar from "../components/common/FilterBar";
// import PaginationBar from "../components/common/PaginationBar";

// const centsToVnd = (c) => (c ?? 0).toLocaleString("vi-VN");

// export default function ServicesPage() {
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(true);

//     // filters
//     const [q, setQ] = useState("");
//     const [sort, setSort] = useState(""); // "" => để BE dùng default (membership rank + random)
//     const [page, setPage] = useState(1);
//     const [size, setSize] = useState(3);
//     const [totalItems, setTotalItems] = useState(0);
//     const [totalPages, setTotalPages] = useState(0);

//     const deb = useRef(null);

//     const fetchData = async (p = page, s = size) => {
//         setLoading(true);
//         try {
//             const params = {
//                 page: p,
//                 size: s,
//                 // Không gửi isActive / companyIsActive => BE mặc định lọc active
//                 ...(q.trim() ? { q: q.trim() } : {}),
//                 ...(sort ? { sort } : {}), // nếu rỗng để BE random theo rank
//             };
//             const res = await listAllCompaniesServices(params);
//             setItems(res.items || []);
//             setTotalItems(res.totalItems || 0);
//             setTotalPages(res.totalPages || 0);
//             setPage(res.page || p);
//             setSize(res.size || s);
//         } catch (e) {
//             toast.error(e?.message || "Failed to load services");
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchData(1, size);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     // debounce search / sort
//     useEffect(() => {
//         if (deb.current) clearTimeout(deb.current);
//         deb.current = setTimeout(() => {
//             fetchData(1, size);
//         }, 350);
//         return () => clearTimeout(deb.current);
//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [q, sort]);

//     return (
//         <Container className="py-3">
//             <h4 className="mb-3">Services</h4>

//             <FilterBar
//                 search={{
//                     value: q,
//                     onChange: (v) => setQ(v),
//                     placeholder: "Search services…",
//                 }}
//                 selects={[
//                     {
//                         value: sort,
//                         onChange: (v) => setSort(v),
//                         style: { maxWidth: 240 },
//                         options: [
//                             {
//                                 value: "",
//                                 label: "Premium services first",
//                             },
//                             { value: "price:asc", label: "Price ↑" },
//                             { value: "price:desc", label: "Price ↓" },
//                             { value: "title:asc", label: "Title A→Z" },
//                             { value: "title:desc", label: "Title Z→A" },
//                             {
//                                 value: "updatedAt:desc",
//                                 label: "Recently updated",
//                             },
//                             {
//                                 value: "createdAt:desc",
//                                 label: "Newest created",
//                             },
//                         ],
//                     },
//                 ]}
//             />

//             {loading ? (
//                 <div className="py-5 text-center">
//                     <Spinner animation="border" />
//                 </div>
//             ) : items.length === 0 ? (
//                 <div className="py-5 text-center text-muted">
//                     No services found.
//                 </div>
//             ) : (
//                 <>
//                     <Row className="g-3 mt-1">
//                         {items.map((svc) => (
//                             <Col xs={12} sm={6} lg={4} key={svc.id}>
//                                 <ServiceCard
//                                     service={svc}
//                                     priceFormatter={centsToVnd}
//                                     // public: không phải owner => không showOwnerActions
//                                     footer={
//                                         <span className="text-muted small">
//                                             Updated:{" "}
//                                             {new Date(
//                                                 svc.updatedAt
//                                             ).toLocaleDateString()}
//                                         </span>
//                                     }
//                                 />
//                             </Col>
//                         ))}
//                     </Row>

//                     <div className="mt-3">
//                         <PaginationBar
//                             page={page}
//                             size={size}
//                             totalItems={totalItems}
//                             totalPages={totalPages}
//                             onPageChange={(p) => fetchData(p, size)}
//                             onSizeChange={(s) => fetchData(1, s)}
//                         />
//                     </div>
//                 </>
//             )}
//         </Container>
//     );
// }



// src/pages/ServicesPage.jsx
import { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { listAllCompaniesServices } from "../api/companies";
import FilterBar from "../components/common/FilterBar"; // vẫn giữ search/sort ở trên cùng

const centsToVnd = (c) =>
  typeof c === "number" ? (c / 100).toLocaleString("vi-VN") : "";

const RIGHT_ADS = [
  { id: "ad1", img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop", href: "#", label: "Khóa nâng cao kỹ năng mềm" },
  { id: "ad2", img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop", href: "#", label: "Chương trình đào tạo tài xế" },
  { id: "ad3", img: "https://images.unsplash.com/photo-1532634896-26909d0d4b6a?q=80&w=800&auto=format&fit=crop", href: "#", label: "Tuyển dụng nội bộ" },
];

const INSIDER = [
  { id: 1, title: "Mẹo phỏng vấn dành cho tài xế mới", img: "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=800&auto=format&fit=crop" },
  { id: 2, title: "Cách định giá chuyến xe hợp lý",    img: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=800&auto=format&fit=crop" },
  { id: 3, title: "Kinh nghiệm giao hàng giờ cao điểm", img: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop" },
];

export default function ServicesPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // filter-bar (giữ nếu bạn vẫn muốn search/sort; nếu muốn ẩn hẳn, xóa FilterBar ở JSX)
  const [q, setQ] = useState("");
  const [sort, setSort] = useState("");
  const deb = useRef(null);

  const fetchAllPages = async () => {
    setLoading(true);
    try {
      let p = 1;
      const s = 100;              // page size cho mỗi lần gọi; tăng/giảm tùy BE
      let all = [];
      let totalPages = 1;

      do {
        const params = {
          page: p,
          size: s,
          ...(q.trim() ? { q: q.trim() } : {}),
          ...(sort ? { sort } : {}),
        };
        const res = await listAllCompaniesServices(params);
        all = all.concat(res.items || []);
        totalPages = res.totalPages || 1;
        p = (res.page || p) + 1;
      } while (p <= totalPages);

      setItems(all);
    } catch (e) {
      toast.error(e?.message || "Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAllPages(); /* lần đầu */ }, []); // eslint-disable-line
  useEffect(() => {
    if (deb.current) clearTimeout(deb.current);
    deb.current = setTimeout(fetchAllPages, 300); // debounce search/sort
    return () => clearTimeout(deb.current);
  }, [q, sort]); // eslint-disable-line

  const placeholder =
    "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop";

  return (
    <div className="services-list-page">
      {/* dải nền xanh nhỏ */}
      <section className="svc-hero edge-to-edge">
        <div className="container py-3">
          <h3 className="m-0 text-white fw-bold">Services</h3>
          <div className="text-white-50">{loading ? "Đang tải…" : `${items.length} dịch vụ`}</div>
        </div>
      </section>

      <Container className="py-3">
        {/* FilterBar: nếu muốn bỏ hẳn thanh này, xóa block dưới */}
        <div className="svc-filter card border-0 shadow-sm p-2 p-md-3 sticky-md-top">
          <FilterBar
            search={{ value: q, onChange: (v) => setQ(v), placeholder: "Search services…" }}
            selects={[{
              value: sort,
              onChange: (v) => setSort(v),
              style: { maxWidth: 260 },
              options: [
                { value: "", label: "Ưu tiên Premium (mặc định)" },
                { value: "price:asc", label: "Giá ↑" },
                { value: "price:desc", label: "Giá ↓" },
                { value: "updatedAt:desc", label: "Cập nhật gần đây" },
                { value: "createdAt:desc", label: "Tạo mới nhất" },
              ],
            }]}
          />
        </div>

        <Row className="mt-3">
          {/* list dài bên trái */}
          <Col lg={9}>
            {loading ? (
              <div className="py-5 text-center"><Spinner animation="border" /></div>
            ) : items.length === 0 ? (
              <div className="py-5 text-center text-muted">Không có dịch vụ.</div>
            ) : (
              <div className="svc-list">
                {items.map((s) => {
                  const img = s.imgUrl || s.imageUrl || (Array.isArray(s.images) && s.images[0]) || placeholder;
                  const companyName = s.company?.name || s.companyName || s.company?.title || "Company";
                  const updated = s.updatedAt ? new Date(s.updatedAt).toLocaleDateString("vi-VN") : "";
                  return (
                    <article key={s.id} className="svc-item card border-0 shadow-sm">
                      <div className="row g-0">
                        <div className="col-md-4 col-lg-3">
                          <div className="svc-thumb">
                            <img src={img} alt={s.title} />
                            {s.isActive !== false && <span className="svc-badge-active">Active</span>}
                          </div>
                        </div>
                        <div className="col-md-8 col-lg-9">
                          <div className="p-3">
                            <div className="d-flex align-items-start justify-content-between gap-2">
                              <div className="pe-2">
                                <Link to="#" className="svc-title-link">{s.title}</Link>
                                <div className="svc-company text-muted small">{companyName}</div>
                              </div>
                              <div className="text-end">
                                <div className="svc-price">{centsToVnd(s.priceCents)} ₫</div>
                              </div>
                            </div>
                            {s.description && <div className="svc-desc text-muted mt-1">{String(s.description)}</div>}
                            <div className="d-flex align-items-center gap-2 flex-wrap mt-2">
                              <span className="badge rounded-pill bg-primary-subtle text-primary">Gợi ý cho Rider</span>
                              <span className="badge rounded-pill bg-warning-subtle text-warning-emphasis">Tuyển Driver</span>
                            </div>
                            <div className="mt-2 small text-muted">Cập nhật: {updated}</div>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* ❌ Không còn PaginationBar/Per page */}
          </Col>

          {/* rail phải giữ nguyên mock */}
          <Col lg={3}>
            <div className="svc-rail sticky-lg-top" style={{ top: 96 }}>
              <div className="d-flex flex-column gap-3">
                {RIGHT_ADS.map((ad) => (
                  <a key={ad.id} className="rail-card card border-0 shadow-sm overflow-hidden" href={ad.href}>
                    <img src={ad.img} alt={ad.label} className="rail-img" />
                    <div className="p-2 small fw-semibold">{ad.label}</div>
                  </a>
                ))}
                <div className="card border-0 shadow-sm">
                  <div className="p-3 fw-semibold">HR Insider</div>
                  <div className="px-3 pb-3 d-flex flex-column gap-2">
                    {INSIDER.map((p) => (
                      <a key={p.id} href="#" className="insider-row">
                        <img src={p.img} alt="" />
                        <div className="title">{p.title}</div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
