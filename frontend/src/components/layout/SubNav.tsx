// import { useEffect, useRef, useState } from "react";
// import { Nav, Container } from "react-bootstrap";
// import { NavLink } from "react-router-dom";
// import type { Role } from "../../constants/routes";
// // import {
// //   Navbar, Nav, , Button, Form, FormControl, NavDropdown, Image,
// // } from "react-bootstrap";

// type SubNavProps = {
//     links: { to: string; label: string; end?: boolean }[];
//     role: Role;
// };

// export default function SubNav({ links, role }: SubNavProps) {
//     const scrollRef = useRef<HTMLDivElement>(null);
//     const [atStart, setAtStart] = useState(true);
//     const [atEnd, setAtEnd] = useState(false);

//     const checkScroll = () => {
//         const el = scrollRef.current;
//         if (!el) return;
//         setAtStart(el.scrollLeft <= 0);
//         setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
//     };

//     useEffect(() => {
//         checkScroll();
//         const el = scrollRef.current;
//         if (!el) return;
//         el.addEventListener("scroll", checkScroll);
//         window.addEventListener("resize", checkScroll);
//         return () => {
//             el.removeEventListener("scroll", checkScroll);
//             window.removeEventListener("resize", checkScroll);
//         };
//     }, []);

//     if (!links?.length) return null;

//     return (
//         <Container className="subnav-wrapper bg-white border-bottom shadow-sm">
//             <div
//                 ref={scrollRef}
//                 className={`subnav-scroll ${atStart ? "at-start" : ""} ${
//                     atEnd ? "at-end" : ""
//                 }`}
//             >
//                 <Nav className="flex-nowrap subnav-tabs">
//                     {links.map((l) => (
//                         <Nav.Link
//                             key={l.to}
//                             as={NavLink}
//                             to={l.to}
//                             end={l.end}
//                             className="px-3 py-2"
//                         >
//                             {l.label}
//                         </Nav.Link>
//                     ))}
//                 </Nav>
//             </div>
//         </Container>
//     );
// }

import { useEffect, useRef, useState } from "react";
import { Nav, Container } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import type { Role } from "../../constants/routes";

type SubNavProps = {
    links: { to: string; label: string; end?: boolean }[];
    role: Role;
};

export default function SubNav({ links }: SubNavProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const checkScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        setAtStart(el.scrollLeft <= 0);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);
        return () => {
            el.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []);

    if (!links?.length) return null;

    return (
        <div className="border-bottom shadow-sm bg-white p-2">
            <Container>
                <div
                    ref={scrollRef}
                    className={`subnav-scroll position-relative ${
                        atStart ? "at-start" : ""
                    } ${atEnd ? "at-end" : ""}`}
                >
                    <Nav
                        variant="underline"
                        className="flex-nowrap subnav-tabs"
                        style={{ overflowX: "auto", whiteSpace: "nowrap" }}
                    >
                        {links.map((l) => (
                            <Nav.Link
                                key={l.to}
                                as={NavLink}
                                to={l.to}
                                end={l.end}
                                className={({ isActive }) =>
                                    `px-3 py-2 ${
                                        isActive ? "active fw-semibold" : ""
                                    }`
                                }
                            >
                                {l.label}
                            </Nav.Link>
                        ))}
                    </Nav>

                    {/* Scroll shadows */}
                    {!atStart && (
                        <div className="subnav-shadow-left position-absolute top-0 start-0 h-100" />
                    )}
                    {!atEnd && (
                        <div className="subnav-shadow-right position-absolute top-0 end-0 h-100" />
                    )}
                </div>
            </Container>
        </div>
    );
}
