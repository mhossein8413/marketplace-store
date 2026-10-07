import { Link } from "react-router";
import ProductCard from "./ProductCard";

function ProductSection({
  title,
  description,
  products,
}) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            {title}
          </h2>

          {description && (
            <p className="mt-2 text-sm text-gray-500 md:text-base">
              {description}
            </p>
          )}
        </div>

        <Link
          to="/explore"
          className="hidden text-sm font-medium text-gray-900 hover:underline sm:block"
        >
          مشاهده بیشتر
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;