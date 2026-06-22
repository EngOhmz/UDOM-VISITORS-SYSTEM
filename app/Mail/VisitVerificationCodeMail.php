<?php

namespace App\Mail;

use App\Models\VisitRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VisitVerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $visitRequest;

    public function __construct(VisitRequest $visitRequest)
    {
        $this->visitRequest = $visitRequest;
    }

    public function build()
    {
        return $this->subject('Your UDOM Campus Visit Verification Code')
            ->view('emails.visit-verification-code');
    }
}
