<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class ReportController extends Controller
{
    protected $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index(Request $request)
    {
        $data = $this->reportService->getReportData($request->all());
        return $this->sendResponse($data, 'Report data retrieved successfully.');
    }

    public function export(Request $request)
    {
        $data = $this->reportService->getReportData($request->all());
        $csv = $this->reportService->generateCsv($data);

        return response($csv['content'], 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $csv['filename'] . '"',
        ]);
    }
}
