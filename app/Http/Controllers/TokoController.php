<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        foreach ($toko as $item) {
        Log::info("Toko: {$item->nama_toko}, ID User: {$item->id_user}, User: " . ($item->user ? $item->user->nama : 'NULL'));
    }
        return inertia('Admin/Toko/index', [
            'toko' => $toko->map(function ($item) {
                return [
                    'id' => $item->id,
                    'encrypted_id' => encrypt($item->id),
                    'nama_toko' => $item->nama_toko,
                    'deskripsi' => $item->deskripsi,
                    'gambar' => $item->gambar ? '/storage/assets/toko/' . $item->gambar : null,
                    'id_user' => $item->id_user,
                    'kontak_toko' => $item->kontak_toko,
                    'alamat' => $item->alamat,
                    'created_at' => $item->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $item->updated_at->format('Y-m-d H:i:s'),
                    'user' => $item->user ? [
                        'id' => $item->user->id,
                        'nama' => $item->user->nama,
                        'username' => $item->user->username,
                    ] : [
                    'nama' => 'N/A',
                    'username' => 'N/A'
                ]
                ];
            })
        ]);
    }

    public function simpanView()
    {
        $users = User::whereIn('role', ['admin', 'member'])->get(['id', 'nama', 'username']);

        return inertia('Admin/Toko/tambah', [
            'users' => $users
        ]);
    }

   public function simpan(Request $request)
{
    $validator = Validator::make($request->all(), [
        'nama_toko' => 'required|string|max:255',
        'deskripsi' => 'required|string',
        'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif',
        'id_user' => 'required|exists:users,id',
        'kontak_toko' => 'required|string',
        'alamat' => 'required|string',
    ]);

    if ($validator->fails()) {
        return redirect()->back()
            ->withErrors($validator)
            ->withInput();
    }

    try {
        $gambarName = null;
        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $gambarName = 'toko_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            $file->move(public_path('storage/assets/toko'), $gambarName);
        }

        Toko::create([
            'nama_toko' => $request->nama_toko,
            'deskripsi' => $request->deskripsi,
            'gambar' => $gambarName,
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

    public function show($id)
    {
        try {
            $toko = Toko::with('user')->findOrFail(decrypt($id));

            return inertia('Admin/Toko/show', [
                'toko' => [
                    'id' => $toko->id,
                    'encrypted_id' => encrypt($toko->id),
                    'nama_toko' => $toko->nama_toko,
                    'deskripsi' => $toko->deskripsi,
                    'gambar' => $toko->gambar ? '/storage/assets/toko/' . $toko->gambar : null,
                    'id_user' => $toko->id_user,
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

    public function editView($id)
    {
        try {
            $toko = Toko::findOrFail(decrypt($id));
            $users = User::whereIn('role', ['admin', 'member'])->get(['id', 'nama', 'username']);

            return inertia('Admin/Toko/edit', [
                'toko' => [
                    'id' => $toko->id,
                    'encrypted_id' => encrypt($toko->id),
                    'nama_toko' => $toko->nama_toko,
                    'deskripsi' => $toko->deskripsi,
                    'gambar' => $toko->gambar ? '/storage/assets/toko/' . $toko->gambar : null,
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

    public function edit(Request $request, $id)
{
    $validator = Validator::make($request->all(), [
        'nama_toko' => 'required|string|max:255',
        'deskripsi' => 'required|string',
        'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif',
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

        $gambarName = $toko->gambar;
        if ($request->hasFile('gambar')) {
            if ($toko->gambar && file_exists(public_path('storage/assets/toko/' . $toko->gambar))) {
                unlink(public_path('storage/assets/toko/' . $toko->gambar));
            }

            $file = $request->file('gambar');
            $gambarName = 'toko_' . time() . '_' . Str::random(10) . '.' . $file->getClientOriginalExtension();

            $file->move(public_path('storage/assets/toko'), $gambarName);
        }

        $toko->update([
            'nama_toko' => $request->nama_toko,
            'deskripsi' => $request->deskripsi,
            'gambar' => $gambarName,
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

    public function destroy($id)
    {
        try {
            $toko = Toko::findOrFail(decrypt($id));

            if ($toko->gambar && file_exists(public_path('storage/assets/toko/' . $toko->gambar))) {
                unlink(public_path('storage/assets/toko/' . $toko->gambar));
            }

            $toko->delete();

            return redirect()->route('admin.toko.index')
                ->with('success', 'Toko berhasil dihapus!');
        } catch (\Exception $e) {
            return redirect()->route('admin.toko.index')
                ->with('error', 'Terjadi kesalahan: ' . $e->getMessage());
        }
    }

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
