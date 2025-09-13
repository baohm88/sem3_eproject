import React from "react";
import { NavLink } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="site-footer mt-5 pt-5">
      <div className="container-xxl">
        <div className="row g-4">
          <div className="col-12 col-md-3">
            <h6 className="footer-title">VietnamWorks</h6>
            <ul className="footer-links">
              <li><NavLink to="/">Về VietnamWorks</NavLink></li>
              <li><NavLink to="/">Về VietnamWorks inTECH</NavLink></li>
              <li><NavLink to="/">Liên hệ</NavLink></li>
              <li><NavLink to="/">Hỏi đáp</NavLink></li>
              <li><NavLink to="/">Quy định bảo mật</NavLink></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="footer-title">Dành cho Nhà tuyển dụng</h6>
            <ul className="footer-links">
              <li><NavLink to="/advertise">Đăng tuyển dụng</NavLink></li>
              <li><NavLink to="/">Tìm kiếm hồ sơ</NavLink></li>
              <li><NavLink to="/">Sản phẩm dịch vụ khác</NavLink></li>
              <li><NavLink to="/">Liên hệ</NavLink></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="footer-title">Việc làm theo khu vực</h6>
            <ul className="footer-links">
              <li><NavLink to="/">Hồ Chí Minh</NavLink></li>
              <li><NavLink to="/">Hà Nội</NavLink></li>
              <li><NavLink to="/">Đà Nẵng</NavLink></li>
              <li><NavLink to="/">Cần Thơ</NavLink></li>
              <li><NavLink to="/">Xem tất cả khu vực</NavLink></li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h6 className="footer-title">Ứng dụng di động</h6>
            <div className="d-flex gap-2 mb-3">
              <img
                alt="App Store"
                className="store-badge"
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              />
              <img
                alt="Google Play"
                className="store-badge"
                src="https://upload.wikimedia.org/wikipedia/commons/c/cd/Get_it_on_Google_play.svg"
              />
            </div>
            <h6 className="footer-title mt-3">Theo dõi chúng tôi</h6>
            <div className="d-flex gap-2">
              <a className="social-round" href="#" aria-label="facebook">
                <i className="bi bi-facebook" />
              </a>
              <a className="social-round" href="#" aria-label="youtube">
                <i className="bi bi-youtube" />
              </a>
              <a className="social-round" href="#" aria-label="tiktok">
                <i className="bi bi-tiktok" />
              </a>
              <a className="social-round" href="#" aria-label="linkedin">
                <i className="bi bi-linkedin" />
              </a>
            </div>
          </div>
        </div>

        <hr className="my-4 border-primary-subtle" />

        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 pb-4 small text-white-50">
          <div>© {new Date().getFullYear()} VietnamWorks clone UI (demo).</div>
          <div className="d-flex align-items-center gap-3">
            <img
              alt="inTECH"
              height={20}
              src="https://static.topcv.vn/v4/image/vw-intech-logo-white.svg"
            />
            <span>Powered by Navigos Group</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
