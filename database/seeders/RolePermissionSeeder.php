<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Define groups and permissions for Visitor Management System
        $groups = [
            'Visitors' => ['view visitors', 'manage visitors'],
            'Visit Requests' => ['view requests', 'approve requests', 'reject requests'],
            'Verification' => ['verify visitors'],
            'Visitor Logs' => ['view logs', 'check in visitors', 'check out visitors'],
            'Offices' => ['view offices', 'create offices', 'edit offices', 'delete offices'],
            'Users' => ['view users', 'create users', 'edit users', 'delete users'],
            'Reports' => ['view reports', 'export reports'],
        ];

        foreach ($groups as $group => $perms) {
            foreach ($perms as $perm) {
                Permission::firstOrCreate([
                    'name' => str_replace(' ', '_', $perm),
                    'display_name' => ucwords($perm),
                    'group' => $group
                ]);
            }
        }

        // Create Admin Role and assign all permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'display_name' => 'Administrator']);
        $adminRole->permissions()->sync(Permission::all());

        // Create Staff Role
        $staffRole = Role::firstOrCreate(['name' => 'staff', 'display_name' => 'Office Staff']);
        $staffRole->permissions()->sync(
            Permission::whereIn('group', ['Visit Requests', 'Verification', 'Visitor Logs', 'Reports'])->get()
        );

        // Create Secretary Role (similar to Staff)
        $secretaryRole = Role::firstOrCreate(['name' => 'secretary', 'display_name' => 'Secretary']);
        $secretaryRole->permissions()->sync(
            Permission::whereIn('group', ['Visit Requests', 'Verification', 'Visitor Logs'])->get()
        );

        // Assign Admin role to the main admin user
        $adminUser = User::where('email', 'admin@udom.ac.tz')->first();
        if ($adminUser) {
            $adminUser->roles()->sync([$adminRole->id]);
        }
    }
}
