'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';

export default function DeleteDialog({
  id,
  action,
}: {
  id: string;
  action: (id: string) => Promise<{ success: boolean; message: string }>;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDeleteClick = () => {
    startTransition(() => {
      action(id)
        .then((res) => {
          if (!res.success) {
            toast.error(res.message);
            return;
          }
  
          setOpen(false);
          toast.success(res.message);
        })
        .catch((error) => {
          console.error("Erreur lors de la suppression :", error);
          toast.error("Une erreur est survenue.");
        });
    });
  };
  
  

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size='sm' variant='outline'>
          Supprimer
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Voulez vous supprimer ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <Button variant='destructive' size='sm' disabled={isPending} onClick={handleDeleteClick}>
            {isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}