<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'department_id', 'building', 'description'];

    public function visitRequests()
    {
        return $this->hasMany(VisitRequest::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }
}
