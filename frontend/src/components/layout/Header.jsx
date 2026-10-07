import { Link, NavLink } from "react-router";

function Header() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-gray-900"
        >
          Marketplace
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "font-medium text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              isActive
                ? "font-medium text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }
          >
            Explore
          </NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 sm:block"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;