import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { loginUser } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

function Login() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setIsLoading(true);

    try {
      const data = await loginUser(formData);

      setAuth(data.token, data.user);

      navigate("/", {
        replace: true,
      });
    } catch (error) {
      setError(
        error.message || "ورود به حساب کاربری انجام نشد"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

          {/* عنوان */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              ورود به حساب
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              برای ادامه وارد حساب کاربری خود شوید
            </p>
          </div>

          {/* خطا */}
          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* فرم */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ایمیل
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
                required
                autoComplete="email"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                رمز عبور
              </label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="رمز عبور خود را وارد کنید"
                required
                minLength={6}
                autoComplete="current-password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "در حال ورود..." : "ورود"}
            </button>
          </form>

          {/* Register */}
          <div className="mt-6 text-center text-sm text-gray-500">
            حساب کاربری ندارید؟

            <Link
              to="/register"
              className="mr-1 font-semibold text-black hover:underline"
            >
              ثبت‌نام کنید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;