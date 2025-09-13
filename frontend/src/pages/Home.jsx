import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../api/axios";

/* =========================================================
   Hardcoded Top Companies (không dùng API)
   -> Thay logo/name/rating/membership theo ý bạn
========================================================= */
const HARDCODED_COMPANIES = [
  {
    id: "c_vnpt",
    name: "VNPT",
    img_url: "https://dummyimage.com/160x80/ffffff/333&text=VNPT",
    rating: 4.6,
    membership: "Premium",
  },
  {
    id: "c_vpbank",
    name: "VPBANK",
    img_url: "https://dummyimage.com/160x80/ffffff/333&text=VPBANK",
    rating: 4.4,
    membership: "Premium",
  },
  {
    id: "c_bidv",
    name: "BIDV",
    img_url: "https://dummyimage.com/160x80/ffffff/333&text=BIDV",
    rating: 4.3,
    membership: "Basic",
  },
  {
    id: "c_automech",
    name: "AUTOMECH",
    img_url: "https://dummyimage.com/160x80/ffffff/333&text=AUTOMECH",
    rating: 4.2,
    membership: "Basic",
  },
  {
    id: "c_minebea",
    name: "MINEBEA",
    img_url: "https://dummyimage.com/160x80/ffffff/333&text=MINEBEA",
    rating: 4.1,
    membership: "Free",
  },
  {
    id: "c_sei",
    name: "SEI",
    img_url: "https://dummyimage.com/160x80/ffffff/333&text=SEI",
    rating: 4.0,
    membership: "Free",
  },
];

/* ---------- Local styles (chỉ áp cho trang này) ---------- */
const LocalStyle = () => (
  <style>{`
    .card-soft{border:0;border-radius:18px;box-shadow:0 10px 24px rgba(0,0,0,.06)}
    .card-soft:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(0,0,0,.1)}
    .company-logo{height:52px;object-fit:contain}
    .section-hdg{font-weight:800}
    .hdg-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:#0d6efd;margin-right:.4rem}
    .hscroll-wrap{position:relative}
    .hscroll{display:flex;gap:12px;overflow:auto;scrollbar-width:none;padding:2px}
    .hscroll::-webkit-scrollbar{display:none}
    .hs-btn{position:absolute;top:50%;transform:translateY(-50%);border:none;background:#fff;border-radius:50%;width:36px;height:36px;
      box-shadow:0 6px 18px rgba(0,0,0,.18);display:flex;align-items:center;justify-content:center}
    .hs-btn.prev{left:-6px}.hs-btn.next{right:-6px}
    .banner-shadow{box-shadow:0 12px 32px rgba(0,0,0,.12)}
  `}</style>
);

/* ---------- helpers ---------- */
const memberRank = { Premium: 3, Basic: 2, Free: 1 };
const vnd = (cents) =>
  typeof cents === "number"
    ? (cents / 100)
        .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
        .replace(",00", "")
    : "";

/** Bóc mảng từ mọi dạng trả về: data.items | items | data(array) | array */
const extractItems = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  const dd = d?.data;
  if (Array.isArray(dd)) return dd;
  if (Array.isArray(dd?.items)) return dd.items;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

/** Chuẩn hoá field về format dùng trong UI */
const normalizeService = (s) => ({
  id: s.id ?? s._id,
  company_id: s.company_id ?? s.companyId,
  title: s.title,
  description: s.description,
  price_cents: s.price_cents ?? s.priceCents,
  is_active: (s.is_active ?? s.isActive) ? 1 : 0,
});
const normalizeDriver = (d) => ({
  id: d.id ?? d._id,
  full_name: d.full_name ?? d.fullName,
  img_url: d.img_url ?? d.imgUrl ?? null,
  location: d.location ?? d.city ?? "",
  rating: Number(d.rating ?? 0),
  is_available: (d.is_available ?? d.isAvailable ?? 1) ? 1 : 0,
});

/* ---------- UI bits ---------- */
function SectionHeader({ title, actionText = "Xem tất cả", onAction }) {
  return (
    <div className="d-flex align-items-center justify-content-between mb-3">
      <h5 className="m-0 section-hdg">
        <span className="hdg-dot" /> {title}
      </h5>
      <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onAction}>
        {actionText}
      </button>
    </div>
  );
}

function HScroll({ children }) {
  const ref = useRef(null);
  const scrollBy = (dir) => ref.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  return (
    <div className="hscroll-wrap">
      <button className="hs-btn prev" aria-label="prev" onClick={() => scrollBy(-1)}>
        <i className="bi bi-chevron-left" />
      </button>
      <div ref={ref} className="hscroll">
        {children}
      </div>
      <button className="hs-btn next" aria-label="next" onClick={() => scrollBy(1)}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

/* ---------- Banner (code cứng + auto slide) ---------- */
const banners = [
  { img: "https://images.unsplash.com/photo-1523419409543-8c8cd488a75e?q=80&w=1600&auto=format&fit=crop", alt: "Banner 1", href: "#" },
  { img: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop", alt: "Banner 2", href: "#" },
  { img: "https://images.unsplash.com/photo-1520975693416-35a2b3d13d05?q=80&w=1600&auto=format&fit=crop", alt: "Banner 3", href: "#" },
];

function BannerCarousel() {
  return (
    <section className="container mt-3">
      <div id="homeBanners" className="carousel slide" data-bs-ride="carousel" data-bs-interval="4000">
        <div className="carousel-inner rounded-4 overflow-hidden banner-shadow">
          {banners.map((b, i) => (
            <a key={i} className={`carousel-item ${i === 0 ? "active" : ""}`} href={b.href}>
              <img src={b.img} className="d-block w-100" alt={b.alt} height={340} style={{ objectFit: "cover" }} />
            </a>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#homeBanners" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#homeBanners" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}

/* ========================== HOME PAGE ========================== */
export default function Home() {
  const [companies, setCompanies] = useState([]); // sẽ set bằng HARDCODED_COMPANIES
  const [services, setServices] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState({ companies: true, services: true, drivers: true });

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      // 1) SERVICES (public)
      try {
        const res = await api.get("/api/companies/all-services", { signal: ac.signal });
        const svcs = extractItems(res).map(normalizeService);
        setServices(svcs);
      } catch (e) {
        console.error("services:", e);
      } finally {
        setLoading((x) => ({ ...x, services: false }));
      }

      // 2) COMPANIES - hardcoded, không gọi API
      try {
        setCompanies(HARDCODED_COMPANIES);
      } catch (e) {
        console.error("companies (hardcoded):", e);
      } finally {
        setLoading((x) => ({ ...x, companies: false }));
      }

      // 3) DRIVERS (public nếu có)
      try {
        const res = await api.get("/api/drivers", { params: { limit: 20 }, signal: ac.signal });
        const items = extractItems(res).map(normalizeDriver);
        setDrivers(items);
      } catch (e) {
        console.warn("drivers public không khả dụng hoặc lỗi:", e);
      } finally {
        setLoading((x) => ({ ...x, drivers: false }));
      }
    })();

    return () => ac.abort();
  }, []);

  /* chọn & sắp xếp */
  const topCompanies = useMemo(() => {
    return [...companies]
      .filter((c) => c?.name)
      .sort((a, b) => {
        const mr = (memberRank[b?.membership] || 0) - (memberRank[a?.membership] || 0);
        if (mr !== 0) return mr;
        return (Number(b?.rating) || 0) - (Number(a?.rating) || 0);
      })
      .slice(0, 12);
  }, [companies]);

  const companyById = useMemo(() => {
    const map = new Map();
    for (const c of companies) map.set(c.id, c);
    return map;
  }, [companies]);

  const featuredServices = useMemo(
    () => [...services].filter((s) => s?.is_active !== 0).slice(0, 12),
    [services]
  );

  const topDrivers = useMemo(
    () =>
      [...drivers]
        .filter((d) => d?.is_available !== 0)
        .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
        .slice(0, 8),
    [drivers]
  );

  return (
    <>
      <LocalStyle />
      <BannerCarousel />

      {/* Companies (hardcoded) */}
      <section className="container mt-4">
        <SectionHeader title="Các công ty hàng đầu" />
        {loading.companies ? (
          <div className="row g-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div className="col-6 col-md-4 col-lg-2" key={i}>
                <div className="card card-soft p-3 h-100 placeholder-glow">
                  <div className="placeholder col-12" style={{ height: 52 }} />
                  <div className="placeholder col-8 mt-3" />
                </div>
              </div>
            ))}
          </div>
        ) : topCompanies.length === 0 ? (
          <div className="text-muted small">Chưa có dữ liệu công ty.</div>
        ) : (
          <div className="row g-3">
            {topCompanies.map((c) => (
              <div className="col-6 col-md-4 col-lg-2" key={c.id}>
                <div className="card card-soft text-center p-3 h-100">
                  <img
                    src={c.img_url || "https://dummyimage.com/160x80/ffffff/333&text=No+Logo"}
                    alt={c.name}
                    className="company-logo mx-auto"
                  />
                  <div className="fw-semibold small mt-3">{c.name}</div>
                  <div className="mt-2 d-flex justify-content-center gap-2">
                    {c.membership && (
                      <span className="badge rounded-pill bg-primary-subtle text-primary">
                        {c.membership}
                      </span>
                    )}
                    {Number(c.rating) > 0 && (
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill">
                        ★ {Number(c.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Services */}
      <section className="container mt-4">
        <SectionHeader title="Dịch vụ/Việc làm nổi bật" />
        {loading.services ? (
          <div className="row g-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-12 col-md-6 col-lg-4" key={i}>
                <div className="card card-soft h-100 placeholder-glow">
                  <div className="placeholder col-12" style={{ height: 140 }} />
                  <div className="p-3">
                    <div className="placeholder col-4" />
                    <div className="placeholder col-8 mt-2" />
                    <div className="placeholder col-6 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : featuredServices.length === 0 ? (
          <div className="text-muted small">Chưa có dịch vụ hoạt động.</div>
        ) : (
          <div className="row g-3">
            {featuredServices.map((s) => {
              const comp = companyById.get(s.company_id);
              return (
                <div className="col-12 col-md-6 col-lg-4" key={s.id}>
                  <div className="card card-soft h-100">
                    <div
                      style={{
                        background:
                          "url('https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop') center/cover no-repeat",
                        height: 140,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    />
                    <div className="p-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="badge bg-primary-subtle text-primary rounded-pill">
                          {comp?.name || "Company"}
                        </span>
                        <span className="badge bg-success-subtle text-success rounded-pill">
                          {vnd(s.price_cents)}
                        </span>
                      </div>
                      <h6 className="mt-2 mb-1">{s.title}</h6>
                      {s.description && (
                        <div className="small text-muted">
                          {String(s.description).slice(0, 100)}
                          {String(s.description).length > 100 ? "…" : ""}
                        </div>
                      )}
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-sm btn-primary rounded-pill">Đặt/Ứng tuyển</button>
                        <button className="btn btn-sm btn-outline-secondary rounded-pill">Chi tiết</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Drivers */}
      <section className="container mt-4 mb-5">
        <SectionHeader title="Top Drivers nổi bật" />
        {loading.drivers ? (
          <HScroll>
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="card card-soft p-3" key={i} style={{ width: 300 }}>
                <div className="placeholder rounded-circle" style={{ width: 64, height: 64 }} />
                <div className="placeholder col-8 mt-2" />
                <div className="placeholder col-6 mt-2" />
              </div>
            ))}
          </HScroll>
        ) : topDrivers.length === 0 ? (
          <div className="text-muted small">Chưa có dữ liệu driver.</div>
        ) : (
          <HScroll>
            {topDrivers.map((d) => (
              <div className="card card-soft p-3" key={d.id} style={{ width: 300 }}>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={d.img_url || "https://i.pravatar.cc/64"}
                    alt={d.full_name}
                    width={64}
                    height={64}
                    className="rounded-circle"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div className="fw-semibold">{d.full_name}</div>
                    <div className="small text-muted">{d.location || "—"}</div>
                    {Number(d.rating) > 0 && (
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill mt-1">
                        ★ {Number(d.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-sm btn-outline-secondary rounded-pill">Xem hồ sơ</button>
                  <button className="btn btn-sm btn-primary rounded-pill">Liên hệ</button>
                </div>
              </div>
            ))}
          </HScroll>
        )}
      </section>
    </>
  );
}


