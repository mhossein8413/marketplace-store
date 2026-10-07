import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import Hero from "../../components/home/Hero";
import CategoryList from "../../components/home/CategoryList";
import ProductSection from "../../components/products/ProductSection";

import {
  getProducts,
  normalizeProduct,
} from "../../services/productService";

function Home() {
  const productsQuery = useQuery({
    queryKey: ["products", "home"],

    queryFn: () => getProducts(),
  });

  const products = useMemo(() => {
    if (!productsQuery.data) {
      return [];
    }

    const items =
      productsQuery.data.products || [];

    return items.map(normalizeProduct);
  }, [productsQuery.data]);

  const featuredProducts = useMemo(() => {
    return products
      .filter((product) => product.isFeatured)
      .slice(0, 4);
  }, [products]);

  const popularProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          b.salesCount - a.salesCount
      )
      .slice(0, 4);
  }, [products]);

  const latestProducts = useMemo(() => {
    return [...products]
      .sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      )
      .slice(0, 4);
  }, [products]);

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

    return Array.from(map.entries()).map(
      ([id, name]) => ({
        id,
        name,
      })
    );
  }, [products]);

  if (productsQuery.isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-gray-500">
            در حال بارگذاری بازار...
          </p>
        </div>
      </div>
    );
  }

  if (productsQuery.isError) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
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
    );
  }

  return (
    <div>
      <Hero
        products={
          featuredProducts.length > 0
            ? featuredProducts
            : latestProducts
        }
      />

      <CategoryList
        categories={categories}
      />

      {featuredProducts.length > 0 && (
        <ProductSection
          title="محصولات ویژه"
          products={featuredProducts}
        />
      )}

      {popularProducts.length > 0 && (
        <ProductSection
          title="محبوب‌ترین محصولات"
          products={popularProducts}
        />
      )}

      {latestProducts.length > 0 && (
        <ProductSection
          title="جدیدترین محصولات"
          products={latestProducts}
        />
      )}
    </div>
  );
}

export default Home;