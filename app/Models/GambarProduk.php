<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Produk;
class GambarProduk extends Model
{
    //
    protected $guarded = [];

     public function produk(){
        return $this->belongsTo(Produk::class, 'id_produk', 'id');
    }
}
