<?php

namespace Database\Seeders;

use App\Models\GambarProduk;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Toko;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create(
            [
                'nama' => 'Muhammad Sajidan',
                'username' => 'sajidan',
                'password' => bcrypt('sajidan'),
                'role' => 'admin',
            ]
        );
         User::create(
            [
                'nama' => 'Supri',
                'username' => 'supri',
                'password' => bcrypt('supri'),
                'role' => 'admin',
            ]
        );
        Toko::create(
            [
                'nama_toko' => 'Supri',
                'deskripsi' => 'Menjual berbagai alat perabotan',
                'gambar' => 'toko.png',
                'id_user' => 1,
                'kontak_toko' => '08123456789',
                'alamat' => 'Tasikmalaya',
            ],
        );
        Toko::create(
            [
                'nama_toko' => 'Supri',
                'deskripsi' => 'Menjual berbagai alat perabotan',
                'gambar' => 'toko.png',
                'id_user' => 2,
                'kontak_toko' => '08123456789',
                'alamat' => 'Tasikmalaya',
            ],
        );
        Kategori::create(
            [
                'nama_kategori' => 'Makanan',
            ]
        );
        Produk::create(
            [
                'id_kategori' => 1,
                'nama_produk' => 'Oats meal',
                'harga' => 30000,
                'stok' => 10,
                'deskripsi' => 'Oats meal 1KG Fresh',
                'tanggal_upload' => '2025-05-03',
                'id_toko' => 1,
                'url_Wa'=> 'www.youtube.com',
            ]
        );
        Produk::create(
            [
                'id_kategori' => 1,
                'nama_produk' => 'Kimchi',
                'harga' => 3890,
                'stok' => 10,
                'deskripsi' => 'Kimchi 1 porsi',
                'tanggal_upload' => '2025-05-03',
                'id_toko' => 1,
                'url_Wa'=> 'www.youtube.com',
            ]
        );
        GambarProduk::create([
            'id_produk' => 1,
            'nama_gambar' => 'ramyeon.jpg'
        ]);
         GambarProduk::create([
            'id_produk' => 2,
            'nama_gambar' => 'kimchi.png'
        ]);
    }
}
