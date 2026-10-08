import { Link } from "react-router";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3000/api";

const API_ORIGIN = API_URL.replace(/\/api\/?$/, "");

function getImageUrl(image) {
  if (!image) {
    return "";
  }

  if (
    image.startsWith("http://") ||
    image.startsWith("https://") ||
    image.startsWith("blob:")
  ) {
    return image;
  }

  return `${API_ORIGIN}${image.startsWith("/") ? image : `/${image}`}`;
}

function ProductCard({ product }) {
  const imageUrl = getImageUrl(product.image);

  return (
    <Link
      to={`/products/${product.id}`}
      className="block"
    >
      <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:-translate-y-1 hover:shadow-md">
        {/* Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
              onError={(event) => {
                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
              تصویر محصول
            </div>
          )}
        </div>

        {/* Content */}
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

          <div className="mt-4 flex items-center justify-between gap-2">
            <span className="font-bold text-gray-900">
              {product.price.toLocaleString("fa-IR")}

              <span className="mr-1 text-xs font-normal text-gray-500">
                تومان
              </span>
            </span>

            <span className="text-xs text-gray-400">
              {product.stock > 0
                ? "موجود"
                : "ناموجود"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default ProductCard;