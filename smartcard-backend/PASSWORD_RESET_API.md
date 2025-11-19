# Password Reset API - Documentation

## Endpoints

### 1. Request Password Reset

Send a password reset link to user's email.

```http
POST /api/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Response (User Not Found):**
```json
{
  "success": false,
  "message": "User with this email does not exist"
}
```

### 2. Reset Password

Reset password using the token from email.

```http
POST /api/reset-password
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "the-token-from-email",
  "password": "newPassword123",
  "password_confirmation": "newPassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now login with your new password."
}
```

**Response (Invalid Token):**
```json
{
  "success": false,
  "message": "Invalid reset token"
}
```

**Response (Expired Token):**
```json
{
  "success": false,
  "message": "Reset token has expired. Please request a new one."
}
```

## Frontend Integration

### Step 1: Forgot Password Page

```tsx
const handleForgotPassword = async (email: string) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Password reset link sent to your email!');
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### Step 2: Reset Password Page

```tsx
// Parse token and email from URL query parameters
const searchParams = new URLSearchParams(window.location.search);
const token = searchParams.get('token');
const email = searchParams.get('email');

const handleResetPassword = async (password: string, passwordConfirmation: string) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation
      })
    });

    const data = await response.json();
    
    if (data.success) {
      alert('Password reset successfully!');
      // Redirect to login
      window.location.href = '/login';
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

## Email Configuration

The password reset email is sent using your SMTP settings in `.env`:

```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=sammxd267@gmail.com
MAIL_PASSWORD=xsquuonrbisalqji
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="sammxd267@gmail.com"
MAIL_FROM_NAME="${APP_NAME}"
FRONTEND_URL=http://localhost:3000
```

## Security Features

- ✅ Tokens are hashed before storage
- ✅ Tokens expire after 60 minutes
- ✅ Old tokens are deleted when requesting new reset
- ✅ Tokens are deleted after successful password reset
- ✅ Password must be minimum 8 characters
- ✅ Password confirmation required

## Testing

1. **Test Forgot Password:**
```bash
curl -X POST http://127.0.0.1:8000/api/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

2. **Check email** (or check `storage/logs/laravel.log` if using log driver)

3. **Test Reset Password:**
```bash
curl -X POST http://127.0.0.1:8000/api/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "token":"TOKEN_FROM_EMAIL",
    "password":"newPassword123",
    "password_confirmation":"newPassword123"
  }'
```

## Notes

- Reset links expire in 60 minutes
- Email is sent using configured SMTP in `.env`
- Frontend URL is configured with `FRONTEND_URL` env variable
- Password reset email template is at `resources/views/emails/password-reset.blade.php`
