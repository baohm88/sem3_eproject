import { Link } from "react-router-dom";

export default function Sidebar({ links = [] }) {
  return (
    <nav className="sideBar">
      <ul>
        {links.map((link) => (
          <li key={link.path}>
            <Link to={link.path}>{link.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
