'use client';

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import {
  createUpdateReview,
  getReviewByProductId,
} from '@/lib/actions/review.actions';
import { reviewFormDefaultValues } from '@/lib/constants';
import { insertReviewSchema } from '@/lib/validator';
import { z } from 'zod';
import { StarIcon } from 'lucide-react';

type CustomerReview = z.infer<typeof insertReviewSchema>;


const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted,
}: {
  userId: string;
  productId: string;
  onReviewSubmitted: () => void;
}) => {

    const [open, setOpen] = useState(false);

    
    const form = useForm<CustomerReview>({
      resolver: zodResolver(insertReviewSchema),
      defaultValues: reviewFormDefaultValues,
    });

    // Form submit handler
    const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
      const res = await createUpdateReview({ ...values, productId });
  
      if (!res.success) return toast.error(res.message);
  
      setOpen(false);
      onReviewSubmitted();
  
      toast.success(res.message);
  };
  
    const handleOpenForm = async () => {
      form.setValue('productId', productId);
      form.setValue('userId', userId);
    
      const review = await getReviewByProductId({ productId });
    
      if (review) {
        form.setValue('title', review.title);
        form.setValue('description', review.description);
        form.setValue('rating', review.rating);
      }
      setOpen(true);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
          <Button onClick={handleOpenForm} variant='default'>
            Ecrire un avis
          </Button>
          <DialogContent className='sm:max-w-[425px]'>
            <Form {...form}>
              <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Ecrire un avis</DialogTitle>
                  <DialogDescription>
                    Partagez votre avis avec d'autres clients
                  </DialogDescription>
                </DialogHeader>
                <div className='grid gap-4 py-4'>
                  <FormField
                    control={form.control}
                    name='title'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input placeholder='Saisissez un titre' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder='Enter description' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name='rating'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Sélectionnez une note' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 5 }).map((_, index) => (
                              <SelectItem key={index} value={(index + 1).toString()}>
                                {index + 1} <StarIcon className='inline h-4 w-4' />
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <Button
                    type='submit'
                    size='lg'
                    className='w-full'
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? 'Soumission en cours...' : 'Soumettre'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      );
};

export default ReviewForm;