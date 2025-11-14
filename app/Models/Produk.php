<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\GambarProduk;
class Produk extends Model
{
    //
    protected $guarded = [];
    public function gambarProduk()
    {
        return $this->hasMany(GambarProduk::class, 'id_produk', 'id');
    }

    public function kategori() {
        return $this->belongsTo(Kategori::class, 'id_kategori', 'id');
    }


    public function toko()
{
    return $this->belongsTo(Toko::class, 'id_toko', 'id');
}
}
