<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect to Google OAuth
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle Google OAuth callback
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            return $this->handleSocialLogin($googleUser, 'google');
        } catch (\Exception $e) {
            Log::error('Google OAuth Error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/callback?error=" . urlencode($e->getMessage()));
        }
    }

    /**
     * Redirect to Facebook OAuth
     */
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->stateless()->redirect();
    }

    /**
     * Handle Facebook OAuth callback
     */
    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            
            return $this->handleSocialLogin($facebookUser, 'facebook');
        } catch (\Exception $e) {
            Log::error('Facebook OAuth Error: ' . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect()->away("{$frontendUrl}/auth/callback?error=" . urlencode($e->getMessage()));
        }
    }

    /**
     * Common handler for social login
     */
    private function handleSocialLogin($socialUser, $provider)
    {
        // Split name into first and last name
        $nameParts = explode(' ', $socialUser->getName(), 2);
        $firstname = $nameParts[0] ?? $socialUser->getName();
        $lastname = $nameParts[1] ?? '';

        // Find or create user
        $user = User::where('email', $socialUser->getEmail())->first();

        if (!$user) {
            // Create new user
            $user = User::create([
                'firstname' => $firstname,
                'lastname' => $lastname,
                'email' => $socialUser->getEmail(),
                'password' => Hash::make(Str::random(24)), // Random password for social users
                'email_verified_at' => now(),
                'provider' => $provider,
                'provider_id' => $socialUser->getId()
            ]);

            // Send welcome email
            try {
                Mail::send('emails.welcome', ['user' => $user], function ($message) use ($user) {
                    $message->to($user->email);
                    $message->subject('Welcome to ' . env('APP_NAME'));
                });
            } catch (\Exception $e) {
                Log::error('Failed to send welcome email for social auth: ' . $e->getMessage());
            }
        } else {
            // Update existing user's provider info if not set
            if (!$user->provider) {
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId()
                ]);
            }
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Redirect to frontend with token
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        
        return redirect()->away("{$frontendUrl}/auth/callback?token={$token}&user=" . urlencode(json_encode([
            'id' => $user->id,
            'firstname' => $user->firstname,
            'lastname' => $user->lastname,
            'email' => $user->email
        ])));
    }
}
