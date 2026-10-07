import { useMemo } from "react";
import { useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";

import ProductReel from "../../components/products/ProductReel";
import {
  getProductById,
  getRelatedProducts,
} from "../../services/productService";

function normalizeProduct(product) {
  return {
    ...product,

    id: product._id,

    seller:
      product.seller?.name ||
      product.seller?.email ||
      "فروشنده",

    category:
      product.category?.name ||
      "بدون دسته‌بندی",

    images: product.images || [],

    tags: product.tags || [],

    salesCount: product.salesCount || 0,

    stock: product.stock || 0,
  };
}

function ProductDetail() {
  const { id } = useParams();

  const productQuery = useQuery({
    queryKey: ["product", id],

    queryFn: () => getProductById(id),

    enabled: Boolean(id),
  });

  const relatedQuery = useQuery({
    queryKey: ["product-related", id],

    queryFn: () => getRelatedProducts(id),

    enabled: Boolean(id),
  });

  const currentProduct = useMemo(() => {
    if (!productQuery.data) {
      return null;
    }

    return normalizeProduct(
      productQuery.data.product || productQuery.data
    );
  }, [productQuery.data]);

  const relatedProducts = useMemo(() => {
    if (!relatedQuery.data) {
      return [];
    }

    const products =
      relatedQuery.data.products ||
      relatedQuery.data;

    if (!Array.isArray(products)) {
      return [];
    }

    return products.map(normalizeProduct);
  }, [relatedQuery.data]);

  if (productQuery.isPending || relatedQuery.isPending) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />

          <p className="mt-4 text-gray-500">
            در حال دریافت اطلاعات محصول...
          </p>
        </div>
      </div>
    );
  }

  if (productQuery.isError) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">
            دریافت محصول با خطا مواجه شد
          </h1>

          <p className="mt-3 text-gray-500">
            {productQuery.error.message}
          </p>
        </div>
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="flex min-h-[calc(100vh-73px)] items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            محصول پیدا نشد
          </h1>

          <p className="mt-3 text-gray-500">
            محصول موردنظر وجود ندارد.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductReel
      currentProduct={currentProduct}
      relatedProducts={relatedProducts}
    />
  );
}

export default ProductDetail;