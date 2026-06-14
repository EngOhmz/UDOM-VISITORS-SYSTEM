<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'visitor_id',
        'office_id',
        'user_id',
        'purpose',
        'notes',
        'visit_date',
        'visit_time',
        'status',
        'verification_code',
        'rejection_reason',
    ];

    protected $casts = [
        'visit_date' => 'date',
    ];

    public function visitor()
    {
        return $this->belongsTo(User::class, 'visitor_id');
    }

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function visitorLog()
    {
        return $this->hasOne(VisitorLog::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::updating(function ($visitRequest) {
            if ($visitRequest->status === 'approved' && empty($visitRequest->verification_code)) {
                $visitRequest->verification_code = strtoupper(substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 0, 8));
            }
        });
    }
}
