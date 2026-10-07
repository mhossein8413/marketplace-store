import { Outlet } from "react-router";
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
            © ۱۴۰۵ بازار آنلاین. تمامی حقوق محفوظ است.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;