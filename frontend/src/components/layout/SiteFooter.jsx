import React from "react";

export default function SiteFooter() {
  return (
    <footer className="site-footer mt-5 edge-to-edge">
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-md-3">
            <div className="footer-title">VietnamWorks</div>
            <ul className="footer-links">
              <li><a href="#">Về VietnamWorks</a></li>
              <li><a href="#">VietnamWorks inTECH</a></li>
              <li><a href="#">Liên hệ</a></li>
              <li><a href="#">Hỏi đáp</a></li>
              <li><a href="#">Thoả Thuận Sử Dụng</a></li>
              <li><a href="#">Quy Định Bảo Mật</a></li>
              <li><a href="#">Sơ Đồ Trang Web</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <div className="footer-title">Dành cho Nhà tuyển dụng</div>
            <ul className="footer-links">
              <li><a href="#">Đăng tuyển dụng</a></li>
              <li><a href="#">Tìm kiếm hồ sơ</a></li>
              <li><a href="#">Sản phẩm Dịch vụ khác</a></li>
              <li><a href="#">Liên hệ</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <div className="footer-title">Việc làm theo khu vực</div>
            <ul className="footer-links">
              <li><a href="#">Hồ Chí Minh</a></li>
              <li><a href="#">Hà Nội</a></li>
              <li><a href="#">Đà Nẵng</a></li>
              <li><a href="#">Cần Thơ</a></li>
              <li><a href="#">Xem tất cả khu vực</a></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <div className="footer-title">Ứng dụng di động</div>
            <div className="d-flex gap-2 mb-3">
              <img className="store-badge" alt="App Store" src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"/>
              <img className="store-badge" alt="Google Play" src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"/>
            </div>
            <div className="footer-title">Theo dõi chúng tôi</div>
            <div className="d-flex gap-2">
              <a className="social-round" href="#"><i className="bi bi-facebook"></i></a>
              <a className="social-round" href="#"><i className="bi bi-youtube"></i></a>
              <a className="social-round" href="#"><i className="bi bi-linkedin"></i></a>
              <a className="social-round" href="#"><i className="bi bi-tiktok"></i></a>
            </div>
          </div>
        </div>

        <hr className="border-light opacity-25 my-4" />

        <div className="small text-light">
          © {new Date().getFullYear()} VietnamWorks. Powered by Group3.
        </div>
      </div>
    </footer>
  );
}
