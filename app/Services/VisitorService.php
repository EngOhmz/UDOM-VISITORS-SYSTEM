<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class VisitorService
{
    public function getAllVisitors($perPage = 10)
    {
        return User::where('role', 'visitor')->paginate($perPage);
    }

    public function getVisitorById($id)
    {
        return User::where('role', 'visitor')->findOrFail($id);
    }

    public function createVisitor(array $data)
    {
        $data['password'] = Hash::make($data['password']);
        $data['role'] = 'visitor';
        return User::create($data);
    }

    public function updateVisitor($id, array $data)
    {
        $visitor = User::where('role', 'visitor')->findOrFail($id);
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        $visitor->update($data);
        return $visitor;
    }

    public function deleteVisitor($id)
    {
        $visitor = User::where('role', 'visitor')->findOrFail($id);
        $visitor->delete();
        return true;
    }
}
