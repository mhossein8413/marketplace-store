import { useMemo } from "react";
import { Link } from "react-router";

import { exploreProducts } from "../../data/mockExploreProducts";

function ProductReel({ currentProduct }) {
  const relatedProducts = useMemo(() => {
    return exploreProducts.filter((product) => {
      const sameCategory =
        product.category === currentProduct.category;

      const hasSharedTag =
        product.tags.some((tag) =>
          currentProduct.tags.includes(tag)
        );

      return (
        product.id !== currentProduct.id &&
        sameCategory &&
        hasSharedTag
      );
    });
  }, [currentProduct]);

  const products = [
    currentProduct,
    ...relatedProducts,
  ];

  return (
    <div className="h-[calc(100vh-73px)] snap-y snap-mandatory overflow-y-auto overscroll-contain">
      {products.map((product, index) => (
        <section
          key={product.id}
          className="flex min-h-full snap-start items-center justify-center px-4 py-6"
        >
          <div className="grid h-full max-h-[850px] w-full max-w-6xl gap-6 rounded-3xl bg-white p-4 shadow-sm md:grid-cols-2 md:p-8">

            {/* تصویر */}
            <div className="relative flex min-h-[420px] items-center justify-center overflow-hidden rounded-2xl bg-gray-100">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-sm text-gray-400">
                  تصویر محصول
                </div>
              )}

              {index > 0 && (
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow">
                  محصول مرتبط
                </span>
              )}
            </div>

            {/* جزئیات */}
            <div className="flex flex-col justify-center px-2 py-6 md:px-6">

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                  {product.category}
                </span>

                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <h1 className="mt-6 text-3xl font-bold text-gray-900 md:text-5xl">
                {product.title}
              </h1>

              <p className="mt-4 text-sm text-gray-500">
                فروشنده: {product.seller}
              </p>

              <div className="mt-6">
                <span className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {product.price.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-gray-100 px-3 py-2 text-gray-600">
                  {product.salesCount} فروش
                </span>

                {product.stock > 0 ? (
                  <span className="rounded-full bg-gray-100 px-3 py-2 text-gray-600">
                    {product.stock} عدد موجود
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-2 text-gray-600">
                    ناموجود
                  </span>
                )}
              </div>

              <p className="mt-6 leading-8 text-gray-600">
                این محصول یکی از محصولات موجود در بازار است.
                در نسخه نهایی توضیحات واقعی محصول از Backend
                دریافت خواهد شد.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
                >
                  افزودن به سبد خرید
                </button>

                <Link
                  to="/explore"
                  className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  بازگشت به کاوش
                </Link>
              </div>

              {index < products.length - 1 && (
                <div className="mt-10 text-center text-sm text-gray-400">
                  برای دیدن محصول بعدی به پایین اسکرول کنید ↓
                </div>
              )}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}

export default ProductReel;