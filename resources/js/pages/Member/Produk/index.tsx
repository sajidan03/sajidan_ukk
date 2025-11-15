import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, usePage, router } from '@inertiajs/react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kelola Produk',
    href: '/produk',
  },
]

interface GambarProduk {
  id: number
  id_produk: number
  nama_gambar: string
}

interface Produk {
  id: number
  encrypted_id: string
  id_kategori: number
  nama_produk: string
  harga: string
  stok: number
  deskripsi: string
  tanggal_upload: string
  url_wa: string;
  id_toko: number
  created_at: string
  updated_at: string
  gambar_produk?: GambarProduk[]
  kategori?: {
    id: number
    nama_kategori: string
  }
  toko?: {
    id: number
    nama_toko: string
  }
}

export default function KelolaProduk() {
  const { props } = usePage()
  const produk = props.produk as Produk[]
  const [searchTerm, setSearchTerm] = useState('')

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      router.delete(`/member/produk/hapus/${id}`)
    }
  }

  const filteredProduk = produk.filter(produkItem =>
    produkItem.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produkItem.deskripsi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produkItem.kategori?.nama_kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    produkItem.toko?.nama_toko.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(Number(amount))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  // Fungsi untuk mendapatkan gambar utama
  const getGambarUtama = (gambarProduk: GambarProduk[] | undefined) => {
    if (!gambarProduk || gambarProduk.length === 0) {
      return '/storage/assets/default-product.jpg'
    }
    // Ambil gambar pertama sebagai gambar utama
    return `/storage/assets/produk/${gambarProduk[0].nama_gambar}`
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Kelola Produk" />
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Kelola Produk</h1>
            <p className="text-gray-600 mt-1">Manajemen data produk SA Market</p>
          </div>

          {/* Search dan Tambah Produk */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Cari produk..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Tombol Export + Tambah Produk */}
            <div className="flex items-center gap-3">
              <a href="/member/produk/export">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export
                </button>
              </a>
              <Link
                href="/member/produk/tambah"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Produk
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
                <th className="px-4 py-3 text-left">Nama Produk</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Harga</th>
                <th className="px-4 py-3 text-left">Stok</th>
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-left">Toko</th>
                <th className="px-4 py-3 text-left">Jumlah Gambar</th>
                <th className="px-4 py-3 text-left">Tanggal Upload</th>
                <th className="px-4 py-3 text-left">URL Wa</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600">
              {filteredProduk.length > 0 ? (
                filteredProduk.map((produkItem, index) => (
                  <tr key={produkItem.id} className="border-b hover:bg-gray-50 transition duration-150">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="relative">
                        <img
                          src={getGambarUtama(produkItem.gambar_produk)}
                          alt={produkItem.nama_produk}
                          className="w-12 h-12 object-cover rounded-lg border"
                          onError={(e) => {
                            e.currentTarget.src = '/storage/assets/default-product.jpg'
                          }}
                        />
                        {produkItem.gambar_produk && produkItem.gambar_produk.length > 1 && (
                          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            +{produkItem.gambar_produk.length - 1}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{produkItem.nama_produk}</td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 text-xs rounded-md">
                        {produkItem.kategori?.nama_kategori || 'Tidak ada kategori'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {formatCurrency(produkItem.harga)}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        produkItem.stok > 10
                          ? 'bg-green-100 text-green-800'
                          : produkItem.stok > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {produkItem.stok} pcs
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs">
                      <div className="line-clamp-2 text-sm" title={produkItem.deskripsi}>
                        {produkItem.deskripsi || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded-md">
                        {produkItem.toko?.nama_toko || 'Tidak tersedia'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        produkItem.gambar_produk && produkItem.gambar_produk.length > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {produkItem.gambar_produk ? produkItem.gambar_produk.length : 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {formatDate(produkItem.tanggal_upload)}
                    </td>
                       <td className="px-4 py-3 text-sm">
                        {produkItem.url_wa }
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          href={`/member/produk/edit/${produkItem.encrypted_id}`}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition duration-200 flex items-center gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(produkItem.encrypted_id)}
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
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-500">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="w-16 h-16 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-lg font-medium">Tidak ada data produk</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {searchTerm ? 'Coba ubah kata kunci pencarian' : 'Mulai dengan menambahkan produk pertama'}
                      </p>
                      {!searchTerm && (
                        <Link
                          href="/member/produk/tambah"
                          className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 inline-flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Tambah Produk Pertama
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
        {filteredProduk.length > 0 && (
          <div className="mt-4 text-sm text-gray-500">
            Menampilkan {filteredProduk.length} dari {produk.length} produk
            {searchTerm && ` untuk pencarian "${searchTerm}"`}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
