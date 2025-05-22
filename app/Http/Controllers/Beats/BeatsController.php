<?php

namespace App\Http\Controllers\Beats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BeatsController extends Controller
{
    //
    public function index()
    {
        return inertia('beats/Beats');
    }
    //palets
    public function palets()
    {
        return inertia('beats/Palet');
    }
}
