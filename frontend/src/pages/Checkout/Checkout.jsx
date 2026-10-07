import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { createOrder } from "../../services/orderService";

function Checkout() {
  const navigate = useNavigate();

  const token = useAuthStore((state) => state.token);

  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [form, setForm] = useState({
    recipientName: "",
    phone: "",
    city: "",
    address: "",
    postalCode: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const totalAmount = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [items]);

  const sellers = useMemo(() => {
    return [
      ...new Set(
        items
          .map((item) => item.seller)
          .filter(Boolean)
      ),
    ];
  }, [items]);

  const hasMultipleSellers = sellers.length > 1;

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!items.length) {
      setError("سبد خرید شما خالی است.");
      return;
    }

    if (hasMultipleSellers) {
      setError(
        "در حال حاضر هر سفارش فقط می‌تواند شامل محصولات یک فروشنده باشد."
      );
      return;
    }

    if (!token) {
      navigate("/login");
      return;
    }

    if (
      !form.recipientName.trim() ||
      !form.phone.trim() ||
      !form.city.trim() ||
      !form.address.trim() ||
      !form.postalCode.trim()
    ) {
      setError("لطفاً همه اطلاعات ارسال را وارد کنید.");
      return;
    }

    try {
      setLoading(true);

      const orderItems = items.map((item) => ({
        product: item.id,
        quantity: item.quantity,
      }));

      const orderData = {
        items: items.map((item) => ({
          product: item.id,
          quantity: item.quantity,
        })),

        shippingAddress: {
          recipientName: form.recipientName.trim(),
          phone: form.phone.trim(),
          city: form.city.trim(),
          address: form.address.trim(),
          postalCode: form.postalCode.trim(),
        },
      };

      console.log("CART ITEMS:", items);
      console.log("ORDER DATA:", orderData);


      await createOrder(token, orderData);

      clearCart();

      setSuccess(true);
    } catch (err) {
      setError(
        err.message || "ثبت سفارش با خطا مواجه شد."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!items.length && !success) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">
            سبد خرید خالی است
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            برای ثبت سفارش ابتدا محصولی به سبد خرید اضافه کنید.
          </p>

          <Link
            to="/explore"
            className="mt-6 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            رفتن به کاوش
          </Link>
        </div>
      </section>
    );
  }

  if (success) {
    return (
      <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-6">
        <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-2xl">
            ✓
          </div>

          <h1 className="mt-5 text-2xl font-black text-gray-900">
            سفارش با موفقیت ثبت شد
          </h1>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            سفارش شما ثبت شد و اکنون می‌توانید آن را در بخش سفارش‌های
            پروفایل مشاهده کنید.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/profile"
              className="rounded-xl bg-black px-6 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              مشاهده سفارش‌ها
            </Link>

            <Link
              to="/explore"
              className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
            >
              ادامه خرید
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 px-4 py-8 sm:px-6 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">
            ثبت سفارش
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            اطلاعات ارسال را وارد کنید تا سفارش شما ثبت شود.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {hasMultipleSellers && (
          <div className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-4 text-sm leading-7 text-yellow-800">
            سبد خرید شما شامل محصولات چند فروشنده است.
            در نسخه فعلی هر سفارش فقط برای یک فروشنده ثبت می‌شود.
            لطفاً محصولات یک فروشنده را در این سفارش نگه دارید.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">

          {/* فرم ارسال */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-white p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-black text-gray-900">
              اطلاعات ارسال
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">

              {/* نام گیرنده */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="recipientName"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  نام گیرنده
                </label>

                <input
                  id="recipientName"
                  name="recipientName"
                  value={form.recipientName}
                  onChange={handleChange}
                  placeholder="نام و نام خانوادگی"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              {/* تلفن */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  شماره موبایل
                </label>

                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0912..."
                  dir="ltr"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              {/* شهر */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  شهر
                </label>

                <input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="مثلاً تهران"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              {/* کد پستی */}
              <div>
                <label
                  htmlFor="postalCode"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  کد پستی
                </label>

                <input
                  id="postalCode"
                  name="postalCode"
                  value={form.postalCode}
                  onChange={handleChange}
                  placeholder="کد پستی ۱۰ رقمی"
                  dir="ltr"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>

              {/* آدرس */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  آدرس کامل
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={5}
                  placeholder="آدرس کامل محل تحویل..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || hasMultipleSellers}
              className="mt-8 w-full rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading
                ? "در حال ثبت سفارش..."
                : "ثبت نهایی سفارش"}
            </button>
          </form>

          {/* خلاصه سفارش */}
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-gray-900">
              خلاصه سفارش
            </h2>

            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-b border-gray-100 pb-4"
                >
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        بدون تصویر
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-bold text-gray-900">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-xs text-gray-500">
                      تعداد:{" "}
                      {item.quantity.toLocaleString("fa-IR")}
                    </p>

                    <p className="mt-1 text-sm font-bold text-gray-900">
                      {(
                        item.price * item.quantity
                      ).toLocaleString("fa-IR")}{" "}
                      تومان
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-gray-100 pt-5">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>تعداد کالا</span>

                <span>
                  {totalQuantity.toLocaleString("fa-IR")}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-900">
                  مبلغ نهایی
                </span>

                <span className="text-xl font-black text-gray-900">
                  {totalAmount.toLocaleString("fa-IR")} تومان
                </span>
              </div>
            </div>

            <Link
              to="/cart"
              className="mt-6 block text-center text-sm font-medium text-gray-500 transition hover:text-black"
            >
              بازگشت به سبد خرید
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default Checkout;