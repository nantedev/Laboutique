'use client'
import { SubmitHandler, useForm } from 'react-hook-form';
import { ShippingAddress } from '@/types';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { shippingAddressSchema } from '@/lib/validator';
import { ControllerRenderProps } from 'react-hook-form';
import { shippingAddressDefaultValues } from '@/lib/constants';
import { toast } from 'sonner';
import { useTransition } from 'react';
import { updateUserAddress } from '@/lib/actions/user.actions';
import CheckoutSteps from '@/components/shared/checkout-steps';


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader } from 'lucide-react';

const ShippingAddressForm = ({
  address,
}: {
  address: ShippingAddress | null;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  
  const form = useForm<z.infer<typeof shippingAddressSchema>>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: address || shippingAddressDefaultValues,
  });

const onSubmit: SubmitHandler<z.infer<typeof shippingAddressSchema>> = async (values) => {
  startTransition(async () => {
    const res = await updateUserAddress(values);

    if (!res.success) {
      toast.error(res.message);
      return;
    }

    toast.success('Adresse mise à jour avec succès');
    router.push('/payment-method');
  });
};

return (
  <>
    <CheckoutSteps current={1} />
    <div className='max-w-md mx-auto space-y-4'>
      <h1 className='h2-bold mt-4'>Adresse de livraison</h1>
      <p className='text-sm text-muted-foreground'>
        Veuillez entrer l'adresse à laquelle vous souhaitez envoyer votre commande
      </p>
      <Form {...form}>
        <form
          method="post"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className='flex flex-col gap-5 md:flex-row'>
            <FormField
              control={form.control}
              name='fullName'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'fullName'
                >;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez votre nom complet" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name='streetAddress'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'streetAddress'
                >;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Adresse</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez l'adresse" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex flex-col gap-5 md:flex-row'>
            <FormField
              control={form.control}
              name='city'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'city'
                >;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Ville</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez la ville" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='country'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'country'
                >;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Pays</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le pays" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='postalCode'
              render={({
                field,
              }: {
                field: ControllerRenderProps<
                  z.infer<typeof shippingAddressSchema>,
                  'postalCode'
                >;
              }) => (
                <FormItem className='w-full'>
                  <FormLabel>Code postal</FormLabel>
                  <FormControl>
                    <Input placeholder="Entrez le code postal" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='flex gap-2'>
            <Button type='submit' disabled={isPending}>
              {isPending ? (
                <Loader className='animate-spin w-4 h-4' />
              ) : (
                <ArrowRight className='w-4 h-4' />
              )}
              Continuer
            </Button>
          </div>
        </form>
      </Form>
    </div>
  </>
)

 
};

export default ShippingAddressForm;