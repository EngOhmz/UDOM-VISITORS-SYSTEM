<?php

namespace App\Services;

use App\Models\Department;

class DepartmentService
{
    public function getAllDepartments($perPage = 10)
    {
        return Department::paginate($perPage);
    }

    public function getAllDepartmentsWithoutPagination()
    {
        return Department::all();
    }

    public function getDepartmentById($id)
    {
        return Department::findOrFail($id);
    }

    public function createDepartment(array $data)
    {
        return Department::create($data);
    }

    public function updateDepartment($id, array $data)
    {
        $department = Department::findOrFail($id);
        $department->update($data);
        return $department;
    }

    public function deleteDepartment($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return true;
    }
}
