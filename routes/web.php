<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\BeritaController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EkskulController;
use App\Http\Controllers\GaleriController;
use App\Http\Controllers\GuruController;
use App\Http\Controllers\OperatorBerita;
use App\Http\Controllers\OperatorController;
use App\Http\Controllers\OperatorEskul;
use App\Http\Controllers\OperatorGaleri;
use App\Http\Controllers\OperatorMapel;
use App\Http\Controllers\OperatorGuru;
use App\Http\Controllers\OperatorProfilSekolah;
use App\Http\Controllers\OperatorSiswa;
use App\Http\Controllers\ProfilSekolahController;
use App\Http\Controllers\MapelController;
use App\Http\Controllers\SiswaController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\FaxController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\TokoController;
use App\Models\Ekstrakulikuler;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'index'])->name('home');
//login
Route::get('/login', [LoginController::class,'loginShow'])->name('login');
Route::post('/login', [LoginController::class,'login'])->name('loginPost');
Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->group(function () {
        Route::get('dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');
        //kelola-user
        Route::get('user', [UserController::class, 'index'])->name('userView');
        Route::get('user/tambah', [UserController::class, 'tambahView'])->name('userTambahView');
        Route::post('user/simpan', [UserController::class, 'simpan'])->name('userSimpan');
        Route::get('user/edit/{id}', [UserController::class, 'userEditView'])->name('userEditView');
        Route::post('user/edit/{id}', [UserController::class, 'editUser'])->name('userEdit');
        Route::delete('user/hapus/{id}', [UserController::class, 'hapusUser'])->name('userHapus');
        //kelola-toko
        Route::get('/toko', [TokoController::class, 'index'])->name('admin.toko.index');
        Route::get('/toko/tambah', [TokoController::class, 'create'])->name('admin.toko.create');
        Route::post('/toko/tambah', [TokoController::class, 'store'])->name('admin.toko.store');
        Route::get('/toko/{id}', [TokoController::class, 'show'])->name('admin.toko.show');
        Route::get('/toko/edit/{id}', [TokoController::class, 'edit'])->name('admin.toko.edit');
        Route::put('/toko/edit/{id}', [TokoController::class, 'update'])->name('admin.toko.update');
        Route::delete('/toko/hapus/{id}', [TokoController::class, 'destroy'])->name('admin.toko.destroy');
        Route::get('/toko/export', [TokoController::class, 'export'])->name('admin.toko.export');
    });

Route::middleware(['auth', 'verified'])
    ->prefix('member')
    ->group(function () {
        Route::get('dashboard', [MemberController::class, 'index'])->name('operator.dashboard');
        });

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
