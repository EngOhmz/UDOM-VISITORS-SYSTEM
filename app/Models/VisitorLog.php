<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitorLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'visit_request_id',
        'check_in_at',
        'check_out_at',
        'checked_in_by',
        'checked_out_by',
        'check_in_notes',
        'check_out_notes',
    ];

    protected $casts = [
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
    ];

    public function visitRequest()
    {
        return $this->belongsTo(VisitRequest::class);
    }

    public function getDurationAttribute()
    {
        if ($this->check_in_at && $this->check_out_at) {
            return $this->check_in_at->diffForHumans($this->check_out_at, true);
        }
        return null;
    }
}
