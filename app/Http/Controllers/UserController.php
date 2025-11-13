<?php

namespace App\Http\Controllers;

use App\Exports\UsersExport;
use App\Models\Profil_sekolah;
use App\Models\User;
use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class UserController extends Controller
{
    public function index()
    {
        $users['users'] = User::all()->map(function ($user) {
            return [
                'id' => $user->id,
                'nama' => $user->nama,
                'username' => $user->username,
                'password'=> $user->password,
                'role' => $user->role,
                'created_at' => $user->created_at,
                'encrypted_id' => Crypt::encrypt($user->id),
            ];
        });
        return Inertia::render('Admin/User/index', $users);
    }

    public function userEditView($id)
    {
        try {
            $id = Crypt::decrypt($id);
        } catch (DecryptException $e) {
            abort(404, 'ID tidak valid');
        }

        $user['user'] = User::findOrFail($id);
        return Inertia::render('Admin/User/edit', $user);
    }

    public function tambahView()
    {
        return Inertia::render('Admin/User/tambah');
    }

 public function simpan(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'username' => 'required|string|unique:users,username',
        'password' => 'required',
        'role' => 'required|in:admin,member',
    ]);

    User::create([
        'name' => $request->name,
        'username' => $request->username,
        'password' => bcrypt($request->password),
        'role' => $request->role,
    ]);

return redirect()->route('userView')->with('success', 'User berhasil ditambahkan.');
}

    public function editUser(Request $request, $id)
{
    $user = User::findOrFail($id);

    $request->validate([
        'name' => 'required|string|max:255',
        'username' => 'required|string|unique:users,username,' . $user->id,
        'password' => 'nullable|string|',
        'role' => 'required|in:admin,member',
    ]);

    $data = [
        'name' => $request->name,
        'username' => $request->username,
        'role' => $request->role,
    ];

    if ($request->filled('password')) {
        $data['password'] = bcrypt($request->password);
    }

    $user->update($data);

    return redirect()->route('userView')->with('success', 'User berhasil diperbarui.');
}

    public function hapusUser($id)
{
    $user = User::findOrFail($id);
    $user->delete();

    return redirect()->route('userView')->with('success', 'User berhasil dihapus.');
}
    public function export(){
        return Excel::download(new UsersExport, 'users.xlsx');
    }
}
