import { useEffect, useState } from "react";
import { Link } from "react-router";

function ArrowIcon({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      {direction === "right" ? (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 18l-6-6 6-6"
        />
      ) : (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 18l6-6-6-6"
        />
      )}
    </svg>
  );
}

function Hero({ products = [] }) {
  const [currentIndex, setCurrentIndex] =
    useState(0);

  const slides = products.slice(0, 4);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((current) =>
        current === slides.length - 1
          ? 0
          : current + 1
      );
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [slides.length]);

  useEffect(() => {
    if (
      currentIndex >
      slides.length - 1
    ) {
      setCurrentIndex(0);
    }
  }, [currentIndex, slides.length]);

  const slide = slides[currentIndex];

  if (!slide) {
    return (
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-20">
          <h1 className="text-4xl font-bold text-gray-900 md:text-6xl">
            محصول موردعلاقه‌ات را پیدا کن.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            بین محصولات مختلف جستجو کن و چیزی که دوست داری پیدا کن.
          </p>
        </div>
      </section>
    );
  }

  const nextSlide = () => {
    setCurrentIndex((current) =>
      current === slides.length - 1
        ? 0
        : current + 1
    );
  };

  const previousSlide = () => {
    setCurrentIndex((current) =>
      current === 0
        ? slides.length - 1
        : current - 1
    );
  };

  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-20">

        {/* متن */}
        <div>
          <span className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            محصولات ویژه بازار
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            محصول موردعلاقه‌ات را پیدا کن.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            محصولات منتخب فروشندگان مختلف را ببین،
            دسته‌بندی‌های جدید را کشف کن و محصول موردنظرت را پیدا کن.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/explore"
              className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              مشاهده محصولات
            </Link>

            <Link
              to="/register"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 transition hover:bg-gray-50"
            >
              شروع فروش
            </Link>
          </div>
        </div>

        {/* Slider */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-gray-100">
            <div className="min-h-[380px] p-6 sm:p-8">

              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                  {slide.isFeatured
                    ? "محصول ویژه"
                    : "محصول منتخب"}
                </span>

                <span className="text-sm text-gray-500">
                  {slide.category}
                </span>
              </div>

              <div className="flex min-h-[220px] items-center justify-center">
                <Link
                  to={`/products/${slide.id}`}
                  className="group w-full max-w-xs"
                >
                  <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
                    <div className="aspect-square bg-gray-100">
                      {slide.image ? (
                        <img
                          src={slide.image}
                          alt={slide.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          تصویر محصول
                        </div>
                      )}
                    </div>

                    <div className="p-6 text-center">
                      <h2 className="text-xl font-bold text-gray-900">
                        {slide.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500">
                        فروشنده: {slide.seller}
                      </p>

                      <p className="mt-4 text-lg font-bold text-gray-900">
                        {slide.price.toLocaleString("fa-IR")}{" "}
                        تومان
                      </p>
                    </div>
                  </div>
                </Link>
              </div>

              {slides.length > 1 && (
                <div className="flex items-center justify-between">

                  {/* قبلی در RTL */}
                  <button
                    type="button"
                    onClick={previousSlide}
                    aria-label="محصول قبلی"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    →
                  </button>

                  <div className="flex items-center gap-2">
                    {slides.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setCurrentIndex(index)
                        }
                        aria-label={`نمایش اسلاید ${index + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          currentIndex === index
                            ? "w-7 bg-gray-900"
                            : "w-2 bg-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  {/* بعدی در RTL */}
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="محصول بعدی"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                  >
                    ←
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;