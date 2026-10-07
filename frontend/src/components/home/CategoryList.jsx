import { Link } from "react-router";

function CategoryList({ categories = [] }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            دسته‌بندی‌ها
          </h2>

          <p className="mt-2 text-sm text-gray-500 md:text-base">
            محصولات موردنظرت را از دسته‌بندی‌های مختلف پیدا کن.
          </p>
        </div>

        <Link
          to="/explore"
          className="hidden text-sm font-medium text-gray-900 hover:underline sm:block"
        >
          مشاهده همه
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/explore?category=${category.id}`}
            className="group rounded-2xl border border-gray-200 bg-white p-5 transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-sm font-bold text-gray-700">
              {category.name.charAt(0)}
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              {category.name}
            </h3>

            <p className="mt-1 text-xs leading-5 text-gray-500">
              مشاهده محصولات
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryList;