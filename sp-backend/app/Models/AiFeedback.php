<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiFeedback extends Model
{
    protected $guarded = [];

    protected $casts = [
        'saran_konkret' => 'array',          
        'perlu_penyesuaian_jadwal' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function roadmap()
    {
        return $this->belongsTo(Roadmap::class);
    }
}
