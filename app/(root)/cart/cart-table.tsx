'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import { Cart } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';

const CartTable = ({ cart }: { cart?: Cart }) => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    return (
        <>
        <h1 className='py-4 h2-bold'>Votre panier</h1>
        {!cart || cart.items.length === 0 ? (
            <div>
            Le panier est vide. <Link href='/'>Poursuivre les achats ?</Link>
            </div>
        ) : (
            <div className='grid md:grid-cols-4 md:gap-5'>
            <div className='overflow-x-auto md:col-span-3'></div>
            </div>
        )}
        <div className='grid md:grid-cols-4 md:gap-5'>
        <div className='overflow-x-auto md:col-span-3'>
        <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead className='text-center'>Quantité</TableHead>
                <TableHead className='text-right'>Prix</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
            {cart?.items.map((item) => (
            <TableRow key={item.slug}>
            <TableCell>
                <Link href={`/product/${item.slug}`} className='flex items-center'>
                <Image
                    src={item.image}
                    alt={item.name}
                    width={50}
                    height={50}
                ></Image>
                <span className='px-2'>{item.name}</span>
                </Link>
            </TableCell>
            <TableCell className='flex-center gap-2'>
                <Button
                    disabled={isPending}
                    variant='outline'
                    type='button'
                    onClick={() =>
                    startTransition(async () => {
                        const res = await removeItemFromCart(item.productId);
                        if (!res.success) {
                        toast.error(res.message);
                        } else {
                        toast.success('Produit retiré du panier');
                        }
                    })
                    }
                >
                    {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                    ) : (
                    <Minus className='w-4 h-4' />
                    )}
                </Button>
                
                <span>{item.qty}</span>
                
                <Button
                    disabled={isPending}
                    variant='outline'
                    type='button'
                    onClick={() =>
                    startTransition(async () => {
                        const res = await addItemToCart(item);
                        if (!res.success) {
                        toast.error(res.message);
                        } else {
                        toast.success('Produit ajouté au panier');
                        }
                    })
                    }
                >
                    {isPending ? (
                    <Loader className='w-4 h-4 animate-spin' />
                    ) : (
                    <Plus className='w-4 h-4' />
                    )}
                </Button>
            </TableCell>
            <TableCell className='text-right'>{item.price}€</TableCell>
            </TableRow>
        ))}
        </TableBody>
        </Table>
        </div>
            <Card>
                <CardContent className='p-4   gap-4'>
                    <div className='pb-3 text-xl'>
                    Total ({cart?.items.reduce((a, c) => a + c.qty, 0) ?? 0} article{ cart?.items.length && cart?.items.length > 1? 's' :"" }) :{" "}
                    {cart ? formatCurrency(cart.itemsPrice) : '0€'}
                    </div>
                    <Button
                    onClick={() => startTransition(() => router.push('/shipping-address'))}
                    className='w-full'
                    disabled={isPending}
                    >
                    {isPending ? (
                        <Loader className='animate-spin w-4 h-4' />
                    ) : (
                        <ArrowRight className='w-4 h-4' />
                    )}
                    Procéder au paiement
                    </Button>
                </CardContent>
            </Card>
        </div>
        </>
    )  
};

export default CartTable;