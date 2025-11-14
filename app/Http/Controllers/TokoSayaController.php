<?php


namespace App\Http\Controllers;

use App\Models\Toko;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

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

            // Pastikan toko milik user yang login
            if ($toko->id_user != Auth::id()) {
                return redirect()->back()->with('error', 'Anda tidak memiliki akses untuk menghapus toko ini.');
            }

            // Hapus toko
            $toko->delete();

            return redirect()->route('member.toko.index')->with('success', 'Toko berhasil dihapus.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Gagal menghapus toko.');
        }
    }
}
