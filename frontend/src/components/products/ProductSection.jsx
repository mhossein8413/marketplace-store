import ProductCard from "./ProductCard";

function ProductSection({ title, products }) {
  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">

        {/* Section Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {title}
          </h2>

          <button
            type="button"
            className="text-sm font-medium text-gray-600 transition hover:text-black"
          >
            مشاهده همه
          </button>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

export default ProductSection;