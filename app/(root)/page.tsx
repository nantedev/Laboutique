import ProductList from '@/components/shared/product/product-list';
import { getLatestProducts } from '@/lib/actions/product.actions';

const HomePage = async () => {

  const latestProducts = await getLatestProducts();

  return (
    <div className='space-y-8'>
      <ProductList title='Nouveautés' data={latestProducts} />
    </div>
  );
};

export default HomePage;