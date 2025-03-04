import { Card, CardContent } from '@/components/ui/card';
import { Headset, ReceiptEuro, ShoppingBag, WalletCards } from 'lucide-react';

const IconBoxes = () => {
    return (
        <div>
          <Card>
            <CardContent className='grid gap-4 md:grid-cols-4 p-4 '>
              <div className='space-y-2'>
                <ShoppingBag />
                <div className='text-sm font-bold'>Livraison gratuite</div>
                <div className='text-sm text-muted-foreground'>
                  Livraison gratuite pour toute commande supérieure à 100€
                </div>
              </div>
              <div className='space-y-2'>
                <ReceiptEuro />
                <div className='text-sm font-bold'>Garantie de remboursement</div>
                <div className='text-sm text-muted-foreground'>
                  Échange possible sous 30 jours
                </div>
              </div>
              <div className='space-y-2'>
                <WalletCards />
                <div className='text-sm font-bold'>Paiement flexible</div>
                <div className='text-sm text-muted-foreground'>
                  Payez par carte bancaire, PayPal ou en espèces à la livraison
                </div>
              </div>
              <div className='space-y-2'>
                <Headset />
                <div className='text-sm font-bold'>Support 24/7</div>
                <div className='text-sm text-muted-foreground'>
                  Assistance disponible à tout moment
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
};

export default IconBoxes