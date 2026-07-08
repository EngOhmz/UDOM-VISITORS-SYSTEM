<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use App\Models\Office;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['roles', 'office', 'office.department'])->paginate(10);
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
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,staff,secretary',
            'office_id' => 'nullable|exists:offices,id'
        ]);

        // Require office_id for staff
        if ($request->role === 'staff' && !$request->office_id) {
            return back()->withErrors(['office_id' => 'Office is required for staff']);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'office_id' => $request->office_id
        ]);

        $role = Role::where('name', $request->role)->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }

        return redirect()->route('users.index')->with('success', 'User created successfully.');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,staff,secretary',
            'office_id' => 'nullable|exists:offices,id'
        ]);

        // Require office_id for staff
        if ($request->role === 'staff' && !$request->office_id) {
            return back()->withErrors(['office_id' => 'Office is required for staff']);
        }

        $user = User::findOrFail($id);
        $userData = [
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'role' => $request->role,
            'office_id' => $request->role === 'staff' ? $request->office_id : null,
        ];

        if ($request->has('password') && !empty($request->password)) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        $role = Role::where('name', $request->role)->first();
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
}
