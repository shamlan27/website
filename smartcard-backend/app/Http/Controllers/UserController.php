<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class UserController extends Controller
{
    private int $deletionCodeExpiryMinutes = 15;
    /**
     * Update user profile
     */
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                'max:255',
                Rule::unique('users')->ignore($user->id),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user->firstname = $request->firstname;
            $user->lastname = $request->lastname;
            $user->email = $request->email;
            $user->save();

            Log::info('User profile updated', [
                'user_id' => $user->id,
                'changes' => $request->only(['firstname', 'lastname', 'email'])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'user' => [
                    'id' => $user->id,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Profile update error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile'
            ], 500);
        }
    }

    /**
     * Change user password
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verify current password
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Current password is incorrect'
            ], 400);
        }

        try {
            $user->password = Hash::make($request->new_password);
            $user->save();

            Log::info('User password changed', [
                'user_id' => $user->id,
                'ip' => $request->ip()
            ]);

            // Send security alert email
            try {
                Mail::send('emails.password-changed-alert', [
                    'user' => $user,
                    'timestamp' => Carbon::now()->format('F j, Y, g:i a'),
                    'ipAddress' => $request->ip(),
                    'userAgent' => $request->userAgent()
                ], function ($message) use ($user) {
                    $message->to($user->email);
                    $message->subject('Security Alert: Password Changed - ' . env('APP_NAME'));
                });
            } catch (\Exception $e) {
                Log::error('Failed to send password change alert: ' . $e->getMessage());
            }

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Password change error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to change password'
            ], 500);
        }
    }

    /**
     * Delete the authenticated user's account
     */
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        try {
            // Validate required fields
            $request->validate([
                'code' => 'required|string|min:6'
            ]);

            // Only require password if not a social-auth user
            if (!$user->provider) {
                $request->validate([
                    'password' => 'required|string'
                ]);
                if (!Hash::check($request->password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Password is incorrect'
                    ], 403);
                }
            }

            // Fetch latest code
            $tokenRow = DB::table('account_deletion_tokens')
                ->where('user_id', $user->id)
                ->orderByDesc('id')
                ->first();

            if (!$tokenRow) {
                return response()->json([
                    'success' => false,
                    'message' => 'No deletion code found. Request a new one.'
                ], 400);
            }

            // Check expiry
            $createdAt = Carbon::parse($tokenRow->created_at);
            if ($createdAt->addMinutes($this->deletionCodeExpiryMinutes)->isPast()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Deletion code expired. Request a new one.'
                ], 400);
            }

            // Validate code match
            if (!Hash::check($request->code, $tokenRow->code)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid deletion code'
                ], 403);
            }

            Log::info('Account deletion initiated', [
                'user_id' => $user->id,
                'email' => $user->email,
                'ip' => $request->ip()
            ]);

            // Send deletion alert email before deleting the user
            try {
                Mail::send('emails.account-deleted-alert', [
                    'user' => $user,
                    'timestamp' => now()->format('F j, Y, g:i a'),
                    'ipAddress' => $request->ip(),
                    'userAgent' => $request->userAgent()
                ], function ($message) use ($user) {
                    $message->to($user->email);
                    $message->subject('Account Deleted - ' . env('APP_NAME'));
                });
            } catch (\Exception $e) {
                Log::error('Failed to send account deletion alert: ' . $e->getMessage());
            }

            // Perform HARD deletion with diagnostics (bypass soft deletes)
            $userId = $user->id;
            $userEmail = $user->email;
            $deletedRows = 0;
            
            DB::transaction(function () use ($user, $userId, &$deletedRows) {
                // Revoke tokens
                if (method_exists($user, 'tokens')) {
                    $tokenCount = $user->tokens()->count();
                    $user->tokens()->delete();
                    Log::info('Revoked tokens before deletion', [
                        'user_id' => $userId,
                        'tokens_revoked' => $tokenCount
                    ]);
                }
                
                // Delete related data manually (bypass foreign key constraints if any)
                DB::table('account_deletion_tokens')->where('user_id', $userId)->delete();
                DB::table('password_reset_tokens')->where('email', $user->email)->delete();
                
                // Delete orders and order items if exist
                $orderIds = DB::table('orders')->where('user_id', $userId)->pluck('id');
                if ($orderIds->count() > 0) {
                    DB::table('order_items')->whereIn('order_id', $orderIds)->delete();
                    DB::table('orders')->where('user_id', $userId)->delete();
                }
                
                // Delete business cards
                DB::table('business_cards')->where('user_id', $userId)->delete();
                
                // FORCE HARD DELETE from users table
                $deletedRows = DB::table('users')->where('id', $userId)->delete();
            });

            Log::info('Post-transaction deletion check', [
                'user_id' => $userId,
                'user_email' => $userEmail,
                'deleted_rows' => $deletedRows
            ]);

            // Final existence check
            $exists = DB::table('users')->where('id', $userId)->exists();
            if ($exists) {
                Log::error('User still exists after hard deletion', [
                    'user_id' => $userId,
                    'deleted_rows' => $deletedRows
                ]);
                return response()->json([
                    'success' => false,
                    'message' => 'Account could not be deleted after multiple attempts. Contact support.',
                    'debug' => [
                        'user_id' => $userId,
                        'deleted_rows' => $deletedRows
                    ]
                ], 500);
            }

            Log::info('Account deleted successfully', [
                'user_id' => $userId,
                'email' => $userEmail
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Account deleted successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Account deletion error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete account'
            ], 500);
        }
    }

    /**
     * Request account deletion code
     */
    public function requestDeleteAccount(Request $request)
    {
        $user = $request->user();

        try {
            // Generate 6-digit code
            $plainCode = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            $hashed = Hash::make($plainCode);

            // Remove previous tokens for user
            DB::table('account_deletion_tokens')->where('user_id', $user->id)->delete();
            DB::table('account_deletion_tokens')->insert([
                'user_id' => $user->id,
                'code' => $hashed,
                'created_at' => Carbon::now()
            ]);

            // Send code email
            try {
                Mail::send('emails.account-deletion-code', [
                    'user' => $user,
                    'plainCode' => $plainCode,
                    'expiresInMinutes' => $this->deletionCodeExpiryMinutes
                ], function ($message) use ($user) {
                    $message->to($user->email);
                    $message->subject('Confirm Account Deletion - ' . env('APP_NAME'));
                });
            } catch (\Exception $e) {
                Log::error('Account deletion code email failed: ' . $e->getMessage());
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to send deletion code email'
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => 'Deletion confirmation code sent to your email'
            ]);
        } catch (\Exception $e) {
            Log::error('Request delete account error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate deletion code'
            ], 500);
        }
    }
}
