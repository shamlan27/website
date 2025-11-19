<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Welcome to {{ env('APP_NAME') }}</title>
    <style>
        body { font-family: Arial, sans-serif; background:#f6f7fb; margin:0; padding:0; }
        .wrapper { max-width:640px; margin:0 auto; background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 6px rgba(0,0,0,0.07); }
        .header { background:#2d6cdf; padding:24px 32px; color:#ffffff; }
        .header h1 { margin:0; font-size:24px; }
        .content { padding:32px; color:#333333; line-height:1.5; }
        .btn { display:inline-block; background:#2d6cdf; color:#ffffff !important; text-decoration:none; padding:12px 20px; border-radius:6px; font-weight:600; }
        .tips { background:#f0f4ff; padding:16px 20px; border-left:4px solid #2d6cdf; border-radius:4px; margin:24px 0; }
        .tips h3 { margin:0 0 8px; font-size:16px; }
        .footer { padding:24px 32px; font-size:12px; color:#777777; text-align:center; }
        ul { padding-left:20px; margin:12px 0; }
        li { margin-bottom:6px; }
        .subtle { color:#555; }
        a { color:#2d6cdf; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <h1>Welcome, {{ ucfirst($user->firstname) }} 👋</h1>
        </div>
        <div class="content">
            <p>We're excited to have you on <strong>{{ env('APP_NAME') }}</strong>. Your account has been created successfully.</p>
            <p class="subtle">Get started by exploring your dashboard and creating your first smart card.</p>
            <p>
                <a href="{{ rtrim(env('FRONTEND_URL','http://localhost:3000'),'/') }}/login" class="btn">Go to Dashboard</a>
            </p>
            <div class="tips">
                <h3>Next Steps</h3>
                <ul>
                    <li>Complete your profile details.</li>
                    <li>Create or import a business card.</li>
                    <li>Manage your security: update password if needed.</li>
                    <li>Explore integrations and sharing options.</li>
                </ul>
            </div>
            <p>If you did not register this account, please reply to this email immediately.</p>
            <p>Need help? Just reply — we're here for you.</p>
            <p>Cheers,<br>The {{ env('APP_NAME') }} Team</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ env('APP_NAME') }}. All rights reserved.</p>
            <p>This is an automated message. Please do not share your password.</p>
        </div>
    </div>
</body>
</html>
