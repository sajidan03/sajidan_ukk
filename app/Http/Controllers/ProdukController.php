<?php

namespace App\Http\Controllers;

use App\Models\GambarProduk;
use App\Models\Kategori;
use App\Models\Produk;
use App\Models\Toko;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class ProdukController extends Controller
{
    public function index()
    {
        $userToko = Toko::where('id_user', Auth::id())->first();

        if (!$userToko) {
            return redirect()->back()->with('error', 'Anda belum memiliki toko.');
        }

        $produk = Produk::with(['kategori', 'toko', 'gambarProduk'])
            ->where('id_toko', $userToko->id)
            ->latest()
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'encrypted_id' => encrypt($item->id),
                    'id_kategori' => $item->id_kategori,
                    'nama_produk' => $item->nama_produk,
                    'harga' => $item->harga,
                    'stok' => $item->stok,
                    'deskripsi' => $item->deskripsi,
                    'tanggal_upload' => $item->tanggal_upload,
                    'url_wa' => $item->url_wa,
                    'id_toko' => $item->id_toko,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'gambar_produk' => $item->gambarProduk->map(function ($gambar) {
                        return [
                            'id' => $gambar->id,
                            'id_produk' => $gambar->id_produk,
                            'nama_gambar' => $gambar->nama_gambar,
                        ];
                    }),
                    'kategori' => $item->kategori ? [
                        'id' => $item->kategori->id,
                        'nama_kategori' => $item->kategori->nama_kategori,
                    ] : null,
                    'toko' => $item->toko ? [
                        'id' => $item->toko->id,
                        'nama_toko' => $item->toko->nama_toko,
                    ] : null,
                ];
            });

        return Inertia::render('Member/Produk/index', [
            'produk' => $produk,
        ]);
    }

    public function destroy($id)
    {
        try {
            $decryptedId = decrypt($id);
            $produk = Produk::findOrFail($decryptedId);

            $userToko = Toko::where('id_user', Auth::id())->first();
            if ($produk->id_toko != $userToko->id) {
                return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menghapus produk ini.');
            }

            foreach ($produk->gambarProduk as $gambar) {
                $filePath = storage_path('app/assets/produk/' . $gambar->nama_gambar);
                if (file_exists($filePath)) {
                    unlink($filePath);
                }
            }

            $produk->gambarProduk()->delete();

            $produk->delete();

            return redirect()->back()->with('success', 'Produk berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus produk.');
        }
    }

    public function simpanView()
    {
        $kategori = Kategori::all();

        $userToko = Toko::where('id_user', Auth::id())->first();

        if (!$userToko) {
            return redirect()->route('memberProdukView')->with('error', 'Anda belum memiliki toko. Silahkan buat toko terlebih dahulu.');
        }

        return Inertia::render('Member/Produk/tambah', [
            'kategori' => $kategori,
            'toko' => $userToko,
        ]);
    }

    public function simpan(Request $request)
    {
        // dd($request->all());
        $userToko = Toko::where('id_user', Auth::id())->first();

        if (!$userToko) {
            return back()->with('error', 'Anda belum memiliki toko.');
        }

        $request->validate([
            'id_kategori' => 'required|exists:kategoris,id',
            'nama_produk' => 'required|string|max:255',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'deskripsi' => 'required|string',
            'gambar_produk' => 'required|array|min:1|max:5',
            'gambar_produk.*' => 'image|mimes:jpeg,png,jpg|max:2048',
            'url_wa' => 'nullable|string|max:255',
        ]);

        try {
            $produk = Produk::create([
                'id_kategori' => $request->id_kategori,
                'nama_produk' => $request->nama_produk,
                'harga' => $request->harga,
                'stok' => $request->stok,
                'deskripsi' => $request->deskripsi,
                'id_toko' => $userToko->id,
                'tanggal_upload' => now(),
                'url_wa' => $request->url_wa,
            ]);

            if ($request->hasFile('gambar_produk')) {
                foreach ($request->file('gambar_produk') as $gambar) {
                    $fileName = time() . '_' . uniqid() . '.' . $gambar->getClientOriginalExtension();

                    $gambar->storeAs('assets/produk', $fileName);

                    GambarProduk::create([
                        'id_produk' => $produk->id,
                        'nama_gambar' => $fileName
                        // 'nama_gambar' => 'logo.png
                    ]);
                }
            }

            return redirect()->route('memberProdukView')->with('success', 'Produk berhasil ditambahkan.');
        } catch (Exception $e) {
            dd($e->getMessage());
            return back()->with('error', 'Gagal menambahkan produk: ' . $e->getMessage());

        }
    }
//     public function simpan(Request $request)
// {
//     $userToko = Toko::where('id_user', Auth::id())->first();

//     if (!$userToko) {
//         return back()->with('error', 'Anda belum memiliki toko.');
//     }

//     $request->validate([
//         'id_kategori' => 'required|exists:kategoris,id',
//         'nama_produk' => 'required|string|max:255',
//         'harga' => 'required|numeric|min:0',
//         'stok' => 'required|integer|min:0',
//         'deskripsi' => 'required|string',
//         'gambar_produk' => 'required|array|min:1|max:5',
//         'gambar_produk.*' => 'image|mimes:jpeg,png,jpg|max:2048',
//     ]);

//     try {
//         $produk = Produk::create([
//             'id_kategori' => $request->id_kategori,
//             'nama_produk' => $request->nama_produk,
//             'harga' => $request->harga,
//             'stok' => $request->stok,
//             'deskripsi' => $request->deskripsi,
//             'id_toko' => $userToko->id,
//             'tanggal_upload' => now(),
//         ]);

//         if ($request->hasFile('gambar_produk')) {
//             foreach ($request->file('gambar_produk') as $gambar) {
//                 $fileName = time() . '_' . uniqid() . '.' . $gambar->getClientOriginalExtension();
//                 $gambar->storeAs('/storage/assets/produk', $fileName);
//                 GambarProduk::create([
//                     'id_produk' => $produk->id,
//                     'nama_gambar' => $fileName,
//                 ]);
//             }
//         }

//         return redirect()->route('memberProdukView')->with('success', 'Produk berhasil ditambahkan.');
//     } catch (Exception $e) {
//         return back()->with('error', 'Gagal menambahkan produk: ' . $e->getMessage());
//     }
// }
// public function simpan(Request $request)
// {


//     $userToko = Toko::where('id_user', Auth::id())->first();

//     if (!$userToko) {
//         return back()->with('error', 'Anda belum memiliki toko.');
//     }

//     Log::info('📥 Data Request:', $request->all());
//     Log::info('📁 Files:', $request->hasFile('gambar_produk') ? ['count' => count($request->file('gambar_produk'))] : ['no_files']);

//     $request->validate([
//         'id_kategori' => 'required|exists:kategoris,id',
//         'nama_produk' => 'required|string|max:255',
//         'harga' => 'required|numeric|min:0',
//         'stok' => 'required|integer|min:0',
//         'deskripsi' => 'required|string',
//         'gambar_produk' => 'required|array|min:1|max:5',
//         'gambar_produk.*' => 'image|mimes:jpeg,png,jpg|max:2048',
//     ]);

//     try {
//         Log::info('🔄 Membuat produk...');

//         $produk = Produk::create([
//             'id_kategori' => 1,
//             'nama_produk' => $request->nama_produk,
//             'harga' => $request->harga,
//             'stok' => $request->stok,
//             'deskripsi' => $request->deskripsi,
//             'id_toko' => $userToko->id,
//             'tanggal_upload' => now(),
//         ]);

//         Log::info('✅ Produk created dengan ID: ' . $produk->id);

//         if ($request->hasFile('gambar_produk')) {
//             foreach ($request->file('gambar_produk') as $gambar) {
//                 $fileName = time() . '_' . uniqid() . '.' . $gambar->getClientOriginalExtension();
//                 $gambar->storeAs('storage/assets/produk', $fileName);

//                 GambarProduk::create([
//                     'id_produk' => $produk->id,
//                     'nama_gambar' => $fileName,
//                 ]);

//                 Log::info('📸 Gambar disimpan: ' . $fileName);
//             }
//         }

//         Log::info('🎉 Produk berhasil disimpan');
//         // return redirect()->route('memberProdukView')->with('success', 'Produk berhasil ditambahkan.');

//     } catch (Exception $e) {
//         Log::error('❌ Error: ' . $e->getMessage());
//         Log::error('📍 File: ' . $e->getFile());
//         Log::error('📄 Line: ' . $e->getLine());
//         return back()->with('error', 'Gagal menambahkan produk: ' . $e->getMessage());
//     }
// }
}
