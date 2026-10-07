import { Link } from "react-router";

function ProductCard({ product }) {
  return (
    <Link
      to={`/products/${product.id}`}
      className="block"
    >
      <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
        <div className="aspect-square bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              تصویر محصول
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-semibold text-gray-900">
              {product.title}
            </h3>

            {product.isFeatured && (
              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                ویژه
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {product.seller}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-gray-900">
              {product.price.toLocaleString("fa-IR")} تومان
            </span>

            <span className="text-xs text-gray-400">
              {product.stock > 0 ? "موجود" : "ناموجود"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;