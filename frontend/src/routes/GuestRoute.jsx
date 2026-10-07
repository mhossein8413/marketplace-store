import { Navigate, Outlet } from "react-router";

import { useAuthStore } from "../store/authStore";

function GuestRoute() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;