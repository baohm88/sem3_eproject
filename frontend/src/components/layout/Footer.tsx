// src/components/layout/Footer.tsx
import { Container, Row, Col } from "react-bootstrap";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer mt-5">
      {/* Local styles for the footer */}
      <style>{`
        .site-footer{
          background:#0b1f3a; /* deep navy */
          color:#cbd5e1;
        }
        .site-footer .ft-wrap{ padding:48px 0 28px; }
        .site-footer .ft-bottom{ border-top:1px solid rgba(255,255,255,.06); padding:18px 0; }
        .ft-title{ color:#fff; font-weight:700; font-size:1rem; margin-bottom:.75rem; }
        .ft-link{ display:block; text-decoration:none; color:#cbd5e1; padding:.25rem 0; opacity:.9; }
        .ft-link:hover{ color:#fff; opacity:1; text-decoration:underline; }
        .ft-badges img{ height:40px; margin-right:12px; border-radius:8px; background:#000; }
        .ft-cert img{ height:48px; }
        .ft-social a{
          display:inline-flex; align-items:center; justify-content:center;
          width:36px; height:36px; border-radius:999px; background:rgba(255,255,255,.08);
          color:#fff; margin-right:10px;
        }
        .ft-social a:hover{ background:rgba(255,255,255,.18); }
        .ft-small{ font-size:.9rem; color:#9fb3c8; }
      `}</style>

      <div className="ft-wrap">
        <Container>
          <Row className="gy-4">
            {/* Column 1 */}
            <Col xs={12} md={6} lg={3}>
              <h6 className="ft-title">WebCabs</h6>
              <a className="ft-link" href="#">About WebCabs</a>
              <a className="ft-link" href="#">About WebCabs inTECH</a>
              <a className="ft-link" href="#">Contact</a>
              <a className="ft-link" href="#">FAQs</a>
              <a className="ft-link" href="#">Terms of Use</a>
              <a className="ft-link" href="#">Privacy Policy</a>
              <a className="ft-link" href="#">Marketplace Operating Regulations</a>
              <a className="ft-link" href="#">Site Map</a>
            </Col>

            {/* Column 2 */}
            <Col xs={12} md={6} lg={3}>
              <h6 className="ft-title">For Employers</h6>
              <a className="ft-link" href="#">Post a Job</a>
              <a className="ft-link" href="#">Search Drivers</a>
              <a className="ft-link" href="#">Pricing & Services</a>
              <a className="ft-link" href="#">Contact Sales</a>
            </Col>

            {/* Column 3 */}
            <Col xs={12} md={6} lg={3}>
              <h6 className="ft-title">Jobs by Location</h6>
              <a className="ft-link" href="#">Ho Chi Minh City</a>
              <a className="ft-link" href="#">Hanoi</a>
              <a className="ft-link" href="#">Hai Phong</a>
              <a className="ft-link" href="#">Da Nang</a>
              <a className="ft-link" href="#">Can Tho</a>
              <a className="ft-link" href="#">See all locations →</a>
            </Col>

            {/* Column 4 */}
            <Col xs={12} md={6} lg={3}>
              <h6 className="ft-title">Jobs by Vehicle Type</h6>
              <a className="ft-link" href="#">Car Driver (4–7 seats)</a>
              <a className="ft-link" href="#">Motorbike Courier</a>
              <a className="ft-link" href="#">Truck Driver</a>
              <a className="ft-link" href="#">Taxi</a>
              <a className="ft-link" href="#">Ride-hailing / Delivery</a>
              <a className="ft-link" href="#">See all categories →</a>
            </Col>
          </Row>

          <Row className="gy-4 mt-2 align-items-center">
            {/* Mobile apps */}
            <Col xs={12} lg={6}>
              <div className="d-flex align-items-center flex-wrap">
                <div className="me-3 ft-title mb-2">Mobile Apps</div>
                <div className="ft-badges mb-2">
                  <a href="#" aria-label="App Store">
                    <img
                      src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                      alt="Download on the App Store"
                    />
                  </a>
                  <a href="#" aria-label="Google Play">
                    <img
                      src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                      alt="Get it on Google Play"
                      style={{ height: 40, background: "transparent" }}
                    />
                  </a>
                </div>
              </div>
            </Col>

            {/* Certification + Social */}
            <Col xs={12} lg={6}>
              <div className="d-flex flex-wrap align-items-center justify-content-lg-end">
                <div className="me-4 mb-2 d-flex align-items-center ft-cert">
                  <span className="ft-small ms-2">Compliance Verified</span>
                </div>
                <div className="ft-social mb-2">
                  <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                  <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
                  <a href="#" aria-label="TikTok"><i className="bi bi-tiktok" /></a>
                  <a href="#" aria-label="YouTube"><i className="bi bi-youtube" /></a>
                  <a href="#" aria-label="Spotify"><i className="bi bi-spotify" /></a>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Bottom line */}
      <div className="ft-bottom">
        <Container>
          <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-2">
            <div className="ft-small">
              © {year} WebCabs. All rights reserved.
            </div>
            <div className="d-flex align-items-center gap-3">
              <span className="ft-small">WebCabs</span>
              <span className="ft-small">WebCabs inTECH</span>
              <span className="ft-small">Powered by WebCabs</span>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  );
}
