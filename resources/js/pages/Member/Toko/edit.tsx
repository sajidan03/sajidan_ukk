import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { useState, useRef, useEffect } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Kelola Produk',
    href: '/member/produk',
  },
  {
    title: 'Edit Produk',
    href: '/member/produk/edit',
  },
]

interface Kategori {
  id: number
  nama_kategori: string
}

interface GambarProduk {
  id: number
  id_produk: number
  nama_gambar: string
}

interface Produk {
  id: number
  id_kategori: number
  nama_produk: string
  harga: string
  stok: number
  deskripsi: string
  tanggal_upload: string
  id_toko: number
  gambar_produk?: GambarProduk[]
}

export default function EditProduk() {
  const { props } = usePage()
  const kategori = props.kategori as Kategori[]
  const produk = props.produk as Produk

  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<GambarProduk[]>(produk.gambar_produk || [])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data, setData, put, processing, errors } = useForm({
    id_kategori: produk.id_kategori || '',
    nama_produk: produk.nama_produk || '',
    harga: produk.harga || '',
    stok: produk.stok || '',
    deskripsi: produk.deskripsi || '',
    gambar_produk: [] as File[],
    deleted_images: [] as number[], // Untuk gambar yang dihapus
  })

  // Load existing images preview
  useEffect(() => {
    if (produk.gambar_produk) {
      setExistingImages(produk.gambar_produk)
    }
  }, [produk.gambar_produk])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    put(`/member/produk/update/${produk.id}`)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newFiles = Array.from(files)
    const totalFiles = data.gambar_produk.length + newFiles.length + existingImages.length

    if (totalFiles > 5) {
      alert('Maksimal 5 gambar yang dapat diupload')
      return
    }

    setData('gambar_produk', [...data.gambar_produk, ...newFiles])

    // Create preview URLs
    const newPreviews = newFiles.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newPreviews])
  }

  const removeNewImage = (index: number) => {
    const newFiles = data.gambar_produk.filter((_, i) => i !== index)
    const newPreviews = previewImages.filter((_, i) => i !== index)

    setData('gambar_produk', newFiles)
    setPreviewImages(newPreviews)

    URL.revokeObjectURL(previewImages[index])
  }

  const removeExistingImage = (imageId: number) => {
    // Tambahkan ke list gambar yang dihapus
    setData('deleted_images', [...data.deleted_images, imageId])
    // Hapus dari existing images
    setExistingImages(prev => prev.filter(img => img.id !== imageId))
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const getImageUrl = (namaGambar: string) => {
    return `/storage/assets/produk/${namaGambar}`
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Produk" />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Produk</h1>
                <p className="mt-2 text-gray-600">Ubah informasi produk Anda</p>
              </div>
              <Link
                href="/member/produk"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </Link>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm border">
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Kolom Kiri - Data Produk */}
                <div className="space-y-6">
                  {/* Nama Produk */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={data.nama_produk}
                      onChange={e => setData('nama_produk', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan nama produk"
                    />
                    {errors.nama_produk && (
                      <p className="mt-1 text-sm text-red-600">{errors.nama_produk}</p>
                    )}
                  </div>

                  {/* Kategori */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={data.id_kategori}
                      onChange={e => setData('id_kategori', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Pilih Kategori</option>
                      {kategori.map((kat) => (
                        <option key={kat.id} value={kat.id}>
                          {kat.nama_kategori}
                        </option>
                      ))}
                    </select>
                    {errors.id_kategori && (
                      <p className="mt-1 text-sm text-red-600">{errors.id_kategori}</p>
                    )}
                  </div>

                  {/* Harga dan Stok */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          ₩
                        </span>
                        <input
                          type="number"
                          value={data.harga}
                          onChange={e => setData('harga', e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0"
                          min="0"
                        />
                      </div>
                      {errors.harga && (
                        <p className="mt-1 text-sm text-red-600">{errors.harga}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stok <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={data.stok}
                        onChange={e => setData('stok', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                        min="0"
                      />
                      {errors.stok && (
                        <p className="mt-1 text-sm text-red-600">{errors.stok}</p>
                      )}
                    </div>
                  </div>

                  {/* Deskripsi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi Produk <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={data.deskripsi}
                      onChange={e => setData('deskripsi', e.target.value)}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Deskripsikan produk secara detail..."
                    />
                    {errors.deskripsi && (
                      <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
                    )}
                  </div>
                </div>

                {/* Kolom Kanan - Upload Gambar */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Gambar Produk
                      <span className="text-gray-500 text-sm font-normal ml-2">
                        (Maksimal 5 gambar, format: JPG, PNG, JPEG)
                      </span>
                    </label>

                    {/* Upload Area */}
                    <div
                      onClick={triggerFileInput}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition duration-200"
                    >
                      <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 mb-2">
                        Klik untuk upload gambar baru
                      </p>
                      <p className="text-sm text-gray-500">
                        Upload {5 - (existingImages.length + data.gambar_produk.length)} gambar lagi
                      </p>
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      multiple
                      accept="image/jpeg,image/png,image/jpg"
                      className="hidden"
                    />

                    {errors.gambar_produk && (
                      <p className="mt-2 text-sm text-red-600">{errors.gambar_produk}</p>
                    )}
                  </div>

                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Gambar Saat Ini</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {existingImages.map((image) => (
                          <div key={image.id} className="relative group">
                            <img
                              src={getImageUrl(image.nama_gambar)}
                              alt={`Gambar ${image.id}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeExistingImage(image.id)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                              Gambar {image.id}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New Images Preview */}
                  {previewImages.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Gambar Baru</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {previewImages.map((preview, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeNewImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs py-1 text-center">
                              Baru {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h4 className="text-sm font-medium text-blue-800">Tips Edit Produk</h4>
                        <ul className="text-xs text-blue-700 mt-1 space-y-1">
                          <li>• Gambar yang dihapus tidak dapat dikembalikan</li>
                          <li>• Gambar baru akan ditambahkan ke gambar yang sudah ada</li>
                          <li>• Total maksimal 5 gambar termasuk yang sudah ada</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-gray-200">
                <Link
                  href="/member/produk"
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                >
                  Batal
                </Link>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v4m0 12v4m8-10h-4M6 12H2" />
                      </svg>
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Produk
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
