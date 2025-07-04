import { notFound } from 'next/navigation';
import ProductPrice from '@/components/shared/product/product-price';
import { Card, CardContent } from '@/components/ui/card';
import { getProductBySlug } from '@/lib/actions/product.actions';
import { Badge } from '@/components/ui/badge';
import ProductImages  from '@/components/shared/product/product-images';
import AddToCart from '@/components/shared/product/add-to-cart';
import { getMyCart } from '@/lib/actions/cart.actions';
import { round2 } from '@/lib/utils';
import { auth } from '@/auth';
import ReviewList from './review-list';
import Rating from '@/components/shared/product/rating';



const ProductDetailsPage = async (props: {
  params: Promise<{ slug: string }>;
}) => {
  const params = await props.params;

  const { slug } = params;

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const cart = await getMyCart(); 
  
  const session = await auth();
  const userId = session?.user?.id;
  return (
    <>
      <section>
        <div className='grid grid-cols-1 md:grid-cols-5'>
          {/* Images Column */}
          <div className='col-span-2'>
            <ProductImages images={product.images!} />
          </div>

          {/* Details Column */}
         <div className='col-span-2 p-5'>
            <div className='flex flex-col gap-6'>
              <p>
                {product.brand} {product.category}
              </p>
              <h1 className='h3-bold'>{product.name}</h1>
                  <Rating value={Number(product.rating)} />
                  <p>{product.numReviews} avis</p>
               <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                  <ProductPrice
                    value={Number(product.price)}
                    className='w-24 rounded-full bg-green-100 text-green-700 px-5 py-2'
                  />
              </div>
            </div>
            <div className='mt-10'>
              <h2>Description:</h2>
              <p>{product.description}</p>
            </div>
          </div>
          {/* Action Column */}
          <div>
            <Card>
              <CardContent className='p-4'>
                <div className='mb-2 flex justify-between'>
                  <div>Prix</div>
                  <div>
                    <ProductPrice value={Number(product.price)} />
                  </div>
                </div>
                <div className='mb-2 flex justify-between'>
                  <div>Disponibilité</div>
                  {product.stock > 0 ? (
                    <Badge variant='outline'>En stock</Badge>
                  ) : (
                    <Badge variant='destructive'>Rupture</Badge>
                  )}
                </div>
                {
                  product.stock > 0 && (
                    <div className='flex-center'>
                      <AddToCart
                        cart={cart}
                        item={{
                          productId: product.id,
                          name: product.name,
                          slug: product.slug,
                          price: round2(product.price), 
                          qty: 1,
                          image: product.images![0],
                        }}
                      />
                    </div>
                  )
                }
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className='mt-10'>
        <h2 className='h2-bold  mb-5'>Avis des clients</h2>
        <ReviewList
          productId={product.id}
          productSlug={product.slug}
          userId={userId || ''}
        />
      </section>
    </>
  );
};

export default ProductDetailsPage;