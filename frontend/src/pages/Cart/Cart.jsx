import { Link } from "react-router";

import { useCartStore } from "../../store/cartStore";

import { useAuthStore } from "../../store/authStore";

function Cart() {
  const items = useCartStore(
    (state) => state.items
  );

  const increaseQuantity = useCartStore(
    (state) => state.increaseQuantity
  );

  const decreaseQuantity = useCartStore(
    (state) => state.decreaseQuantity
  );

  const removeFromCart = useCartStore(
    (state) => state.removeFromCart
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const totalAmount = items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const user = useAuthStore((state) => state.user);

  if (items.length === 0) {
    return (
      <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-white px-6 py-20 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-gray-900">
              سبد خرید خالی است
            </h1>

            <p className="mt-3 text-gray-500">
              هنوز محصولی به سبد خرید اضافه نکرده‌اید.
            </p>

            <Link
              to="/explore"
              className="mt-7 inline-flex rounded-xl bg-black px-6 py-3 text-sm font-semibold text-white hover:bg-gray-800"
            >
              مشاهده محصولات
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              سبد خرید
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {items.length} محصول در سبد خرید شماست.
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="text-sm font-medium text-red-500 hover:underline"
          >
            خالی کردن سبد
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">

          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                  {/* Image */}
                  <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-gray-400">
                        تصویر
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-bold text-gray-900">
                      {item.title}
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      فروشنده: {item.seller}
                    </p>

                    <p className="mt-3 font-bold text-gray-900">
                      {item.price.toLocaleString("fa-IR")}{" "}
                      تومان
                    </p>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50"
                    >
                      −
                    </button>

                    <span className="flex h-9 min-w-9 items-center justify-center rounded-xl bg-gray-100 px-2 text-sm font-semibold">
                      {item.quantity}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
                      disabled={
                        item.quantity >= item.stock
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.id)
                    }
                    className="text-sm font-medium text-red-500 hover:underline"
                  >
                    حذف
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              خلاصه سفارش
            </h2>

            <div className="mt-6 space-y-4 text-sm">

              <div className="flex justify-between">
                <span className="text-gray-500">
                  تعداد کالا
                </span>

                <span className="font-medium text-gray-900">
                  {items.reduce(
                    (total, item) =>
                      total + item.quantity,
                    0
                  )}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">
                    مجموع
                  </span>

                  <span className="text-xl font-black text-gray-900">
                    {totalAmount.toLocaleString(
                      "fa-IR"
                    )}{" "}
                    تومان
                  </span>
                </div>
              </div>

            </div>

            <Link
              to={user ? "/checkout" : "/login"}
              className="block rounded-xl bg-black px-5 py-3 text-center text-sm font-bold text-white transition hover:bg-gray-800"
            >
              {user ? "ادامه و ثبت سفارش" : "ورود برای ثبت سفارش"}
            </Link>

            <Link
              to="/explore"
              className="mt-3 flex w-full items-center justify-center rounded-2xl border border-gray-200 px-5 py-4 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              ادامه خرید
            </Link>
          </aside>

        </div>
      </div>
    </main>
  );
}

export default Cart;