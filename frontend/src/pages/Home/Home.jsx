import Hero from "../../components/home/Hero";
import CategoryList from "../../components/home/CategoryList";
import ProductSection from "../../components/products/ProductSection";

import {
  featuredProducts,
  popularProducts,
  latestProducts,
} from "../../data/mockProducts";

function Home() {
  return (
    <div>
      <Hero />

      <CategoryList />

      <ProductSection
        title="محصولات ویژه"
        description="محصولاتی که توسط مدیریت انتخاب شده‌اند"
        products={featuredProducts}
      />

      <ProductSection
        title="محبوب‌ترین محصولات"
        description="محصولاتی که بیشترین توجه کاربران را داشته‌اند"
        products={popularProducts}
      />

      <ProductSection
        title="جدیدترین محصولات"
        description="تازه‌ترین محصولاتی که وارد بازار شده‌اند"
        products={latestProducts}
      />
    </div>
  );
}

export default Home;