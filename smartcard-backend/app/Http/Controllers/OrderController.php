<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OrderConfirmation;
use App\Mail\OrderCancellation;
use App\Http\Requests\StoreOrderRequest;

class OrderController extends Controller
{
    /**
     * Get all orders for the authenticated user
     */
    public function index(Request $request)
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('items')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    /**
     * Get a single order by order_id
     */
    public function show(Request $request, $orderId)
    {
        $order = Order::where('order_id', $orderId)
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->firstOrFail();

        return response()->json([
            'success' => true,
            'order' => $order
        ]);
    }

    /**
     * Create a new order (Checkout)
     */
    public function store(StoreOrderRequest $request)
    {
        $validated = $request->validated();

        // Idempotency: if an order with the same order_id already exists, return it
        $existing = Order::with('items')->where('order_id', $validated['order_id'])->first();
        if ($existing) {
            return response()->json([
                'success' => true,
                'message' => 'Order already created',
                'order' => $existing
            ], 200);
        }

        // Create order
        $order = Order::create([
            'order_id' => $validated['order_id'],
            'user_id' => $request->user()->id,
            'status' => 'pending',
            'total_amount' => $validated['total_amount'],
            'shipping_address' => $validated['shipping_address'],
            'billing_address' => $validated['billing_address'],
            'payment_method' => $validated['payment_method']
        ]);

        // Create order items
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'] ?? null,
                'product_name' => $item['product_name'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'image' => $item['image'] ?? null
            ]);
        }

        // Send confirmation email
        try {
            Mail::to($request->user()->email)->send(new OrderConfirmation($order->load('items')));
        } catch (\Exception $e) {
            // Log error but don't fail the order creation
            Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'order' => $order->load('items')
        ], 201);
    }

    /**
     * Cancel an order
     */
    public function cancel(Request $request, $orderId)
    {
        $order = Order::where('order_id', $orderId)
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->firstOrFail();

        // Check if order can be cancelled
        if (!in_array($order->status, ['pending', 'processing'])) {
            return response()->json([
                'success' => false,
                'message' => 'Order cannot be cancelled at this stage. Only pending or processing orders can be cancelled.'
            ], 400);
        }

        $validated = $request->validate([
            'reason' => 'required|string',
            'comment' => 'nullable|string',
            'refund_method' => 'required|string|in:bank_transfer,original_payment,store_credit'
        ]);

        // Determine refund days based on refund method
        $refundDays = $validated['refund_method'] === 'bank_transfer' ? 14 : 7;

        // Update order
        $order->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['reason'],
            'cancellation_comment' => $validated['comment'] ?? null,
            'refund_method' => $validated['refund_method'],
            'refund_days' => $refundDays
        ]);

        // Send cancellation email
        try {
            Mail::to($request->user()->email)->send(new OrderCancellation($order));
        } catch (\Exception $e) {
            Log::error('Failed to send cancellation email: ' . $e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Order cancelled successfully',
            'order' => $order
        ]);
    }

    /**
     * Update tracking number (Admin only - add middleware as needed)
     */
    public function updateTracking(Request $request, $orderId)
    {
        $order = Order::where('order_id', $orderId)->firstOrFail();

        $validated = $request->validate([
            'tracking_number' => 'required|string|max:100'
        ]);

        $order->update([
            'tracking_number' => $validated['tracking_number'],
            'status' => 'shipped'
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Tracking number updated successfully',
            'order' => $order->load('items')
        ]);
    }

    /**
     * Send order invoice email
     */
    public function sendInvoice(Request $request, $orderId)
    {
        $order = Order::where('order_id', $orderId)
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->firstOrFail();

        try {
            Mail::to($request->user()->email)->send(new OrderConfirmation($order));
            
            return response()->json([
                'success' => true,
                'message' => 'Invoice sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send invoice: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Send order cancellation email
     */
    public function sendCancellation(Request $request, $orderId)
    {
        $order = Order::where('order_id', $orderId)
            ->where('user_id', $request->user()->id)
            ->where('status', 'cancelled')
            ->with('items')
            ->firstOrFail();

        try {
            Mail::to($request->user()->email)->send(new OrderCancellation($order));
            
            return response()->json([
                'success' => true,
                'message' => 'Cancellation email sent successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send cancellation email: ' . $e->getMessage()
            ], 500);
        }
    }
}
