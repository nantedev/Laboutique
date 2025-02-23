'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus, Minus } from 'lucide-react';
import { toast } from 'sonner'; // Importer depuis Sonner
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { Cart, CartItem } from '@/types';

const AddToCart = ({cart, item }: { cart?: Cart; item: CartItem; }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    // Execute the addItemToCart action
    const res = await addItemToCart(item);

    // Afficher le message d'erreur en cas d'échec
    if (!res.success) {
      toast.error(res.message); // Utilisation de toast.error pour afficher un message rouge
      return;
    }

    // Afficher un toast de succès avec une action
    toast.success(`${item.name} ajouté(e) au panier`, {
      action: {
        label: 'Revenir au panier',
        onClick: () => router.push('/cart'),
      },
    });
  };

  // Remove item from cart
  const handleRemoveFromCart = async () => {
    const res = await removeItemFromCart(item.productId);
  
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    return;
  };
    //Check if item is in cart
  
    const existItem = cart && cart.items.find((x) => x.productId === item.productId);
  
    return existItem ? (
    <div>
      <Button type='button' variant='outline' onClick={handleRemoveFromCart}>
        <Minus className='w-4 h-4' />
      </Button>
      <span className='px-2'>{existItem.qty}</span>
      <Button type='button' variant='outline' onClick={handleAddToCart}>
        <Plus className='w-4 h-4' />
      </Button>
    </div>
  ) : (
    <Button className='w-full' type='button' onClick={handleAddToCart}>
      <Plus className='w-4 h-4' />
      Add to cart
    </Button>
  );
  };
    




export default AddToCart;
