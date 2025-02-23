'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { ArrowRight, Loader, Minus, Plus } from 'lucide-react';
import { Cart } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

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
        </>
    )  
};

export default CartTable;