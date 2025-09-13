// import { useEffect, useMemo, useRef, useState } from "react";
// import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
// import {
//     Navbar,
//     Nav,
//     Container,
//     Button,
//     Form,
//     FormControl,
//     NavDropdown,
//     Image,
// } from "react-bootstrap";
// import { RiMenu2Line } from "react-icons/ri";
// import { toast } from "react-toastify";
// import { useAuth } from "../../context/AuthContext";
// import SideBar from "./SideBar";
// import SubNav from "./SubNav";
// import {
//     PUBLIC_ROUTES,
//     buildNavLinks,
//     ROLE_ROUTES,
//     type Role,
//     type RouteItem,
// } from "../../routes/routes";

// type LinkItem = { to: string; label: string; end?: boolean };

// const NAVBAR_HEIGHT = 80;

// export default function MainLayout() {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { profile, isAuthenticated, logout } = useAuth();
//     const [showSidebar, setShowSidebar] = useState(false);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showDropdown, setShowDropdown] = useState(false);

//     // đo chiều cao thực của SubNav (phòng khi responsive thay đổi)
//     const subnavRef = useRef<HTMLDivElement | null>(null);
//     const [subnavHeight, setSubnavHeight] = useState(44); // default ước lượng

//     useEffect(() => {
//         const measure = () => {
//             if (subnavRef.current) {
//                 const h = subnavRef.current.getBoundingClientRect().height || 0;
//                 setSubnavHeight(Math.round(h));
//             }
//         };
//         measure();
//         window.addEventListener("resize", measure);
//         return () => window.removeEventListener("resize", measure);
//     }, [location.pathname]); // đo lại khi đổi route (SubNav có thể khác)

//     const links: LinkItem[] = useMemo(
//         () =>
//             PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
//                 to: r.path,
//                 label: r.label!,
//                 end: r.end,
//             })),
//         []
//     );

//     const role = (profile?.role as Role) ?? ("Rider" as Role);
//     const roleBase = ROLE_ROUTES[role]?.base ?? "/";
//     const showSubNav =
//         (location.pathname === roleBase ||
//             location.pathname.startsWith(roleBase + "/")) &&
//         ["Admin", "Company", "Driver"].includes(role);

//     const subLinks = useMemo(() => buildNavLinks(role), [role]);

//     const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
//         Admin: "/admin",
//         Company: "/company",
//         Driver: "/driver",
//         Rider: "/",
//         Guest: "/",
//         undefined: "/",
//     };
//     const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

//     const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
//         setSearchTerm(e.target.value);
//     const handleKeyPress = (e: React.KeyboardEvent) => {
//         if (e.key === "Enter" && searchTerm.trim() !== "") navigate("/");
//     };
//     const toggleSidebar = () => setShowSidebar((prev) => !prev);

//     const onClickNav = (to: string, e?: React.MouseEvent) => {
//         if (to === "/advertise") {
//             if (!isAuthenticated) {
//                 e?.preventDefault();
//                 navigate("/login", { state: { from: location } });
//                 return;
//             }
//             if (profile?.role !== "Company") {
//                 e?.preventDefault();
//                 toast.error("Only companies can access Advertise");
//                 return;
//             }
//         }
//     };

//     return (
//         <>
//             {/* MAIN NAV - fixed top */}
//             <header>
//                 <Navbar
//                     bg="light"
//                     className="shadow-sm"
//                     expand="md"
//                     fixed="top" // <-- fixed
//                 >
//                     <Container className="d-flex justify-content-between align-items-center">
//                         <div className="d-flex align-items-center gap-3">
//                             <RiMenu2Line
//                                 className="fs-3 d-md-none text-danger"
//                                 onClick={toggleSidebar}
//                                 style={{ cursor: "pointer" }}
//                             />
//                             <Navbar.Brand
//                                 as={NavLink}
//                                 to="/"
//                                 className="d-none d-md-block"
//                             >
//                                 <img
//                                     src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
//                                     alt="AutoBid"
//                                     height={50}
//                                 />
//                             </Navbar.Brand>
//                             <div className="d-none d-md-flex">
//                                 {links.map(({ to, label, end }) => (
//                                     <NavLink
//                                         key={to}
//                                         to={to}
//                                         end={end}
//                                         onClick={(e) => onClickNav(to, e)}
//                                         className={({ isActive }) =>
//                                             `nav-link d-flex align-items-center m-2 ${
//                                                 isActive
//                                                     ? "text-primary fw-bold"
//                                                     : "text-muted"
//                                             }`
//                                         }
//                                     >
//                                         {label}
//                                     </NavLink>
//                                 ))}
//                             </div>
//                         </div>

//                         <Navbar.Brand
//                             as={NavLink}
//                             to="/"
//                             className="mx-auto d-md-none"
//                         >
//                             <img
//                                 src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
//                                 alt="AutoBid"
//                                 height={30}
//                             />
//                         </Navbar.Brand>

//                         <Form
//                             className="d-none d-md-flex w-50 mx-auto"
//                             onKeyPress={handleKeyPress}
//                         >
//                             <FormControl
//                                 type="search"
//                                 placeholder="Search taxi companies (ex. Xanh SM)"
//                                 className="me-2"
//                                 value={searchTerm}
//                                 onChange={handleSearchChange}
//                             />
//                         </Form>

//                         {isAuthenticated ? (
//                             <div className="d-none d-md-flex align-items-center gap-3">
//                                 <i className="bi bi-bell-fill fs-5 text-muted" />
//                                 <Nav>
//                                     <NavDropdown
//                                         align="end"
//                                         show={showDropdown} // 👈 control show/hide
//                                         onMouseEnter={() =>
//                                             setShowDropdown(true)
//                                         } // hover in
//                                         onMouseLeave={() =>
//                                             setShowDropdown(false)
//                                         } // hover out
//                                         onToggle={() => {}}
//                                         title={
//                                             <Image
//                                                 src={
//                                                     (profile as any)?.imgUrl ||
//                                                     "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
//                                                 }
//                                                 roundedCircle
//                                                 height={30}
//                                                 width={30}
//                                             />
//                                         }
//                                         id="user-dropdown"
//                                     >
//                                         <NavDropdown.Item
//                                             disabled
//                                             className="small text-muted"
//                                         >
//                                             {(profile as any)?.email ||
//                                                 "Account"}
//                                         </NavDropdown.Item>
//                                         <NavDropdown.Divider />
//                                         <NavDropdown.Item
//                                             as={NavLink}
//                                             to={dashboardTo}
//                                             end
//                                         >
//                                             <i className="bi bi-clipboard-data-fill me-2" />
//                                             Dashboard
//                                         </NavDropdown.Item>
//                                         <NavDropdown.Item
//                                             as={NavLink}
//                                             to={`/${(
//                                                 profile as any
//                                             )?.role?.toLowerCase?.()}/profile`}
//                                         >
//                                             <i className="bi bi-heart-fill me-2 text-danger" />
//                                             Profile
//                                         </NavDropdown.Item>
//                                         <NavDropdown.Item
//                                             as="button"
//                                             onClick={logout}
//                                         >
//                                             <i className="bi bi-box-arrow-right me-2" />
//                                             Logout
//                                         </NavDropdown.Item>
//                                     </NavDropdown>
//                                 </Nav>
//                             </div>
//                         ) : (
//                             <Button
//                                 variant="success"
//                                 size="sm"
//                                 as={NavLink}
//                                 to="/login"
//                             >
//                                 <i className="bi bi-box-arrow-left me-2"></i>
//                                 Login
//                             </Button>
//                         )}
//                     </Container>
//                 </Navbar>
//             </header>

//             {/* Spacer dưới Navbar: ngăn che nội dung */}
//             <div style={{ height: NAVBAR_HEIGHT }} />

//             {/* SUB NAV - sticky ngay dưới MainNav */}
//             {showSubNav && (
//                 <>
//                     <div
//                         ref={subnavRef}
//                         className="sticky-top bg-white border-bottom"
//                         style={{ top: NAVBAR_HEIGHT, zIndex: 1020 }}
//                     >
//                         <SubNav links={subLinks} role={role} />
//                     </div>

//                     {/* Spacer dưới SubNav: để Outlet không bị che khi ở top.
//               Khi cuộn, SubNav sẽ overlay nội dung (đúng mong muốn). */}
//                     <div style={{ height: subnavHeight }} />
//                 </>
//             )}

//             {/* SideBar for mobile */}
//             <SideBar
//                 show={showSidebar}
//                 handleClose={() => setShowSidebar(false)}
//                 links={links}
//             />

//             {/* Content */}
//             <main className="container py-3">
//                 <Outlet />
//             </main>
//         </>
//     );
// }



import { useEffect, useMemo, useRef, useState } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
    Navbar,
    Nav,
    Container,
    Button,
    Form,
    FormControl,
    NavDropdown,
    Image,
} from "react-bootstrap";
import { RiMenu2Line } from "react-icons/ri";
import { toast } from "react-toastify";
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

type LinkItem = { to: string; label: string; end?: boolean };

const NAVBAR_HEIGHT = 80;

export default function MainLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const { profile, isAuthenticated, logout } = useAuth();
    const [showSidebar, setShowSidebar] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);

    // đo chiều cao thực của SubNav (phòng khi responsive thay đổi)
    const subnavRef = useRef<HTMLDivElement | null>(null);
    const [subnavHeight, setSubnavHeight] = useState(44); // default ước lượng

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
    }, [location.pathname]); // đo lại khi đổi route (SubNav có thể khác)

    const links: LinkItem[] = useMemo(
        () =>
            PUBLIC_ROUTES.filter((r) => !!r.label).map((r: RouteItem) => ({
                to: r.path,
                label: r.label!,
                end: r.end,
            })),
        []
    );

    const role = (profile?.role as Role) ?? ("Rider" as Role);
    const roleBase = ROLE_ROUTES[role]?.base ?? "/";
    const showSubNav =
        (location.pathname === roleBase ||
            location.pathname.startsWith(roleBase + "/")) &&
        ["Admin", "Company", "Driver"].includes(role);

    const subLinks = useMemo(() => buildNavLinks(role), [role]);

    const DASH_BY_ROLE: Record<Role | "Guest" | undefined, string> = {
        Admin: "/admin",
        Company: "/company",
        Driver: "/driver",
        Rider: "/",
        Guest: "/",
        undefined: "/",
    };
    const dashboardTo = DASH_BY_ROLE[(profile?.role as Role) ?? "Guest"];

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setSearchTerm(e.target.value);
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && searchTerm.trim() !== "") navigate("/");
    };
    const toggleSidebar = () => setShowSidebar((prev) => !prev);

    const onClickNav = (to: string, e?: React.MouseEvent) => {
        if (to === "/advertise") {
            if (!isAuthenticated) {
                e?.preventDefault();
                navigate("/login", { state: { from: location } });
                return;
            }
            if (profile?.role !== "Company") {
                e?.preventDefault();
                toast.error("Only companies can access Advertise");
                return;
            }
        }
    };

    return (
        <>
            {/* MAIN NAV - fixed top */}
            <header>
                <Navbar
                    bg="light"
                    className="shadow-sm"
                    expand="md"
                    fixed="top" // <-- fixed
                >
<Container className="d-flex justify-content-between align-items-center">
  {/* Trái: burger + logo */}
  <div className="d-flex align-items-center gap-3">
    <RiMenu2Line
      className="fs-3 d-md-none text-danger"
      onClick={toggleSidebar}
      style={{ cursor: "pointer" }}
    />
    <Navbar.Brand as={NavLink} to="/" className="d-none d-md-block">
      <img
        src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
        alt="AutoBid"
        height={50}
      />
    </Navbar.Brand>
  </div>

  {/* Logo center mobile */}
  <Navbar.Brand as={NavLink} to="/" className="mx-auto d-md-none">
    <img
      src="https://cdn.xanhsm.com/2023/08/1d8dda9d-xe-premium-06-2025-2048x1365.png"
      alt="AutoBid"
      height={30}
    />
  </Navbar.Brand>

  {/* Phải: Tất cả việc làm + Search (2 cột bằng nhau) + account/login */}
  <div className="d-none d-md-flex align-items-center gap-3 ms-auto">
    {/* ✅ Hai control bằng nhau về chiều ngang */}
    <div className="right-tools d-flex align-items-center gap-2">
      {/* Cột 1: Dropdown Tất cả việc làm */}
      <div className="control">
        <Nav className="w-100">
          <NavDropdown
            align="start"
            id="nav-all-jobs-dropdown"
            title={<span className="px-3">Tất cả việc làm</span>}
            renderMenuOnMount
            className="w-100"
          >
            {links.map(({ to, label, end }) => (
              <NavDropdown.Item
                as={NavLink}
                key={to}
                to={to}
                end={end}
                onClick={(e) => onClickNav(to, e)}
                className="d-flex align-items-center"
              >
                {label}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Nav>
      </div>

      {/* Cột 2: Search box (ngắn gọn) */}
      <div className="control">
        <Form className="search-box d-flex" onSubmit={(e) => {
          e.preventDefault();
          if (searchTerm.trim()) navigate("/");
        }}>
          <FormControl
            type="search"
            placeholder="Search taxi companies…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form>
      </div>
    </div>

    {/* Chuông + tài khoản (giữ nguyên) */}
    {isAuthenticated ? (
      <>
        <i className="bi bi-bell-fill fs-5 text-muted" />
        <Nav>
          <NavDropdown
            align="end"
            show={showDropdown}
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            onToggle={() => {}}
            title={
              <Image
                src={
                  (profile as any)?.imgUrl ||
                  "https://png.pngtree.com/png-clipart/20240705/original/pngtree-web-programmer-avatar-png-image_15495270.png"
                }
                roundedCircle
                height={30}
                width={30}
              />
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
              <i className="bi bi-heart-fill me-2 text-danger" />
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
      <Button variant="success" size="sm" as={NavLink} to="/login">
        <i className="bi bi-box-arrow-left me-2"></i>
        Login
      </Button>
    )}
  </div>
</Container>

                </Navbar>
            </header>

            {/* Spacer dưới Navbar: ngăn che nội dung */}
            <div style={{ height: NAVBAR_HEIGHT }} />

            {/* SUB NAV - sticky ngay dưới MainNav */}
            {showSubNav && (
                <>
                    <div
                        ref={subnavRef}
                        className="sticky-top bg-white border-bottom"
                        style={{ top: NAVBAR_HEIGHT, zIndex: 1020 }}
                    >
                        <SubNav links={subLinks} role={role} />
                    </div>

                    {/* Spacer dưới SubNav */}
                    <div style={{ height: subnavHeight }} />
                </>
            )}

            {/* SideBar for mobile */}
            <SideBar
                show={showSidebar}
                handleClose={() => setShowSidebar(false)}
                links={links}
            />

            {/* Content */}
            <main className="container py-3">
                <Outlet />
            </main>
        </>
    );
}
