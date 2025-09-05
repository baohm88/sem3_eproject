// import { useEffect, useMemo, useRef, useState } from "react";
// import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//   Navbar,
//   Nav,
//   Container,
//   Button,
//   Form,
//   FormControl,
//   NavDropdown,
//   Image,
// } from "react-bootstrap";
// import { RiMenu2Line } from "react-icons/ri";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import SideBar from "./SideBar";
// import SubNav from "./SubNav";
// import {
//   PUBLIC_ROUTES,
//   buildNavLinks,
//   ROLE_ROUTES,
//   type Role,
//   type RouteItem,
// } from "../../routes/routes";

// type LinkItem = { to: string; label: string; end?: boolean };

// /** Chiều cao header thực tế để chèn spacer, đồng bộ với CSS */
// const NAVBAR_HEIGHT = 74;

// export default function MainLayout() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { profile, isAuthenticated, logout } = useAuth();

//   const [showSidebar, setShowSidebar] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   // đo chiều cao thực của SubNav (khi responsive thay đổi)
//   const subnavRef = useRef<HTMLDivElement | null>(null);
//   const [subnavHeight, setSubnavHeight] = useState(44);

//   useEffect(() => {
//     const measure = () => {
//       if (subnavRef.current) {
//         const h = subnavRef.current.getBoundingClientRect().height || 0;
//         setSubnavHeight(Math.round(h));
//       }
//     };
//     measure();
//     window.addEventListener("resize", measure);
//     return () => window.removeEventListener("resize", measure);
//   }, [location.pathname]);

//   const links: LinkItem[] = useMemo(
//     () =>
//       PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
//         to: r.path,
//         label: r.label!,
//         end: r.end,
//       })),
//     []
//   );

//   const role = (profile?.role as Role) ?? ("Rider" as Role);
//   const roleBase = ROLE_ROUTES[role]?.base ?? "/";
//   const showSubNav =
//     (location.pathname === roleBase ||
//       location.pathname.startsWith(roleBase + "/")) &&
//     ["Admin", "Company", "Driver"].includes(role);

//   const subLinks = useMemo(() => buildNavLinks(role), [role]);

//   const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
//     Admin: "/admin",
//     Company: "/company",
//     Driver: "/driver",
//     Rider: "/",
//     Guest: "/",
//     undefined: "/",
//   };
//   const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

//   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//     setSearchTerm(e.target.value);

//   const handleSearchKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === "Enter" && searchTerm.trim() !== "") navigate("/");
//   };

//   const toggleSidebar = () => setShowSidebar((prev) => !prev);

//   /** Giữ nguyên rule hạn chế truy cập trang Advertise cho non-company */
//   const onClickNav = (to: string, e?: React.MouseEvent) => {
//     if (to === "/advertise") {
//       if (!isAuthenticated) {
//         e?.preventDefault();
//         navigate("/login", { state: { from: location } });
//         return;
//       }
//       if (profile?.role !== "Company") {
//         e?.preventDefault();
//         toast.error("Only companies can access Advertise");
//         return;
//       }
//     }
//   };

//   return (
//     <>
//       {/* ===== Main Header (cố định) ===== */}
//       <header>
//         {/* đổi skin: nv-gradient + nv-shadow (đặt CSS trong App.css/index.css) */}
//         <Navbar className="nv-gradient nv-shadow" expand="md" fixed="top">
//           <Container className="header-container d-flex justify-content-between align-items-center">
//             {/* Left: menu icon (mobile) + logo + primary links */}
//             <div className="d-flex align-items-center gap-3">
//               <RiMenu2Line
//                 className="fs-3 d-md-none text-white"
//                 onClick={toggleSidebar}
//                 style={{ cursor: "pointer" }}
//                 aria-label="Mở menu"
//               />

//               <Navbar.Brand
//                 as={NavLink}
//                 to="/"
//                 className="d-none d-md-flex align-items-center nv-link"
//               >
//                 <img
//                   src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
//                   alt="Logo"
//                   height={40}
//                 />
//               </Navbar.Brand>

//               {/* Links dạng pill – giữ logic click Advertise */}
//               <nav className="d-none d-md-flex align-items-center gap-2">
//                 {links.map(({ to, label, end }) => (
//                   <NavLink
//                     key={to}
//                     to={to}
//                     end={end}
//                     onClick={(e) => onClickNav(to, e)}
//                     className={({ isActive }) =>
//                       `pill-btn nv-link ${isActive ? "active" : ""}`
//                     }
//                   >
//                     {label}
//                   </NavLink>
//                 ))}
//               </nav>
//             </div>

//             {/* Logo giữa cho mobile */}
//             <Navbar.Brand
//               as={NavLink}
//               to="/"
//               className="mx-auto d-md-none"
//             >
//               <img
//                 src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
//                 alt="Logo"
//                 height={28}
//               />
//             </Navbar.Brand>

//             {/* Search pill (desktop) */}
//             <Form
//               className="d-none d-md-flex w-50 mx-auto search-pill"
//               onKeyDown={handleSearchKeyDown}
//               role="search"
//             >
//               <i className="bi bi-search text-white px-2" />
//               <FormControl
//                 type="search"
//                 placeholder="Tìm dịch vụ (VD: Đưa đón sân bay)"
//                 className="me-2"
//                 value={searchTerm}
//                 onChange={handleSearchChange}
//                 aria-label="Tìm kiếm"
//               />
//             </Form>

//             {/* Right controls */}
//             {isAuthenticated ? (
//               <div className="d-flex align-items-center gap-2">
//                 {/* Nút tất cả danh mục (giống ảnh demo) */}
//                 <NavLink to="/services" className="d-none d-md-inline-flex pill-btn nv-link">
//                   <i className="bi bi-list" />
//                   <span>Tất cả danh mục</span>
//                 </NavLink>

//                 {/* Bell + Avatar */}
//                 <button className="icon-btn d-none d-md-grid" title="Thông báo" aria-label="Thông báo">
//                   <i className="bi bi-bell"></i>
//                 </button>

//                 <Nav>
//                   <NavDropdown
//                     align="end"
//                     show={showDropdown}
//                     onMouseEnter={() => setShowDropdown(true)}
//                     onMouseLeave={() => setShowDropdown(false)}
//                     onToggle={() => {}}
//                     title={
//                       <span className="icon-btn">
//                         <Image
//                           src={
//                             (profile as any)?.imgUrl ||
//                             "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
//                           }
//                           roundedCircle
//                           height={26}
//                           width={26}
//                         />
//                       </span>
//                     }
//                     id="user-dropdown"
//                   >
//                     <NavDropdown.Item disabled className="small text-muted">
//                       {(profile as any)?.email || "Account"}
//                     </NavDropdown.Item>
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item as={NavLink} to={dashboardTo} end>
//                       <i className="bi bi-clipboard-data-fill me-2" />
//                       Dashboard
//                     </NavDropdown.Item>
//                     <NavDropdown.Item
//                       as={NavLink}
//                       to={`/${(profile as any)?.role?.toLowerCase?.()}/profile`}
//                     >
//                       <i className="bi bi-person me-2" />
//                       Profile
//                     </NavDropdown.Item>
//                     <NavDropdown.Item as="button" onClick={logout}>
//                       <i className="bi bi-box-arrow-right me-2" />
//                       Logout
//                     </NavDropdown.Item>
//                   </NavDropdown>
//                 </Nav>
//               </div>
//             ) : (
//               <NavLink to="/login" className="pill-btn nv-link">
//                 <i className="bi bi-box-arrow-in-right" />
//                 <span>Đăng nhập</span>
//               </NavLink>
//             )}
//           </Container>
//         </Navbar>
//       </header>

//       {/* Spacer dưới header cố định để nội dung không bị che */}
//       <div style={{ height: NAVBAR_HEIGHT }} />

//       {/* ===== SubNav (sticky ngay dưới header) ===== */}
//       {showSubNav && (
//         <>
//           <div
//             ref={subnavRef}
//             className="sticky-top bg-white border-bottom"
//             style={{ top: NAVBAR_HEIGHT, zIndex: 1020 }}
//           >
//             <SubNav links={subLinks} role={role} />
//           </div>
//           {/* Spacer dưới SubNav để tránh đè nội dung khi ở top */}
//           <div style={{ height: subnavHeight }} />
//         </>
//       )}

//       {/* ===== Mobile Sidebar giữ nguyên hành vi ===== */}
//       <SideBar
//         show={showSidebar}
//         handleClose={() => setShowSidebar(false)}
//         links={links}
//       />

//       {/* ===== Nội dung trang ===== */}
//       <main className="container py-3">
//         <Outlet />
//       </main>
//     </>
//   );
// }
import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Image,
} from "react-bootstrap";
import { RiMenu2Line } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import SideBar from "./SideBar";
import SubNav from "./SubNav";
import {
  PUBLIC_ROUTES,
  buildNavLinks,
  ROLE_ROUTES,
  type Role,
  type RouteItem,
} from "../../routes/routes";

/** Chiều cao header thực tế để chèn spacer, đồng bộ với CSS */
const NAVBAR_HEIGHT = 74;

type LinkItem = { to: string; label: string; end?: boolean };

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, logout } = useAuth();

  // UI states
  const [showSidebar, setShowSidebar] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showCats, setShowCats] = useState(false); // dropdown "Tất cả danh mục"

  // đo chiều cao thực SubNav (khi responsive thay đổi)
  const subnavRef = useRef<HTMLDivElement | null>(null);
  const [subnavHeight, setSubnavHeight] = useState(44);

  useEffect(() => {
    const measure = () => {
      if (subnavRef.current) {
        const h = subnavRef.current.getBoundingClientRect().height || 0;
        setSubnavHeight(Math.round(h));
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [location.pathname]);

  // Link cho SideBar/mobile (desktop sẽ gom vào dropdown "Tất cả danh mục")
  const links: LinkItem[] = useMemo(
    () =>
      PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
        to: r.path,
        label: r.label!,
        end: r.end,
      })),
    []
  );

  // Logic hiển thị SubNav theo role
  const role = (profile?.role as Role) ?? ("Rider" as Role);
  const roleBase = ROLE_ROUTES[role]?.base ?? "/";
  const showSubNav =
    (location.pathname === roleBase ||
      location.pathname.startsWith(roleBase + "/")) &&
    ["Admin", "Company", "Driver"].includes(role);

  const subLinks = useMemo(() => buildNavLinks(role), [role]);

  // Dashboard route theo role
  const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
    Admin: "/admin",
    Company: "/company",
    Driver: "/driver",
    Rider: "/",
    Guest: "/",
    undefined: "/",
  };
  const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  /** Điều hướng đến trang Advertise theo auth/role:
   *  - Guest  -> /login (ghi nhớ from)
   *  - Non-Company -> /unauthorized
   *  - Company -> /advertise
   */
  const goAdvertise = () => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (profile?.role !== "Company") {
      navigate("/unauthorized");
      return;
    }
    navigate("/advertise");
  };

  return (
    <>
      {/* ===== Main Header (cố định) ===== */}
      <header>
        <Navbar className="nv-gradient nv-shadow" expand="md" fixed="top">
          <Container className="header-container d-flex justify-content-between align-items-center">

            {/* Left: menu icon (mobile) + logo */}
            <div className="d-flex align-items-center gap-3">
              <RiMenu2Line
                className="fs-3 d-md-none text-white"
                onClick={toggleSidebar}
                style={{ cursor: "pointer" }}
                aria-label="Mở menu"
              />

              <Navbar.Brand
                as={NavLink}
                to="/"
                className="d-none d-md-flex align-items-center nv-link"
              >
                <img
                  src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                  alt="Logo"
                  height={40}
                />
              </Navbar.Brand>
            </div>

            {/* Centered logo trên mobile */}
            <Navbar.Brand as={NavLink} to="/" className="mx-auto d-md-none">
              <img
                src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
                alt="Logo"
                height={28}
              />
            </Navbar.Brand>

            {/* Right controls (Categories + Bell + Avatar/Login) */}
            <div className="d-flex align-items-center gap-2">
              {/* === TẤT CẢ DANH MỤC (DROPDOWN) === */}
              <NavDropdown
                id="all-categories"
                align="end"
                className="d-none d-md-inline-block"
                show={showCats}
                onMouseEnter={() => setShowCats(true)}
                onMouseLeave={() => setShowCats(false)}
                onToggle={() => {}}
                title={
                  <span className="pill-btn nv-link">
                    <i className="bi bi-list" />
                    <span>Tất cả danh mục</span>
                  </span>
                }
              >
                <div className="px-1 py-1">
                  <Nav className="flex-column">
                    <NavDropdown.Item as={NavLink} to="/" className="cat-link">
                      <i className="bi bi-house me-2" />
                      Trang chủ
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/listings" className="cat-link">
                      <i className="bi bi-building me-2" />
                      Đối tác/Doanh nghiệp
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/drivers" className="cat-link">
                      <i className="bi bi-steering-wheel me-2" />
                      Tài xế
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/services" className="cat-link">
                      <i className="bi bi-taxi-front me-2" />
                      Tất cả dịch vụ
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/services?category=airport" className="cat-link">
                      <i className="bi bi-airplane me-2" />
                      Đưa đón sân bay
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/services?category=hourly" className="cat-link">
                      <i className="bi bi-hourglass-split me-2" />
                      Thuê xe theo giờ
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/services?category=cargo" className="cat-link">
                      <i className="bi bi-truck me-2" />
                      Vận chuyển hàng hoá
                    </NavDropdown.Item>

                    <NavDropdown.Item as={NavLink} to="/feedback" className="cat-link">
                      <i className="bi bi-chat-dots me-2" />
                      Feedback
                    </NavDropdown.Item>

                    {/* Nhà tuyển dụng → kiểm tra role trước khi điều hướng */}
                    <NavDropdown.Item as="button" className="cat-link" onClick={goAdvertise}>
                      <i className="bi bi-megaphone me-2" />
                      Nhà tuyển dụng
                    </NavDropdown.Item>
                  </Nav>
                </div>
              </NavDropdown>

              {/* Bell + Avatar / Login */}
              {isAuthenticated ? (
                <>
                  <button
                    className="icon-btn d-none d-md-grid"
                    title="Thông báo"
                    aria-label="Thông báo"
                  >
                    <i className="bi bi-bell"></i>
                  </button>

                  <Nav>
                    <NavDropdown
                      align="end"
                      show={showUserDropdown}
                      onMouseEnter={() => setShowUserDropdown(true)}
                      onMouseLeave={() => setShowUserDropdown(false)}
                      onToggle={() => {}}
                      title={
                        <span className="icon-btn">
                          <Image
                            src={
                              (profile as any)?.imgUrl ||
                              "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
                            }
                            roundedCircle
                            height={26}
                            width={26}
                          />
                        </span>
                      }
                      id="user-dropdown"
                    >
                      <NavDropdown.Item disabled className="small text-muted">
                        {(profile as any)?.email || "Account"}
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item as={NavLink} to={dashboardTo} end>
                        <i className="bi bi-clipboard-data-fill me-2" />
                        Dashboard
                      </NavDropdown.Item>
                      <NavDropdown.Item
                        as={NavLink}
                        to={`/${(profile as any)?.role?.toLowerCase?.()}/profile`}
                      >
                        <i className="bi bi-person me-2" />
                        Profile
                      </NavDropdown.Item>
                      <NavDropdown.Item as="button" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2" />
                        Logout
                      </NavDropdown.Item>
                    </NavDropdown>
                  </Nav>
                </>
              ) : (
                <NavLink to="/login" className="pill-btn nv-link">
                  <i className="bi bi-box-arrow-in-right" />
                  <span>Đăng nhập</span>
                </NavLink>
              )}
            </div>
          </Container>
        </Navbar>
      </header>

      {/* Spacer dưới header cố định để nội dung không bị che */}
      <div style={{ height: NAVBAR_HEIGHT }} />

      {/* ===== SubNav (sticky ngay dưới header) ===== */}
      {showSubNav && (
        <>
          <div
            ref={subnavRef}
            className="sticky-top bg-white border-bottom"
            style={{ top: NAVBAR_HEIGHT, zIndex: 1020 }}
          >
            <SubNav links={subLinks} role={role} />
          </div>
          {/* Spacer dưới SubNav để tránh đè nội dung khi ở top */}
          <div style={{ height: subnavHeight }} />
        </>
      )}

      {/* ===== Mobile Sidebar (dùng links public) ===== */}
      <SideBar
        show={showSidebar}
        handleClose={() => setShowSidebar(false)}
        links={links}
      />

      {/* ===== Nội dung trang ===== */}
      <main className="container py-3">
        <Outlet />
      </main>
    </>
  );
}
