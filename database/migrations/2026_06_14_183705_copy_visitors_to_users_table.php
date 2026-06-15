<?php

use App\Models\Visitor;
use App\Models\User;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CopyVisitorsToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        $visitors = Visitor::all();
        
        foreach ($visitors as $visitor) {
            // Check if user already exists with same email or phone
            $existingUser = User::where('email', $visitor->email)
                ->orWhere('phone', $visitor->phone)
                ->first();
            
            if (!$existingUser) {
                // Create user
                $newUser = User::create([
                    'name' => $visitor->name,
                    'email' => $visitor->email,
                    'phone' => $visitor->phone,
                    'id_number' => $visitor->id_number,
                    'organization' => $visitor->organization,
                    'password' => $visitor->password, // Keep the same password hash
                    'role' => 'visitor',
                ]);
                
                // Update all visit requests for this visitor to use new user id
                DB::table('visit_requests')
                    ->where('visitor_id', $visitor->id)
                    ->update(['visitor_id' => $newUser->id]);
            } else {
                // If user exists, update visit requests to use existing user id
                DB::table('visit_requests')
                    ->where('visitor_id', $visitor->id)
                    ->update(['visitor_id' => $existingUser->id]);
            }
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Can't really reverse this easily, but we'll just leave it
    }
}
