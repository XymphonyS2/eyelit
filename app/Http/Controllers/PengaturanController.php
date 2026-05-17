<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

class PengaturanController extends Controller
{
    public function index()
    {
        $user = User::find(auth()->id());

        return inertia('pengaturan', [
            'user' => $user,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'username' => 'required|string|max:50|unique:users,username,' . auth()->id(),
            'foto_profil' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ], [
            'username.required' => 'Username wajib diisi',
            'username.unique' => 'Username sudah digunakan',
            'username.max' => 'Username maksimal 50 karakter',
            'foto_profil.image' => 'Foto profil harus berupa gambar',
            'foto_profil.mimes' => 'Foto profil harus format jpeg, png, jpg, gif, atau svg',
            'foto_profil.max' => 'Ukuran foto profil maksimal 2MB',
        ]);

        $user = User::find(auth()->id());

        // Update username
        $user->username = $request->username;

        // Update foto profil
        if ($request->hasFile('foto_profil')) {
            $file = $request->file('foto_profil');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->move(public_path('images/profil'), $filename);
            $user->foto_profil = $filename;
        }

        $user->save();

        return redirect()->back()->with('success', 'Pengaturan berhasil disimpan');
    }

    public function logout(Request $request)
    {
        auth()->logout();
        Session::flush();
        return redirect('/');
    }
}