<?php

namespace Database\Seeders;

use App\Models\Office;
use App\Models\User;
use App\Models\Visitor;
use App\Models\VisitRequest;
use App\Models\VisitorLog;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UDOMVisitorSeeder extends Seeder
{
    public function run()
    {
        // Create Offices
        $offices = [
            ['name' => 'Vice Chancellor\'s Office', 'department' => 'Administration', 'building' => 'Administration Block'],
            ['name' => 'Registrar\'s Office', 'department' => 'Academic Affairs', 'building' => 'Administration Block'],
            ['name' => 'Dean of Students', 'department' => 'Student Affairs', 'building' => 'Student Center'],
            ['name' => 'Finance Office', 'department' => 'Finance', 'building' => 'Finance Building'],
            ['name' => 'IT Office', 'department' => 'Information Technology', 'building' => 'ICT Building'],
            ['name' => 'Library', 'department' => 'Library Services', 'building' => 'Main Library'],
        ];

        foreach ($offices as $office) {
            Office::create($office);
        }

        $officeIds = Office::pluck('id')->toArray();

        // Create Admin User
        User::create([
            'name' => 'UDOM Admin',
            'email' => 'admin@udom.ac.tz',
            'phone' => '255700000001',
            'password' => Hash::make('password'),
            'role' => 'admin',
        ]);

        // Create Staff Users
        $staff = [
            ['name' => 'Staff 1', 'email' => 'staff1@udom.ac.tz', 'phone' => '255700000011', 'role' => 'staff', 'office_index' => 0],
            ['name' => 'Staff 2', 'email' => 'staff2@udom.ac.tz', 'phone' => '255700000012', 'role' => 'staff', 'office_index' => 1],
            ['name' => 'Secretary 1', 'email' => 'secretary1@udom.ac.tz', 'phone' => '255700000013', 'role' => 'secretary', 'office_index' => 2],
        ];

        foreach ($staff as $s) {
            $user = User::create([
                'name' => $s['name'],
                'email' => $s['email'],
                'phone' => $s['phone'],
                'password' => Hash::make('password'),
                'role' => $s['role'],
                'office_id' => $officeIds[$s['office_index']]
            ]);
            
            $role = \App\Models\Role::where('name', $s['role'])->first();
            if ($role) {
                $user->roles()->attach($role->id);
            }
        }

        // Create Visitors
        $visitors = [
            ['name' => 'John Doe', 'email' => 'john@example.com', 'phone' => '255600000001', 'id_number' => 'A1234567', 'organization' => 'ABC Company'],
            ['name' => 'Jane Smith', 'email' => 'jane@example.com', 'phone' => '255600000002', 'id_number' => 'B9876543', 'organization' => 'XYZ Corp'],
            ['name' => 'Bob Johnson', 'email' => 'bob@example.com', 'phone' => '255600000003', 'id_number' => 'C1122334', 'organization' => '123 Industries'],
        ];

        foreach ($visitors as $v) {
            Visitor::create([
                'name' => $v['name'],
                'email' => $v['email'],
                'phone' => $v['phone'],
                'id_number' => $v['id_number'],
                'organization' => $v['organization'],
                'password' => Hash::make('password'),
            ]);
        }

        $visitorIds = Visitor::pluck('id')->toArray();
        $staffIds = User::whereIn('role', ['staff', 'secretary'])->pluck('id')->toArray();

        // Create Visit Requests
        foreach ($visitorIds as $visitorId) {
            for ($i = 0; $i < 2; $i++) {
                $statuses = ['pending', 'approved', 'rejected'];
                $status = $statuses[array_rand($statuses)];
                
                $request = VisitRequest::create([
                    'visitor_id' => $visitorId,
                    'office_id' => $officeIds[array_rand($officeIds)],
                    'user_id' => $status !== 'pending' ? $staffIds[array_rand($staffIds)] : null,
                    'purpose' => 'Meeting with staff',
                    'notes' => 'Discussing collaboration opportunities',
                    'visit_date' => now()->addDays(rand(0, 7))->toDateString(),
                    'visit_time' => rand(8, 16) . ':00',
                    'status' => $status,
                    'rejection_reason' => $status === 'rejected' ? 'Office unavailable on that date' : null,
                ]);

                // Create Visitor Log for approved requests
                if ($status === 'approved' && rand(0, 1) === 1) {
                    $checkInAt = now()->subDays(rand(1, 7))->setTime(rand(8, 12), 0);
                    $checkOutAt = $checkInAt->copy()->addHours(rand(1, 4));
                    
                    VisitorLog::create([
                        'visit_request_id' => $request->id,
                        'check_in_at' => $checkInAt,
                        'check_out_at' => $checkOutAt,
                        'checked_in_by' => User::find($staffIds[array_rand($staffIds)])->name,
                        'checked_out_by' => User::find($staffIds[array_rand($staffIds)])->name,
                    ]);
                }
            }
        }
    }
}
