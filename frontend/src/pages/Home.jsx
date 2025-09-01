import React from "react";

/** Light–orange (cam nhạt) theme just for this page */
const Theme = () => (
    <style>{`
    :root{
      --brand:#FFA94D;            /* cam nhạt */
      --brand-600:#FF922B;        /* hover */
      --brand-700:#F76707;        /* pressed */
      --bg-soft:#FFF3E6;          /* nền dịu */
      --ink:#1f2937;              /* chữ đậm */
    }
    .btn-brand{ background:var(--brand); border-color:var(--brand-600); color:#222; }
    .btn-brand:hover{ background:var(--brand-600); border-color:var(--brand-700); color:#111; }
    .badge-brand{ background:var(--brand); color:#222; }
    .section-title{ font-weight:800; color:var(--ink); }
    .muted{ color:#4b5563; }
    .chip{ background:var(--bg-soft); border:1px solid #ffd8a8; color:#7c4a03; }
    .card-soft{ border:0; border-radius:18px; box-shadow:0 10px 24px rgba(0,0,0,.06); }
    .card-soft:hover{ transform:translateY(-2px); box-shadow:0 14px 30px rgba(0,0,0,.1); }
    .company-logo{ height:52px; object-fit:contain; }
    .hero{
      background: linear-gradient(135deg, #0d1b31 0%, #1a2f52 60%) no-repeat;
      color:#fff; border-radius:24px; overflow:hidden;
    }
    .hero-visual{
      background:url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat;
      min-height:320px;
    }
  `}</style>
);

const companies = [
    { name: "AUTOMECH", logo: "https://dummyimage.com/160x80/ffffff/333333&text=AUTOMECH" },
    { name: "MINEBEA", logo: "https://dummyimage.com/160x80/ffffff/333333&text=MINEBEA" },
    { name: "BIDV", logo: "https://dummyimage.com/160x80/ffffff/333333&text=BIDV" },
    { name: "VNPT", logo: "https://dummyimage.com/160x80/ffffff/333333&text=VNPT" },
    { name: "VPBANK", logo: "https://dummyimage.com/160x80/ffffff/333333&text=VPBANK" },
    { name: "SEI", logo: "https://dummyimage.com/160x80/ffffff/333333&text=SEI" },
];

const taxiServices = [
    { brand: "VinaTaxi", title: "Đặt xe 4–7 chỗ", perks: ["Giá tốt giờ cao điểm", "Hỗ trợ doanh nghiệp"], img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop" },
    { brand: "Mai Linh", title: "Thuê xe theo giờ", perks: ["Tài xế nhiều kinh nghiệm", "Miễn phí chờ 10’"], img: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?q=80&w=1200&auto=format&fit=crop" },
    { brand: "Vinasun", title: "Đưa đón sân bay", perks: ["Đặt lịch trước", "Theo dõi chuyến đi"], img: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop" },
];

const driverJobs = [
    { company: "Mai Linh", role: "Driver 4 chỗ – Ca hành chính", location: "Q.1, TP.HCM", salary: "14–18tr", tags: ["Toàn thời gian", "BHYT/BHXH"] },
    { company: "Vinasun", role: "Driver 7 chỗ – Theo ca", location: "Hà Nội", salary: "15–20tr", tags: ["Theo ca", "Thưởng doanh thu"] },
    { company: "G7 Taxi", role: "Driver Airport Shuttle", location: "Đà Nẵng", salary: "12–16tr", tags: ["Full-time", "Phụ cấp nhiên liệu"] },
    { company: "Taxi Group", role: "Driver hợp tác kinh doanh", location: "Hải Phòng", salary: "Ưu đãi cao", tags: ["Hợp tác", "Chủ động thời gian"] },
];

function SectionHeader({ title, subtitle, actionText = "Xem tất cả", onAction }) {
    return (
        <div className="d-flex align-items-end justify-content-between mb-3">
            <div>
                <h4 className="section-title mb-1">{title}</h4>
                {subtitle && <div className="muted small">{subtitle}</div>}
            </div>
            <button className="btn btn-sm btn-outline-secondary rounded-pill" onClick={onAction}>
                {actionText}
            </button>
        </div>
    );
}

function Banner() {
    return (
        <section className="container mt-4">
            <div id="bannerCarousel" className="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
                <div className="carousel-inner rounded-4">
                    {/* Slide 1 */}
                    <div className="carousel-item active">
                        <div className="hero card-soft">
                            <div className="row g-0">
                                <div className="col-lg-7 p-4 p-lg-5">
                                    <span className="badge badge-brand rounded-pill px-3 py-2 fw-semibold">IVB CAREER</span>
                                    <h1 className="mt-3 fw-bold" style={{ lineHeight: 1.05 }}>
                                        Grow & Glow – Vững kết sự nghiệp, bền tầm phát triển
                                    </h1>
                                    <p className="mt-2 text-white-50">
                                        Tìm việc mơ ước, khám phá công ty phù hợp và ứng tuyển chỉ trong vài bước.
                                    </p>
                                    <div className="d-flex gap-2 mt-2">
                                        <button className="btn btn-brand rounded-pill px-4">Khám phá ngay</button>
                                        <button className="btn btn-outline-light rounded-pill px-4">Tìm hiểu thêm</button>
                                    </div>
                                    <div className="mt-4 d-flex gap-2 flex-wrap">
                                        <span className="badge chip rounded-pill">Developer</span>
                                        <span className="badge chip rounded-pill">Designer</span>
                                        <span className="badge chip rounded-pill">Data</span>
                                        <span className="badge chip rounded-pill">Marketing</span>
                                    </div>
                                </div>
                                <div className="col-lg-5 hero-visual" />
                            </div>
                        </div>
                    </div>
                    {/* Slide 2 */}
                    <div className="carousel-item">
                        <div className="hero card-soft">
                            <div className="row g-0">
                                <div className="col-lg-7 p-4 p-lg-5">
                                    <span className="badge badge-brand rounded-pill px-3 py-2 fw-semibold">ỨNG TUYỂN</span>
                                    <h1 className="mt-3 fw-bold" style={{ lineHeight: 1.05 }}>
                                        Ứng tuyển dễ dàng – Nhanh chóng & tiện lợi
                                    </h1>
                                    <p className="mt-2 text-white-50">
                                        Hàng ngàn công việc mới mỗi ngày, phù hợp với bạn.
                                    </p>
                                    <button className="btn btn-light rounded-pill px-4 mt-2">Ứng tuyển ngay</button>
                                </div>
                                <div
                                    className="col-lg-5 hero-visual"
                                    style={{
                                        background: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
                                        minHeight: "320px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* Slide 3 */}
                    <div className="carousel-item">
                        <div className="hero card-soft">
                            <div className="row g-0">
                                <div className="col-lg-7 p-4 p-lg-5">
                                    <span className="badge badge-brand rounded-pill px-3 py-2 fw-semibold">ĐỐI TÁC</span>
                                    <h1 className="mt-3 fw-bold" style={{ lineHeight: 1.05 }}>
                                        Đối tác uy tín – Cơ hội nghề nghiệp rộng mở
                                    </h1>
                                    <p className="mt-2 text-white-50">
                                        Hợp tác cùng những doanh nghiệp hàng đầu Việt Nam.
                                    </p>
                                    <button className="btn btn-brand rounded-pill px-4 mt-2">Khám phá thêm</button>
                                </div>
                                <div
                                    className="col-lg-5 hero-visual"
                                    style={{
                                        background: "url('https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
                                        minHeight: "320px",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Nút điều hướng */}
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


function TopCompanies() {
    return (
        <section className="container mt-5">
            <SectionHeader
                title="Các công ty hàng đầu"
                subtitle="Đối tác tuyển dụng uy tín – cập nhật việc mới mỗi ngày"
            />
            <div className="row g-3">
                {companies.map((c, i) => (
                    <div className="col-6 col-md-4 col-lg-2" key={i}>
                        <div className="card card-soft p-3 text-center h-100">
                            <img src={c.logo} alt={c.name} className="company-logo mx-auto" />
                            <div className="fw-semibold small mt-3">{c.name}</div>
                            <div className="mt-2">
                                <span className="badge rounded-pill chip">VIỆC MỚI</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FeaturedTaxiServices() {
    return (
        <section className="container mt-5">
            <SectionHeader
                title="Các dịch vụ nổi bật từ các hãng taxi"
                subtitle="Đặt xe nhanh, đúng nhu cầu – dành cho cá nhân & doanh nghiệp"
            />
            <div className="row g-3">
                {taxiServices.map((s, i) => (
                    <div className="col-12 col-md-6 col-lg-4" key={i}>
                        <div className="card card-soft h-100">
                            <div
                                style={{
                                    background: `url('${s.img}') center/cover no-repeat`,
                                    height: 160,
                                    borderTopLeftRadius: 18,
                                    borderTopRightRadius: 18,
                                }}
                            />
                            <div className="p-3">
                                <div className="d-flex align-items-center justify-content-between">
                                    <span className="badge badge-brand rounded-pill">{s.brand}</span>
                                </div>
                                <h6 className="mt-2 mb-1">{s.title}</h6>
                                <ul className="mb-3 small muted">
                                    {s.perks.map((p, idx) => (
                                        <li key={idx}>{p}</li>
                                    ))}
                                </ul>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-sm btn-brand rounded-pill">Đặt ngay</button>
                                    <button className="btn btn-sm btn-outline-secondary rounded-pill">Chi tiết</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function FeaturedDriverJobs() {
    return (
        <section className="container mt-5 mb-5">
            <SectionHeader
                title="Các công việc driver nổi bật từ các hãng taxi"
                subtitle="Lương – thưởng cạnh tranh, hỗ trợ đầy đủ"
            />
            <div className="row g-3">
                {driverJobs.map((j, i) => (
                    <div className="col-12 col-md-6 col-lg-3" key={i}>
                        <div className="card card-soft h-100">
                            <div className="card-body">
                                <span className="badge badge-brand rounded-pill">{j.company}</span>
                                <h6 className="mt-2 mb-1">{j.role}</h6>
                                <div className="small muted">Khu vực: {j.location}</div>
                                <div className="mt-2 fw-semibold">Thu nhập: {j.salary}</div>
                                <div className="mt-2 d-flex flex-wrap gap-2">
                                    {j.tags.map((t, idx) => (
                                        <span key={idx} className="badge chip rounded-pill">{t}</span>
                                    ))}
                                </div>
                                <div className="d-flex gap-2 mt-3">
                                    <button className="btn btn-sm btn-brand rounded-pill">Ứng tuyển</button>
                                    <button className="btn btn-sm btn-outline-secondary rounded-pill">Lưu tin</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

function HomePage() {
    return (
        <>
            <Theme />
            <Banner />
            <TopCompanies />
            <FeaturedTaxiServices />
            <FeaturedDriverJobs />
        </>
    );
}

export default HomePage;
