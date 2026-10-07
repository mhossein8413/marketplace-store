import { useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import ProductCard from "../../components/products/ProductCard";
import { getProducts } from "../../services/productService";

function normalizeProduct(product) {
  return {
    id: product._id,

    title: product.title,

    description: product.description,

    seller:
      product.seller?.name ||
      product.seller?.email ||
      "فروشنده",

    price: product.price,

    stock: product.stock,

    image: product.images?.[0] || "",

    images: product.images || [],

    category:
      product.category?.name ||
      "بدون دسته‌بندی",

    categoryId:
      product.category?._id ||
      product.category ||
      "",

    tags: product.tags || [],

    salesCount: product.salesCount || 0,

    isFeatured: product.isFeatured || false,

    createdAt: product.createdAt,
  };
}

function Explore() {
  const [searchParams, setSearchParams] =
    useSearchParams();

  const query = searchParams.get("q") || "";

  const category =
    searchParams.get("category") || "";

  const tag =
    searchParams.get("tag") || "";

  const sort =
    searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] =
    useState(query);

  const productsQuery = useQuery({
    queryKey: [
      "products",
      {
        category,
        tag,
      },
    ],

    queryFn: () =>
      getProducts({
        category,
        tag,
      }),
  });

  const products = useMemo(() => {
    if (!productsQuery.data) {
      return [];
    }

    const data = productsQuery.data.products || [];

    return data.map(normalizeProduct);
  }, [productsQuery.data]);

  // ----------------------------
  // ساخت Categoryهای موجود
  // ----------------------------
  const categories = useMemo(() => {
    const map = new Map();

    products.forEach((product) => {
      if (
        product.categoryId &&
        product.category
      ) {
        map.set(
          product.categoryId,
          product.category
        );
      }
    });

    return [
      {
        id: "",
        name: "همه",
      },
      ...Array.from(map.entries()).map(
        ([id, name]) => ({
          id,
          name,
        })
      ),
    ];
  }, [products]);

  // ----------------------------
  // ساخت Tagهای موجود
  // ----------------------------
  const tags = useMemo(() => {
    const tagSet = new Set();

    products.forEach((product) => {
      product.tags.forEach((item) => {
        tagSet.add(item);
      });
    });

    return Array.from(tagSet);
  }, [products]);

  // ----------------------------
  // Search + Sort در Frontend
  // ----------------------------
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (query) {
      const normalizedQuery =
        query.toLowerCase();

      result = result.filter((product) =>
        product.title
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    // Sort
    if (sort === "price-low") {
      result.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sort === "price-high") {
      result.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sort === "popular") {
      result.sort(
        (a, b) =>
          b.salesCount - a.salesCount
      );
    }

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
    }

    return result;
  }, [products, query, sort]);

  // ----------------------------
  // تغییر Query Param
  // ----------------------------
  const updateParam = (key, value) => {
    const nextParams =
      new URLSearchParams(searchParams);

    if (!value) {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }

    setSearchParams(nextParams);
  };

  // ----------------------------
  // Search
  // ----------------------------
  const handleSearch = (event) => {
    event.preventDefault();

    updateParam(
      "q",
      searchInput.trim()
    );
  };

  // ----------------------------
  // Clear
  // ----------------------------
  const clearFilters = () => {
    setSearchInput("");

    setSearchParams({});
  };

  // ----------------------------
  // Loading
  // ----------------------------
  if (productsQuery.isPending) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

            <p className="mt-4 text-gray-500">
              در حال دریافت محصولات...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------
  // Error
  // ----------------------------
  if (productsQuery.isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="flex min-h-[50vh] items-center justify-center">
          <div className="max-w-md text-center">
            <h1 className="text-2xl font-bold text-red-600">
              دریافت محصولات با خطا مواجه شد
            </h1>

            <p className="mt-3 text-gray-500">
              {productsQuery.error.message}
            </p>

            <button
              type="button"
              onClick={() =>
                productsQuery.refetch()
              }
              className="mt-6 rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              تلاش دوباره
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
          کاوش محصولات
        </h1>

        <p className="mt-3 text-gray-500">
          محصول موردنظرت را جستجو کن و از بین محصولات
          مختلف انتخاب کن.
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
            setSearchInput(
              event.target.value
            )
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

      {/* Category */}
      <section className="mt-8">
        <h2 className="mb-3 font-semibold text-gray-900">
          دسته‌بندی
        </h2>

        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => {
            const isActive =
              category === item.id;

            return (
              <button
                key={item.id || "all"}
                type="button"
                onClick={() =>
                  updateParam(
                    "category",
                    item.id
                  )
                }
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                  isActive
                    ? "bg-gray-900 text-white"
                    : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
                }`}
              >
                {item.name}
              </button>
            );
          })}
        </div>
      </section>

      {/* Tags */}
      <section className="mt-6">
        <h2 className="mb-3 font-semibold text-gray-900">
          برچسب‌ها
        </h2>

        <div className="flex flex-wrap gap-2">
          {tags.map((item) => {
            const isActive =
              tag === item;

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

      {/* Sort */}
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
              updateParam(
                "sort",
                event.target.value
              )
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
      {(query || category || tag) && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">
            فیلترهای فعال:
          </span>

          {query && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              جستجو: {query}
            </span>
          )}

          {category && (
            <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm text-gray-700">
              {
                categories.find(
                  (item) =>
                    item.id === category
                )?.name || "دسته‌بندی"
              }
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
          {filteredProducts.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            )
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-20 text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            محصولی پیدا نشد
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            فیلترها یا عبارت جستجو را تغییر بده.
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