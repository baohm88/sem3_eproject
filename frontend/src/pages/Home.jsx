// // src/pages/Home.jsx
// import React from "react";
// import { Link } from "react-router-dom";

// /** Light–orange (cam nhạt) theme just for this page */
// const Theme = () => (
//   <style>{`
//     :root{
//       --brand:#FFA94D;            /* cam nhạt */
//       --brand-600:#FF922B;        /* hover */
//       --brand-700:#F76707;        /* pressed */
//       --bg-soft:#FFF3E6;          /* nền dịu */
//       --ink:#1f2937;              /* chữ đậm */
//     }
//     .btn-brand{ background:var(--brand); border-color:var(--brand-600); color:#222; }
//     .btn-brand:hover{ background:var(--brand-600); border-color:var(--brand-700); color:#111; }
//     .badge-brand{ background:var(--brand); color:#222; }
//     .section-title{ font-weight:800; color:var(--ink); }
//     .muted{ color:#4b5563; }
//     .chip{ background:var(--bg-soft); border:1px solid #ffd8a8; color:#7c4a03; }
//     .card-soft{ border:0; border-radius:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); transition:transform .15s ease, box-shadow .15s ease; }
//     .card-soft:hover{ transform:translateY(-2px); box-shadow:0 14px 30px rgba(0,0,0,.1); }
//     .company-logo{ height:52px; object-fit:contain; }
//     .hero{
//       background: linear-gradient(135deg, #0d1b31 0%, #1a2f52 60%) no-repeat;
//       color:#fff; border-radius:24px; overflow:hidden;
//     }
//     .hero-visual{
//       background:url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat;
//       min-height:320px;
//     }
//   `}</style>
// );

// const companies = [
//   { name: "AUTOMECH", logo: "https://dummyimage.com/160x80/ffffff/333333&text=AUTOMECH" },
//   { name: "MINEBEA",  logo: "https://dummyimage.com/160x80/ffffff/333333&text=MINEBEA" },
//   { name: "BIDV",     logo: "https://dummyimage.com/160x80/ffffff/333333&text=BIDV" },
//   { name: "VNPT",     logo: "https://dummyimage.com/160x80/ffffff/333333&text=VNPT" },
//   { name: "VPBANK",   logo: "https://dummyimage.com/160x80/ffffff/333333&text=VPBANK" },
//   { name: "SEI",      logo: "https://dummyimage.com/160x80/ffffff/333333&text=SEI" },
// ];

// const taxiServices = [
//   { brand: "VinaTaxi", title: "Đặt xe 4–7 chỗ",     perks: ["Giá tốt giờ cao điểm", "Hỗ trợ doanh nghiệp"], img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop" },
//   { brand: "Mai Linh",  title: "Thuê xe theo giờ",   perks: ["Tài xế nhiều kinh nghiệm", "Miễn phí chờ 10’"], img: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?q=80&w=1200&auto=format&fit=crop" },
//   { brand: "Vinasun",   title: "Đưa đón sân bay",    perks: ["Đặt lịch trước", "Theo dõi chuyến đi"],         img: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop" },
// ];

// const driverJobs = [
//   { company: "Mai Linh",  role: "Driver 4 chỗ – Ca hành chính", location: "Q.1, TP.HCM", salary: "14–18tr", tags: ["Toàn thời gian", "BHYT/BHXH"] },
//   { company: "Vinasun",   role: "Driver 7 chỗ – Theo ca",        location: "Hà Nội",     salary: "15–20tr", tags: ["Theo ca", "Thưởng doanh thu"] },
//   { company: "G7 Taxi",   role: "Driver Airport Shuttle",        location: "Đà Nẵng",    salary: "12–16tr", tags: ["Full-time", "Phụ cấp nhiên liệu"] },
//   { company: "Taxi Group",role: "Driver hợp tác kinh doanh",     location: "Hải Phòng",  salary: "Ưu đãi cao", tags: ["Hợp tác", "Chủ động thời gian"] },
// ];

// function SectionHeader({ title, subtitle, actionText = "Xem tất cả", onAction }) {
//   return (
//     <div className="d-flex align-items-end justify-content-between mb-3">
//       <div>
//         <h4 className="section-title mb-1">{title}</h4>
//         {subtitle && <div className="muted small">{subtitle}</div>}
//       </div>
//       <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onAction}>
//         {actionText}
//       </button>
//     </div>
//   );
// }

// function Banner() {
//   return (
//     <section className="container mt-4">
//       <div id="bannerCarousel" className="carousel slide" role="region" aria-label="Trang chủ - banner nổi bật" data-bs-ride="carousel" data-bs-interval="3000">
//         <div className="carousel-inner rounded-4">
//           {/* Slide 1 */}
//           <div className="carousel-item active">
//             <div className="hero card-soft">
//               <div className="row g-0">
//                 <div className="col-lg-7 p-4 p-lg-5">
//                   <span className="badge badge-brand rounded-pill px-3 py-2 fw-semibold">IVB CAREER</span>
//                   <h1 className="mt-3 fw-bold" style={{ lineHeight: 1.05 }}>
//                     Grow & Glow – Vững kết sự nghiệp, bền tầm phát triển
//                   </h1>
//                   <p className="mt-2 text-white-50">
//                     Tìm việc mơ ước, khám phá công ty phù hợp và ứng tuyển chỉ trong vài bước.
//                   </p>
//                   <div className="d-flex gap-2 mt-2">
//                     <button className="btn btn-brand rounded-pill px-4">Khám phá ngay</button>
//                     <button className="btn btn-outline-light rounded-pill px-4">Tìm hiểu thêm</button>
//                   </div>
//                   <div className="mt-4 d-flex gap-2 flex-wrap">
//                     <span className="badge chip rounded-pill">Developer</span>
//                     <span className="badge chip rounded-pill">Designer</span>
//                     <span className="badge chip rounded-pill">Data</span>
//                     <span className="badge chip rounded-pill">Marketing</span>
//                   </div>
//                 </div>
//                 <div className="col-lg-5 hero-visual" />
//               </div>
//             </div>
//           </div>
//           {/* Slide 2 */}
//           <div className="carousel-item">
//             <div className="hero card-soft">
//               <div className="row g-0">
//                 <div className="col-lg-7 p-4 p-lg-5">
//                   <span className="badge badge-brand rounded-pill px-3 py-2 fw-semibold">ỨNG TUYỂN</span>
//                   <h1 className="mt-3 fw-bold" style={{ lineHeight: 1.05 }}>
//                     Ứng tuyển dễ dàng – Nhanh chóng & tiện lợi
//                   </h1>
//                   <p className="mt-2 text-white-50">
//                     Hàng ngàn công việc mới mỗi ngày, phù hợp với bạn.
//                   </p>
//                   <button className="btn btn-light rounded-pill px-4 mt-2">Ứng tuyển ngay</button>
//                 </div>
//                 <div
//                   className="col-lg-5 hero-visual"
//                   style={{
//                     background: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
//                     minHeight: "320px",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//           {/* Slide 3 */}
//           <div className="carousel-item">
//             <div className="hero card-soft">
//               <div className="row g-0">
//                 <div className="col-lg-7 p-4 p-lg-5">
//                   <span className="badge badge-brand rounded-pill px-3 py-2 fw-semibold">ĐỐI TÁC</span>
//                   <h1 className="mt-3 fw-bold" style={{ lineHeight: 1.05 }}>
//                     Đối tác uy tín – Cơ hội nghề nghiệp rộng mở
//                   </h1>
//                   <p className="mt-2 text-white-50">
//                     Hợp tác cùng những doanh nghiệp hàng đầu Việt Nam.
//                   </p>
//                   <button className="btn btn-brand rounded-pill px-4 mt-2">Khám phá thêm</button>
//                 </div>
//                 <div
//                   className="col-lg-5 hero-visual"
//                   style={{
//                     background: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
//                     minHeight: "320px",
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Nút điều hướng */}
//         <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
//           <span className="carousel-control-prev-icon" aria-hidden="true"></span>
//           <span className="visually-hidden">Previous</span>
//         </button>
//         <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
//           <span className="carousel-control-next-icon" aria-hidden="true"></span>
//           <span className="visually-hidden">Next</span>
//         </button>
//       </div>
//     </section>
//   );
// }

// function TopCompanies() {
//   return (
//     <section className="container mt-5">
//       <SectionHeader
//         title="Các công ty hàng đầu"
//         subtitle="Đối tác tuyển dụng uy tín – cập nhật việc mới mỗi ngày"
//       />
//       <div className="row g-3">
//         {companies.map((c, i) => (
//           <div className="col-6 col-md-4 col-lg-2" key={i}>
//             <div className="card card-soft p-3 text-center h-100">
//               <img loading="lazy" src={c.logo} alt={c.name} className="company-logo mx-auto" />
//               <div className="fw-semibold small mt-3">{c.name}</div>
//               <div className="mt-2">
//                 <span className="badge rounded-pill chip">VIỆC MỚI</span>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function FeaturedTaxiServices() {
//   return (
//     <section className="container mt-5">
//       <SectionHeader
//         title="Các dịch vụ nổi bật từ các hãng taxi"
//         subtitle="Đặt xe nhanh, đúng nhu cầu – dành cho cá nhân & doanh nghiệp"
//       />
//       <div className="row g-3">
//         {taxiServices.map((s, i) => (
//           <div className="col-12 col-md-6 col-lg-4" key={i}>
//             <div className="card card-soft h-100">
//               <div
//                 style={{
//                   background: `url('${s.img}') center/cover no-repeat`,
//                   height: 160,
//                   borderTopLeftRadius: 18,
//                   borderTopRightRadius: 18,
//                 }}
//               />
//               <div className="p-3">
//                 <div className="d-flex align-items-center justify-content-between">
//                   <span className="badge badge-brand rounded-pill">{s.brand}</span>
//                 </div>
//                 <h6 className="mt-2 mb-1">{s.title}</h6>
//                 <ul className="mb-3 small muted">
//                   {s.perks.map((p, idx) => (
//                     <li key={idx}>{p}</li>
//                   ))}
//                 </ul>
//                 <div className="d-flex gap-2">
//                   <button className="btn btn-sm btn-brand rounded-pill">Đặt ngay</button>
//                   {/* Điều hướng sang ServicesPage với id fix cứng (index) */}
//                   <Link
//                     to={`/services/${i}`}
//                     className="btn btn-sm btn-outline-secondary rounded-pill"
//                   >
//                     Chi tiết
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function FeaturedDriverJobs() {
//   return (
//     <section className="container mt-5 mb-5">
//       <SectionHeader
//         title="Các công việc driver nổi bật từ các hãng taxi"
//         subtitle="Lương – thưởng cạnh tranh, hỗ trợ đầy đủ"
//       />
//       <div className="row g-3">
//         {driverJobs.map((j, i) => (
//           <div className="col-12 col-md-6 col-lg-3" key={i}>
//             <div className="card card-soft h-100">
//               <div className="card-body">
//                 <span className="badge badge-brand rounded-pill">{j.company}</span>
//                 <h6 className="mt-2 mb-1">{j.role}</h6>
//                 <div className="small muted">Khu vực: {j.location}</div>
//                 <div className="mt-2 fw-semibold">Thu nhập: {j.salary}</div>
//                 <div className="mt-2 d-flex flex-wrap gap-2">
//                   {j.tags.map((t, idx) => (
//                     <span key={idx} className="badge chip rounded-pill">{t}</span>
//                   ))}
//                 </div>
//                 <div className="d-flex gap-2 mt-3">
//                   <button className="btn btn-sm btn-brand rounded-pill">Ứng tuyển</button>
//                   <button className="btn btn-sm btn-outline-secondary rounded-pill">Lưu tin</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function HomePage() {
//   return (
//     <>
//       <Theme />
//       <Banner />
//       <TopCompanies />
//       <FeaturedTaxiServices />
//       <FeaturedDriverJobs />
//     </>
//   );
// }

// export default HomePage;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listCompanies, getLatestServices } from "../api/companies";

/** ==== CSS cục bộ cho trang Home (nhẹ, tránh đụng global) ==== */
const Theme = () => (
  <style>{`
    .section-title{ font-weight:800; color:#0f172a; }
    .muted{ color:#64748b; }
    .card-soft{ border:0; border-radius:18px; background:#fff; box-shadow:0 12px 28px rgba(2,6,23,.08); overflow:hidden; }
    .card-soft:hover{ transform:translateY(-2px); box-shadow:0 16px 32px rgba(2,6,23,.12); transition:.18s ease; }
    .company-logo{ height:52px; object-fit:contain; }

    /* HERO (đặt trước banner) */
    .hero-search{
      background: radial-gradient(900px 360px at 12% -20%, #0c6cff33 0%, transparent 60%),
                  linear-gradient(135deg, #0b5cab 0%, #0a4c90 70%);
      color:#fff; border-radius:24px; overflow:hidden;
      box-shadow: 0 16px 36px rgba(2,6,23,.18);
    }
    .hero-search h1{ font-weight:900; line-height:1.1; letter-spacing:.2px; }
    .hero-badge{ background:#ffffff22; color:#fff; border-radius:999px; padding:.45rem .95rem; font-weight:700; letter-spacing:.5px; }
    .hero-input{ border:1px solid #ffffff44; border-radius:999px; padding:.6rem .8rem; background:#ffffff1a; color:#fff; backdrop-filter: blur(4px); }
    .hero-input .form-control{ background:transparent !important; border:0 !important; color:#fff !important; }
    .hero-input .form-control::placeholder{ color:#e2e8f0cc; }
    .hero-search .chip{ background:#fff; color:#0b5cab; border:0; border-radius:999px; padding:.3rem .65rem; font-weight:600; }
    .hero-img{ min-height:320px; background-size:cover; background-position:center; }

    /* CATEGORY tiles */
    .cat-tile{ border:1px solid #e5e7eb; border-radius:14px; padding:14px; background:#fff; }
    .cat-tile:hover{ border-color:#cfe0ff; box-shadow:0 8px 18px rgba(2,6,23,.06); transform:translateY(-2px); transition:.18s; }
    .cat-icon{ width:40px; height:40px; display:grid; place-items:center; background:#eff6ff; border-radius:10px; font-size:20px; color:#1d4ed8; }

    /* Latest services grid */
    .ls-grid{ display:grid; grid-template-columns:1fr; gap:16px; }
    @media (min-width: 992px){ .ls-grid{ grid-template-columns:1fr 1fr 1fr; } }
    .ls-card{ border:1px solid #eef1f4; border-radius:16px; padding:16px; background:#fff; }
    .ls-card:hover{ box-shadow:0 8px 20px rgba(2,6,23,.06); }
    .ls-price{ color:#ff6a00; font-weight:800; margin-top:2px; }

    /* Spotlight/News/Testimonials */
    .spotlight{ border-radius:18px; overflow:hidden; background:#fff; }
    .spotlight .right{
      background: url('https://images.unsplash.com/photo-1474564862106-1f23a9655d15?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat;
      min-height:220px;
    }
    .mini-card{ border:1px solid #e5e7eb; border-radius:14px; overflow:hidden; background:#fff; }
    .mini-thumb{ height:120px; background-size:cover; background-position:center; }
    .testimonial{ border:1px solid #e5e7eb; border-radius:16px; padding:16px; background:#fff; }
    .promo{ background:#f8fafc; border-radius:18px; padding:24px; }
  `}</style>
);

/** ==== DÙNG CHUNG ==== */
function SectionHeader({ title, subtitle, actionText = "Xem tất cả", to = "#", onAction }) {
  return (
    <div className="d-flex align-items-end justify-content-between mb-3">
      <div>
        <h4 className="section-title mb-1">{title}</h4>
        {subtitle && <div className="muted small">{subtitle}</div>}
      </div>
      {to ? (
        <Link className="btn btn-sm btn-outline-secondary rounded-pill" to={to} onClick={onAction}>
          {actionText}
        </Link>
      ) : (
        <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}

/** ==== SECTIONS ==== */
function HeroSearch() {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const goSearch = () => {
    const qs = q.trim() ? `?q=${encodeURIComponent(q.trim())}` : "";
    navigate(`/services${qs}`);
  };
  const goCategory = (cat) => navigate(`/services?category=${cat}`);

  return (
    <section className="container my-4">
      <div className="row g-0 hero-search card-soft">
        <div className="col-lg-7 p-4 p-lg-5 d-flex flex-column justify-content-center">
          <span className="hero-badge d-inline-block">DỊCH VỤ LÁI XE & VẬN CHUYỂN</span>
          <h1 className="mt-3">Bạn cần dịch vụ gì?</h1>
          <p className="mt-2 text-white-50">
            Taxi 4–16 chỗ, đưa đón sân bay, thuê xe theo giờ, vận chuyển hàng hoá/xe tải/van.
          </p>

          <div className="d-flex gap-2 mt-2">
            <div className="flex-grow-1 d-flex align-items-center hero-input">
              <i className="bi bi-search me-2" />
              <input
                className="form-control"
                placeholder="Ví dụ: Đưa đón sân bay, Liên tỉnh..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goSearch()}
              />
            </div>
            <button className="btn btn-light rounded-pill fw-semibold px-4" onClick={goSearch}>
              Tìm kiếm
            </button>
          </div>

          <div className="d-flex gap-2 flex-wrap mt-3">
            {["airport","hourly","intercity","cargo"].map((c) => (
              <button key={c} className="chip" onClick={() => goCategory(c)}>
                {c === "airport" ? "Sân bay" :
                 c === "hourly" ? "Theo giờ" :
                 c === "intercity" ? "Liên tỉnh" : "Hàng hoá"}
              </button>
            ))}
          </div>
        </div>

        <div
          className="col-lg-5 hero-img"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1606666912724-38b9cf24bbf3?q=80&w=1400&auto=format&fit=crop')",
          }}
        />
      </div>
    </section>
  );
}

function BannerCarousel() {
  return (
    <section className="container mb-4">
      <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3500">
        <div className="carousel-inner rounded-4">
          {/* Slide 1 */}
          <div className="carousel-item active">
            <div
              className="card-soft"
              style={{
                background:
                  "url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat",
                minHeight: 320,
              }}
            >
              <div className="p-4 p-lg-5 text-white" style={{ backdropFilter: "brightness(0.85)" }}>
                <h3 className="fw-bold">Gia nhập đối tác – Thu nhập ổn định</h3>
                <p className="mb-3">Hợp tác linh hoạt, thưởng doanh thu hấp dẫn</p>
                <Link to="/drivers" className="btn btn-light rounded-pill px-4 fw-semibold">Tìm cơ hội</Link>
              </div>
            </div>
          </div>

          {/* Slide 2 */}
          <div className="carousel-item">
            <div className="card-soft">
              <div className="row g-0">
                <div className="col-lg-7 p-4 p-lg-5 d-flex flex-column justify-content-center">
                  <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-semibold">ỨNG TUYỂN</span>
                  <h3 className="mt-3 fw-bold">Ứng tuyển dễ dàng – Nhanh chóng & tiện lợi</h3>
                  <p className="text-muted">Hàng ngàn công việc tài xế mới mỗi ngày, phù hợp với bạn.</p>
                  <Link to="/drivers" className="btn btn-warning rounded-pill px-4 fw-semibold">Ứng tuyển ngay</Link>
                </div>
                <div
                  className="col-lg-5"
                  style={{
                    background: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
                    minHeight: "320px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <button className="carousel-control-prev" type="button" data-bs-target="#bannerCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#bannerCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </section>
  );
}

/** ======= Các công ty hàng đầu (động) ======= */
function TopCompanies() {
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const page = await listCompanies({ isActive: true, sort: "rating:desc", page: 1, size: 6 });
        if (alive) setState({ loading: false, items: page.items ?? [], error: "" });
      } catch {
        if (alive) setState({ loading: false, items: [], error: "Không tải được danh sách công ty" });
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="container mt-2">
      <SectionHeader
        title="Các công ty hàng đầu"
        subtitle="Đối tác tuyển dụng uy tín – cập nhật việc mới mỗi ngày"
        to="/listings"
      />
      {state.loading ? (
        <div className="row g-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="col-6 col-md-4 col-lg-2" key={i}>
              <div className="card card-soft p-3 placeholder-wave" style={{ height: 112 }}>
                <div className="placeholder col-8 mb-2" />
                <div className="placeholder col-5" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="row g-3">
          {state.items.map((c, i) => (
            <div className="col-6 col-md-4 col-lg-2" key={c.id || i}>
              <div className="card card-soft p-3 h-100">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={c?.imgUrl || "https://dummyimage.com/120x60/eff3f9/222&text=Company"}
                    alt={c?.name || "Company"}
                    className="company-logo"
                  />
                  <div className="ms-1">
                    <div className="fw-semibold">{c?.name || "Công ty"}</div>
                    <div className="small text-secondary">Đánh giá: {Number(c?.rating || 0).toFixed(1)}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

/** ======= Ngành dịch vụ trọng điểm (fix cứng) ======= */
function CategoryTiles() {
  const navigate = useNavigate();
  return (
    <section className="container mt-4">
      <SectionHeader
        title="Ngành dịch vụ trọng điểm"
        subtitle="Chọn nhanh theo nhu cầu di chuyển và vận chuyển phổ biến"
        to="/services"
      />
      <div className="row g-3">
        {[
          { key: "airport", icon: "bi-airplane", label: "Đưa đón sân bay" },
          { key: "hourly", icon: "bi-hourglass-split", label: "Thuê xe theo giờ" },
          { key: "intercity", icon: "bi-signpost-2", label: "Liên tỉnh" },
          { key: "cargo", icon: "bi-truck", label: "Vận chuyển hàng hoá" },
          { key: "tour", icon: "bi-map", label: "Tour/City tour" },
          { key: "shuttle", icon: "bi-people", label: "Đưa đón nhân viên" },
        ].map((c) => (
          <div className="col-6 col-md-4 col-lg-2" key={c.key}>
            <button className="w-100 text-start cat-tile" onClick={() => navigate(`/services?category=${c.key}`)}>
              <div className="cat-icon mb-2"><i className={`bi ${c.icon}`} /></div>
              <div className="fw-semibold">{c.label}</div>
              <div className="small text-secondary mt-1">Xem dịch vụ</div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ======= Dịch vụ mới nhất (động) ======= */
function LatestServices() {
  const [state, setState] = useState({ loading: true, items: [], error: "" });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const page = await getLatestServices({ size: 6 });
        if (alive) setState({ loading: false, items: page.items ?? [], error: "" });
      } catch {
        if (alive) setState({ loading: false, items: [], error: "Không tải được dịch vụ mới" });
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <section className="container mt-4">
      <SectionHeader
        title="Dịch vụ mới nhất"
        subtitle="Những chuyến/đơn dịch vụ vừa được cập nhật"
        to="/services"
      />
      {state.loading ? (
        <div className="ls-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div className="ls-card placeholder-wave" key={i} style={{ height: 96 }}>
              <div className="placeholder col-4 mb-2" />
              <div className="placeholder col-2" />
            </div>
          ))}
        </div>
      ) : state.items.length ? (
        <div className="ls-grid">
          {state.items.map((s) => (
            <div className="ls-card" key={s.id}>
              <div className="d-flex align-items-center gap-3">
                <img
                  src={s.companyImgUrl || "https://dummyimage.com/80x80/eff3f9/222&text=LOGO"}
                  alt={s.companyName}
                  className="rounded-3"
                  style={{ width: 64, height: 64, objectFit: "cover" }}
                />
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <Link to={`/services?id=${s.id}`} className="fw-semibold link-dark text-decoration-none">
                      {s.title}
                    </Link>
                    <span className="badge bg-light text-danger d-inline-flex align-items-center gap-1">
                      <i className="bi bi-fire" /> Hot
                    </span>
                  </div>
                  <div className="text-secondary small mt-1">{s.companyName}</div>
                  <div className="ls-price">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                      maximumFractionDigits: 0,
                    }).format(s.priceCents)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-secondary">Chưa có dữ liệu dịch vụ.</div>
      )}
    </section>
  );
}

/** ======= Spotlight nhà tuyển dụng (fix cứng) ======= */
function RecruiterSpotlight() {
  return (
    <section className="container mt-4">
      <SectionHeader
        title="Nhà tuyển dụng nổi bật"
        subtitle="Các đối tác có chương trình ưu đãi/thuê chuyến hấp dẫn"
        to="/listings"
      />
      <div className="spotlight card-soft">
        <div className="row g-0">
          <div className="col-lg-8 p-4 p-lg-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">
              ƯU ĐÃI DOANH NGHIỆP
            </span>
            <h3 className="fw-bold mt-3">Gói đưa đón nhân viên – Tiết kiệm đến 20%</h3>
            <p className="muted">
              Lộ trình cố định, tài xế chuyên nghiệp, báo cáo minh bạch hàng tuần. Phù hợp công ty 50–500 nhân sự.
            </p>
            <Link to="/advertise" className="btn btn-primary rounded-pill px-4">Tư vấn gói</Link>
          </div>
          <div className="col-lg-4 right" />
        </div>
      </div>
    </section>
  );
}

/** ======= Mẹo hay & Bản tin (fix cứng) ======= */
const tips = [
  { id: 1, title: "3 cách đặt xe sân bay tiết kiệm 20%", img: "https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, title: "Checklist chuyển nhà nhanh gọn", img: "https://images.unsplash.com/photo-1520367745676-56196632073f?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, title: "Thuê xe theo giờ: khi nào hợp lý?", img: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=1200&auto=format&fit=crop" },
];

function TipsNews() {
  return (
    <section className="container mt-4">
      <SectionHeader title="Mẹo hay & Bản tin" subtitle="Kinh nghiệm di chuyển, vận chuyển thông minh" to="/feedback" actionText="Xem thêm" />
      <div className="row g-3">
        {tips.map((t) => (
          <div className="col-12 col-md-4" key={t.id}>
            <div className="mini-card h-100">
              <div className="mini-thumb" style={{ backgroundImage: `url('${t.img}')` }} />
              <div className="p-3">
                <div className="fw-semibold">{t.title}</div>
                <Link to="/feedback" className="btn btn-sm btn-outline-secondary rounded-pill mt-2">Đọc tiếp</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ======= Testimonials (fix cứng) ======= */
const testimonials = [
  { id: 1, name: "Anh Trọng – Quận 3", text: "Đặt xe sân bay 5 phút có tài xế, giá hiển thị rõ ràng. Tài xế thân thiện!", company: "Vinasun" },
  { id: 2, name: "Chị Hạnh – Hà Nội", text: "Gói đưa đón nhân viên chạy rất ổn định, báo cáo hàng tuần đầy đủ.", company: "Mai Linh" },
];

function Testimonials() {
  return (
    <section className="container mt-4">
      <SectionHeader title="Khách hàng nói gì?" subtitle="Trải nghiệm thật từ người dùng thực" to="" actionText=" " />
      <div className="row g-3">
        {testimonials.map((c) => (
          <div className="col-12 col-md-6" key={c.id}>
            <div className="testimonial h-100">
              <div className="mb-2" style={{fontSize:28, color:"#94a3b8", lineHeight:0}}>“</div>
              <div className="mb-2">{c.text}</div>
              <div className="small text-secondary">
                <i className="bi bi-person-circle me-1" />
                {c.name} • <span className="fw-semibold">{c.company}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** ======= App promo (fix cứng) ======= */
function AppPromo() {
  return (
    <section className="container my-4">
      <div className="promo d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
        <div>
          <h5 className="fw-bold mb-1">Đặt chuyến nhanh hơn với ứng dụng</h5>
          <div className="text-secondary">Theo dõi tài xế theo thời gian thực, lưu địa chỉ quen thuộc</div>
        </div>
        <div className="d-flex gap-2">
          <a href="#" className="btn btn-dark rounded-pill px-3"><i className="bi bi-apple me-2" />App Store</a>
          <a href="#" className="btn btn-success rounded-pill px-3"><i className="bi bi-google-play me-2" />Google Play</a>
        </div>
      </div>
    </section>
  );
}

/** ==== PAGE ==== */
export default function HomePage() {
  return (
    <>
      <Theme />

      {/* 1) “Bạn cần dịch vụ gì?” */}
      <HeroSearch />

      {/* 2) Banner carousel */}
      <BannerCarousel />

      {/* 3) Các công ty hàng đầu (API) */}
      <TopCompanies />

      {/* 4) Ngành dịch vụ trọng điểm */}
      <CategoryTiles />

      {/* 5) Dịch vụ mới nhất (API) */}
      <LatestServices />

      {/* 6) Spotlight đối tác */}
      <RecruiterSpotlight />

      {/* 7) Tin/mẹo */}
      <TipsNews />

      {/* 8) Testimonials */}
      <Testimonials />

      {/* 9) App promo */}
      <AppPromo />
    </>
  );
}
