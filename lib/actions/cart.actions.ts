'use server';

import { CartItem } from '@/types';

export async function addItemToCart (data: CartItem)  {
  return {
    success: true,
    message: 'Produit ajouté à la carte',
  };
};
