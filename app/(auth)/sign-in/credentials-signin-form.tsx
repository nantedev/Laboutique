'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInDefaultValues } from '@/lib/constants';
import Link from 'next/link';

const CredentialsSignInForm = () => {
  return (
    <form>
      <div className='space-y-6'>
        <div>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            required
            type='email'
            defaultValue={signInDefaultValues.email}
            autoComplete='email'
          />
        </div>
        <div>
          <Label htmlFor='password'>Mot de passe</Label>
          <Input
            id='password'
            name='password'
            required
            type='password'
            defaultValue={signInDefaultValues.password}
            autoComplete='current-password'
          />
        </div>
        <div>
          <Button className='w-full' variant='default'>
          Se connecter avec vos identifiants
          </Button>
        </div>

        <div className='text-sm text-center text-muted-foreground'>
          Pas de compte ?{' '}
          <Link target='_self' className='link' href='/sign-up'>
            Inscrivez-vous
          </Link>
        </div>
      </div>
    </form>
  );
};

export default CredentialsSignInForm;