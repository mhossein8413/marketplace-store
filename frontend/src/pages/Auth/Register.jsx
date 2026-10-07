import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { registerUser } from "../../services/authService";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
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
    setSuccess("");
    setIsLoading(true);

    try {
      await registerUser(formData);

      setSuccess(
        "ثبت‌نام با موفقیت انجام شد. در حال انتقال به صفحه ورود..."
      );

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1000);
    } catch (error) {
      setError(
        error.message || "ثبت‌نام انجام نشد"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-gray-100">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              ساخت حساب کاربری
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              برای شروع در بازار ثبت‌نام کنید
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-2xl bg-green-50 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                نام
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="نام خود را وارد کنید"
                required
                autoComplete="name"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

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
                placeholder="حداقل ۶ کاراکتر"
                required
                minLength={6}
                autoComplete="new-password"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-black focus:bg-white"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading
                ? "در حال ثبت‌نام..."
                : "ثبت‌نام"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            قبلاً حساب ساخته‌اید؟

            <Link
              to="/login"
              className="mr-1 font-semibold text-black hover:underline"
            >
              وارد شوید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;