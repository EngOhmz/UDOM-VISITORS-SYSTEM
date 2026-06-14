<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class UpdateUsersTableForVisitors extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            // Make email nullable
            $table->string('email')->nullable()->change();
            
            // Add visitor-specific columns
            $table->string('id_number')->nullable();
            $table->string('organization')->nullable();
            
            // Update role enum to include visitor
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'staff', 'secretary', 'visitor') DEFAULT 'staff'");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['id_number', 'organization']);
            
            // Revert role enum
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'staff', 'secretary') DEFAULT 'staff'");
            
            // Revert email to non-nullable (though this might cause issues if there are users with null emails)
            // $table->string('email')->unique()->change();
        });
    }
}
