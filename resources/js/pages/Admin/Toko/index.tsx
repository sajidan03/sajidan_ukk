import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kelola Toko',
    href: '/toko',
  },
]

interface Toko {
  id: number
  nama_toko: string
  deskripsi: string
  gambar: string
  id_user: number
  kontak_toko: string
  alamat: string
  created_at: string
  updated_at: string
  encrypted_id: string
  user?: {
    nama: string
    username: string
  }
}

export default function KelolaToko() {
  const { props } = usePage()
  const toko = props.toko as Toko[]
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus toko ini?')) {
      router.delete(`/admin/toko/hapus/${id}`)
    }
  }

  // Filter toko berdasarkan search term
  const filteredToko = toko.filter(tokoItem =>
    tokoItem.nama_toko.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tokoItem.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tokoItem.kontak_toko.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kelola Toko" />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Kelola Toko</h1>
            <p className="text-gray-600 mt-1">Manajemen data toko SA Market</p>
          </div>

          {/* Search dan Tambah Toko */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari toko..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Tombol Export + Tambah Toko */}
            <div className="flex items-center gap-3">
              <a href="/admin/toko/export">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </a>
              <Link
                href="/admin/toko/tambah"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Toko
              </Link>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto border-collapse">
            <thead className="bg-gray-100 text-gray-700 text-sm">
              <tr>
                <th className="px-4 py-3 text-left">No</th>
                <th className="px-4 py-3 text-left">Gambar</th>
                <th className="px-4 py-3 text-left">Nama Toko</th>
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-left">Kontak</th>
                <th className="px-4 py-3 text-left">Alamat</th>
                <th className="px-4 py-3 text-left">Pemilik</th>
                <th className="px-4 py-3 text-left">Dibuat</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filteredToko.length > 0 ? (
                filteredToko.map((tokoItem, index) => (
                  <tr key={tokoItem.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <img
                        src={tokoItem.gambar || '/storage/assets/default-store.jpg'}
                        alt={tokoItem.nama_toko}
                        className="w-12 h-12 object-cover rounded-lg border"
                        onError={(e) => {
                          e.currentTarget.src = '/storage/assets/default-store.jpg'
                        }}
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{tokoItem.nama_toko}</td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="line-clamp-2" title={tokoItem.deskripsi}>
                        {tokoItem.deskripsi}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {tokoItem.kontak_toko}
                      </div>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="line-clamp-2" title={tokoItem.alamat}>
                        {tokoItem.alamat}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md">
                        {tokoItem.user?.nama || 'N/A'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(tokoItem.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/admin/toko/edit/${tokoItem.encrypted_id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(tokoItem.id)}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition duration-200 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="text-lg font-medium">Tidak ada data toko</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan toko pertama'}
                      </p>
                      {!searchTerm && (
                        <Link
                          href="/admin/toko/tambah"
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 inline-flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Tambah Toko Pertama
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Info Summary */}
        {filteredToko.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {filteredToko.length} dari {toko.length} toko
            {searchTerm && ` untuk pencarian "${searchTerm}"`}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
