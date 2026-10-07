import { Routes, Route } from "react-router";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Explore from "../pages/Explore/Explore";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

function AppRoutes() {
  return (
    <Routes>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route path="/explore" element={<Explore />} />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />
      </Route>

      {/* برای پیدا کردن Routeهای اشتباه */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <h1 className="text-3xl font-bold text-red-500">
              این مسیر پیدا نشد
            </h1>
          </div>
        }
      />

    </Routes>
  );
}

export default AppRoutes;