<?php

namespace App\Http\Controllers;

use App\Models\Toko;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;

class TokoSayaController extends Controller
{
    public function index()
    {
        $toko = Toko::where('id_user', Auth::id())->first();

        if ($toko) {
            $tokoData = [
                'id' => $toko->id,
                'encrypted_id' => encrypt($toko->id),
                'nama_toko' => $toko->nama_toko,
                'deskripsi' => $toko->deskripsi,
                'gambar' => $toko->gambar,
                'id_user' => $toko->id_user,
                'kontak_toko' => $toko->kontak_toko,
                'alamat' => $toko->alamat,
                'created_at' => $toko->created_at,
                'updated_at' => $toko->updated_at,
            ];
        } else {
            $tokoData = null;
        }

        return Inertia::render('Member/Toko/index', [
            'toko' => $tokoData,
        ]);
    }

    public function destroy($id)
    {
        try {
            $decryptedId = decrypt($id);
            $toko = Toko::findOrFail($decryptedId);

            if ($toko->id_user != Auth::id()) {
                return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menghapus toko ini.');
            }

            $toko->delete();

            return redirect()->route('member.toko.index')->with('success', 'Toko berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus toko.');
        }
    }

    // EDIT TOKO - TAMPILAN
    public function editView($id)
    {
        $id = Crypt::encrypt($id);
        $toko = Toko::where('id_user', Auth::id())->first();

        if (!$toko) {
            return redirect()->route('member.toko.index')->with('error', 'Anda belum memiliki toko.');
        }

        return Inertia::render('Member/Toko/edit', [
            'toko' => [
                'id' => $toko->id,
                'encrypted_id' => encrypt($toko->id),
                'nama_toko' => $toko->nama_toko,
                'deskripsi' => $toko->deskripsi,
                'gambar' => $toko->gambar,
                'kontak_toko' => $toko->kontak_toko,
                'alamat' => $toko->alamat,
            ],
        ]);
    }

    // UPDATE TOKO - PROSES
    public function edit(Request $request)
    {
        $toko = Toko::where('id_user', Auth::id())->first();

        if (!$toko) {
            return back()->with('error', 'Anda belum memiliki toko.');
        }

        $request->validate([
            'nama_toko' => 'required|string|max:100',
            'deskripsi' => 'required|string',
            'kontak_toko' => 'required|string|max:13',
            'alamat' => 'required|string',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            $data = [
                'nama_toko' => $request->nama_toko,
                'deskripsi' => $request->deskripsi,
                'kontak_toko' => $request->kontak_toko,
                'alamat' => $request->alamat,
            ];

            // Handle upload gambar jika ada
            if ($request->hasFile('gambar')) {
                // Hapus gambar lama jika ada
                if ($toko->gambar && Storage::exists('assets/toko/' . $toko->gambar)) {
                    Storage::delete('assets/toko/' . $toko->gambar);
                }

                $fileName = time() . '_' . uniqid() . '.' . $request->file('gambar')->getClientOriginalExtension();
                $request->file('gambar')->storeAs('assets/toko', $fileName);
                $data['gambar'] = $fileName;
            }

            $toko->update($data);

            return redirect()->route('member.toko.index')->with('success', 'Toko berhasil diupdate.');

        } catch (\Exception $e) {
            return back()->with('error', 'Gagal mengupdate toko: ' . $e->getMessage());
        }
    }
}
