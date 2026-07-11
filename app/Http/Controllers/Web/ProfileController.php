<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Support\PasswordRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function edit(Request $request)
    {
        return Inertia::render('Profile', [
            'user' => $request->user()
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:255|unique:users,phone,' . $user->id,
            'password' => PasswordRules::optional(),
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ], PasswordRules::messages());

        $updateData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
        ];

        if ($request->hasFile('avatar')) {
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $updateData['avatar'] = '/storage/' . $avatarPath;
        }

        $user->update($updateData);

        if ($request->password) {
            $user->update([
                'password' => Hash::make($request->password)
            ]);
        }

        return redirect()->route('profile.edit')->with('success', 'Profile updated successfully.');
    }
}
