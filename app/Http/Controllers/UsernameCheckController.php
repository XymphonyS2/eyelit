<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UsernameCheckController extends Controller
{
    public function __invoke(Request $request): JsonResponse
    {
        $username = $request->query('username');
        $excludeId = $request->query('exclude_id');

        if (!$username) {
            return response()->json(['available' => false]);
        }

        $query = \App\Models\User::where('username', $username);

        if ($excludeId) {
            $query->where('id', '!=', $excludeId);
        }

        $exists = $query->exists();

        return response()->json(['available' => !$exists]);
    }
}