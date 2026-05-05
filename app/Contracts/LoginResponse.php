<?php

namespace App\Contracts;

use Illuminate\Contracts\Support\Responsable;

class LoginResponse implements Responsable
{
    public function toResponse($request)
    {
        $user = $request->user();

        if ($user && $user->peran === 'Admin') {
            return redirect()->intended('/dashboard');
        }

        return redirect()->intended('/welcome');
    }
}