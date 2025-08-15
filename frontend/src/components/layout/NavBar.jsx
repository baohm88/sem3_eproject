import { Link } from "react-router-dom";

export default function NavBar({ links = [] }) {
  return (
    <nav className="navBar">
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
