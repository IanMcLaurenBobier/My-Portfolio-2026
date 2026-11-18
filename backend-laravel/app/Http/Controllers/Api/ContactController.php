<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactRequest;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;

class ContactController extends Controller
{
    public function index(): JsonResponse
    {
        $messages = ContactMessage::query()->latest()->limit(100)->get();

        return response()->json([
            'data' => $messages,
            'total' => $messages->count(),
        ]);
    }

    public function store(StoreContactRequest $request): JsonResponse
    {
        // Honeypot check
        if ($request->filled('website')) {
            return response()->json(['message' => 'Inquiry received.'], 201);
        }

        $validated = $request->validated();

        $submission = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'message' => 'Thank you for reaching out. Your message has been recorded.',
            'data' => [
                'id' => $submission->id,
                'createdAt' => $submission->created_at?->toIso8601String(),
            ],
        ], 201);
    }
}
