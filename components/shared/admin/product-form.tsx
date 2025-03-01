'use client';

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
  import { Input } from '@/components/ui/input';
  import { toast } from 'sonner';
  import { createProduct, updateProduct } from '@/lib/actions/product.actions';
  import { productDefaultValues } from '@/lib/constants';
  import { insertProductSchema, updateProductSchema } from '@/lib/validator';
  import { ControllerRenderProps } from 'react-hook-form';
  import { Product } from '@/types';
  import { zodResolver } from '@hookform/resolvers/zod';
  import { useRouter } from 'next/navigation';
  import { useForm } from 'react-hook-form';
  import { z } from 'zod';
  import { Card, CardContent } from '@/components/ui/card';
  import Image from 'next/image';
  import { Button } from '@/components/ui/button';



  const ProductForm = ({
    type,
    product,
    productId,
  }: {
    type: 'Create' | 'Update';
    product?: Product;
    productId?: string;
  }) => {
    const router = useRouter();
  
    return <>Form</>;
  };


  export default ProductForm;

