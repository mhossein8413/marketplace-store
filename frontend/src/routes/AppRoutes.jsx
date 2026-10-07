import { Routes, Route } from "react-router";

import MainLayout from "../layouts/MainLayout";

import Home from "../pages/Home/Home";
import Explore from "../pages/Explore/Explore";
import ProductDetail from "../pages/ProductDetail/ProductDetail";

import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import GuestRoute from "./GuestRoute";
import Profile from "../pages/Profile/Profile";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>

      <Route element={<MainLayout />}>

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

        {/* Guest Only Routes */}
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

        <Route element={<ProtectedRoute />}>
        <Route
          path="/profile"
          element={<Profile />}
        />
      </Route>    

      </Route>

      

      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center">
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