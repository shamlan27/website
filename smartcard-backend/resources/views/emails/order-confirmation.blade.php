<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4CAF50; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .order-info { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
        .items { margin: 20px 0; }
        .item { padding: 10px; border-bottom: 1px solid #ddd; }
        .total { font-size: 18px; font-weight: bold; text-align: right; padding: 15px; background: white; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Thank You for Your Order!</h1>
        </div>
        
        <div class="content">
            <div class="order-info">
                <h2>Order Details</h2>
                <p><strong>Order ID:</strong> {{ $order->order_id }}</p>
                <p><strong>Order Date:</strong> {{ $order->created_at->format('F d, Y H:i') }}</p>
                <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
            </div>

            <div class="items">
                <h3>Order Items:</h3>
                @foreach($order->items as $item)
                <div class="item">
                    <strong>{{ $item->product_name }}</strong><br>
                    Quantity: {{ $item->quantity }} × ${{ number_format($item->price, 2) }} = ${{ number_format($item->quantity * $item->price, 2) }}
                </div>
                @endforeach
            </div>

            <div class="total">
                Total Amount: ${{ number_format($order->total_amount, 2) }}
            </div>

            <div class="order-info">
                <h3>Shipping Address:</h3>
                <p>
                    {{ $order->shipping_address['firstName'] ?? '' }} {{ $order->shipping_address['lastName'] ?? '' }}<br>
                    {{ $order->shipping_address['address'] ?? '' }}<br>
                    {{ $order->shipping_address['city'] ?? '' }}, {{ $order->shipping_address['province'] ?? '' }} {{ $order->shipping_address['zipCode'] ?? '' }}<br>
                    {{ $order->shipping_address['country'] ?? '' }}<br>
                    Phone: {{ $order->shipping_address['phone'] ?? '' }}<br>
                    Email: {{ $order->shipping_address['email'] ?? '' }}
                </p>
            </div>

            <div class="order-info">
                <p><strong>Payment Method:</strong> {{ ucfirst(str_replace('_', ' ', $order->payment_method)) }}</p>
                @if($order->tracking_number)
                <p><strong>Tracking Number:</strong> {{ $order->tracking_number }}</p>
                @else
                <p>We'll send you a tracking number once your order ships.</p>
                @endif
            </div>
        </div>

        <div class="footer">
            <p>Thank you for shopping with us!</p>
            <p>If you have any questions, please contact our support team.</p>
        </div>
    </div>
</body>
</html>
