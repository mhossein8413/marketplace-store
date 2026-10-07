import { useAuthStore } from "../../store/authStore";

function Profile() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            پروفایل من
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            مدیریت حساب کاربری و فعالیت‌های شما
          </p>
        </div>

        {/* Profile Card */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* Avatar */}
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-black text-3xl font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {/* Information */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-400">
                  نام
                </p>

                <p className="text-lg font-semibold text-gray-900">
                  {user?.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  ایمیل
                </p>

                <p className="text-sm font-medium text-gray-700">
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-400">
                  نوع حساب
                </p>

                <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                  {user?.role === "admin"
                    ? "مدیر"
                    : "کاربر"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Sections */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">

          {/* Orders */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                سفارش‌های من
              </h2>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                به‌زودی
              </span>
            </div>

            <p className="text-sm leading-6 text-gray-500">
              در این بخش سفارش‌هایی که به عنوان خریدار
              ثبت کرده‌اید نمایش داده خواهند شد.
            </p>
          </div>

          {/* My Products */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                محصولات من
              </h2>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500">
                به‌زودی
              </span>
            </div>

            <p className="text-sm leading-6 text-gray-500">
              محصولاتی که شما به عنوان فروشنده ثبت کرده‌اید
              و وضعیت آن‌ها در این بخش قرار می‌گیرند.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;