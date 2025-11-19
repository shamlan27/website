<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'status',
        'total_amount',
        'shipping_address',
        'billing_address',
        'payment_method',
        'tracking_number',
        'cancellation_reason',
        'cancellation_comment',
        'refund_method',
        'refund_days',
    ];

    protected $casts = [
        'shipping_address' => 'array',
        'billing_address' => 'array',
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    protected $appends = [
        'total_quantity',
    ];

    public function getTotalQuantityAttribute(): int
    {
        // Ensure relation is loaded before summing to avoid N+1
        $items = $this->relationLoaded('items') ? $this->items : $this->items()->get();
        return (int) ($items?->sum('quantity') ?? 0);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
