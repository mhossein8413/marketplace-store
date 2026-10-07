import {
  Routes,
  Route,
} from "react-router";

import MainLayout from "../layouts/MainLayout";
import Home from "../pages/Home/Home";
import Explore from "../pages/Explore/Explore";

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

      </Route>
    </Routes>
  );
}

export default AppRoutes;