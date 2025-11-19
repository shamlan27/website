<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Changed - Security Alert</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #F59E0B;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
        }
        .alert-box {
            background-color: #FEF3C7;
            border-left: 4px solid #F59E0B;
            padding: 20px;
            margin: 20px 0;
            border-radius: 4px;
        }
        .alert-box h3 {
            margin-top: 0;
            color: #92400E;
        }
        .info-table {
            width: 100%;
            margin: 20px 0;
            border-collapse: collapse;
        }
        .info-table td {
            padding: 10px;
            border-bottom: 1px solid #E5E7EB;
        }
        .info-table td:first-child {
            font-weight: bold;
            color: #6B7280;
            width: 40%;
        }
        .button {
            display: inline-block;
            padding: 14px 30px;
            margin: 20px 0;
            background-color: #EF4444;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
        }
        .button:hover {
            background-color: #DC2626;
        }
        .footer {
            background-color: #f9f9f9;
            padding: 20px 30px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
        .security-notice {
            background-color: #FEE2E2;
            border: 1px solid #FCA5A5;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
            color: #991B1B;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>🔒 Security Alert</h1>
        </div>
        
        <div class="content">
            <h2>Hello {{ $user->firstname }}!</h2>
            
            <div class="alert-box">
                <h3>⚠️ Your Password Was Changed</h3>
                <p>We're writing to let you know that your password was successfully changed.</p>
            </div>
            
            <table class="info-table">
                <tr>
                    <td>Date & Time:</td>
                    <td>{{ $timestamp }}</td>
                </tr>
                <tr>
                    <td>IP Address:</td>
                    <td>{{ $ipAddress }}</td>
                </tr>
                <tr>
                    <td>Device/Browser:</td>
                    <td>{{ $userAgent }}</td>
                </tr>
            </table>
            
            <div class="security-notice">
                <strong>⚠️ Didn't change your password?</strong><br>
                If you did not make this change, your account may have been compromised. Please reset your password immediately and contact our support team.
            </div>
            
            <div style="text-align: center;">
                <a href="{{ env('FRONTEND_URL') }}/forgot-password" class="button">Reset Password Now</a>
            </div>
            
            <h3>Security Tips:</h3>
            <ul>
                <li>Never share your password with anyone</li>
                <li>Use a unique password for your account</li>
                <li>Enable two-factor authentication if available</li>
                <li>Regularly update your password</li>
            </ul>
            
            <p>If you have any concerns about your account security, please contact our support team immediately.</p>
            
            <p>Thanks,<br>{{ config('app.name') }} Security Team</p>
        </div>
        
        <div class="footer">
            <p>This is an important security notification.</p>
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
