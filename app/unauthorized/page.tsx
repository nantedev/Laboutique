import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Unauthorized Access',
};

export default function UnauthorizedPage() {
  return (
    <div className='container mx-auto flex h-[calc(100vh-200px)] flex-col items-center justify-center space-y-4'>
      <h1 className='h1-bold text-4xl'>Accès non autorisé</h1>
      <p className='text-muted-foreground'>
        Vous n'avez pas la permission d'accéder à cette page.
      </p>
      <Button asChild>
        <Link href='/'>Retour à l'accueil</Link>
      </Button>
    </div>
  );
}