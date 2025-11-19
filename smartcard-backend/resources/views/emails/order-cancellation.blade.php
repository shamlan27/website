<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f44336; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .items { margin: 20px 0; }
        .item { padding: 10px; border-bottom: 1px solid #ddd; }
        .refund-box { background: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Order Cancelled</h1>
        </div>
        
        <div class="content">
            <div class="order-info">
                <p>Your order <strong>{{ $order->order_id }}</strong> has been cancelled successfully.</p>
                <p><strong>Cancellation Date:</strong> {{ $order->updated_at->format('F d, Y H:i') }}</p>
                @if($order->cancellation_reason)
                <p><strong>Reason:</strong> {{ ucfirst(str_replace('_', ' ', $order->cancellation_reason)) }}</p>
                @endif
                @if($order->cancellation_comment)
                <p><strong>Comment:</strong> {{ $order->cancellation_comment }}</p>
                @endif
            </div>

            <div class="refund-box">
                <h3>Refund Information:</h3>
                <p><strong>Refund Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->refund_method)) }}</p>
                <p><strong>Processing Time:</strong> {{ $order->refund_days }} business days</p>
                <p><strong>Refund Amount:</strong> ${{ number_format($order->total_amount, 2) }}</p>
            </div>

            <div class="items">
                <h3>Cancelled Items:</h3>
                @foreach($order->items as $item)
                <div class="item">
                    <strong>{{ $item->product_name }}</strong><br>
                    Quantity: {{ $item->quantity }} × ${{ number_format($item->price, 2) }} = ${{ number_format($item->quantity * $item->price, 2) }}
                </div>
                @endforeach
            </div>

            <div class="order-info">
                <p>The refund will be processed within {{ $order->refund_days }} business days and will be credited to your {{ str_replace('_', ' ', $order->refund_method) }}.</p>
                <p>You will receive a confirmation email once the refund has been processed.</p>
            </div>
        </div>

        <div class="footer">
            <p>If you have any questions about your cancellation or refund, please contact our support team.</p>
            <p>We're sorry to see you go and hope to serve you again in the future.</p>
        </div>
    </div>
</body>
</html>
