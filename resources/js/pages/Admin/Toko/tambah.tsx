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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Tambah Toko Baru</h1>
            <p className="mt-2 text-gray-600">
              Lengkapi form berikut untuk menambahkan toko baru ke sistem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8" encType="multipart/form-data">
            {/* Grid Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Nama Toko */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nama Toko *
                  </label>
                  <input
                    type="text"
                    value={data.nama_toko}
                    onChange={(e) => setData('nama_toko', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Masukkan nama toko"
                  />
                  {errors.nama_toko && (
                    <p className="text-red-500 text-sm mt-2">{errors.nama_toko}</p>
                  )}
                </div>

                {/* Kontak Toko */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Kontak Toko *
                  </label>
                  <input
                    type="text"
                    value={data.kontak_toko}
                    onChange={(e) => setData('kontak_toko', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                    placeholder="Contoh: +62 812-3456-7890"
                  />
                  {errors.kontak_toko && (
                    <p className="text-red-500 text-sm mt-2">{errors.kontak_toko}</p>
                  )}
                </div>

                {/* Pemilik Toko */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pemilik Toko *
                  </label>
                  <select
                    value={data.id_user}
                    onChange={(e) => setData('id_user', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  >
                    <option value="">Pilih Pemilik Toko</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.nama} ({user.username})
                      </option>
                    ))}
                  </select>
                  {errors.id_user && (
                    <p className="text-red-500 text-sm mt-2">{errors.id_user}</p>
                  )}
                </div>

                {/* Gambar */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Gambar Toko
                  </label>
                  <div className="space-y-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {errors.gambar && (
                      <p className="text-red-500 text-sm mt-2">{errors.gambar}</p>
                    )}

                    {previewImage && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Preview Gambar:</p>
                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Deskripsi */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Deskripsi Toko *
                  </label>
                  <textarea
                    value={data.deskripsi}
                    onChange={(e) => setData('deskripsi', e.target.value)}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-vertical"
                    placeholder="Masukkan deskripsi lengkap toko..."
                  />
                  {errors.deskripsi && (
                    <p className="text-red-500 text-sm mt-2">{errors.deskripsi}</p>
                  )}
                </div>

                {/* Alamat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Alamat Toko *
                  </label>
                  <textarea
                    value={data.alamat}
                    onChange={(e) => setData('alamat', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 resize-vertical"
                    placeholder="Masukkan alamat lengkap toko..."
                  />
                  {errors.alamat && (
                    <p className="text-red-500 text-sm mt-2">{errors.alamat}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-8 border-t border-gray-200">
              <Link
                href="/admin/toko"
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 font-medium"
              >
                Batal
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 font-medium flex items-center gap-2"
              >
                {processing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Simpan Toko
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppLayout>
  )
}
