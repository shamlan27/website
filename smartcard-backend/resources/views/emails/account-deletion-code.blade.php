<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Confirm Account Deletion - {{ env('APP_NAME') }}</title>
    <style>
        body { font-family: Arial, sans-serif; background:#f6f7fb; margin:0; padding:0; }
        .wrapper { max-width:620px; margin:24px auto; background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
        .header { background:#ffb200; color:#1a1a1a; padding:24px 30px; }
        .header h1 { margin:0; font-size:22px; }
        .content { padding:30px; color:#333; line-height:1.55; }
        .code-box { background:#1a1a1a; color:#fff; letter-spacing:4px; font-size:28px; text-align:center; padding:16px 10px; border-radius:8px; font-weight:600; margin:24px 0; font-family: 'Courier New', monospace; }
        .notice { background:#fff8e6; border:1px solid #ffe4a3; padding:14px 16px; border-radius:6px; margin:18px 0; font-size:14px; }
        .footer { padding:20px 30px; font-size:12px; color:#777; text-align:center; }
        a { color:#ff9800; }
    </style>
</head>
<body>
<div class="wrapper">
    <div class="header">
        <h1>Confirm Your Account Deletion</h1>
    </div>
    <div class="content">
        <p>Hi {{ ucfirst($user->firstname) }},</p>
        <p>You requested to delete your <strong>{{ env('APP_NAME') }}</strong> account. This code is required to confirm the deletion. If you did not initiate this request, ignore this email and your account will remain active.</p>
        <div class="code-box">{{ $plainCode }}</div>
        <p class="notice"><strong>Expires in:</strong> {{ $expiresInMinutes }} minutes. Enter this code promptly — once expired you must request a new one.</p>
        <p>For security, keep this code private. Our team will never ask you for it.</p>
        <p>If you did not request deletion: simply ignore this message. Your account is safe.</p>
        <p>Thanks,<br>The {{ env('APP_NAME') }} Team</p>
    </div>
    <div class="footer">
        <p>&copy; {{ date('Y') }} {{ env('APP_NAME') }}. All rights reserved.</p>
        <p>This automated message relates to account security.</p>
    </div>
</div>
</body>
</html>