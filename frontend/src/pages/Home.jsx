import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Carousel from "react-bootstrap/Carousel";
/* ====== Hardcoded Top Companies (giữ nguyên) ====== */
const HARDCODED_COMPANIES = [
  { id: "c_XANHSM", name: "XANHSM", img_url: "https://dummyimage.com/160x80/ffffff/333&text=XANHSM", rating: 4.6, membership: "Premium" },
  { id: "c_MAILINH", name: "MAILINH", img_url: "https://dummyimage.com/160x80/ffffff/333&text=MAILINH", rating: 4.4, membership: "Premium" },
  { id: "c_BE", name: "BE", img_url: "https://dummyimage.com/160x80/ffffff/333&text=BE", rating: 4.3, membership: "Basic" },
  { id: "c_GRAP", name: "GRAP", img_url: "https://dummyimage.com/160x80/ffffff/333&text=GRAP", rating: 4.2, membership: "Basic" },
  { id: "c_GOJEK", name: "GOJEK", img_url: "https://dummyimage.com/160x80/ffffff/333&text=GOJEK", rating: 4.1, membership: "Free" },
  { id: "c_SHOPEE", name: "SHOPEE", img_url: "https://dummyimage.com/160x80/ffffff/333&text=SHOPEE", rating: 4.0, membership: "Free" },
];

/* ====== Hardcoded Home – khối cuối trang ====== */
const PRESS_ITEMS = [
  { id: 1, logo: "https://dummyimage.com/120x28/ffffff/555&text=DANTRI", text: "Giải thưởng quốc tế" },
  { id: 2, logo: "https://dummyimage.com/120x28/ffffff/555&text=VNEXP", text: "Báo chí nói về chúng tôi" },
  { id: 3, logo: "https://dummyimage.com/120x28/ffffff/555&text=CAFEF", text: "Thị trường tuyển dụng" },
  { id: 4, logo: "https://dummyimage.com/120x28/ffffff/555&text=ICTNEWS", text: "Công nghệ nhân sự" },
];

const TESTIMONIALS = [
  { id: 1, quote: "Nhờ nền tảng, tôi tìm được công việc phù hợp rất nhanh. UI dễ dùng, tư vấn rõ ràng.", author: "Ms. Trúc Năng" },
  { id: 2, quote: "Tin tuyển chất lượng, có lọc theo ngành/địa điểm, ứng tuyển mượt.", author: "Mr. Quang Tùng" },
  { id: 3, quote: "Tính năng gợi ý công việc rất hữu ích với người mới.", author: "Anh Tuấn" },
];

const INSIDER_POSTS = [
  { id: 1, title: "CHRO là gì? Vai trò & nhiệm vụ", cat: "Phát triển kỹ năng", img: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, title: "Dự báo lương & các điều quan trọng", cat: "Phát triển kỹ năng", img: "https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, title: "Học tại chỗ/On-the-job có nên?", cat: "Phát triển kỹ năng", img: "https://images.unsplash.com/photo-1554774853-b415df9eeb92?q=80&w=1200&auto=format&fit=crop" },
  { id: 4, title: "Podcast: Những kỹ năng cần có", cat: "Phát triển kỹ năng", img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop" },
  { id: 5, title: "Từ data analyst đến data science", cat: "Phát triển kỹ năng", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop" },
];

/* ---------- helpers chung ---------- */
const memberRank = { Premium: 3, Basic: 2, Free: 1 };
const vnd = (cents) =>
  typeof cents === "number" ? (cents / 100).toLocaleString("vi-VN", { style: "currency", currency: "VND" }).replace(",00", "") : "";

const extractItems = (res) => {
  const d = res?.data;
  if (Array.isArray(d)) return d;
  const dd = d?.data;
  if (Array.isArray(dd)) return dd;
  if (Array.isArray(dd?.items)) return dd.items;
  if (Array.isArray(d?.items)) return d.items;
  return [];
};

/* Service chuẩn hoá – có ảnh động từ API */
const normalizeService = (s) => ({
  id: s.id ?? s._id,
  company_id: s.company_id ?? s.companyId,
  title: s.title,
  description: s.description,
  price_cents: s.price_cents ?? s.priceCents,
  is_active: (s.is_active ?? s.isActive) ? 1 : 0,
  img_url:
    s.imageUrl ??
    s.imageURL ??
    s.image_url ??
    s.imgUrl ??
    s.img_url ??
    (Array.isArray(s.images) && s.images[0]) ??
    (Array.isArray(s.photos) && s.photos[0]) ??
    null,
});

const normalizeDriver = (d) => ({
  id: d.id ?? d._id,
  full_name: d.full_name ?? d.fullName,
  img_url: d.img_url ?? d.imgUrl ?? null,
  location: d.location ?? d.city ?? "",
  rating: Number(d.rating ?? 0),
  is_available: (d.is_available ?? d.isAvailable ?? 1) ? 1 : 0,
});

/* ---------- small UI ---------- */
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
    <div className="position-relative">
      <button className="circle-nav position-absolute" style={{ left: -6, top: "50%", transform: "translateY(-50%)" }} onClick={() => scrollBy(-1)}>
        <i className="bi bi-chevron-left" />
      </button>
      <div ref={ref} className="d-flex gap-3 overflow-auto" style={{ scrollbarWidth: "none" }}>
        {children}
      </div>
      <button className="circle-nav position-absolute" style={{ right: -6, top: "50%", transform: "translateY(-50%)" }} onClick={() => scrollBy(1)}>
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
}

/* ---------- Banner ---------- */
const BANNERS = [
  { img: "/assets/xanhsm.jpg", alt: "Xanh SM", href: "/services?category=taxi" },
  { img: "/assets/airport.jpg", alt: "Taxi sân bay", href: "/services?category=airport" },
  { img: "/assets/4-7cho.jpg", alt: "Xe 4–7 chỗ", href: "/services?category=car" },
];
function BannerCarousel({
  items = BANNERS,
  interval = 4000,
  height = 340,
  fade = false,
}) {
  return (
    <Carousel
      interval={interval}
      controls      // có nút trái/phải
      indicators    // có chấm tròn
      pause="hover" // di chuột vào sẽ tạm dừng
      touch         // hỗ trợ vuốt trên mobile
      slide={!fade}
      fade={fade}
      className="rounded-4 overflow-hidden banner-shadow"
    >
      {items.map((b, idx) => (
        <Carousel.Item key={idx}>
          {/* bọc <img> trong <a> nếu muốn click đi đâu đó */}
          <a href={b.href || "#"} style={{ display: "block" }}>
            <img
              src={b.src}
              alt={b.alt || `banner-${idx}`}
              className="d-block w-100"
              style={{
                height,
                objectFit: "cover",
              }}
            />
          </a>

          {/* Caption (tuỳ chọn) */}
          {b.caption && (
            <Carousel.Caption className="text-start">
              <h5 className="fw-bold">{b.caption}</h5>
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

/* ========================== HOME ========================== */
export default function Home() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [services, setServices] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState({ companies: true, services: true, drivers: true });

  // pager cho Services (4/slide)
  const [svcPage, setSvcPage] = useState(0);
  const pageSize = 4;

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await api.get("/api/companies/all-services", { signal: ac.signal });
        const svcs = extractItems(res).map(normalizeService);
        setServices(svcs);
      } catch (e) {
        console.error("services:", e);
      } finally {
        setLoading((x) => ({ ...x, services: false }));
      }
      setCompanies(HARDCODED_COMPANIES);
      setLoading((x) => ({ ...x, companies: false }));
      try {
        const res = await api.get("/api/drivers", { params: { limit: 20 }, signal: ac.signal });
        const items = extractItems(res).map(normalizeDriver);
        setDrivers(items);
      } catch (e) {
        console.warn("drivers public lỗi/không khả dụng:", e);
      } finally {
        setLoading((x) => ({ ...x, drivers: false }));
      }
    })();
    return () => ac.abort();
  }, []);

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

  const featuredServices = useMemo(() => [...services].filter((s) => s?.is_active !== 0), [services]);
  const totalSvcPages = Math.max(1, Math.ceil(featuredServices.length / pageSize));
  const svcSlice = featuredServices.slice(svcPage * pageSize, svcPage * pageSize + pageSize);
  const gotoSvc = (p) => setSvcPage(Math.min(Math.max(p, 0), totalSvcPages - 1));

  const topDrivers = useMemo(
    () =>
      [...drivers]
        .filter((d) => d?.is_available !== 0)
        .sort((a, b) => (Number(b?.rating) || 0) - (Number(a?.rating) || 0))
        .slice(0, 8),
    [drivers]
  );

  const fallbackCover =
    "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop";

  return (
    <>
      {/* ====== FULL-BLEED BLUE BAND ====== */}
      <section className="home-band edge-to-edge">
        <div className="container">
          <BannerCarousel />
          <div className="mt-3 text-white-50 small">Các Công Ty Hàng Đầu</div>
          {loading.companies ? (
            <div className="row g-3 mt-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="col-6 col-md-4 col-lg-2" key={i}>
                  <div className="card company-card placeholder-glow">
                    <div className="placeholder col-12" style={{ height: 84 }} />
                    <div className="placeholder col-8 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="row g-3 mt-2">
              {topCompanies.map((c) => (
                <div className="col-6 col-md-4 col-lg-2" key={c.id}>
                  <div className="card company-card hover-lift">
                    <img src={c.img_url} alt={c.name} className="company-logo" />
                    <div className="fw-semibold small mt-2 text-dark">{c.name}</div>
                    <div className="mt-1 d-flex gap-2">
                      <span className="badge bg-primary-subtle text-primary rounded-pill">{c.membership}</span>
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill">★ {c.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====== SERVICES FEATURED (4/slide) ====== */}
      <section className="container my-4">
        <div className="featured-box">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="m-0 section-hdg">
              Việc Làm Nổi Bật <span className="text-primary">Chuyên Viên IT</span>
            </h5>
            <Link to="/services" className="btn btn-sm btn-outline-secondary rounded-pill">
              Xem tất cả
            </Link>
          </div>
          {featuredServices.length === 0 ? (
            <div className="text-muted small">{loading.services ? "Đang tải…" : "Chưa có dịch vụ hoạt động."}</div>
          ) : (
            <>
              <div className="row g-3">
                {svcSlice.map((s) => {
                  const comp = companyById.get(s.company_id);
                  const cover = s.img_url || fallbackCover;
                  return (
                    <div className="col-12 col-md-6 col-lg-3" key={s.id}>
                      <div className="svc-card h-100">
                        <div className="svc-media" style={{ backgroundImage: `url('${cover}')` }}>
                          {typeof s.price_cents === "number" && <span className="svc-price">{vnd(s.price_cents)}</span>}
                        </div>
                        <div className="svc-body">
                          <span className="svc-company">{comp?.name || "Company"}</span>
                          <h6 className="svc-title">{s.title}</h6>
                          {s.description && <div className="svc-desc text-truncate-2">{String(s.description)}</div>}
                          <div className="svc-actions">
                            <button className="btn btn-sm btn-primary">Đặt/Ứng tuyển</button>
                            <button className="btn btn-sm btn-outline-secondary">Chi tiết</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pager">
                <button className="nav-round" onClick={() => gotoSvc(svcPage - 1)} disabled={svcPage === 0}>
                  <i className="bi bi-chevron-left" />
                </button>
                <div className="dots">
                  {Array.from({ length: totalSvcPages }).map((_, i) => (
                    <button key={i} className={`dot ${i === svcPage ? "active" : ""}`} onClick={() => gotoSvc(i)} />
                  ))}
                </div>
                <button className="nav-round" onClick={() => gotoSvc(svcPage + 1)} disabled={svcPage >= totalSvcPages - 1}>
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      {/* ====== WOWCV / PRESS / TESTIMONIALS / INSIDER ====== */}
      <section className="container my-4">
        {/* WOWCV hero dòng đầu */}
        <div className="row g-3">
          <div className="col-lg-8">
            <div className="wowcv-hero card-soft p-4">
              <div className="row align-items-center g-3">
                <div className="col-md-7">
                  <h4 className="mb-2">Tạo Ấn Tượng Với Nhà Tuyển Dụng Cùng <span className="text-primary">WowCV</span></h4>
                  <p className="text-muted mb-3">Tạo mẫu CV nhanh gọn & miễn phí, để nhà tuyển dụng “Wow!” ngay khi nhìn thấy CV của bạn.</p>
                  <button className="btn btn-brand rounded-pill">Tạo CV ngay</button>
                </div>
                <div className="col-md-5">
                  <img
                    src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop"
                    alt=""
                    className="img-fluid rounded-3"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 d-flex flex-column gap-3">
            <div className="wowcv-card card-soft p-3">
              <div className="fw-semibold mb-1">Nhân Số Học</div>
              <div className="text-muted">Khám phá năng lực và nghề phù hợp qua biểu đồ nhân số học.</div>
              <a href="#" className="stretched-link small mt-2">Xem thêm</a>
            </div>
            <div className="wowcv-card card-soft p-3">
              <div className="fw-semibold mb-1">Lộ Trình Sự Nghiệp</div>
              <div className="text-muted">Gợi ý kỹ năng/khóa học theo từng cấp bậc & ngành.</div>
              <a href="#" className="stretched-link small mt-2">Xem thêm</a>
            </div>
          </div>
        </div>

        {/* Báo chí nói về */}
        <div className="mt-4">
          <div className="fw-semibold mb-2">Báo chí nói về</div>
          <HScroll>
            {PRESS_ITEMS.map((p) => (
              <div key={p.id} className="press-pill card-soft px-3 py-2" style={{ minWidth: 220 }}>
                <div className="d-flex align-items-center gap-3">
                  <img src={p.logo} alt="" height={22} />
                  <div className="small text-muted">{p.text}</div>
                </div>
              </div>
            ))}
          </HScroll>
        </div>

        {/* Ứng viên nói về */}
        <div className="mt-4">
          <div className="fw-semibold mb-2">Ứng viên nói về</div>
          <HScroll>
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="testi-card card-soft p-3" style={{ minWidth: 360 }}>
                <div className="text-muted">“{t.quote}”</div>
                <div className="mt-2 fw-semibold">{t.author}</div>
              </div>
            ))}
          </HScroll>
        </div>

        {/* Audio bar (tĩnh – layout) */}
        <div className="audio-card card-soft mt-4 p-3 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-light rounded-circle border"><i className="bi bi-play-fill" /></button>
            <div>
              <div className="fw-semibold">Một dòng CV: nếu lầm mãi không lên chức… liệu có nên nhảy việc?</div>
              <div className="small text-muted">00:00 — 09:00</div>
            </div>
          </div>
          <button className="btn btn-outline-secondary rounded-circle"><i className="bi bi-chevron-right" /></button>
        </div>

        {/* HR Insider */}
        <div className="d-flex align-items-center justify-content-between mt-4 mb-2">
          <h5 className="m-0 section-hdg">Tư Vấn Nghề Nghiệp Từ HR Insider</h5>
          <a href="#" className="text-primary fw-semibold text-decoration-none small">XEM TẤT CẢ</a>
        </div>
        <div className="row g-3">
          {INSIDER_POSTS.map((p) => (
            <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={p.id}>
              <div className="insider-card card-soft h-100">
                <div className="insider-thumb" style={{ backgroundImage: `url('${p.img}')` }} />
                <div className="p-3">
                  <div className="small text-primary">{p.cat}</div>
                  <div className="fw-semibold mt-1">{p.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tag cloud (tĩnh) */}
        <div className="tags-cloud mt-4">
          <div className="tags-wrap">
            {["tìm việc làm", "tuyển dụng", "Vận chuyển", "TAXI", "Giao hàng", "Dịch vụ", "Hướng dẫn tour", "hà nội", "hồ chí minh"].map(
              (t, i) => (
                <a key={i} href="#" className="tag-pill">{t}</a>
              )
            )}
          </div>
        </div>
      </section>

      {/* ====== DRIVERS ====== */}
      <section className="container mt-4 mb-5">
        <SectionHeader
          title="Top Drivers nổi bật"
          onAction={() => navigate("/drivers")}
        />
        {topDrivers.length === 0 ? (
          <div className="text-muted small">{loading.drivers ? "Đang tải…" : "Chưa có dữ liệu driver."}</div>
        ) : (
          <HScroll>
            {topDrivers.map((d) => (
              <div className="card driver-chip" key={d.id} style={{ width: 300 }}>
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={d.img_url || "https://i.pravatar.cc/64"}
                    alt={d.full_name}
                    width={56}
                    height={56}
                    className="rounded-circle"
                    style={{ objectFit: "cover" }}
                  />
                  <div>
                    <div className="fw-semibold">{d.full_name}</div>
                    <div className="xsmall">{d.location || "—"}</div>
                    {Number(d.rating) > 0 && (
                      <span className="badge bg-warning-subtle text-warning-emphasis rounded-pill mt-1">
                        ★ {Number(d.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-2 mt-3">
                  <button className="btn btn-xxs btn-outline-secondary rounded-pill">Xem hồ sơ</button>
                  <button className="btn btn-xxs btn-primary rounded-pill">Liên hệ</button>
                </div>
              </div>
            ))}
          </HScroll>
        )}
      </section>
    </>
  );
}
