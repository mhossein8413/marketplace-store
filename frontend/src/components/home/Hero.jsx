import { useEffect, useState } from "react";
import { Link } from "react-router";

const slides = [
  {
    id: 1,
    category: "موبایل",
    title: "آیفون ۱۵",
    seller: "فروشنده: علی",
    price: "۵۲,۰۰۰,۰۰۰ تومان",
    badge: "محصول ویژه",
  },
  {
    id: 2,
    category: "لپ‌تاپ",
    title: "لپ‌تاپ حرفه‌ای",
    seller: "فروشنده: محمد",
    price: "۶۸,۰۰۰,۰۰۰ تومان",
    badge: "پیشنهاد ویژه",
  },
  {
    id: 3,
    category: "دیجیتال",
    title: "هدفون بی‌سیم",
    seller: "فروشنده: سارا",
    price: "۴,۵۰۰,۰۰۰ تومان",
    badge: "محبوب‌ترین",
  },
  {
    id: 4,
    category: "پوشیدنی",
    title: "ساعت هوشمند",
    seller: "فروشنده: رضا",
    price: "۷,۲۰۰,۰۰۰ تومان",
    badge: "جدید",
  },
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((current) =>
        current === slides.length - 1 ? 0 : current + 1
      );
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const slide = slides[currentSlide];

  const nextSlide = () => {
    setCurrentSlide((current) =>
      current === slides.length - 1 ? 0 : current + 1
    );
  };

  const previousSlide = () => {
    setCurrentSlide((current) =>
      current === 0 ? slides.length - 1 : current - 1
    );
  };

  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center md:py-20">

        {/* متن Hero */}
        <div>
          <span className="inline-flex rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            چیزهای جدید را کشف کنید
          </span>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            محصول موردعلاقه‌ات را پیدا کن.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            بین محصولات فروشندگان مختلف جستجو کن،
            دسته‌بندی‌های جدید را ببین و محصول موردنظرت را پیدا کن.
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

        {/* اسلایدشو */}
        <div className="relative">
          <div className="overflow-hidden rounded-3xl bg-gray-100">
            <div className="min-h-[380px] p-6 sm:p-8">

              {/* بالای کارت */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                  {slide.badge}
                </span>

                <span className="text-sm text-gray-500">
                  {slide.category}
                </span>
              </div>

              {/* فضای محصول */}
              <div className="flex min-h-[220px] items-center justify-center">
                <div className="w-full max-w-xs rounded-3xl bg-white p-8 text-center shadow-lg">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl bg-gray-100">
                    <span className="text-sm font-medium text-gray-400">
                      تصویر محصول
                    </span>
                  </div>

                  <h2 className="mt-6 text-xl font-bold text-gray-900">
                    {slide.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-500">
                    {slide.seller}
                  </p>

                  <p className="mt-4 text-lg font-bold text-gray-900">
                    {slide.price}
                  </p>
                </div>
              </div>

              {/* کنترل‌های اسلاید */}
              <div className="flex items-center justify-between">

                {/* محصول قبلی - سمت راست */}
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="محصول قبلی"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  →
                </button>

                {/* نقاط */}
                <div className="flex items-center gap-2">
                  {slides.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`نمایش اسلاید ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        currentSlide === index
                          ? "w-7 bg-gray-900"
                          : "w-2 bg-gray-300"
                      }`}
                    />
                  ))}
                </div>

                {/* محصول بعدی - سمت چپ */}
                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="محصول بعدی"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  ←
                </button>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;