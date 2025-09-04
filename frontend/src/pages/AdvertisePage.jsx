import React from "react";
import { Container, Row, Col, Card, Button, Badge } from "react-bootstrap";

function AdvertisePage() {
  return (
    <>
      {/* Page-scoped styles (không ảnh hưởng trang khác) */}
      <style>{`
        :root{
          --adv-blue-1:#063a9b;
          --adv-blue-2:#052f82;
          --adv-ink:#0f172a;
          --adv-muted:#64748b;
          --adv-ring:#2f5ce6;
          --adv-green:#10b981;
          --adv-orange:#ff922b;
        }
        .adv-hero{
          background: radial-gradient(1200px 500px at 10% -10%, #0e2aa9 0%, transparent 60%),
                      radial-gradient(800px 360px at 90% 10%, #0b49c1 0%, transparent 60%),
                      linear-gradient(90deg, var(--adv-blue-1), var(--adv-blue-2));
          color:#fff;
          border-radius:24px;
          overflow:hidden;
          min-height:340px;
          position:relative;
        }
        .adv-hero .slide{
          min-height:340px;
          display:flex; align-items:center;
        }
        .adv-hero h1{
          font-weight:800; letter-spacing:.2px; line-height:1.1;
        }
        .adv-hero .dots{
          position:absolute; bottom:14px; left:50%; transform:translateX(-50%);
          display:flex; gap:8px;
        }
        .adv-hero .dot{ width:8px; height:8px; border-radius:50%; background:#ffffff55; }
        .adv-hero .dot.active{ background:#fff; }

        .adv-section-title{
          font-weight:800; color:var(--adv-ink);
        }
        .adv-section-sub{ color:var(--adv-muted); }

        .adv-card{
          border:0; border-radius:18px;
          box-shadow:0 12px 28px rgba(2,6,23,.08);
        }
        .adv-bullets{
          list-style:none; padding:0; margin:0;
        }
        .adv-bullets li{
          display:flex; align-items:flex-start; gap:10px;
          margin-bottom:10px; color:#0f172a;
        }
        .adv-bullets i{ color:var(--adv-green); margin-top:3px; }

        .adv-price{ font-size:28px; font-weight:800; color:#16a34a; }
        .adv-old{ color:#9ca3af; text-decoration:line-through; margin-right:8px; }
        .adv-save{ color:#ef4444; font-weight:600; }

        .adv-cta{
          background:#f8fafc;
          border-radius:18px;
          padding:28px 20px;
        }
        .adv-cta h5{ margin:0; font-weight:700; }
        .adv-cta .btn{ border-radius:999px; }

        @media (max-width: 991.98px){
          .adv-hero{ border-radius:16px; }
          .adv-hero h1{ font-size:28px; }
        }
      `}</style>

      {/* HERO */}
      <section className="adv-hero mb-4">
        <Container className="h-100">
          <div className="row slide">
            <div className="col-lg-7 py-4">
              <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                Tuyển dụng thông minh
              </Badge>
              <h1 className="mt-3">
                AI Candidate Recommendation<br />Gợi ý đúng ứng viên – Chọn chuẩn xế chất!
              </h1>
              <p className="text-white-50 mb-0">
                Tối ưu tuyển tài xế & đối tác chỉ trong vài bước. Đăng tin nhanh, nhận hồ sơ liên tục.
              </p>
              <div className="mt-3 d-flex gap-2">
                <Button variant="light" className="rounded-pill px-4">
                  Bắt đầu ngay
                </Button>
                <Button variant="outline-light" className="rounded-pill px-4">
                  Tư vấn miễn phí
                </Button>
              </div>
            </div>
            <div className="col-lg-5 d-none d-lg-block">
              {/* ảnh minh hoạ */}
              <div
                style={{
                  background:
                    "url('https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
                  height: 260,
                  borderRadius: 16,
                  marginTop: 40,
                  border: "1px solid #ffffff33",
                }}
              />
            </div>
          </div>

          {/* dots giả lập */}
          <div className="dots">
            <span className="dot active" />
            <span className="dot" />
            <span className="dot" />
          </div>
        </Container>
      </section>

      {/* TITLE */}
      <section className="py-3">
        <Container className="text-center">
          <div className="mb-1">
            <i className="bi bi-chevron-double-down text-secondary"></i>
          </div>
          <h3 className="adv-section-title">DỊCH VỤ CỦA CHÚNG TÔI</h3>
          <p className="adv-section-sub mb-0">
            Chúng tôi cung cấp nhiều dịch vụ giúp nhà tuyển dụng kết nối với tài xế/đối tác nhanh hơn,
            dễ đo lường hiệu quả hơn.
          </p>
        </Container>
      </section>

      {/* BLOCK: Đăng Tuyển */}
      <section className="py-4">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <Card className="adv-card">
                <div
                  style={{
                    background:
                      "url('https://images.unsplash.com/photo-1600880291730-6c4fefc7b3a3?q=80&w=1400&auto=format&fit=crop') center/cover no-repeat",
                    height: 260,
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                  }}
                />
                <Card.Body>
                  <h5 className="mb-1">Đăng Tuyển</h5>
                  <div className="d-flex align-items-end gap-2">
                    <span className="adv-old">2,400,000 VND</span>
                    <span className="adv-price">2,160,000 VND</span>
                  </div>
                  <div className="adv-save mt-1">-10% khi mua online</div>

                  <ul className="adv-bullets mt-3">
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      Đảm bảo hiển thị 100% – tin của bạn luôn nổi bật
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      Đăng tuyển nhanh chóng và nhận hồ sơ ngay lập tức
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      Quản lý hồ sơ trực tuyến: lọc CV, gợi ý phù hợp, đánh giá
                    </li>
                    <li>
                      <i className="bi bi-check-circle-fill"></i>
                      Chỉ trả chi phí cho đúng mục tiêu tuyển dụng, không lãng phí
                    </li>
                  </ul>

                  <div className="mt-3">
                    <Button variant="warning" className="rounded-pill px-4">
                      Mua ngay
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="d-flex">
              <div className="ms-lg-3 my-auto">
                <h4 className="fw-bold">Tuyển dụng hiệu quả cho hãng taxi & logistics</h4>
                <p className="text-secondary mb-1">
                  • Tin đăng phủ toàn hệ thống, tiếp cận đúng tài xế đang tìm việc
                </p>
                <p className="text-secondary mb-1">
                  • Hỗ trợ thiết kế nội dung & hình ảnh chuyên nghiệp
                </p>
                <p className="text-secondary mb-3">
                  • Báo cáo hiệu quả theo thời gian thực
                </p>

                <div className="d-flex gap-2">
                  <Badge bg="success">Bảo hành hiển thị</Badge>
                  <Badge bg="info">Nhận CV nhanh</Badge>
                  <Badge bg="secondary">Tối ưu ngân sách</Badge>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA cuối trang */}
      <section className="py-4">
        <Container>
          <div className="adv-cta d-flex flex-column flex-lg-row align-items-center justify-content-between gap-3">
            <div>
              <h5>Đăng tuyển ngay hôm nay?</h5>
              <div className="text-secondary">Bắt đầu ngay trong vài phút</div>
            </div>
            <Button variant="primary" className="rounded-pill px-4" href="/company/jobs/new">
              Đăng Tuyển
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}

export default AdvertisePage;
