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

import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

/* =========================================================
   MOCK DATA (có thể thay bằng API sau này)
   ========================================================= */
const COMPANIES = [
  { name: "AUTOMECH", logo: "https://dummyimage.com/160x80/ffffff/333333&text=AUTOMECH" },
  { name: "MINEBEA",  logo: "https://dummyimage.com/160x80/ffffff/333333&text=MINEBEA"  },
  { name: "BIDV",     logo: "https://dummyimage.com/160x80/ffffff/333333&text=BIDV"     },
  { name: "VNPT",     logo: "https://dummyimage.com/160x80/ffffff/333333&text=VNPT"     },
  { name: "VPBANK",   logo: "https://dummyimage.com/160x80/ffffff/333333&text=VPBANK"   },
  { name: "SEI",      logo: "https://dummyimage.com/160x80/ffffff/333333&text=SEI"      },
];

const TIPS = [
  { id: 1, title: "3 cách đặt xe sân bay tiết kiệm 20%", img: "https://images.unsplash.com/photo-1543269865-0a740d43b90c?q=80&w=1200&auto=format&fit=crop" },
  { id: 2, title: "Checklist chuyển nhà nhanh gọn",      img: "https://images.unsplash.com/photo-1520367745676-56196632073f?q=80&w=1200&auto=format&fit=crop" },
  { id: 3, title: "Thuê xe theo giờ: khi nào hợp lý?",    img: "https://images.unsplash.com/photo-1479142506502-19b3a3b7ff33?q=80&w=1200&auto=format&fit=crop" },
];

const TESTIMONIALS = [
  { id: 1, name: "Anh Trọng – Quận 3", text: "Đặt xe sân bay 5 phút có tài xế, giá hiển thị rõ ràng. Tài xế thân thiện!", company: "Vinasun" },
  { id: 2, name: "Chị Hạnh – Hà Nội",  text: "Gói đưa đón nhân viên chạy rất ổn định, báo cáo hàng tuần đầy đủ.",        company: "Mai Linh" },
];

/* =========================================================
   SECTION HEADER (tối giản, không phụ thuộc css cũ)
   ========================================================= */
function SectionHeader({ title, subtitle, to = "", actionText = "Xem tất cả" }) {
  return (
    <div className="d-flex align-items-end justify-content-between mb-3">
      <div>
        <h4 className="mb-1 fw-bold">{title}</h4>
        {subtitle && <div className="text-secondary small">{subtitle}</div>}
      </div>
      {to ? (
        <Link className="btn btn-sm btn-outline-secondary rounded-pill" to={to}>
          {actionText}
        </Link>
      ) : null}
    </div>
  );
}

/* =========================================================
   HERO SEARCH (gradient inline — không cần class riêng)
   ========================================================= */
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
      <div
        className="card-soft p-4 p-lg-5"
        style={{
          color: "#fff",
          background:
            "radial-gradient(900px 360px at 12% -20%, #0c6cff33 0%, transparent 60%), linear-gradient(135deg, #0b5cab 0%, #0a4c90 70%)",
        }}
      >
        <span className="d-inline-block px-3 py-2 rounded-pill fw-bold" style={{ background: "#ffffff22" }}>
          DỊCH VỤ LÁI XE & VẬN CHUYỂN
        </span>

        <div className="row g-4 align-items-center mt-3">
          <div className="col-lg-7">
            <h1 className="fw-black" style={{ fontWeight: 900, lineHeight: 1.1 }}>
              Đặt chuyến nhanh – Giá rõ ràng, tài xế chuẩn
            </h1>
            <p className="mt-2 text-white-50">
              Taxi 4–16 chỗ, đưa đón sân bay, thuê xe theo giờ, vận chuyển hàng hoá/xe tải/van.
            </p>

            <div className="d-flex gap-2 mt-2">
              <div
                className="flex-grow-1 d-flex align-items-center rounded-pill px-3"
                style={{ border: "1px solid #ffffff44", background: "#ffffff1a", backdropFilter: "blur(4px)" }}
              >
                <i className="bi bi-search me-2" />
                <input
                  className="form-control border-0 bg-transparent text-white"
                  placeholder="Bạn cần dịch vụ gì? (VD: Đưa đón sân bay)"
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
              {[
                { k: "airport", label: "Sân bay" },
                { k: "hourly", label: "Theo giờ" },
                { k: "intercity", label: "Liên tỉnh" },
                { k: "cargo", label: "Hàng hoá" },
              ].map((c) => (
                <button
                  key={c.k}
                  className="btn btn-sm btn-light rounded-pill fw-semibold"
                  onClick={() => goCategory(c.k)}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="col-lg-5">
            <div
              style={{
                minHeight: 280,
                borderRadius: 16,
                background:
                  "url('https://images.unsplash.com/photo-1606666912724-38b9cf24bbf3?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
                boxShadow: "inset 0 0 0 9999px rgba(0,0,0,.08)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   BANNER CAROUSEL (đơn giản, một slide demo)
   ========================================================= */
function BannerCarousel() {
  return (
    <section className="container mb-4">
      <div className="card-soft overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-7 p-4 p-lg-5 d-flex flex-column justify-content-center">
            <span className="badge bg-warning text-dark rounded-pill px-3 py-2 fw-semibold">ỨNG TUYỂN</span>
            <h3 className="mt-3 fw-bold">Ứng tuyển dễ dàng – Nhanh chóng & tiện lợi</h3>
            <p className="text-secondary">
              Hàng ngàn công việc tài xế mới mỗi ngày, phù hợp với bạn.
            </p>
            <Link to="/drivers" className="btn btn-warning rounded-pill px-4 fw-semibold">
              Ứng tuyển ngay
            </Link>
          </div>
          <div
            className="col-lg-5"
            style={{
              minHeight: 300,
              background:
                "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CÁC CÔNG TY HÀNG ĐẦU
   ========================================================= */
function TopCompanies() {
  return (
    <section className="container mt-2">
      <SectionHeader
        title="Các công ty hàng đầu"
        subtitle="Đối tác tuyển dụng uy tín – cập nhật việc mới mỗi ngày"
        to="/listings"
      />
      <div className="row g-3">
        {COMPANIES.map((c, i) => (
          <div className="col-6 col-md-4 col-lg-2" key={i}>
            <div className="card-soft p-3 text-center h-100">
              <img src={c.logo} alt={c.name} className="mx-auto" style={{ height: 52, objectFit: "contain" }} />
              <div className="fw-semibold small mt-3">{c.name}</div>
              <div className="mt-2">
                <span className="badge bg-light text-dark rounded-pill">VIỆC MỚI</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   NGÀNH DỊCH VỤ TRỌNG ĐIỂM
   ========================================================= */
function CategoryTiles() {
  const navigate = useNavigate();
  const items = [
    { key: "airport",  icon: "bi-airplane",        label: "Đưa đón sân bay" },
    { key: "hourly",   icon: "bi-hourglass-split", label: "Thuê xe theo giờ" },
    { key: "intercity",icon: "bi-signpost-2",      label: "Liên tỉnh" },
    { key: "cargo",    icon: "bi-truck",           label: "Vận chuyển hàng hoá" },
    { key: "tour",     icon: "bi-map",             label: "Tour/City tour" },
    { key: "shuttle",  icon: "bi-people",          label: "Đưa đón nhân viên" },
  ];
  return (
    <section className="container mt-4">
      <SectionHeader
        title="Ngành dịch vụ trọng điểm"
        subtitle="Chọn nhanh theo nhu cầu di chuyển và vận chuyển phổ biến"
        to="/services"
      />
      <div className="row g-3">
        {items.map((c) => (
          <div className="col-6 col-md-4 col-lg-2" key={c.key}>
            <button
              className="w-100 text-start btn bg-white border rounded-3 p-3"
              onClick={() => navigate(`/services?category=${c.key}`)}
            >
              <div className="d-inline-grid place-items-center bg-light rounded-3 mb-2" style={{ width: 40, height: 40 }}>
                <i className={`bi ${c.icon}`} />
              </div>
              <div className="fw-semibold">{c.label}</div>
              <div className="small text-secondary mt-1">Xem dịch vụ</div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   DỊCH VỤ MỚI NHẤT (đúng spec ls-*)
   ========================================================= */
const BRAND_LOGO = {
  Vinasun: "https://upload.wikimedia.org/wikipedia/commons/3/3b/Vinasun_logo.svg",
  "Mai Linh": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Mai_Linh.svg",
  "Xanh SM": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Green_car_icon.svg",
  "G7 Taxi": "https://dummyimage.com/100x60/f0f3f7/222&text=G7",
};

const LATEST_MOCK = [
  { id: 1,  title: "Đón sân bay Tân Sơn Nhất → Q.1", brand: "Vinasun", price: "Từ 180K",   loc: "TP.HCM",  hot: true  },
  { id: 2,  title: "Thuê xe theo giờ – 7 chỗ",        brand: "Mai Linh", price: "Từ 250K/h", loc: "Hà Nội",  hot: true  },
  { id: 3,  title: "Chở hàng nhẹ nội thành",          brand: "G7 Taxi",  price: "Từ 120K",   loc: "Đà Nẵng", hot: true  },
  { id: 4,  title: "Liên tỉnh SG ↔ Vũng Tàu",         brand: "Xanh SM",  price: "Từ 950K",   loc: "HCM - VT",hot: true  },
  { id: 5,  title: "Đưa đón nhân viên (Q.7 ↔ Q.1)",    brand: "Vinasun",  price: "Theo tháng",loc: "TP.HCM",  hot: true  },
  { id: 6,  title: "Taxi 7 chỗ theo giờ (3h)",         brand: "Mai Linh", price: "Từ 600K",   loc: "Hà Nội",  hot: true  },
  // page 2 (demo)
  { id: 7,  title: "Đưa đón sân bay Nội Bài → Ba Đình", brand: "Mai Linh", price: "Từ 180K",  loc: "Hà Nội", hot: false },
  { id: 8,  title: "Chuyển trọ nhanh gọn (xe tải nhỏ)", brand: "G7 Taxi",  price: "Từ 200K",  loc: "TP.HCM", hot: false },
  { id: 9,  title: "Liên tỉnh Huế ↔ Đà Nẵng",          brand: "Xanh SM",  price: "Từ 700K",  loc: "Huế - ĐN",hot: false },
  { id:10,  title: "Đưa đón học sinh theo tháng",       brand: "Vinasun",  price: "Theo tháng",loc: "TP.HCM", hot: false },
  { id:11,  title: "Thuê xe 16 chỗ đi tour",            brand: "Vinasun",  price: "Liên hệ",  loc: "Nhiều nơi", hot:false},
  { id:12,  title: "Taxi 4 chỗ theo giờ (2h)",          brand: "Mai Linh", price: "Từ 300K",  loc: "Đà Nẵng", hot:false},
];

function LatestServices({ items = LATEST_MOCK }) {
  const pageSize = 6;
  const [page, setPage] = useState(0);

  const pages = useMemo(() => Math.ceil(items.length / pageSize), [items.length]);
  const slice = useMemo(
    () => items.slice(page * pageSize, page * pageSize + pageSize),
    [items, page]
  );

  const goPrev = () => setPage((p) => (p - 1 + pages) % pages);
  const goNext = () => setPage((p) => (p + 1) % pages);

  return (
    <section className="container mt-4">
      <div className="ls-panel">
        <div className="ls-header">
          <h3 className="ls-title">Dịch vụ mới nhất</h3>
          <Link to="/services" className="ls-link">XEM TẤT CẢ</Link>
        </div>

        <div className="ls-list">
          {slice.map((s) => (
            <article key={s.id} className="ls-item">
              <div className="ls-logo">
                <img src={BRAND_LOGO[s.brand] || "https://dummyimage.com/90x54/f3f6fb/222"} alt={s.brand} />
              </div>
              <div className="ls-body">
                <div className="d-flex align-items-center gap-2 flex-wrap">
                  <h6 className="ls-job text-truncate-2">{s.title}</h6>
                  {s.hot && (
                    <span className="ls-hot d-inline-flex align-items-center gap-1">
                      <i className="bi bi-fire" /> Hot
                    </span>
                  )}
                </div>
                <div className="text-secondary mt-1">{s.brand}</div>
                <div className="ls-price">{s.price}</div>
                <div className="ls-loc">
                  <i className="bi bi-geo-alt me-1" />
                  {s.loc}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="ls-footer">
          <button className="ls-btn" onClick={goPrev} aria-label="Trang trước">
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              className={`ls-dot ${i === page ? "is-active" : ""}`}
              onClick={() => setPage(i)}
              aria-label={`Chuyển đến trang ${i + 1}`}
            />
          ))}
          <button className="ls-btn" onClick={goNext} aria-label="Trang sau">
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   NHÀ TUYỂN DỤNG NỔI BẬT
   ========================================================= */
function RecruiterSpotlight() {
  return (
    <section className="container mt-4">
      <SectionHeader
        title="Nhà tuyển dụng nổi bật"
        subtitle="Các đối tác có chương trình ưu đãi/thuê chuyến hấp dẫn"
        to="/listings"
      />
      <div className="card-soft overflow-hidden">
        <div className="row g-0">
          <div className="col-lg-8 p-4 p-lg-5">
            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-semibold">
              ƯU ĐÃI DOANH NGHIỆP
            </span>
            <h3 className="fw-bold mt-3">Gói đưa đón nhân viên – Tiết kiệm đến 20%</h3>
            <p className="text-secondary">
              Lộ trình cố định, tài xế chuyên nghiệp, báo cáo minh bạch hàng tuần. Phù hợp công ty 50–500 nhân sự.
            </p>
            <Link to="/advertise" className="btn btn-primary rounded-pill px-4">Tư vấn gói</Link>
          </div>
          <div
            className="col-lg-4"
            style={{
              minHeight: 220,
              background:
                "url('https://images.unsplash.com/photo-1474564862106-1f23a9655d15?q=80&w=1600&auto=format&fit=crop') center/cover no-repeat",
            }}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   MẸO HAY & BẢN TIN
   ========================================================= */
function TipsNews() {
  return (
    <section className="container mt-4">
      <SectionHeader title="Mẹo hay & Bản tin" subtitle="Kinh nghiệm di chuyển, vận chuyển thông minh" to="/feedback" actionText="Xem thêm" />
      <div className="row g-3">
        {TIPS.map((t) => (
          <div className="col-12 col-md-4" key={t.id}>
            <div className="card-soft h-100 overflow-hidden">
              <div style={{ height: 120, backgroundImage: `url('${t.img}')`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div className="p-3">
                <div className="fw-semibold">{t.title}</div>
                <Link to="/feedback" className="btn btn-sm btn-outline-secondary rounded-pill mt-2">
                  Đọc tiếp
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* =========================================================
   TESTIMONIALS
   ========================================================= */
function Testimonials() {
  return (
    <section className="container mt-4">
      <SectionHeader title="Khách hàng nói gì?" subtitle="Trải nghiệm thật từ người dùng thực" />
      <div className="row g-3">
        {TESTIMONIALS.map((c) => (
          <div className="col-12 col-md-6" key={c.id}>
            <div className="card-soft h-100 p-3">
              <div className="mb-2" style={{ fontSize: 28, color: "#94a3b8", lineHeight: 0 }}>“</div>
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

/* =========================================================
   APP PROMO
   ========================================================= */
function AppPromo() {
  return (
    <section className="container my-4">
      <div className="card-soft d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3 p-3 p-lg-4">
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

/* =========================================================
   PAGE: HOME
   ========================================================= */
export default function Home() {
  return (
    <>
      <HeroSearch />
      <BannerCarousel />
      <TopCompanies />
      <CategoryTiles />
      <LatestServices />
      <RecruiterSpotlight />
      <TipsNews />
      <Testimonials />
      <AppPromo />
    </>
  );
}
