<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\SocialAuthController;
use App\Http\Controllers\UserController;


Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'forgotPassword']);
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// Social Auth Routes
Route::get('/auth/google', [SocialAuthController::class, 'redirectToGoogle']);
Route::get('/auth/google/callback', [SocialAuthController::class, 'handleGoogleCallback']);
Route::get('/auth/facebook', [SocialAuthController::class, 'redirectToFacebook']);
Route::get('/auth/facebook/callback', [SocialAuthController::class, 'handleFacebookCallback']);

// Temporary debug route
Route::get('/debug/order-items', function () {
    return DB::table('order_items')->orderBy('created_at', 'desc')->limit(5)->get();
});

// Local-only: simple mail test endpoint
if (app()->environment('local')) {
    Route::get('/debug/test-mail', function (Request $request) {
        $to = $request->query('to', config('mail.from.address'));
        // Sanitize and validate the target email
        $to = is_string($to) ? $to : strval($to);
        $to = trim($to);
        $to = trim($to, " \t\n\r\0\x0B\"'<>");
        if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
            return response()->json([
                'ok' => false,
                'error' => 'Invalid email address. Provide ?to=name@example.com'
            ], 422);
        }
        try {
            \Illuminate\Support\Facades\Mail::raw('Test email from ' . config('app.name') . ' at ' . now()->toDateTimeString(), function ($message) use ($to) {
                $message->to($to);
                $message->subject('Test Mail - ' . config('app.name'));
            });
            return response()->json(['ok' => true, 'to' => $to]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Test mail failed: ' . $e->getMessage());
            return response()->json(['ok' => false, 'error' => $e->getMessage()], 500);
        }
    });

    Route::get('/debug/check-db', function () {
        try {
            $dbName = DB::connection()->getDatabaseName();
            $userCount = DB::table('users')->count();
            $users = DB::table('users')->select('id', 'email', 'provider')->get();
            
            return response()->json([
                'database' => $dbName,
                'user_count' => $userCount,
                'users' => $users,
                'connection' => config('database.default')
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });

    Route::delete('/debug/force-delete-user/{id}', function ($id) {
        try {
            $user = DB::table('users')->where('id', $id)->first();
            if (!$user) {
                return response()->json(['error' => 'User not found'], 404);
            }

            DB::beginTransaction();
            
            // Delete all related data
            $tokensDeleted = DB::table('personal_access_tokens')->where('tokenable_id', $id)->delete();
            $deletionTokens = DB::table('account_deletion_tokens')->where('user_id', $id)->delete();
            $resetTokens = DB::table('password_reset_tokens')->where('email', $user->email)->delete();
            
            $orderIds = DB::table('orders')->where('user_id', $id)->pluck('id');
            $orderItemsDeleted = 0;
            $ordersDeleted = 0;
            if ($orderIds->count() > 0) {
                $orderItemsDeleted = DB::table('order_items')->whereIn('order_id', $orderIds)->delete();
                $ordersDeleted = DB::table('orders')->where('user_id', $id)->delete();
            }
            
            $cardsDeleted = DB::table('business_cards')->where('user_id', $id)->delete();
            $userDeleted = DB::table('users')->where('id', $id)->delete();
            
            DB::commit();
            
            $stillExists = DB::table('users')->where('id', $id)->exists();
            
            return response()->json([
                'success' => !$stillExists,
                'deleted' => [
                    'user' => $userDeleted,
                    'tokens' => $tokensDeleted,
                    'deletion_tokens' => $deletionTokens,
                    'reset_tokens' => $resetTokens,
                    'cards' => $cardsDeleted,
                    'orders' => $ordersDeleted,
                    'order_items' => $orderItemsDeleted
                ],
                'still_exists' => $stillExists
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    });
}

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user/update', [UserController::class, 'updateProfile']);
    Route::put('/user/change-password', [UserController::class, 'changePassword']);
    Route::delete('/user/delete-account', [UserController::class, 'deleteAccount']);
    // Fallback alias for clients that cannot send DELETE (to avoid 405)
    Route::post('/user/delete-account', [UserController::class, 'deleteAccount']);
    Route::post('/user/request-delete', [UserController::class, 'requestDeleteAccount']);
    
    Route::post('/cards', [CardController::class, 'store']);
    Route::get('/cards', [CardController::class, 'index']);
    
    // Order Management Routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{orderId}', [OrderController::class, 'show']);
    Route::post('/orders/{orderId}/cancel', [OrderController::class, 'cancel']);
    Route::put('/orders/{orderId}/tracking', [OrderController::class, 'updateTracking']);
    Route::post('/orders/{orderId}/send-invoice', [OrderController::class, 'sendInvoice']);
    Route::post('/orders/{orderId}/send-cancellation', [OrderController::class, 'sendCancellation']);
});