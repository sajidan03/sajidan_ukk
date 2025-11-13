import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, useForm } from '@inertiajs/react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Shield, User } from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Dashboard', href: '/admin' },
  { title: 'Kelola User', href: '/admin/user' },
  { title: 'Tambah User', href: '#' },
]

export default function Create() {
  const { data, setData, post, processing, errors } = useForm({
    nama: '',
    username: '',
    password: '',
    role: 'member',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    post('/admin/user/simpan')
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />
      case 'member': return <User className="w-4 h-4" />
      default: return <User className="w-4 h-4" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-700 border-red-200'
      case 'operator': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-blue-100 text-blue-700 border-blue-200'
    }
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Tambah User" />

      <div className="min-h-screen bg-gray-50 p-6">


        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Form Header */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Form Tambah User
            </h2>
            <p className="text-gray-600 mt-1">
              Lengkapi form berikut untuk menambahkan user baru
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Nama */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Nama Lengkap *
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={data.nama}
                  onChange={(e) => setData('nama', e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.nama && (
                  <div className="text-red-600 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.nama}
                  </div>
                )}
              </div>

              {/* Username */}
              <div className="space-y-3">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username *
                </Label>
                <Input
                  id="username"
                  type="text"
                  value={data.username}
                  onChange={(e) => setData('username', e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.username && (
                  <div className="text-red-600 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.username}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.password && (
                  <div className="text-red-600 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.password}
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="space-y-3">
                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role *
                </Label>
                <Select
                  value={data.role}
                  onValueChange={(value) => setData("role", value)}
                >
                  <SelectTrigger id="role" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Member
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.role && (
                  <div className="text-red-600 text-sm flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    {errors.role}
                  </div>
                )}
              </div>
            </div>

            {/* Role Preview */}
            <div className="p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-medium text-blue-800 mb-3">Preview Role:</h4>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 ${getRoleColor(data.role)}`}>
                {getRoleIcon(data.role)}
                <span className="text-sm font-medium capitalize">{data.role}</span>
              </div>
              <p className="text-sm text-blue-700 mt-3">
                User akan memiliki akses sesuai dengan role yang dipilih.
                <span className="font-medium"> Admin</span> memiliki akses penuh, sedangkan
                <span className="font-medium"> Member</span> memiliki akses terbatas.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
              <Link
                href="/admin/user"
                className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Daftar User
              </Link>
              <Button
                type="submit"
                disabled={processing}
                className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-white rounded-lg transition-all duration-200 flex items-center gap-2 min-w-[140px]"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Simpan User
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Shield className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-2">Informasi Penting</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Pastikan data yang dimasukkan sudah benar dan valid</li>
                <li>• Role yang dipilih akan menentukan hak akses user dalam sistem</li>
                <li>• Password harus kuat dan aman, minimal 8 karakter</li>
                <li>• Username harus unik dan belum digunakan oleh user lain</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
