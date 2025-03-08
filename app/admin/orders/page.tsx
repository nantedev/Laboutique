import { auth } from '@/auth';
import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth-guard';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import Pagination from '@/components/shared/pagination';
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils';
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions';
import DeleteDialog from '@/components/shared/delete-dialog';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin Orders',
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  await requireAdmin();
  const { page = '1', query: searchText } = await props.searchParams;

  const session = await auth();
  if (session?.user.role !== 'admin')
    throw new Error('Permission requis');

  const orders = await getAllOrders({
    page: Number(page),
    query: searchText,
  });

  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-3'>
         <h1 className='h2-bold'>Commandes</h1>
            {searchText && (
              <div>
                Filtrées par <i>&quot;{searchText}&quot;</i>{' '}
                <Link href={`/admin/orders`}>
                  <Button variant='outline' size='sm'>
                    Supprimer le filtre
                  </Button>
                </Link>
              </div>
            )}
      </div>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>DATE</TableHead>
                <TableHead>TOTAL</TableHead>
                <TableHead>PAYÉ</TableHead>
                <TableHead>LIVRÉ</TableHead>
                <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not Paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Non livrée'}
                </TableCell>
                <TableCell>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/order/${order.id}`}>Détails</Link>
                  </Button>
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
        )}
      </div>
    </div>
  )
};

export default OrdersPage;