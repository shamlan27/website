# Order Management API - Quick Reference

## Base URL
```
http://127.0.0.1:8000/api
```

## Authentication
All order endpoints require Bearer token authentication.
```javascript
headers: {
  'Authorization': 'Bearer YOUR_TOKEN_HERE',
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}
```

## API Endpoints

### 1. Get All Orders
```http
GET /api/orders
Authorization: Bearer {token}
```

### 2. Get Single Order
```http
GET /api/orders/{order_id}
Authorization: Bearer {token}
```

### 3. Create Order (Checkout)
```http
POST /api/orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "order_id": "ORD-12345678",
  "items": [
    {
      "product_id": 5,
      "product_name": "Smart NFC Card",
      "quantity": 2,
      "price": 149.99,
      "image": "/images/product.jpg"
    }
  ],
  "shipping_address": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "province": "Western",
    "district": "Colombo",
    "city": "Colombo",
    "zipCode": "00100",
    "country": "Sri Lanka"
  },
  "billing_address": { ... },
  "payment_method": "visa",
  "total_amount": 299.99
}
```

### 4. Cancel Order
```http
POST /api/orders/{order_id}/cancel
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "ordered_by_mistake",
  "comment": "Optional comment",
  "refund_method": "bank_transfer"
}
```

### 5. Update Tracking Number (Admin)
```http
PUT /api/orders/{order_id}/tracking
Authorization: Bearer {token}
Content-Type: application/json

{
  "tracking_number": "TRACK123456789"
}
```

### 6. Send Invoice Email
```http
POST /api/orders/{order_id}/send-invoice
Authorization: Bearer {token}
```

### 7. Send Cancellation Email
```http
POST /api/orders/{order_id}/send-cancellation
Authorization: Bearer {token}
```

## Frontend Integration Example

```javascript
// API Service
const API_URL = 'http://127.0.0.1:8000/api';

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
});

// Get all orders
export const getOrders = async () => {
  const response = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeaders()
  });
  return response.json();
};

// Create order
export const createOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(orderData)
  });
  return response.json();
};

// Cancel order
export const cancelOrder = async (orderId, cancelData) => {
  const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(cancelData)
  });
  return response.json();
};
```

## Order Status Flow
```
pending → processing → shipped → delivered
   ↓
cancelled (only from pending/processing)
```

## Refund Processing Times
- Bank Transfer: 14 business days
- Original Payment Method: 7 business days
- Store Credit: 7 business days

## Email Templates
- Order Confirmation: Sent automatically on order creation
- Cancellation Confirmation: Sent automatically on order cancellation
- Can be resent manually using `/send-invoice` and `/send-cancellation` endpoints

## Testing
Use the test page at: `http://127.0.0.1:8000/test-api.html`

## Notes
- All timestamps are in UTC
- Order IDs must be unique
- Only orders with status 'pending' or 'processing' can be cancelled
- Shipping/billing addresses are stored as JSON
