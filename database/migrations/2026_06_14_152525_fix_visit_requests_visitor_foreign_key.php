<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class FixVisitRequestsVisitorForeignKey extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('visit_requests', function (Blueprint $table) {
            $table->dropForeign(['visitor_id']);
            $table->foreign('visitor_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('visit_requests', function (Blueprint $table) {
            $table->dropForeign(['visitor_id']);
            $table->foreign('visitor_id')->references('id')->on('visitors')->onDelete('cascade');
        });
    }
}
