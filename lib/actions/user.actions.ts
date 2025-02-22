'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { signIn, signOut } from '@/auth';
import { signInFormSchema } from '../validator';

export async function signInWithCredentials(
    prevState: unknown,
    formData: FormData
  ) {
    try {
      const user = signInFormSchema.parse({
        email: formData.get('email'),
        password: formData.get('password'),
      });
  
      await signIn('credentials', user);
  
      return { success: true, message: 'Connexion réussie' };
    } catch (error) {
      if (isRedirectError(error)) {
        throw error;
      }
  
      return { success: false, message: 'Email ou mot de passe invalide' };
    }
  }

  export async function signOutUser() {
    await signOut();
  }