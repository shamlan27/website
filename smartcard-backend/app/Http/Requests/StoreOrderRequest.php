<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class StoreOrderRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $items = $this->input('items', []);
        
        // Clean items data - convert empty strings to null for optional fields
        Log::info('StoreOrderRequest before clean', ['items' => $items]);
        foreach ($items as $key => $item) {
            // Normalize product_id: cast numeric strings to int; treat empty/invalid as null
            if (array_key_exists('product_id', $item)) {
                $raw = $item['product_id'];
                if (is_string($raw)) {
                    $trim = trim($raw);
                    $lower = strtolower($trim);
                    if ($trim === '' || $lower === 'null' || $lower === 'undefined') {
                        $items[$key]['product_id'] = null;
                    } elseif (is_numeric($trim)) {
                        $items[$key]['product_id'] = (int) $trim;
                    } else {
                        $items[$key]['product_id'] = null;
                    }
                } elseif (is_numeric($raw)) {
                    $items[$key]['product_id'] = (int) $raw;
                } else {
                    $items[$key]['product_id'] = null;
                }
            }

            // Normalize image: empty string to null
            if (array_key_exists('image', $item)) {
                $img = $item['image'];
                if (is_string($img) && trim($img) === '') {
                    $items[$key]['image'] = null;
                }
            }
        }
        
        $this->merge(['items' => $items]);
        Log::info('StoreOrderRequest after clean', ['items' => $this->input('items')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'order_id' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'nullable|integer',
            'items.*.product_name' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.image' => 'nullable|string',
            'shipping_address' => 'required|array',
            'billing_address' => 'required|array',
            'payment_method' => 'required|string',
            'total_amount' => 'required|numeric|min:0'
        ];
    }
}
