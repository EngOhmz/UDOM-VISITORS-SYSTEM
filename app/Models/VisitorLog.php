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

    protected $appends = [
        'duration',
    ];

    public function visitRequest()
    {
        return $this->belongsTo(VisitRequest::class);
    }

    public function getDurationAttribute()
    {
        if (!$this->check_in_at || !$this->check_out_at) {
            return null;
        }

        $totalMinutes = $this->check_in_at->diffInMinutes($this->check_out_at);

        if ($totalMinutes < 1) {
            return 'Less than 1 min';
        }

        $hours = intdiv($totalMinutes, 60);
        $minutes = $totalMinutes % 60;

        if ($hours > 0 && $minutes > 0) {
            return $hours . ' hr' . ($hours > 1 ? 's' : '') . ' ' . $minutes . ' min' . ($minutes > 1 ? 's' : '');
        }

        if ($hours > 0) {
            return $hours . ' hr' . ($hours > 1 ? 's' : '');
        }

        return $minutes . ' min' . ($minutes > 1 ? 's' : '');
    }
}
