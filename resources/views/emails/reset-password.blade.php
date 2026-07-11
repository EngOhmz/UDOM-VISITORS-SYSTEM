<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px;">
        <tr>
            <td align="center">
                <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
                    <tr>
                        <td style="background:#0a5c3c;padding:24px 28px;text-align:center;">
                            <p style="margin:0;color:#d4af37;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">University of Dodoma</p>
                            <h1 style="margin:8px 0 0;color:#ffffff;font-size:20px;font-weight:bold;">Password Reset</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:28px;">
                            <p style="margin:0 0 8px;color:#334155;font-size:15px;">Hello <strong>{{ $user->name ?? 'User' }}</strong>,</p>
                            <p style="margin:0 0 20px;color:#64748b;font-size:14px;line-height:1.6;">
                                We received a request to reset your UDOM Visitor Management System password. Click the button below to choose a new password.
                            </p>

                            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $url }}" style="display:inline-block;background:#0a5c3c;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:14px;font-weight:bold;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0 0 12px;color:#64748b;font-size:13px;line-height:1.6;">
                                This link will expire in 60 minutes. If you did not request a password reset, you can safely ignore this email.
                            </p>
                            <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.6;word-break:break-all;">
                                If the button does not work, copy and paste this link into your browser:<br>
                                {{ $url }}
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
