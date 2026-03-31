import { NavLink } from "react-router";
import {
  navbarClass,
  navContainerClass,
  navBrandClass,
  navLinksClass,
  navLinkClass,
  navLinkActiveClass,
  primaryBtn,
  secondaryBtn
} from "../styles/common";
import { useAuth } from "../store/authStore";

function Header() {
  const { isAuthenticated, currentUser, logout } = useAuth();
  const isAdmin = isAuthenticated && currentUser?.role === "ADMIN";

  // Hide entire header for admin — they have their own navbar
  if (isAdmin) return null;

  const getLinkStyle = ({ isActive }) =>
    isActive ? navLinkActiveClass : navLinkClass;

  const getDashboardPath = () => {
    if (!currentUser) return "/";
    if (currentUser.role === "AUTHOR") return "/author-dashboard";
    if (currentUser.role === "USER") return "/user-dashboard";
    return "/";
  };

  return (
    <header className={navbarClass}>
      <div className={navContainerClass}>
        {/* Brand */}
        <div className="flex items-center gap-3">
          <img
            width="32px"
            height="32px"
            className="rounded-lg object-cover"
            src="data:image/png;base64,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"
            alt="logo"
          />
          <span className={navBrandClass}>BlogApp</span>
        </div>

        {/* Nav Links */}
        <ul className={navLinksClass}>
          <li>
            <NavLink to="/" className={getLinkStyle}>Home</NavLink>
          </li>

          {!isAuthenticated ? (
            // Logged out: show Register + Login
            <>
              <li>
                <NavLink to="/register" className={getLinkStyle}>Register</NavLink>
              </li>
              <li>
                <NavLink to="/login" className={getLinkStyle}>Login</NavLink>
              </li>
            </>
          ) : (
            // Logged in: show Dashboard + Logout
            <>
              <li>
                <NavLink to={getDashboardPath()} className={getLinkStyle}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <button onClick={logout} className={secondaryBtn}>
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
}

export default Header;