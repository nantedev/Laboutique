'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { Order } from '@/types';
import Image from 'next/image';
import Link from 'next/link';

const OrderDetailsTable = ({ order }: { order: Order }) => {

  return (
    <>
      <h1 className='py-4 text-2xl'> Order {formatId(order.id)}</h1>
      <div className='grid md:grid-cols-3 md:gap-5'>
        <div className='overflow-x-auto md:col-span-2 space-y-4'>Content</div>
      </div>
    </>
  );
};

export default OrderDetailsTable;