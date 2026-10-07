import { Link, Outlet } from "react-router";
import Header from "../components/layout/Header";

function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-white">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <p className="text-sm text-gray-500">
            © 2026 Marketplace. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;