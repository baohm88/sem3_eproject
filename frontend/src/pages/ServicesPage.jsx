// src/pages/ServicesPage.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

// Dữ liệu fix cứng giống Home.jsx
const taxiServices = [
  {
    brand: "VinaTaxi",
    title: "Đặt xe 4–7 chỗ",
    perks: ["Giá tốt giờ cao điểm", "Hỗ trợ doanh nghiệp"],
    img: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    brand: "Mai Linh",
    title: "Thuê xe theo giờ",
    perks: ["Tài xế nhiều kinh nghiệm", "Miễn phí chờ 10’"],
    img: "https://images.unsplash.com/photo-1520341280432-4749d4d7bcf9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    brand: "Vinasun",
    title: "Đưa đón sân bay",
    perks: ["Đặt lịch trước", "Theo dõi chuyến đi"],
    img: "https://images.unsplash.com/photo-1493238792000-8113da705763?q=80&w=1200&auto=format&fit=crop",
  },
];

function ServiceDetail({ service }) {
  return (
    <div className="card card-soft">
      <div
        style={{
          background: `url('${service.img}') center/cover no-repeat`,
          height: 280,
          borderTopLeftRadius: 18,
          borderTopRightRadius: 18,
        }}
      />
      <div className="p-4">
        <span className="badge badge-brand rounded-pill">{service.brand}</span>
        <h2 className="mt-3">{service.title}</h2>
        <ul className="mt-3">
          {service.perks.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
        <div className="mt-4 d-flex gap-2">
          <button className="btn btn-brand rounded-pill px-4">Đặt ngay</button>
          <button className="btn btn-outline-secondary rounded-pill px-4">Lưu dịch vụ</button>
        </div>
      </div>
    </div>
  );
}

function ServiceList() {
  return (
    <>
      <h1 className="mb-3">Dịch vụ</h1>
      <div className="row g-3">
        {taxiServices.map((s, i) => (
          <div key={i} className="col-12 col-md-6 col-lg-4">
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
                <span className="badge badge-brand rounded-pill">{s.brand}</span>
                <h6 className="mt-2 mb-1">{s.title}</h6>
                <ul className="mb-3 small muted">
                  {s.perks.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-brand rounded-pill">Đặt ngay</button>
                  <Link
                    to={`/services/${i}`}
                    className="btn btn-sm btn-outline-secondary rounded-pill"
                  >
                    Chi tiết
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function ServicesPage() {
  const { id } = useParams(); // undefined nếu path là /services

  // Nếu có :id → hiển thị chi tiết, ngược lại render danh sách
  if (typeof id !== "undefined") {
    const index = Number(id);
    const service = Number.isInteger(index) ? taxiServices[index] : undefined;

    if (!service) {
      return (
        <div className="container mt-4">
          <Link to="/services" className="btn btn-outline-secondary mb-3">
            ← Quay lại danh sách
          </Link>
          <div className="alert alert-warning">Không tìm thấy dịch vụ.</div>
        </div>
      );
    }

    return (
      <div className="container mt-4">
        <Link to="/" className="btn btn-outline-secondary mb-3">← Trang chủ</Link>
        <ServiceDetail service={service} />
      </div>
    );
  }

  // /services (không có :id)
  return (
    <div className="container mt-4">
      <ServiceList />
    </div>
  );
}
