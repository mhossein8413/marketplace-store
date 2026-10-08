import {
  Routes,
  Route,
} from "react-router";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Explore from "../pages/Explore/Explore";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Profile from "../pages/Profile/Profile";
import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Checkout/Checkout.jsx";

import CreateProduct from "../pages/CreateProduct/CreateProduct";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>

        {/* Public */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/explore"
          element={<Explore />}
        />

        <Route
          path="/products/:id"
          element={<ProductDetail />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* Guest Only */}

        <Route element={<GuestRoute />}>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Route>

        {/* Protected */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/profile"
            element={<Profile />}
          />

          <Route
            path="/checkout"
            element={<Checkout />}
          />

          <Route
            path="/products/create"
            element={<CreateProduct />}
          />
        </Route>

        {/* 404 */}

        <Route
          path="*"
          element={
            <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
              <div className="text-center">
                <h1 className="text-3xl font-black text-red-500">
                  این مسیر پیدا نشد
                </h1>

                <p className="mt-3 text-sm text-gray-500">
                  صفحه موردنظر وجود ندارد.
                </p>
              </div>
            </div>
          }
        />

      </Route>
    </Routes>
  );
}

export default AppRoutes;