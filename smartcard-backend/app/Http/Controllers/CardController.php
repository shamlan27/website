<?php

namespace App\Http\Controllers;

use App\Models\Card;
use Illuminate\Http\Request;

class CardController extends Controller
{
    public function index(Request $request)
    {
        $cards = $request->user()->cards;

        return response()->json([
            'cards' => $cards,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|string',
            'qr_code' => 'nullable|string',
        ]);

        $card = $request->user()->cards()->create($request->all());

        return response()->json([
            'message' => 'Card created successfully',
            'card' => $card,
        ], 201);
    }

    public function show(Card $card)
    {
        if ($card->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'card' => $card,
        ]);
    }

    public function update(Request $request, Card $card)
    {
        if ($card->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'title' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'website' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:500',
            'logo' => 'nullable|string',
            'qr_code' => 'nullable|string',
        ]);

        $card->update($request->all());

        return response()->json([
            'message' => 'Card updated successfully',
            'card' => $card,
        ]);
    }

    public function destroy(Card $card)
    {
        if ($card->user_id !== auth()->id()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 403);
        }

        $card->delete();

        return response()->json([
            'message' => 'Card deleted successfully',
        ]);
    }
}
