import ProductList from '@/components/shared/product/product-list';
import {
  getFeaturedProducts,
  getLatestProducts,
} from '@/lib/actions/product.actions';
import { ProductCarousel } from '@/components/shared/product/product-carousel';
import ViewAllProductsButton from '@/components/view-all-products-button';
import IconBoxes from '@/components/icon-boxes';
import DealCountdown from '@/components/deal-countdown';

const HomePage = async () => {

  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className='space-y-8'>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList title='Nouveautés' data={latestProducts} />
      <ViewAllProductsButton />
      <DealCountdown/>
      <IconBoxes />
      
    </div>
  );
};

export default HomePage;