import Hero from "../../components/home/Hero";

function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Explore the marketplace
          </h2>

          <p className="mt-3 text-gray-600">
            Find products from different categories and sellers.
          </p>
        </div>
      </section>
    </>
  );
}

export default Home;