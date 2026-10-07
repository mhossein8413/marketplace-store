import {
  Link,
  Outlet,
} from "react-router";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <Link
            to="/"
            className="text-xl font-bold text-gray-900"
          >
            Marketplace
          </Link>

          <nav className="flex gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900"
            >
              Home
            </Link>

            <Link
              to="/explore"
              className="text-gray-600 hover:text-gray-900"
            >
              Explore
            </Link>
          </nav>

        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-6">
          Marketplace
        </div>
      </footer>

    </div>
  );
}

export default MainLayout;