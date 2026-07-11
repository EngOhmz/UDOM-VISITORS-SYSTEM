<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Support\PasswordRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class VisitorAuthController extends Controller
{
    public function showLogin()
    {
        return Inertia::render('Auth/Login');
    }

    public function showRegister()
    {
        return Inertia::render('Visitor/Auth/Register');
    }

    public function register(Request $request)
    {
        $request->merge([
            'email' => $request->filled('email') ? $request->email : null,
            'phone' => trim((string) $request->phone),
        ]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['nullable', 'email', 'max:255', Rule::unique('users', 'email')],
            'phone' => ['required', 'string', 'max:20', Rule::unique('users', 'phone')],
            'id_number' => 'nullable|string|max:50',
            'organization' => 'nullable|string|max:255',
            'password' => PasswordRules::required(),
        ], array_merge(PasswordRules::messages(), [
            'name.required' => 'Please enter your full name.',
            'phone.required' => 'Please enter your phone number.',
            'phone.unique' => 'This phone number is already registered. Please sign in or use a different number.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered. Please sign in or use a different email.',
        ]));

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'id_number' => $validated['id_number'],
            'organization' => $validated['organization'],
            'password' => Hash::make($validated['password']),
            'role' => 'visitor',
        ]);

        return redirect()->route('login')->with('success', 'Registration successful! Please login.');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect()->route('login');
    }
}
