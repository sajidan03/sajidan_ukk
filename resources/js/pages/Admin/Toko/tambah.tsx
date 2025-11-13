// resources/js/Pages/Admin/Toko/Create.tsx
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kelola Toko',
    href: '/admin/toko',
  },
  {
    title: 'Tambah Toko',
    href: '/admin/toko/tambah',
  },
]

interface User {
  id: number
  nama: string
  username: string
}

export default function CreateToko({ users }: { users: User[] }) {
  const { data, setData, post, processing, errors } = useForm({
    nama_toko: '',
    deskripsi: '',
    gambar: null as File | null,
    id_user: '',
    kontak_toko: '',
    alamat: '',
  })

  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/toko/tambah')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setData('gambar', file)
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah Toko" />
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-6">Tambah Toko Baru</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama Toko */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Toko *
                </label>
                <input
                  type="text"
                  value={data.nama_toko}
                  onChange={(e) => setData('nama_toko', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan nama toko"
                />
                {errors.nama_toko && (
                  <p className="text-red-500 text-sm mt-1">{errors.nama_toko}</p>
                )}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deskripsi Toko *
                </label>
                <textarea
                  value={data.deskripsi}
                  onChange={(e) => setData('deskripsi', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan deskripsi toko"
                />
                {errors.deskripsi && (
                  <p className="text-red-500 text-sm mt-1">{errors.deskripsi}</p>
                )}
              </div>

              {/* Gambar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gambar Toko
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.gambar && (
                      <p className="text-red-500 text-sm mt-1">{errors.gambar}</p>
                    )}
                  </div>
                  {previewImage && (
                    <div className="w-20 h-20 border rounded-md overflow-hidden">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Pemilik Toko */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pemilik Toko *
                </label>
                <select
                  value={data.id_user}
                  onChange={(e) => setData('id_user', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih Pemilik Toko</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.nama} ({user.username})
                    </option>
                  ))}
                </select>
                {errors.id_user && (
                  <p className="text-red-500 text-sm mt-1">{errors.id_user}</p>
                )}
              </div>

              {/* Kontak Toko */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kontak Toko *
                </label>
                <input
                  type="text"
                  value={data.kontak_toko}
                  onChange={(e) => setData('kontak_toko', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: +62 812-3456-7890"
                />
                {errors.kontak_toko && (
                  <p className="text-red-500 text-sm mt-1">{errors.kontak_toko}</p>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alamat Toko *
                </label>
                <textarea
                  value={data.alamat}
                  onChange={(e) => setData('alamat', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Masukkan alamat lengkap toko"
                />
                {errors.alamat && (
                  <p className="text-red-500 text-sm mt-1">{errors.alamat}</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t">
                <Link
                  href="/admin/toko"
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition duration-200"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {processing ? 'Menyimpan...' : 'Simpan Toko'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
