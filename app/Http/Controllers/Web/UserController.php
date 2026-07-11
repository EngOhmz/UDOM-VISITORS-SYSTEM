<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Office;
use App\Models\Department;
use App\Support\PasswordRules;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'office', 'office.department'])
            ->whereIn('role', ['admin', 'staff', 'secretary'])
            ->latest()
            ->paginate(10);
        $roles = Role::all();
        $offices = Office::with('department')->get();
        $departments = Department::all();
        return Inertia::render('Users', [
            'users' => $users,
            'roles' => $roles,
            'offices' => $offices,
            'departments' => $departments
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->userRules(), array_merge($this->userMessages(), PasswordRules::messages()));

        if ($validated['role'] === 'staff' && empty($validated['office_id'])) {
            return back()->withErrors(['office_id' => 'Please select an office for staff users.']);
        }

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'office_id' => $validated['role'] === 'staff' ? $validated['office_id'] : null,
        ]);

        $role = Role::where('name', $validated['role'])->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate($this->userRules($id), array_merge($this->userMessages(), PasswordRules::messages()));

        if ($validated['role'] === 'staff' && empty($validated['office_id'])) {
            return back()->withErrors(['office_id' => 'Please select an office for staff users.']);
        }

        $user = User::findOrFail($id);
        $userData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'role' => $validated['role'],
            'office_id' => $validated['role'] === 'staff' ? $validated['office_id'] : null,
        ];

        if (!empty($validated['password'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        $role = Role::where('name', $validated['role'])->first();
        if ($role) {
            $user->roles()->sync([$role->id]);
        }

        return redirect()->route('users.index')->with('success', 'User updated successfully.');
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if (auth()->id() === $user->id) {
            return redirect()->route('users.index')->with('error', 'You cannot delete your own account.');
        }
        $user->delete();
        return redirect()->route('users.index')->with('success', 'User deleted successfully.');
    }

    protected function userRules($userId = null): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($userId),
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                Rule::unique('users', 'phone')->ignore($userId),
            ],
            'password' => $userId ? PasswordRules::optional(false) : PasswordRules::required(false),
            'role' => 'required|in:admin,staff,secretary',
            'office_id' => 'nullable|exists:offices,id',
        ];
    }

    protected function userMessages(): array
    {
        return [
            'name.required' => 'Please enter the user\'s name.',
            'email.required' => 'Please enter an email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered. Please use a different email.',
            'phone.unique' => 'This phone number is already registered. Please use a different number.',
            'password.required' => 'Please enter a password for the new user.',
            'role.required' => 'Please select a role.',
            'role.in' => 'Please select a valid role.',
            'office_id.exists' => 'The selected office is invalid.',
        ];
    }
}
