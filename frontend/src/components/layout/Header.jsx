import { Link, NavLink, useNavigate } from "react-router";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";

function Header() {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const cartItems = useCartStore((state) => state.items);

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[73px] max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* Logo */}
        <Link
          to="/"
          className="shrink-0 text-2xl font-black tracking-tight text-black"
        >
          بازار
        </Link>

        {/* Desktop Navigation */}
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

        {/* Right Section */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="سبد خرید"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-gray-700 transition hover:bg-gray-100 hover:text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4"
              />

              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 13 5.4 5M7 13l-2 2a1 1 0 0 0 .7 1.7H17"
              />

              <circle cx="9" cy="19" r="1" />
              <circle cx="17" cy="19" r="1" />
            </svg>

            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] font-bold text-white">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <>
              {/* Desktop Profile */}
              <Link
                to="/profile"
                className="hidden items-center gap-2 rounded-full bg-gray-100 px-3 py-2 transition hover:bg-gray-200 sm:flex"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span className="max-w-[120px] truncate text-sm font-medium text-gray-800">
                  {user.name}
                </span>
              </Link>

              {/* Mobile Profile */}
              <Link
                to="/profile"
                aria-label="پروفایل"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200 sm:hidden"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              </Link>

              {/* Logout */}
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 sm:block"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              {/* Login */}
              <Link
                to="/login"
                className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 sm:px-4"
              >
                ورود
              </Link>

              {/* Register */}
              <Link
                to="/register"
                className="rounded-xl bg-black px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-800 sm:px-4"
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