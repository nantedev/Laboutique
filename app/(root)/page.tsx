import ProductList from '@/components/shared/product/product-list';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
import { ProductCarousel } from '@/components/shared/product/product-carousel';

const HomePage = async () => {

  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className='space-y-8'>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList title='Nouveautés' data={latestProducts} />
    </div>
  );
};

export default HomePage;