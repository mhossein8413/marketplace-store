import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import ProductCard from "../../components/products/ProductCard";
import { exploreProducts } from "../../data/mockExploreProducts";

const categories = [
  "همه",
  "موبایل",
  "لپ‌تاپ",
  "دیجیتال",
  "پوشاک",
  "خانه",
  "کتاب",
];

const tags = [
  "پرفروش",
  "ویژه",
  "جدید",
  "اقتصادی",
  "گیمینگ",
  "روزمره",
  "آموزشی",
];

function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "همه";
  const tag = searchParams.get("tag") || "";
  const sort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(query);

  const updateParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (!value || value === "همه") {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  };

  const handleSearch = (event) => {
    event.preventDefault();

    updateParam("q", searchInput.trim());
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    const result = exploreProducts.filter((product) => {
      const matchesSearch =
        !query ||
        product.title.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        category === "همه" ||
        product.category === category;

      const matchesTag =
        !tag ||
        product.tags.includes(tag);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesTag
      );
    });

    if (sort === "price-low") {
      return [...result].sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      return [...result].sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "popular") {
      return [...result].sort(
        (a, b) => b.salesCount - a.salesCount
      );
    }

    return [...result].sort(
      (a, b) =>
        new Date(b.createdAt) -
        new Date(a.createdAt)
    );
  }, [query, category, tag, sort]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* عنوان */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          کاوش محصولات
        </h1>

        <p className="mt-3 text-gray-500">
          محصول موردنظرت را جستجو کن و با فیلترهای مختلف
          راحت‌تر پیدایش کن.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSearch}
        className="mt-8 flex flex-col gap-3 sm:flex-row"
      >
        <input
          type="text"
          value={searchInput}
          onChange={(event) =>
            setSearchInput(event.target.value)
          }
          placeholder="مثلاً آیفون، لپ‌تاپ، هدفون..."
          className="h-12 flex-1 rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
        />

        <button
          type="submit"
          className="h-12 rounded-xl bg-gray-900 px-7 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          جستجو
        </button>
      </form>

      {/* Category Filter */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            دسته‌بندی
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const isActive = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() =>
                  updateParam("category", item)
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tag Filter */}
      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-gray-900">
          برچسب
        </h2>

        <div className="flex flex-wrap gap-2">
          {tags.map((item) => {
            const isActive = tag === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() =>
                  updateParam(
                    "tag",
                    isActive ? "" : item
                  )
                }
                className={`rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                #{item}
              </button>
            );
          })}
        </div>
      </section>

      {/* Sort + result count */}
      <div className="mt-10 flex flex-col gap-4 border-y border-gray-200 py-5 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-gray-500">
          {filteredProducts.length} محصول پیدا شد
        </p>

        <div className="flex items-center gap-3">
          <label
            htmlFor="sort"
            className="text-sm text-gray-500"
          >
            مرتب‌سازی:
          </label>

          <select
            id="sort"
            value={sort}
            onChange={(event) =>
              updateParam("sort", event.target.value)
            }
            className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none"
          >
            <option value="newest">
              جدیدترین
            </option>

            <option value="popular">
              پرفروش‌ترین
            </option>

            <option value="price-low">
              ارزان‌ترین
            </option>

            <option value="price-high">
              گران‌ترین
            </option>
          </select>
        </div>
      </div>

      {/* Active filters */}
      {(query || category !== "همه" || tag) && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">
            فیلترهای فعال:
          </span>

          {query && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              جستجو: {query}
            </span>
          )}

          {category !== "همه" && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              {category}
            </span>
          )}

          {tag && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              #{tag}
            </span>
          )}

          <button
            type="button"
            onClick={clearFilters}
            className="mr-2 text-sm font-medium text-gray-900 hover:underline"
          >
            حذف فیلترها
          </button>
        </div>
      )}

      {/* Products */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            محصولی پیدا نشد
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            فیلترها یا عبارت جستجو را تغییر بده و دوباره امتحان کن.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            حذف فیلترها
          </button>
        </div>
      )}

    </main>
  );
}

export default Explore;