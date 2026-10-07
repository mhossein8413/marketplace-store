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

        {/* Guest only */}
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

        {/* Authenticated only */}
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