<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Account Deleted - {{ env('APP_NAME') }}</title>
    <style>
        body { font-family: Arial, sans-serif; background:#f6f7fb; margin:0; padding:0; }
        .container { max-width:660px; margin:24px auto; background:#fff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,.08); }
        .header { background:#d92d20; color:#fff; padding:22px 28px; }
        .header h1 { margin:0; font-size:22px; }
        .content { padding:28px; color:#333; line-height:1.6; }
        .warning { background:#fff1f0; border:1px solid #ffccc7; color:#a8071a; padding:12px 14px; border-radius:6px; margin:16px 0; }
        .meta { width:100%; border-collapse:collapse; margin-top:12px; }
        .meta th, .meta td { text-align:left; padding:8px 10px; border-bottom:1px solid #f0f0f0; font-size:14px; }
        .footer { padding:20px 28px; font-size:12px; color:#777; text-align:center; }
        .btn { display:inline-block; background:#2d6cdf; color:#fff !important; text-decoration:none; padding:10px 16px; border-radius:6px; font-weight:600; }
        .muted { color:#555; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Account Was Deleted</h1>
        </div>
        <div class="content">
            <p>Hi {{ ucfirst($user->firstname) }},</p>
            <p>This is a confirmation that your <strong>{{ env('APP_NAME') }}</strong> account associated with <strong>{{ $user->email }}</strong> was deleted.</p>
            <table class="meta">
                <tr>
                    <th>Date & Time</th>
                    <td>{{ $timestamp }}</td>
                </tr>
                <tr>
                    <th>IP Address</th>
                    <td>{{ $ipAddress ?? 'Unknown' }}</td>
                </tr>
                <tr>
                    <th>Device / Browser</th>
                    <td>{{ $userAgent ?? 'Unknown' }}</td>
                </tr>
            </table>
            <div class="warning">
                <strong>Didn't request this?</strong> If you did not delete your account, please contact support immediately so we can help you investigate.
            </div>
            <p class="muted">Note: This action is irreversible. If you plan to return, you'll need to create a new account.</p>
            <p>If you need assistance, just reply to this email.</p>
            <p>— The {{ env('APP_NAME') }} Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ env('APP_NAME') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
