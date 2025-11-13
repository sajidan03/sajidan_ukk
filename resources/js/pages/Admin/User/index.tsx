import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, usePage, router } from '@inertiajs/react'
import DataTable from 'datatables.net-dt';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kelola user',
    href: '/user',
  },
]

interface User {
  id: number
  nama: string
  username: string
  role: string
  created_at: string
  encrypted_id: string
}

export default function Dashboard() {
  const { props } = usePage()
  const users = props.users as User[]

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      router.delete(`/admin/user/hapus/${id}`)
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="User" />
     <div className="p-6">
  {/* Header */}
  <script>
     let table = new DataTable
  </script>
  <div className="flex items-center justify-between mb-6">
    <h1 className="text-2xl font-bold">Daftar User</h1>

    {/* Tombol Export + Tambah User */}
    <div className="flex items-center gap-3">
     <a href="/admin/user/export">
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
        Export
    </button>
    </a>
      <Link
        href="/admin/user/tambah"
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        + Tambah User
      </Link>
    </div>
</div>


        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Dibuat</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {users.length > 0 ? (
                users.map((users, index) => (
                  <tr key={users.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{users.nama}</td>
                    <td className="px-4 py-3">{users.username}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-md ${
                          users.role === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {users.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">{users.created_at}</td>
                    <td className="px-4 py-3 flex items-center justify-center gap-2">
                      <Link
                        href={`/admin/user/edit/${users.encrypted_id}`}
                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(users.id)}

                        className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                    Tidak ada data
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
