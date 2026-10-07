import { Link, NavLink, useNavigate } from "react-router";

import { useAuthStore } from "../../store/authStore";

function Header() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  function handleLogout() {
    logout();

    navigate("/", {
      replace: true,
    });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-black tracking-tight text-black"
        >
          بازار
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            خانه
          </NavLink>

          <NavLink
            to="/explore"
            className={({ isActive }) =>
              `text-sm font-medium transition ${
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`
            }
          >
            کاوش
          </NavLink>
        </nav>

        {/* Authentication */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Profile */}
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-2 transition hover:bg-gray-200 sm:flex"
              >
                {/* Avatar */}
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                {/* Name */}
                <span className="max-w-[120px] truncate text-sm font-medium text-gray-800">
                  {user.name}
                </span>
              </Link>

              {/* Mobile Profile */}
              <Link
                to="/profile"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 sm:hidden"
                aria-label="پروفایل"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
              >
                ورود
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                ثبت‌نام
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;