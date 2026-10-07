import { useMemo } from "react";
import { useParams } from "react-router";

import ProductReel from "../../components/products/ProductReel";
import { exploreProducts } from "../../data/mockExploreProducts";

function ProductDetail() {
  const { id } = useParams();

  const currentProduct = useMemo(() => {
    return exploreProducts.find(
      (product) => String(product.id) === String(id)
    );
  }, [id]);

  if (!currentProduct) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            محصول پیدا نشد
          </h1>

          <p className="mt-2 text-gray-500">
            این محصول وجود ندارد یا حذف شده است.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ProductReel
      currentProduct={currentProduct}
    />
  );
}

export default ProductDetail;