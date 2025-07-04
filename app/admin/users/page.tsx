import Pagination from '@/components/shared/pagination';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import DeleteDialog from '@/components/shared/delete-dialog';
import { getAllUsers, deleteUser } from '@/lib/actions/user.actions';

const AdminUserPage = async (props: {
    searchParams: Promise<{
      page: string;
      query: string;
    }>;
  }) => {
    const searchParams = await props.searchParams;
  
    const { page = '1', query: searchText } = searchParams;
  
    const users = await getAllUsers({ page: Number(page), query: searchText});
  
    return (
        <div className='space-y-2'>
          <div className='flex items-center gap-3'>
                <h1 className='h2-bold'>Utilisateurs</h1>
                {searchText && (
                  <div>
                    Filtrés par <i>&quot;{searchText}&quot;</i>{' '}
                    <Link href={`/admin/users`}>
                      <Button variant='outline' size='sm'>
                        Supprimer le filtre
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>NOM</TableHead>
                  <TableHead>EMAIL</TableHead>
                  <TableHead>ROLE</TableHead>
                  <TableHead>ACTIONS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{formatId(user.id)}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell className='flex gap-1'>
                      <Button asChild variant='outline' size='sm'>
                        <Link href={`/admin/users/${user.id}`}>Edit</Link>
                      </Button>
                      <DeleteDialog id={user.id} action={deleteUser} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {users?.totalPages && users.totalPages > 1 && (
              <Pagination page={page} totalPages={users.totalPages} />
            )}
          </div>
        </div>
      )
  };

export default AdminUserPage;