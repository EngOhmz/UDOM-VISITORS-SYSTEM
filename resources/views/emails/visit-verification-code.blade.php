<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Visit Verification Code</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background:#0060cc;padding:24px 28px;text-align:center;">
                            <img src="{{ asset('images/udom-logo.png') }}" alt="University of Dodoma" width="72" height="72" style="display:block;margin:0 auto 12px;border-radius:50%;background:#ffffff;padding:4px;">
                            <p style="margin:0;color:#f2a900;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">University of Dodoma</p>
                            <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:bold;">Visitor Management System</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <p style="margin:0 0 8px;color:#334155;font-size:15px;">Hello <strong>{{ $visitRequest->visitor->name ?? 'Visitor' }}</strong>,</p>
                            <p style="margin:0 0 20px;color:#64748b;font-size:14px;line-height:1.6;">
                                Your visit request has been <strong style="color:#0060cc;">approved</strong>. Use the verification code below when you arrive on campus.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:2px solid #0060cc;border-radius:10px;margin-bottom:24px;">
                                <tr>
                                    <td style="padding:20px;text-align:center;">
                                        <p style="margin:0 0 6px;color:#0050a8;font-size:11px;font-weight:bold;letter-spacing:1px;text-transform:uppercase;">Verification Code</p>
                                        <p style="margin:0;color:#002e63;font-size:28px;font-weight:bold;font-family:Courier New,monospace;letter-spacing:4px;">{{ $visitRequest->verification_code }}</p>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;">
                                <tr>
                                    <td style="padding:16px 18px;">
                                        <p style="margin:0 0 10px;color:#475569;font-size:13px;"><strong>Office:</strong> {{ $visitRequest->office->name ?? 'N/A' }}</p>
                                        <p style="margin:0 0 10px;color:#475569;font-size:13px;"><strong>Purpose:</strong> {{ $visitRequest->purpose }}</p>
                                        <p style="margin:0 0 10px;color:#475569;font-size:13px;"><strong>Visit Date:</strong> {{ $visitRequest->visit_date->format('l, F j, Y') }}</p>
                                        @if($visitRequest->visit_time)
                                        <p style="margin:0;color:#475569;font-size:13px;"><strong>Visit Time:</strong> {{ $visitRequest->visit_time }}</p>
                                        @endif
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;line-height:1.6;text-align:center;">
                                Present this code at reception upon arrival.<br>
                                You can also view it by signing in to your UDOM VMS account.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background:#f8fafc;padding:16px 28px;text-align:center;border-top:1px solid #e2e8f0;">
                            <p style="margin:0;color:#94a3b8;font-size:11px;">© {{ date('Y') }} University of Dodoma — Visitor Management System</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
