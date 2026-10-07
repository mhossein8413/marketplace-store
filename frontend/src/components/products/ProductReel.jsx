import { useMemo } from "react";
import { Link } from "react-router";

import { exploreProducts } from "../../data/mockExploreProducts";
import { useCartStore } from "../../store/cartStore";

function ProductReel({ currentProduct }) {
  const addToCart = useCartStore((state) => state.addToCart);

  const relatedProducts = useMemo(() => {
    if (!currentProduct) {
      return [];
    }

    return exploreProducts.filter((product) => {
      const sameCategory =
        product.category === currentProduct.category;

      const hasSharedTag =
        product.tags?.some((tag) =>
          currentProduct.tags?.includes(tag)
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
  ].filter(Boolean);

  function handleAddToCart(product) {
    if (!product || product.stock <= 0) {
      return;
    }

    addToCart(product);
  }

  if (!currentProduct) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500">
            محصول پیدا نشد.
          </p>

          <Link
            to="/explore"
            className="mt-4 inline-block rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            بازگشت به کاوش
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-73px)] snap-y snap-mandatory overflow-y-auto overscroll-contain bg-gray-50">
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

              {/* Category + Tags */}
              <div className="flex flex-wrap gap-2">
                {product.category && (
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    {product.category}
                  </span>
                )}

                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gray-50 px-3 py-1.5 text-xs text-gray-500"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="mt-6 text-3xl font-bold text-gray-900 md:text-5xl">
                {product.title}
              </h1>

              {/* Seller */}
              <p className="mt-4 text-sm text-gray-500">
                فروشنده: {product.seller || "فروشنده"}
              </p>

              {/* Price */}
              <div className="mt-6">
                <span className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {Number(product.price || 0).toLocaleString("fa-IR")}
                </span>

                <span className="mr-1 text-sm text-gray-500">
                  تومان
                </span>
              </div>

              {/* Sales + Stock */}
              <div className="mt-6 flex items-center gap-3 text-sm">
                <span className="rounded-full bg-gray-100 px-3 py-2 text-gray-600">
                  {Number(product.salesCount || 0).toLocaleString("fa-IR")}{" "}
                  فروش
                </span>

                {Number(product.stock) > 0 ? (
                  <span className="rounded-full bg-gray-100 px-3 py-2 text-gray-600">
                    {Number(product.stock).toLocaleString("fa-IR")} عدد موجود
                  </span>
                ) : (
                  <span className="rounded-full bg-gray-100 px-3 py-2 text-red-500">
                    ناموجود
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="mt-6 leading-8 text-gray-600">
                {product.description ||
                  "توضیحات این محصول در حال حاضر موجود نیست."}
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-wrap gap-3">

                {/* Add To Cart */}
                <button
                  type="button"
                  onClick={() => handleAddToCart(product)}
                  disabled={Number(product.stock) <= 0}
                  className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  {Number(product.stock) > 0
                    ? "افزودن به سبد خرید"
                    : "محصول ناموجود است"}
                </button>

                {/* Back To Explore */}
                <Link
                  to="/explore"
                  className="rounded-xl border border-gray-300 px-6 py-3 font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  بازگشت به کاوش
                </Link>
              </div>

              {/* Scroll Hint */}
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