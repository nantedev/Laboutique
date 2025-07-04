import Pagination from '@/components/shared/pagination';
import ProductCard from '@/components/shared/product/product-card';
import { Button } from '@/components/ui/button';
import {
  getAllCategories,
  getAllProducts,
} from '@/lib/actions/product.actions';
import Link from 'next/link';



const prices = [
  {
    name: '1 à 50€',
    value: '1-50',
  },
  {
    name: '51 à 100€',
    value: '51-100',
  },
  {
    name: '101 à 200€',
    value: '101-200',
  },
  {
    name: '201 à 500€',
    value: '201-500',
  },
  {
    name: '501 à 1000€',
    value: '501-1000',
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ['Plus récent', 'Prix le plus bas', 'Prix le plus élevé', 'Meilleure note'];



export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
  } = await props.searchParams;

  const isQuerySet = q && q !== 'all' && q.trim() !== '';
  const isCategorySet = category && category !== 'all' && category.trim() !== '';
  const isPriceSet = price && price !== 'all' && price.trim() !== '';
  const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${
        isQuerySet ? q : ''
      }
      ${isCategorySet ? `: Category ${category}` : ''}
      ${isPriceSet ? `: Price ${price}` : ''}
      ${isRatingSet ? `: Rating ${rating}` : ''}`,
    };
  } else {
    return {
      title: 'Search Products',
    };
  }
}


const SearchPage = async (props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {

  const {
    q = 'all',
    category = 'all',
    price = 'all',
    rating = 'all',
    sort = 'newest',
    page = '1',
  } = await props.searchParams;

  const categories = await getAllCategories();

  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  });

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  return (
  <div className='grid md:grid-cols-5 md:gap-5'>
    <div className='filter-links'>
      {/* Category Links */}
      <div className='text-xl mt-3 mb-2'>Rayon</div>
      <div>
        <ul className='space-y-1'>
          <li>
            <Link
              className={`${
                ('all' === category || '' === category) && 'font-bold'
              }`}
              href={getFilterUrl({ c: 'all' })}
            >
              Indifférent
            </Link>
          </li>
          {categories.map((x) => (
            <li key={x.category}>
              <Link
                className={`${x.category === category && 'font-bold'}`}
                href={getFilterUrl({ c: x.category })}
              >
                {x.category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {
        /* Price Links */
      }
      <div>
        <div className='text-xl mt-8 mb-2'>Prix</div>
        <ul className='space-y-1'>
          <li>
            <Link
              className={`  ${'all' === price && 'font-bold'}`}
              href={getFilterUrl({ p: 'all' })}
            >
              Indifférent
            </Link>
          </li>
          {prices.map((p) => (
            <li key={p.value}>
              <Link
                href={getFilterUrl({ p: p.value })}
                className={`${p.value === price && 'font-bold'}`}
              >
                {p.name}
              </Link>
            </li>
          ))}
        </ul>
    </div>
    {
      /* Rating Links */
    }
    <div>
      <div className='text-xl mt-8 mb-2'>Avis des clients</div>
      <ul className='space-y-1'>
        <li>
          <Link
            href={getFilterUrl({ r: 'all' })}
            className={`  ${'all' === rating && 'font-bold'}`}
          >
            Indifférent
          </Link>
        </li>
        {ratings.map((r) => (
          <li key={r}>
            <Link
              href={getFilterUrl({ r: `${r}` })}
              className={`${r.toString() === rating && 'font-bold'}`}
            >
              {`${r} étoiles & plus`}
            </Link>
          </li>
        ))}
      </ul>
    </div>
    </div>
    <div className='md:col-span-4 space-y-4'>
      
    <div className='flex-between flex-col md:flex-row my-4'>
      <div className='flex items-center'>
        {q !== 'all' && q !== '' && 'Query : ' + q}
        {category !== 'all' && category !== '' && '   Category : ' + category}
        {price !== 'all' && '    Price: ' + price}
        {rating !== 'all' && '    Rating: ' + rating + ' & up'}
        &nbsp;
        {(q !== 'all' && q !== '') ||
        (category !== 'all' && category !== '') ||
        rating !== 'all' ||
        price !== 'all' ? (
          <Button variant={'link'} asChild>
            <Link href='/search'>Réinitialiser le filtre</Link>
          </Button>
        ) : null}
      </div>
      <div>
        {/* SORTING */}
        Tri par:{' '}
          {sortOrders.map((s) => (
            <Link
              key={s}
              className={`mx-2   ${sort == s && 'font-bold'} `}
              href={getFilterUrl({ s })}
            >
              {s}
            </Link>
          ))}
      </div>
    </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
        {products!.data.length === 0 && <div>Aucun produit trouvé</div>}
        {products!.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products!.totalPages! > 1 && (
        <Pagination page={page} totalPages={products!.totalPages} />
      )}
    </div>
  </div>

);
};





export default SearchPage;