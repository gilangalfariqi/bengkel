<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

class PublicController extends Controller
{
    public function apiVersion()
    {
        return response()->json([
            'meta' => ['status' => 'success'],
            'data' => [
                'version' => '1.0.0',
            ],
        ]);
    }
}

