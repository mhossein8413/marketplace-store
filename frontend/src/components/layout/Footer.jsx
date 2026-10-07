import { Link } from "react-router";

function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-14">

        {/* بخش بالایی */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* برند */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900"
            >
              بازار
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
              بازاری برای کشف محصولات جدید، خرید از فروشندگان مختلف
              و شروع یک مسیر تازه برای فروش محصولات.
            </p>

            <Link
              to="/register"
              className="mt-6 inline-flex rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              شروع فروش
            </Link>
          </div>

          {/* خرید */}
          <div>
            <h3 className="font-semibold text-gray-900">
              خرید
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/explore"
                  className="transition hover:text-gray-900"
                >
                  کاوش محصولات
                </Link>
              </li>

              <li>
                <Link
                  to="/explore"
                  className="transition hover:text-gray-900"
                >
                  دسته‌بندی‌ها
                </Link>
              </li>

              <li>
                <Link
                  to="/favorites"
                  className="transition hover:text-gray-900"
                >
                  علاقه‌مندی‌ها
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="transition hover:text-gray-900"
                >
                  سبد خرید
                </Link>
              </li>
            </ul>
          </div>

          {/* فروش */}
          <div>
            <h3 className="font-semibold text-gray-900">
              فروش
            </h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  to="/profile"
                  className="transition hover:text-gray-900"
                >
                  پروفایل من
                </Link>
              </li>

              <li>
                <Link
                  to="/profile/products/new"
                  className="transition hover:text-gray-900"
                >
                  ثبت محصول
                </Link>
              </li>

              <li>
                <Link
                  to="/profile/sales"
                  className="transition hover:text-gray-900"
                >
                  فروش‌های من
                </Link>
              </li>

              <li>
                <Link
                  to="/register"
                  className="transition hover:text-gray-900"
                >
                  ایجاد حساب
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* جداکننده */}
        <div className="my-10 border-t border-gray-200" />

        {/* پایین Footer */}
        <div className="flex flex-col gap-4 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">

          <p>
            © ۱۴۰۵ بازار. تمامی حقوق محفوظ است.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              to="/privacy"
              className="transition hover:text-gray-900"
            >
              حریم خصوصی
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-gray-900"
            >
              قوانین و مقررات
            </Link>

            <Link
              to="/contact"
              className="transition hover:text-gray-900"
            >
              تماس با ما
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;