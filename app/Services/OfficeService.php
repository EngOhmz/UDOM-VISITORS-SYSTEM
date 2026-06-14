<?php

namespace App\Services;

use App\Models\Office;

class OfficeService
{
    public function getAllOffices($perPage = 10)
    {
        return Office::with('department')->paginate($perPage);
    }

    public function getAllOfficesWithoutPagination()
    {
        return Office::all();
    }

    public function getOfficesByDepartmentId($departmentId)
    {
        return Office::where('department_id', $departmentId)->get();
    }

    public function getOfficeById($id)
    {
        return Office::findOrFail($id);
    }

    public function createOffice(array $data)
    {
        return Office::create($data);
    }

    public function updateOffice($id, array $data)
    {
        $office = Office::findOrFail($id);
        $office->update($data);
        return $office;
    }

    public function deleteOffice($id)
    {
        $office = Office::findOrFail($id);
        $office->delete();
        return true;
    }
}
