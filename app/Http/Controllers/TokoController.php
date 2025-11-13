<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TokoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $toko = Toko::with('user')->latest()->get();

        return inertia('Admin/Toko/index', [
            'toko' => $toko->map(function ($item) {
                return [
                    'id' => $item->id,
                    'encrypted_id' => encrypt($item->id),
                    'nama_toko' => $item->nama_toko,
                    'deskripsi' => $item->deskripsi,
                    'gambar' => $item->gambar ? '/storage/assets/' . $item->gambar : null,
                    'id_user' => $item->id_user,
                    'kontak_toko' => $item->kontak_toko,
                    'alamat' => $item->alamat,
                    'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $item->updated_at->format('Y-m-d H:i:s'),
                    'user' => $item->user ? [
                        'nama' => $item->user->nama,
                        'username' => $item->user->username,
                    ] : null
                ];
            })
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::where('role', '!=', )->get(['id', 'nama', 'username']);

        return inertia('Admin/Toko/tambah', [
            'users' => $users
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'id_user' => 'required|exists:users,id',
            'kontak_toko' => 'required|string|max:20',
            'alamat' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $gambarPath = null;
            if ($request->hasFile('gambar')) {
                $gambarPath = $request->file('gambar')->store('toko', 'public');
            }

            Toko::create([
                'nama_toko' => $request->nama_toko,
                'deskripsi' => $request->deskripsi,
                'gambar' => $gambarPath,
                'id_user' => $request->id_user,
                'kontak_toko' => $request->kontak_toko,
                'alamat' => $request->alamat,
            ]);

            return redirect()->route('admin.toko.index')
                ->with('success', 'Toko berhasil ditambahkan!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        try {
            $toko = Toko::with('user')->findOrFail(decrypt($id));

            return inertia('Admin/Toko/index', [
                'toko' => [
                    'id' => $toko->id,
                    'encrypted_id' => encrypt($toko->id),
                    'nama_toko' => $toko->nama_toko,
                    'deskripsi' => $toko->deskripsi,
                    'gambar' => $toko->gambar ? Storage::url($toko->gambar) : null,
                    'id_user' => $toko->id,
                    'kontak_toko' => $toko->kontak_toko,
                    'alamat' => $toko->alamat,
                    'created_at' => $toko->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $toko->updated_at->format('Y-m-d H:i:s'),
                    'user' => $toko->user ? [
                        'nama' => $toko->user->nama,
                        'username' => $toko->user->username,
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.toko.index')
                ->with('error', 'Toko tidak ditemukan!');
        }
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        try {
            $toko = Toko::findOrFail(decrypt($id));
            $users = User::where('role', '!=', 'siswa')->get(['id', 'nama', 'username']);

            return inertia('Admin/Toko/Edit', [
                'toko' => [
                    'id' => $toko->id,
                    'encrypted_id' => encrypt($toko->id),
                    'nama_toko' => $toko->nama_toko,
                    'deskripsi' => $toko->deskripsi,
                    'gambar' => $toko->gambar ? Storage::url($toko->gambar) : null,
                    'id_user' => $toko->id_user,
                    'kontak_toko' => $toko->kontak_toko,
                    'alamat' => $toko->alamat,
                ],
                'users' => $users
            ]);
        } catch (\Exception $e) {
            return redirect()->route('admin.toko.index')
                ->with('error', 'Toko tidak ditemukan!');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'nama_toko' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'id_user' => 'required|exists:users,id',
            'kontak_toko' => 'required|string|max:20',
            'alamat' => 'required|string',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $toko = Toko::findOrFail(decrypt($id));

            $gambarPath = $toko->gambar;
            if ($request->hasFile('gambar')) {
                // Hapus gambar lama jika ada
                if ($toko->gambar) {
                    Storage::disk('public')->delete($toko->gambar);
                }
                $gambarPath = $request->file('gambar')->store('toko', 'public');
            }

            $toko->update([
                'nama_toko' => $request->nama_toko,
                'deskripsi' => $request->deskripsi,
                'gambar' => $gambarPath,
                'id_user' => $request->id_user,
                'kontak_toko' => $request->kontak_toko,
                'alamat' => $request->alamat,
            ]);

            return redirect()->route('admin.toko.index')
                ->with('success', 'Toko berhasil diperbarui!');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        try {
            $toko = Toko::findOrFail(decrypt($id));

            // Hapus gambar jika ada
            if ($toko->gambar) {
                Storage::disk('public')->delete($toko->gambar);
            }

            $toko->delete();

            return redirect()->route('admin.toko.index')
                ->with('success', 'Toko berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->route('admin.toko.index')
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

    /**
     * Export data toko
     */
    public function export()
    {
        $toko = Toko::with('user')->latest()->get();

        $fileName = 'data-toko-' . date('Y-m-d') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"',
        ];

        $callback = function() use ($toko) {
            $file = fopen('php://output', 'w');
            fputcsv($file, [
                'No',
                'Nama Toko',
                'Deskripsi',
                'Pemilik',
                'Kontak',
                'Alamat',
                'Tanggal Dibuat'
            ]);

            foreach ($toko as $index => $item) {
                fputcsv($file, [
                    $index + 1,
                    $item->nama_toko,
                    $item->deskripsi,
                    $item->user->nama ?? 'N/A',
                    $item->kontak_toko,
                    $item->alamat,
                    $item->created_at->format('d/m/Y')
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
