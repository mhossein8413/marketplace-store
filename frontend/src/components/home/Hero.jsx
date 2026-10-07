import { Link } from "react-router";

function Hero() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-2 md:items-center">
        
        {/* Text */}
        <div>
          <span className="inline-block rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700">
            Discover something new
          </span>

          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl">
            Find products you love.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            Explore unique products from different sellers,
            discover new categories, and find something worth buying.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/explore"
              className="rounded-xl bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
            >
              Explore products
            </Link>

            <Link
              to="/register"
              className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-medium text-gray-900 hover:bg-gray-50"
            >
              Start selling
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="flex justify-center md:justify-end">
          <div className="flex h-80 w-full max-w-md items-center justify-center rounded-3xl bg-gray-100">
            <span className="text-lg font-medium text-gray-400">
              Product Showcase
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

export default Hero;