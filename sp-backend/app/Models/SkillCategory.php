<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SkillCategory extends Model
{
    protected $guarded = [];

    public function skills()
    {
        return $this->hasMany(Skill::class);
    }
}
