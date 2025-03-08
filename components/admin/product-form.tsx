'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
  import { Input } from '@/components/ui/input';
  import { toast } from 'sonner';
  import { createProduct, updateProduct, removeProductImage } from '@/lib/actions/product.actions';
  import { productDefaultValues } from '@/lib/constants';
  import { insertProductSchema, updateProductSchema } from '@/lib/validator';
  import { ControllerRenderProps, SubmitHandler } from 'react-hook-form';
  import { Product } from '@/types';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useRouter } from 'next/navigation';
  import { useForm } from 'react-hook-form';
  import { z } from 'zod';
  import { Card, CardContent } from '@/components/ui/card';
  import Image from 'next/image';
  import { Button } from '@/components/ui/button';
  import slugify from 'slugify';
  import { Textarea } from '@/components/ui/textarea';
  import { UploadButton } from '@/lib/uploadthing';  
  import { Checkbox } from '@/components/ui/checkbox';


const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update';
  product?: Product;
  productId?: string;
}) => {
  
  const router = useRouter();
  
  const form = useForm<z.infer<typeof insertProductSchema>>({
    resolver: zodResolver(type === "Create" ? insertProductSchema : updateProductSchema),
    defaultValues:
      product && type === "Update" ? product : productDefaultValues,
  });
  
  // Handle form submit
  const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
    values
  ) => {
    if (type === 'Create') {
      const res = await createProduct(values);
  
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success(res.message);
        router.push(`/admin/products`);
      }
    }
  
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`);
        return;
      }
  
      const res = await updateProduct({ ...values, id: productId });
  
      if (!res.success) {
        toast.error(res.message);
      } else {
        toast.success("Produit mis à jour avec succès !");
        router.push(`/admin/products`);
      }
    }
  };

  const images = form.watch('images');
  const isFeatured = form.watch('isFeatured');
  const banner = form.watch('banner');

  return (
    <Form {...form}>
      <form method='post' onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Nom */}
          <FormField
            control={form.control}
            name='name'
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'name'>;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Nom</FormLabel>
                <FormControl>
                  <Input placeholder='Entrez le nom du produit' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Slug */}
          <FormField
            control={form.control}
            name='slug'
            render={({
              field,
            }: {
              field: ControllerRenderProps<z.infer<typeof insertProductSchema>, 'slug'>;
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Entrez le slug du produit'
                      className='pl-8'
                      {...field}
                    />
                    {/* Bouton Générer */}
                    <button
                      type='button'
                      className='bg-gray-500 text-white px-4 py-1 mt-2 hover:bg-gray-600'
                      onClick={() => {
                        form.setValue('slug', slugify(form.getValues('name'), { lower: true }));
                      }}
                    >
                      Générer
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
            {/* Catégorie */}
            <FormField
              control={form.control}
              name='category'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  'category'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Catégorie</FormLabel>
                  <FormControl>
                    <Input placeholder='Entrez la catégorie' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Marque */}
            <FormField
              control={form.control}
              name='brand'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof insertProductSchema>,
                  'brand'
                >
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Marque</FormLabel>
                  <FormControl>
                    <Input placeholder='Entrez la marque du produit' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
          {/* Prix */}
            <FormField
            control={form.control}
            name='price'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'price'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Prix</FormLabel>
                <FormControl>
                  <Input placeholder='Entrez le prix du produit' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Stock */}
          <FormField
            control={form.control}
            name='stock'
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof insertProductSchema>,
                'stock'
              >
            }) => (
              <FormItem className='w-full'>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input type='number' placeholder='Entrez le stock du produit' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='upload-field flex flex-col gap-5 md:flex-row'>
          {/* Images */}
            <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex-start space-x-2'>
                      {images.map((image: string) => (
                        <div key={image} className="relative">
                          <Image
                            src={image}
                            alt='product image'
                            className='w-20 h-20 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                          <button
                            type="button"
                            onClick={async () => {
                              if (type === 'Update' && productId) {
                                const res = await removeProductImage(productId, image);
                                if (res.success) {
                                  const newImages = images.filter((img: string) => img !== image);
                                  form.setValue('images', newImages);
                                  toast.success(res.message);
                                } else {
                                  toast.error(res.message);
                                }
                              } else {
                                // For new products, just update the form state
                                const newImages = images.filter((img: string) => img !== image);
                                form.setValue('images', newImages);
                              }
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url]);
                          }}
                          onUploadError={(error: Error) => {
                            toast.error(`ERROR! ${error.message}`);
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
          <div className='upload-field'>
            {/* Is Featured */}
            Produit vedette
              <Card>
                <CardContent className='space-y-2 mt-2  '>
                  <FormField
                    control={form.control}
                    name='isFeatured'
                    render={({ field }) => (
                      <FormItem className='space-x-2 items-center'>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <FormLabel>Produit vedette ?</FormLabel>
                      </FormItem>
                    )}
                  />
                  {isFeatured && banner && (
                    <Image
                      src={banner}
                      alt='banner image'
                      className=' w-full object-cover object-center rounded-sm'
                      width={1920}
                      height={680}
                    />
                  )}
                  {isFeatured && !banner && (
                    <UploadButton
                      endpoint='imageUploader'
                      onClientUploadComplete={(res: { url: string }[]) => {
                        form.setValue('banner', res[0].url);
                      }}
                      onUploadError={(error: Error) => {
                        toast.error(`ERROR! ${error.message}`);
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
        <div>
        {/* Description */}
        <FormField
          control={form.control}
          name='description'
          render={({
            field,
          }: {
            field: ControllerRenderProps<
              z.infer<typeof insertProductSchema>,
              'description'
            >
          }) => (
            <FormItem className='w-full'>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='Entrez la description du produit'
                  className='resize-none'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
        <div>
        <Button type='submit' size='lg' disabled={form.formState.isSubmitting} className='button col-span-2 w-full'>
        {form.formState.isSubmitting ? 'Envoi en cours' : `${type === 'Create' ? 'Créer' : 'Mettre à jour'} le produit`}
        </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm;

