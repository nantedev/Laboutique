'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';
import { toast } from 'sonner'; // Importer depuis Sonner
import { addItemToCart } from '@/lib/actions/cart.actions';
import { CartItem } from '@/types';

const AddToCart = ({ item }: { item: CartItem; }) => {
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

  return <Button className='w-full' type='button' onClick={handleAddToCart}>Ajouter au panier</Button>;
};

export default AddToCart;
