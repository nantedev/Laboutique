import ProductList from '@/components/shared/product/product-list';
import sampleData from '@/db/sample-data';

const HomePage = () => {
  return (
    <div className='space-y-8'>
      <h2 className='h2-bold'>Produits Récents</h2>
      <ProductList title='Nouveautés' data={sampleData.products} />
    </div>
  );
};

export default HomePage;